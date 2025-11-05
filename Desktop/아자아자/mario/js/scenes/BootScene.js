// Boot Scene - 로딩 및 초기화
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // 로딩 바 생성
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const percentText = this.add.text(width / 2, height / 2, '0%', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // 로딩 이벤트
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // 플레이어 스프라이트 생성 (픽셀 아트)
        this.createPlayerSprites();
        // 적 스프라이트 생성
        this.createEnemySprites();
        // 타일 스프라이트 생성
        this.createTileSprites();
        // 파워업 스프라이트 생성
        this.createPowerupSprites();
        // UI 요소 생성
        this.createUISprites();
    }

    createPlayerSprites() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        const colors = {
            hat: 0xD22B2B,
            hatShadow: 0xA61E1E,
            skin: 0xFFD7B1,
            skinShadow: 0xE0B48A,
            hair: 0x8B4513,
            moustache: 0x5C2A06,
            shirt: 0xD22B2B,
            overall: 0x1E4CB5,
            button: 0xF6C645,
            glove: 0xFFFFFF,
            shoe: 0x5C2A06,
            eye: 0x1F1B24
        };

        const drawArm = (pose, lean, offsetY) => {
            if (!pose) return;
            graphics.fillStyle(colors.shirt).fillRect(
                pose.x + lean,
                pose.y + offsetY,
                pose.w,
                pose.h
            );

            if (pose.glove) {
                graphics.fillStyle(colors.glove).fillRect(
                    pose.glove.x + lean,
                    pose.glove.y + offsetY,
                    pose.glove.w,
                    pose.glove.h
                );
            }
        };

        const drawLeg = (pose, lean, offsetY) => {
            if (!pose) return;
            graphics.fillStyle(colors.overall).fillRect(
                pose.x + lean,
                pose.y + offsetY,
                pose.w,
                pose.h
            );

            if (pose.shoe) {
                graphics.fillStyle(colors.shoe).fillRect(
                    pose.shoe.x + lean,
                    pose.shoe.y + offsetY,
                    pose.shoe.w,
                    pose.shoe.h
                );
            }
        };

        const drawSmallMario = (key, pose = {}) => {
            const lean = pose.lean || 0;
            const baseYOffset = 16;
            const offsetY = baseYOffset + (pose.bodyOffsetY || 0);

            graphics.clear();

            // Hat crown
            graphics.fillStyle(colors.hat).fillRect(3 + lean, 0 + offsetY, 10, 3);
            graphics.fillStyle(colors.hat).fillRect(2 + lean, 3 + offsetY, 12, 2);
            graphics.fillStyle(colors.hatShadow).fillRect(1 + lean, 5 + offsetY, 14, 2);

            // Hair and face
            graphics.fillStyle(colors.hair).fillRect(2 + lean, 5 + offsetY, 2, 6);
            graphics.fillStyle(colors.hair).fillRect(12 + lean, 5 + offsetY, 2, 6);

            graphics.fillStyle(colors.skin).fillRect(4 + lean, 5 + offsetY, 8, 6);
            graphics.fillStyle(colors.skinShadow).fillRect(10 + lean, 8 + offsetY, 2, 2);

            // Eyes and nose
            graphics.fillStyle(colors.eye).fillRect(6 + lean, 7 + offsetY, 1, 1);
            graphics.fillStyle(colors.eye).fillRect(9 + lean, 7 + offsetY, 1, 1);
            graphics.fillStyle(colors.skinShadow).fillRect(8 + lean, 8 + offsetY, 1, 1);

            // Moustache
            graphics.fillStyle(colors.moustache).fillRect(4 + lean, 9 + offsetY, 8, 2);

            // Shirt and straps
            graphics.fillStyle(colors.shirt).fillRect(4 + lean, 11 + offsetY, 8, 2);
            graphics.fillStyle(colors.shirt).fillRect(2 + lean, 11 + offsetY, 2, 3);
            graphics.fillStyle(colors.shirt).fillRect(12 + lean, 11 + offsetY, 2, 3);

            graphics.fillStyle(colors.overall).fillRect(5 + lean, 13 + offsetY, 6, 3);
            graphics.fillStyle(colors.overall).fillRect(5 + lean, 11 + offsetY, 2, 4);
            graphics.fillStyle(colors.overall).fillRect(9 + lean, 11 + offsetY, 2, 4);

            graphics.fillStyle(colors.button).fillRect(5 + lean, 13 + offsetY, 2, 2);
            graphics.fillStyle(colors.button).fillRect(9 + lean, 13 + offsetY, 2, 2);

            // Arms
            const defaultArms = {
                leftArm: { x: 1, y: 11, w: 3, h: 3, glove: { x: 1, y: 13, w: 3, h: 2 } },
                rightArm: { x: 12, y: 11, w: 3, h: 3, glove: { x: 12, y: 13, w: 3, h: 2 } }
            };

            drawArm(pose.leftArm || defaultArms.leftArm, lean, offsetY);
            drawArm(pose.rightArm || defaultArms.rightArm, lean, offsetY);

            // Legs
            const defaultLegs = {
                leftLeg: { x: 4, y: 13, w: 3, h: 3, shoe: { x: 4, y: 15, w: 3, h: 1 } },
                rightLeg: { x: 9, y: 13, w: 3, h: 3, shoe: { x: 9, y: 15, w: 3, h: 1 } }
            };

            drawLeg(pose.leftLeg || defaultLegs.leftLeg, lean, offsetY);
            drawLeg(pose.rightLeg || defaultLegs.rightLeg, lean, offsetY);

            graphics.generateTexture(key, 16, 32);
        };

        drawSmallMario('player-small-idle');
        drawSmallMario('player-small-run1', {
            lean: -1,
            leftArm: { x: 1, y: 12, w: 3, h: 2, glove: { x: 1, y: 13, w: 3, h: 2 } },
            rightArm: { x: 13, y: 10, w: 2, h: 3, glove: { x: 13, y: 12, w: 2, h: 2 } },
            leftLeg: { x: 3, y: 14, w: 3, h: 2, shoe: { x: 3, y: 15, w: 3, h: 1 } },
            rightLeg: { x: 9, y: 12, w: 3, h: 4, shoe: { x: 9, y: 15, w: 4, h: 1 } }
        });
        drawSmallMario('player-small-run2', {
            lean: 1,
            leftArm: { x: 0, y: 10, w: 3, h: 3, glove: { x: 0, y: 12, w: 3, h: 2 } },
            rightArm: { x: 12, y: 12, w: 3, h: 2, glove: { x: 12, y: 13, w: 3, h: 2 } },
            leftLeg: { x: 4, y: 12, w: 3, h: 4, shoe: { x: 4, y: 15, w: 4, h: 1 } },
            rightLeg: { x: 10, y: 14, w: 3, h: 2, shoe: { x: 10, y: 15, w: 3, h: 1 } }
        });
        drawSmallMario('player-small-jump', {
            bodyOffsetY: -1,
            leftArm: { x: 1, y: 9, w: 3, h: 3, glove: { x: 1, y: 11, w: 3, h: 2 } },
            rightArm: { x: 12, y: 9, w: 3, h: 3, glove: { x: 12, y: 11, w: 3, h: 2 } },
            leftLeg: { x: 4, y: 11, w: 3, h: 4, shoe: { x: 4, y: 14, w: 3, h: 1 } },
            rightLeg: { x: 9, y: 11, w: 3, h: 4, shoe: { x: 9, y: 14, w: 3, h: 1 } }
        });

        const drawBigMario = (key, pose = {}) => {
            const lean = pose.lean || 0;
            const offsetY = pose.bodyOffsetY || 0;

            graphics.clear();

            // Hat
            graphics.fillStyle(colors.hat).fillRect(3 + lean, 0 + offsetY, 10, 3);
            graphics.fillStyle(colors.hat).fillRect(2 + lean, 3 + offsetY, 12, 2);
            graphics.fillStyle(colors.hatShadow).fillRect(1 + lean, 5 + offsetY, 14, 2);

            // Hair and face
            graphics.fillStyle(colors.hair).fillRect(2 + lean, 6 + offsetY, 2, 10);
            graphics.fillStyle(colors.hair).fillRect(12 + lean, 6 + offsetY, 2, 10);

            graphics.fillStyle(colors.skin).fillRect(4 + lean, 6 + offsetY, 8, 10);
            graphics.fillStyle(colors.skinShadow).fillRect(10 + lean, 11 + offsetY, 2, 3);

            // Eyes and nose
            graphics.fillStyle(colors.eye).fillRect(6 + lean, 9 + offsetY, 1, 1);
            graphics.fillStyle(colors.eye).fillRect(9 + lean, 9 + offsetY, 1, 1);
            graphics.fillStyle(colors.skinShadow).fillRect(8 + lean, 10 + offsetY, 1, 2);

            // Moustache
            graphics.fillStyle(colors.moustache).fillRect(4 + lean, 12 + offsetY, 8, 3);

            // Shirt and torso
            graphics.fillStyle(colors.shirt).fillRect(4 + lean, 16 + offsetY, 8, 4);
            graphics.fillStyle(colors.shirt).fillRect(1 + lean, 16 + offsetY, 3, 5);
            graphics.fillStyle(colors.shirt).fillRect(12 + lean, 16 + offsetY, 3, 5);

            // Overalls
            graphics.fillStyle(colors.overall).fillRect(5 + lean, 20 + offsetY, 6, 6);
            graphics.fillStyle(colors.overall).fillRect(5 + lean, 16 + offsetY, 2, 7);
            graphics.fillStyle(colors.overall).fillRect(9 + lean, 16 + offsetY, 2, 7);

            graphics.fillStyle(colors.button).fillRect(5 + lean, 20 + offsetY, 2, 2);
            graphics.fillStyle(colors.button).fillRect(9 + lean, 20 + offsetY, 2, 2);

            // Arms
            const defaultArms = {
                leftArm: { x: 0, y: 18, w: 4, h: 5, glove: { x: 0, y: 22, w: 4, h: 3 } },
                rightArm: { x: 12, y: 18, w: 4, h: 5, glove: { x: 12, y: 22, w: 4, h: 3 } }
            };
            drawArm(pose.leftArm || defaultArms.leftArm, lean, offsetY);
            drawArm(pose.rightArm || defaultArms.rightArm, lean, offsetY);

            // Legs
            const defaultLegs = {
                leftLeg: { x: 4, y: 24, w: 3, h: 6, shoe: { x: 3, y: 30, w: 4, h: 2 } },
                rightLeg: { x: 9, y: 24, w: 3, h: 6, shoe: { x: 8, y: 30, w: 4, h: 2 } }
            };
            drawLeg(pose.leftLeg || defaultLegs.leftLeg, lean, offsetY);
            drawLeg(pose.rightLeg || defaultLegs.rightLeg, lean, offsetY);

            graphics.generateTexture(key, 16, 32);
        };

        drawBigMario('player-big-idle');
        drawBigMario('player-big-run1', {
            lean: -1,
            leftArm: { x: 0, y: 19, w: 4, h: 4, glove: { x: 0, y: 22, w: 4, h: 3 } },
            rightArm: { x: 13, y: 16, w: 3, h: 5, glove: { x: 13, y: 20, w: 3, h: 3 } },
            leftLeg: { x: 3, y: 26, w: 3, h: 5, shoe: { x: 2, y: 30, w: 4, h: 2 } },
            rightLeg: { x: 9, y: 23, w: 3, h: 7, shoe: { x: 9, y: 30, w: 4, h: 2 } }
        });
        drawBigMario('player-big-run2', {
            lean: 1,
            leftArm: { x: -1, y: 16, w: 3, h: 5, glove: { x: -1, y: 20, w: 3, h: 3 } },
            rightArm: { x: 12, y: 19, w: 4, h: 4, glove: { x: 12, y: 22, w: 4, h: 3 } },
            leftLeg: { x: 4, y: 23, w: 3, h: 7, shoe: { x: 3, y: 30, w: 4, h: 2 } },
            rightLeg: { x: 10, y: 26, w: 3, h: 5, shoe: { x: 10, y: 30, w: 4, h: 2 } }
        });
        drawBigMario('player-big-jump', {
            bodyOffsetY: -1,
            leftArm: { x: 0, y: 15, w: 4, h: 5, glove: { x: 0, y: 19, w: 4, h: 3 } },
            rightArm: { x: 12, y: 15, w: 4, h: 5, glove: { x: 12, y: 19, w: 4, h: 3 } },
            leftLeg: { x: 4, y: 22, w: 3, h: 7, shoe: { x: 3, y: 29, w: 4, h: 2 } },
            rightLeg: { x: 9, y: 22, w: 3, h: 7, shoe: { x: 8, y: 29, w: 4, h: 2 } }
        });

        graphics.destroy();
    }

    createEnemySprites() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // 굼바 스타일 적 (16x16)
        graphics.clear();
        graphics.fillStyle(0x5C2A06).fillEllipse(8, 10, 14, 10);
        graphics.fillStyle(0x8B4513).fillEllipse(8, 7, 14, 9);
        graphics.fillStyle(0xFFD7B1).fillEllipse(8, 9, 10, 6);

        // 눈과 눈썹
        graphics.fillStyle(0xFFFFFF).fillRect(4, 6, 3, 4);
        graphics.fillRect(9, 6, 3, 4);
        graphics.fillStyle(0x1F1B24).fillRect(5, 7, 1, 2);
        graphics.fillRect(10, 7, 1, 2);
        graphics.fillStyle(0x1F1B24).fillRect(3, 4, 4, 1);
        graphics.fillRect(9, 4, 4, 1);

        // 발
        graphics.fillStyle(0x372010).fillRect(2, 13, 5, 3);
        graphics.fillRect(9, 13, 5, 3);

        graphics.generateTexture('enemy-goomba', 16, 16);

        // 쿠파 트루퍼 스타일 적 (16x20)
        graphics.clear();
        graphics.fillStyle(0x1E7E34).fillEllipse(8, 11, 12, 12);
        graphics.fillStyle(0x2ECC71).fillEllipse(8, 9, 12, 10);
        graphics.fillStyle(0xFFE4C0).fillRect(5, 11, 6, 6);
        graphics.fillStyle(0xFFD93D).fillRect(6, 12, 4, 4);

        graphics.fillStyle(0xFFD7B1).fillRect(4, 4, 8, 6);
        graphics.fillStyle(0x8B4513).fillRect(4, 4, 2, 4);
        graphics.fillRect(10, 4, 2, 4);
        graphics.fillStyle(0x1F1B24).fillRect(5, 5, 1, 2);
        graphics.fillRect(10, 5, 1, 2);

        // 발
        graphics.fillStyle(0x372010).fillRect(3, 16, 4, 3);
        graphics.fillRect(9, 16, 4, 3);

        graphics.generateTexture('enemy-troopa', 16, 20);

        graphics.destroy();
    }

    createTileSprites() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        const tileSize = CONFIG.TILE_SIZE;

        // 땅 블록
        graphics.clear();
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 0, tileSize, tileSize);
        graphics.fillStyle(0x654321);
        graphics.fillRect(2, 2, tileSize - 4, tileSize - 4);
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(4, 4, 4, 4);
        graphics.fillRect(tileSize - 8, 4, 4, 4);
        graphics.fillRect(4, tileSize - 8, 4, 4);
        graphics.fillRect(tileSize - 8, tileSize - 8, 4, 4);

        graphics.generateTexture('tile-ground', tileSize, tileSize);

        // 벽돌 블록
        graphics.clear();
        graphics.fillStyle(0xCD853F);
        graphics.fillRect(0, 0, tileSize, tileSize);
        graphics.fillStyle(0x000000);
        graphics.fillRect(0, tileSize / 2 - 1, tileSize, 2);
        graphics.fillRect(tileSize / 2 - 1, 0, 2, tileSize / 2);
        graphics.fillRect(tileSize / 4 - 1, tileSize / 2, 2, tileSize / 2);
        graphics.fillRect(tileSize * 3 / 4 - 1, tileSize / 2, 2, tileSize / 2);

        graphics.generateTexture('tile-brick', tileSize, tileSize);

        // 물음표 블록
        graphics.clear();
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(0, 0, tileSize, tileSize);
        graphics.fillStyle(0xFFFF00);
        graphics.fillRect(2, 2, tileSize - 4, tileSize - 4);
        graphics.fillStyle(0xFF8C00);
        // 물음표 그리기
        graphics.fillRect(10, 8, 12, 4);
        graphics.fillRect(18, 12, 4, 4);
        graphics.fillRect(14, 16, 4, 4);
        graphics.fillRect(14, 22, 4, 4);

        graphics.generateTexture('tile-question', tileSize, tileSize);

        // 파이프 (상단)
        graphics.clear();
        graphics.fillStyle(0x00FF00);
        graphics.fillRect(0, 0, tileSize, tileSize);
        graphics.fillStyle(0x008000);
        graphics.fillRect(0, 0, tileSize, 8);
        graphics.fillRect(4, 8, tileSize - 8, tileSize - 8);

        graphics.generateTexture('tile-pipe-top', tileSize, tileSize);

        // 파이프 (몸통)
        graphics.clear();
        graphics.fillStyle(0x00FF00);
        graphics.fillRect(0, 0, tileSize, tileSize);
        graphics.fillStyle(0x008000);
        graphics.fillRect(4, 0, tileSize - 8, tileSize);

        graphics.generateTexture('tile-pipe-body', tileSize, tileSize);

        graphics.destroy();
    }

    createPowerupSprites() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        graphics.clear();

        // 버섯 모자
        graphics.fillStyle(0xFFFFFF).fillEllipse(8, 6, 14, 10);
        graphics.fillStyle(0xD22B2B).fillEllipse(8, 6, 14, 8);
        graphics.fillStyle(0xFFFFFF).fillCircle(4, 6, 3);
        graphics.fillCircle(12, 6, 3);
        graphics.fillCircle(8, 3, 2);

        // 줄기
        graphics.fillStyle(0xFFE4C0).fillRect(6, 8, 4, 6);
        graphics.fillStyle(0xD7B48A).fillRect(6, 11, 4, 2);

        graphics.generateTexture('powerup-mushroom', 16, 16);
        graphics.destroy();
    }

    createUISprites() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // 코인
        graphics.clear();
        graphics.fillStyle(0xFFD700);
        graphics.fillCircle(8, 8, 6);
        graphics.fillStyle(0xFFFF00);
        graphics.fillCircle(8, 8, 4);
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(7, 4, 2, 8);

        graphics.generateTexture('coin', 16, 16);

        // 하트 (생명)
        graphics.clear();
        graphics.fillStyle(0xFF0000);
        graphics.fillCircle(5, 5, 4);
        graphics.fillCircle(11, 5, 4);
        graphics.beginPath();
        graphics.moveTo(1, 6);
        graphics.lineTo(8, 14);
        graphics.lineTo(15, 6);
        graphics.closePath();
        graphics.fillPath();

        graphics.generateTexture('heart', 16, 16);

        graphics.destroy();
    }

    create() {
        // 캠퍼스 맵으로 이동
        this.scene.start('CampusMapScene');
    }
}
