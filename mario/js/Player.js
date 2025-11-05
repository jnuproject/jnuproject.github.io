// Player Class - 진짜 마리오처럼
class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // 스프라이트 생성
        this.sprite = scene.physics.add.sprite(x, y, 'player-small-idle');
        this.sprite.setScale(2);

        // 물리 속성 - 마리오처럼
        this.sprite.setBounce(0);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setMaxVelocity(CONFIG.PLAYER_MAX_SPEED, 600);

        // 플레이어 상태
        this.isDead = false;
        this.coins = 0;
        this.score = 0;
        this.lives = 3;
        this.isPoweredUp = false;
        this.isInvincible = false;
        this.isGrounded = false;
        this.sizeState = null;
        this.animationKeys = {};

        // 이동 관련
        this.acceleration = CONFIG.PLAYER_ACCELERATION;
        this.maxSpeed = CONFIG.PLAYER_SPEED;
        this.jumpPower = CONFIG.PLAYER_JUMP;
        this.isJumping = false;
        this.jumpTime = 0;
        this.maxJumpTime = 200; // ms

        // 컨트롤
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // 애니메이션 생성
        this.createAnimations();
        this.setSizeState('small', { playAnimation: false });
        this.playAnimation('idle');

        // 파티클 효과용
        this.dustTimer = 0;
    }

    createAnimations() {
        const scene = this.scene;

        if (!scene.anims.exists('mario-small-idle')) {
            scene.anims.create({
                key: 'mario-small-idle',
                frames: [{ key: 'player-small-idle' }],
                frameRate: 1
            });
        }

        if (!scene.anims.exists('mario-small-run')) {
            scene.anims.create({
                key: 'mario-small-run',
                frames: [
                    { key: 'player-small-run1' },
                    { key: 'player-small-run2' }
                ],
                frameRate: 12,
                repeat: -1
            });
        }

        if (!scene.anims.exists('mario-small-jump')) {
            scene.anims.create({
                key: 'mario-small-jump',
                frames: [{ key: 'player-small-jump' }],
                frameRate: 1
            });
        }

        if (!scene.anims.exists('mario-big-idle')) {
            scene.anims.create({
                key: 'mario-big-idle',
                frames: [{ key: 'player-big-idle' }],
                frameRate: 1
            });
        }

        if (!scene.anims.exists('mario-big-run')) {
            scene.anims.create({
                key: 'mario-big-run',
                frames: [
                    { key: 'player-big-run1' },
                    { key: 'player-big-run2' }
                ],
                frameRate: 12,
                repeat: -1
            });
        }

        if (!scene.anims.exists('mario-big-jump')) {
            scene.anims.create({
                key: 'mario-big-jump',
                frames: [{ key: 'player-big-jump' }],
                frameRate: 1
            });
        }
    }

    setSizeState(size, options = {}) {
        const { playAnimation = true, force = false } = options;
        if (this.sizeState === size && !force) {
            if (!playAnimation) {
                this.sprite.anims.stop();
                this.sprite.setTexture(size === 'big' ? 'player-big-idle' : 'player-small-idle');
            }
            return;
        }

        this.sizeState = size;
        this.animationKeys = size === 'big'
            ? {
                idle: 'mario-big-idle',
                run: 'mario-big-run',
                jump: 'mario-big-jump'
            }
            : {
                idle: 'mario-small-idle',
                run: 'mario-small-run',
                jump: 'mario-small-jump'
            };

        this.configureBodyForSize(size);

        if (playAnimation) {
            this.playAnimation('idle');
        } else {
            this.sprite.anims.stop();
            this.sprite.setTexture(size === 'big' ? 'player-big-idle' : 'player-small-idle');
        }
    }

    configureBodyForSize(size) {
        if (!this.sprite.body) return;

        if (size === 'big') {
            this.sprite.body.setSize(12, 28);
            this.sprite.body.setOffset(2, 4);
        } else {
            this.sprite.body.setSize(12, 14);
            this.sprite.body.setOffset(2, 18);
        }
    }

    playAnimation(name, ignoreIfPlaying = true) {
        const key = this.animationKeys[name];
        if (!key) return;
        this.sprite.anims.play(key, ignoreIfPlaying);
    }

    update(time, delta) {
        if (this.isDead) return;

        // 땅에 닿아있는지 체크
        this.isGrounded = this.sprite.body.touching.down || this.sprite.body.blocked.down;

        // 좌우 이동 (가속도 기반 - 진짜 마리오처럼)
        const isRunning = this.shiftKey.isDown;
        const currentMaxSpeed = isRunning ? this.maxSpeed * 1.3 : this.maxSpeed;

        if (this.cursors.left.isDown) {
            // 왼쪽으로 가속
            this.sprite.setAccelerationX(-this.acceleration);
            this.sprite.setFlipX(true);

            // 애니메이션
            if (this.isGrounded) {
                this.playAnimation('run');
                this.createDust();
            }
        } else if (this.cursors.right.isDown) {
            // 오른쪽으로 가속
            this.sprite.setAccelerationX(this.acceleration);
            this.sprite.setFlipX(false);

            if (this.isGrounded) {
                this.playAnimation('run');
                this.createDust();
            }
        } else {
            // 마찰력 (감속)
            if (this.isGrounded) {
                this.sprite.setAccelerationX(0);
                this.sprite.setVelocityX(this.sprite.body.velocity.x * 0.85);

                // 거의 멈춤
                if (Math.abs(this.sprite.body.velocity.x) < 5) {
                    this.sprite.setVelocityX(0);
                    this.playAnimation('idle');
                }
            } else {
                // 공중에서는 약간의 감속
                this.sprite.setAccelerationX(0);
                this.sprite.setVelocityX(this.sprite.body.velocity.x * 0.98);
            }
        }

        // 최대 속도 제한
        if (Math.abs(this.sprite.body.velocity.x) > currentMaxSpeed) {
            this.sprite.setVelocityX(
                Math.sign(this.sprite.body.velocity.x) * currentMaxSpeed
            );
        }

        // 점프 - 진짜 마리오처럼 (길게 누르면 높이 점프)
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
            Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if (this.isGrounded) {
                this.jump();
            }
        }

        // 점프 유지 (버튼을 누르고 있으면 더 높이)
        if ((this.cursors.up.isDown || this.spaceKey.isDown) && this.isJumping) {
            if (this.jumpTime < this.maxJumpTime) {
                this.sprite.setVelocityY(-this.jumpPower);
                this.jumpTime += delta;
            } else {
                this.isJumping = false;
            }
        }

        // 점프 버튼을 떼면 점프 종료
        if (this.cursors.up.isUp && this.spaceKey.isUp) {
            this.isJumping = false;
        }

        // 땅에 닿으면 점프 리셋
        if (this.isGrounded) {
            this.isJumping = false;
            this.jumpTime = 0;
        } else {
            this.playAnimation('jump');
        }

        // 떨어지는 속도에 따른 중력 조절 (마리오의 특징적인 점프감)
        if (this.sprite.body.velocity.y > 0) {
            // 떨어질 때 중력 증가
            this.sprite.body.setGravityY(CONFIG.GRAVITY * 0.3);
        } else {
            this.sprite.body.setGravityY(0);
        }

        // 화면 밖으로 떨어지면 죽음
        if (this.sprite.y > this.scene.cameras.main.height + 100) {
            this.die();
        }
    }

    jump() {
        this.sprite.setVelocityY(-this.jumpPower);
        this.isJumping = true;
        this.jumpTime = 0;

        // 점프 파티클
        this.createJumpEffect();
    }

    createDust() {
        // 먼지 효과 (땅에서 달릴 때)
        this.dustTimer++;
        if (this.dustTimer > 10 && Math.abs(this.sprite.body.velocity.x) > 50) {
            this.dustTimer = 0;

            const dust = this.scene.add.circle(
                this.sprite.x,
                this.sprite.y + 16,
                2,
                0xFFFFFF,
                0.5
            );

            this.scene.tweens.add({
                targets: dust,
                scaleX: 2,
                scaleY: 2,
                alpha: 0,
                duration: 300,
                onComplete: () => dust.destroy()
            });
        }
    }

    createJumpEffect() {
        // 점프할 때 파티클
        for (let i = 0; i < 4; i++) {
            const particle = this.scene.add.circle(
                this.sprite.x + Phaser.Math.Between(-8, 8),
                this.sprite.y + 16,
                2,
                0xFFFFFF,
                0.8
            );

            this.scene.tweens.add({
                targets: particle,
                y: particle.y + 5,
                alpha: 0,
                duration: 200,
                onComplete: () => particle.destroy()
            });
        }
    }

    powerUp() {
        if (this.sizeState === 'big') return;

        this.isPoweredUp = true;

        this.setSizeState('big', { playAnimation: false, force: true });
        this.sprite.setScale(2);
        this.sprite.setAlpha(1);

        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: { from: 2, to: 2.2 },
            scaleY: { from: 2, to: 2.2 },
            duration: 120,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.sprite.setScale(2);
                this.playAnimation('idle');
            }
        });

        this.makeInvincible(1500);
        this.addScore(1000);
    }

    hit() {
        if (this.isInvincible) return;

        if (this.sizeState === 'big') {
            // 파워업 상태면 다운그레이드
            this.isPoweredUp = false;
            this.setSizeState('small', { playAnimation: false, force: true });
            this.sprite.setScale(2);

            this.scene.tweens.add({
                targets: this.sprite,
                scaleX: { from: 2, to: 1.8 },
                scaleY: { from: 2, to: 1.8 },
                duration: 120,
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                    this.sprite.setScale(2);
                    this.playAnimation('idle');
                }
            });

            this.makeInvincible(2000);
        } else {
            // 죽음
            this.die();
        }
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.lives--;

        // 죽음 애니메이션 (마리오처럼 위로 튀었다가 떨어짐)
        this.sprite.setVelocity(0, -300);
        this.sprite.setAcceleration(0, 0);
        this.sprite.body.setAllowGravity(true);
        this.sprite.setCollideWorldBounds(false);
        this.isPoweredUp = false;
        this.setSizeState('small', { playAnimation: false, force: true });
        this.sprite.setTexture('player-small-jump');
        this.sprite.setScale(2);

        this.scene.tweens.add({
            targets: this.sprite,
            angle: 720,
            duration: 1500,
            ease: 'Power2'
        });

        // 2초 후 리스폰 또는 게임 오버
        this.scene.time.delayedCall(2000, () => {
            if (this.lives > 0) {
                this.respawn();
            } else {
                this.gameOver();
            }
        });
    }

    respawn() {
        this.isDead = false;
        this.sprite.setPosition(100, 100);
        this.sprite.setVelocity(0, 0);
        this.sprite.setAcceleration(0, 0);
        this.sprite.setAngle(0);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setAllowGravity(true);
        this.sprite.setAlpha(1);
        this.isPoweredUp = false;
        this.setSizeState('small', { playAnimation: false, force: true });
        this.sprite.setScale(2);
        this.playAnimation('idle');

        this.makeInvincible(3000);
    }

    makeInvincible(duration) {
        this.isInvincible = true;

        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: duration / 200,
            onComplete: () => {
                this.isInvincible = false;
                this.sprite.setAlpha(1);
            }
        });
    }

    gameOver() {
        this.scene.showGameOver();
    }

    collectCoin() {
        this.coins++;
        this.addScore(100);

        // 100코인마다 1UP
        if (this.coins % 100 === 0) {
            this.lives++;
            this.show1Up();
        }
    }

    addScore(points) {
        this.score += points;
    }

    show1Up() {
        const text = this.scene.add.text(this.sprite.x, this.sprite.y - 40, '1UP!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            fill: '#00FF00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 1500,
            onComplete: () => text.destroy()
        });
    }

    stompEnemy(enemy) {
        // 적을 밟았을 때 작은 바운스
        this.sprite.setVelocityY(-250);
        this.addScore(100);
    }

    getSprite() {
        return this.sprite;
    }

    getCoins() {
        return this.coins;
    }

    getLives() {
        return this.lives;
    }

    getScore() {
        return this.score;
    }
}
