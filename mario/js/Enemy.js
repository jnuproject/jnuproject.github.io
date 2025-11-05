// Enemy Class - 마리오 스타일 적
class Enemy {
    constructor(scene, x, y, type = 'goomba') {
        this.scene = scene;
        this.type = type;

        // 타입에 따른 설정
        const config = this.getEnemyConfig(type);

        this.sprite = scene.physics.add.sprite(x, y, config.texture);
        this.sprite.setScale(2);

        // 물리 속성
        this.sprite.body.setSize(config.width, config.height);
        this.sprite.setBounce(0);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setAllowGravity(true);

        // 적 속성
        this.speed = config.speed;
        this.direction = -1;
        this.isDead = false;
        this.type = type;

        // 초기 이동
        this.sprite.setVelocityX(this.direction * this.speed);

        // 데이터 저장
        this.sprite.setData('enemy', this);

        // 트루파는 살짝 바운스
        if (type === 'troopa') {
            this.sprite.setBounce(0.1);
        }
    }

    getEnemyConfig(type) {
        const configs = {
            'goomba': {
                texture: 'enemy-goomba',
                width: 14,
                height: 14,
                speed: 40
            },
            'troopa': {
                texture: 'enemy-troopa',
                width: 14,
                height: 18,
                speed: 60
            }
        };

        return configs[type] || configs['goomba'];
    }

    update() {
        if (this.isDead) return;

        // 벽이나 끝에 닿으면 방향 전환
        if (this.sprite.body.blocked.left || this.sprite.body.blocked.right) {
            this.turnAround();
        }

        // 낭떠러지 감지 (앞쪽에 땅이 없으면 방향 전환)
        this.checkCliff();

        // 방향에 따라 스프라이트 뒤집기
        this.sprite.setFlipX(this.direction > 0);

        // 화면 아래로 떨어지면 제거
        if (this.sprite.y > this.scene.cameras.main.height + 100) {
            this.destroy();
        }
    }

    turnAround() {
        this.direction *= -1;
        this.sprite.setVelocityX(this.direction * this.speed);
    }

    checkCliff() {
        // 간단한 낭떠러지 감지 (일부 적만)
        if (this.type === 'goomba' && this.sprite.body.touching.down) {
            const frontX = this.sprite.x + (this.direction * 20);
            const frontY = this.sprite.y + 20;

            // 앞에 플랫폼이 있는지 체크 (간소화)
            // 실제로는 raycasting이 필요하지만 간단히 구현
        }
    }

    stompedByPlayer(player) {
        if (this.isDead) return 0;

        this.isDead = true;
        const score = this.type === 'troopa' ? 200 : 100;

        // 밟힌 애니메이션
        this.sprite.setVelocity(0, 0);
        this.sprite.body.setEnable(false);

        if (this.type === 'goomba') {
            // 굼바는 납작해짐
            this.scene.tweens.add({
                targets: this.sprite,
                scaleY: 0.3,
                scaleX: 2.2,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => this.destroy()
            });
        } else {
            // 트루파는 껍질로 변함 (간소화 버전 - 그냥 사라짐)
            this.scene.tweens.add({
                targets: this.sprite,
                scaleY: 0.5,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => this.destroy()
            });
        }

        // 점수 표시
        this.showScore(score);

        // 플레이어 바운스
        player.stompEnemy(this);

        return score;
    }

    hitPlayer(player) {
        if (this.isDead) return;
        player.hit();
    }

    showScore(score) {
        const text = this.scene.add.text(this.sprite.x, this.sprite.y - 20, score.toString(), {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
    }

    getSprite() {
        return this.sprite;
    }
}
