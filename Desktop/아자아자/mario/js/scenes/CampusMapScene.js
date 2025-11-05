// Campus Map Scene - 슈퍼 마리오 월드 스타일 맵
class CampusMapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CampusMapScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 배경 (풀밭)
        this.createBackground();

        // 길 그리기 (건물들 연결)
        this.createPaths();

        // 건물들 배치
        this.buildings = [];
        CONFIG.BUILDINGS.forEach((building, index) => {
            this.createBuilding(building);
        });

        // 플레이어 (탑뷰 마리오)
        this.createPlayer();

        // 타이틀
        this.createTitle();

        // 컨트롤 설명
        this.createControls();

        // 카메라 설정
        this.cameras.main.fadeIn(500, 135, 206, 250);

        // 키보드
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // 선택된 건물
        this.selectedBuilding = null;
        this.canSelect = true;
    }

    createBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 하늘 그라디언트
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x98D8E8, 0x98D8E8, 1);
        sky.fillRect(0, 0, width, height);

        // 풀밭 패턴
        for (let y = 0; y < height; y += 20) {
            for (let x = 0; x < width; x += 20) {
                const grassColor = (x + y) % 40 === 0 ? 0x4CAF50 : 0x66BB6A;
                const grass = this.add.rectangle(x + 10, y + 10, 20, 20, grassColor);
                grass.setAlpha(0.8);
            }
        }

        // 나무들
        this.createTrees();

        // 구름들
        for (let i = 0; i < 8; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(20, 100);
            this.createCloud(x, y);
        }
    }

    createTrees() {
        const treePositions = [
            { x: 100, y: 100 },
            { x: 700, y: 100 },
            { x: 100, y: 500 },
            { x: 700, y: 500 },
            { x: 400, y: 500 }
        ];

        treePositions.forEach(pos => {
            // 나무 기둥
            const trunk = this.add.rectangle(pos.x, pos.y, 12, 30, 0x8B4513);

            // 나무 잎
            const leaves = this.add.circle(pos.x, pos.y - 20, 20, 0x228B22);
            const leaves2 = this.add.circle(pos.x - 10, pos.y - 15, 15, 0x228B22);
            const leaves3 = this.add.circle(pos.x + 10, pos.y - 15, 15, 0x228B22);
        });
    }

    createCloud(x, y) {
        const cloud = this.add.graphics();
        cloud.fillStyle(0xFFFFFF, 0.8);
        cloud.fillCircle(x, y, 15);
        cloud.fillCircle(x + 12, y, 18);
        cloud.fillCircle(x + 24, y, 15);
        cloud.fillCircle(x + 12, y - 8, 15);

        // 구름 움직이기
        this.tweens.add({
            targets: cloud,
            x: x + 50,
            duration: 30000,
            ease: 'Linear',
            repeat: -1,
            onRepeat: () => {
                cloud.x = -50;
            }
        });
    }

    createPaths() {
        // 건물들을 연결하는 길
        const graphics = this.add.graphics();
        graphics.lineStyle(16, 0xFFD700, 1);

        // 시작점
        const start = { x: 50, y: 550 };

        // 길 그리기 (S자 형태로 모든 건물 연결)
        const paths = [
            start,
            CONFIG.BUILDINGS[4], // 체육관
            CONFIG.BUILDINGS[0], // 도서관
            CONFIG.BUILDINGS[1], // 학생회관
            CONFIG.BUILDINGS[3], // 기숙사
            CONFIG.BUILDINGS[2], // 공학관
        ];

        // 부드러운 곡선으로 연결
        const path = new Phaser.Curves.Spline(paths.map(p => new Phaser.Math.Vector2(p.x, p.y)));
        path.draw(graphics, 128);

        // 길 테두리
        graphics.lineStyle(20, 0xDAA520, 1);
        path.draw(graphics, 128);
        graphics.lineStyle(14, 0xFFD700, 1);
        path.draw(graphics, 128);

        // 길에 점선 추가 (도로 느낌)
        graphics.lineStyle(2, 0xFFFFFF, 0.6);
        for (let t = 0; t < 1; t += 0.02) {
            if (Math.floor(t * 100) % 4 < 2) {
                const p1 = path.getPoint(t);
                const p2 = path.getPoint(t + 0.01);
                graphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
            }
        }

        // 시작 지점 표시
        this.startPoint = { x: start.x, y: start.y };
        const startFlag = this.add.rectangle(start.x, start.y - 20, 4, 40, 0x000000);
        const startFlagTriangle = this.add.triangle(
            start.x + 10, start.y - 35,
            0, 0,
            20, 10,
            0, 20,
            0x00FF00
        );

        const startText = this.add.text(start.x, start.y + 30, 'START', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
    }

    createBuilding(building) {
        const { x, y, name, icon, stageNumber } = building;

        // 건물 기반 (그림자)
        const shadow = this.add.ellipse(x, y + 35, 50, 15, 0x000000, 0.3);

        // 건물 (3D 블록 느낌)
        const buildingBlock = this.add.graphics();

        // 정면
        buildingBlock.fillStyle(0xFF6B6B, 1);
        buildingBlock.fillRect(x - 25, y - 15, 50, 50);

        // 윗면 (3D 효과)
        buildingBlock.fillStyle(0xFF8E8E, 1);
        buildingBlock.beginPath();
        buildingBlock.moveTo(x - 25, y - 15);
        buildingBlock.lineTo(x, y - 25);
        buildingBlock.lineTo(x + 25, y - 15);
        buildingBlock.lineTo(x + 25, y - 15);
        buildingBlock.closePath();
        buildingBlock.fillPath();

        // 옆면
        buildingBlock.fillStyle(0xFF4444, 1);
        buildingBlock.beginPath();
        buildingBlock.moveTo(x + 25, y - 15);
        buildingBlock.lineTo(x + 35, y - 5);
        buildingBlock.lineTo(x + 35, y + 45);
        buildingBlock.lineTo(x + 25, y + 35);
        buildingBlock.closePath();
        buildingBlock.fillPath();

        // 창문
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const winX = x - 15 + i * 20;
                const winY = y - 5 + j * 20;
                const window = this.add.rectangle(winX, winY, 8, 12, 0x87CEEB);
                window.setStrokeStyle(1, 0x000000);
            }
        }

        // 건물 이름 라벨
        const labelBg = this.add.rectangle(x, y - 45, name.length * 12 + 10, 20, 0x000000, 0.7);
        labelBg.setStrokeStyle(2, 0xFFFFFF);

        const nameText = this.add.text(x, y - 45, name, {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // 스테이지 번호
        const stageCircle = this.add.circle(x - 30, y - 30, 12, 0xFFD700);
        stageCircle.setStrokeStyle(2, 0xFF8C00);

        const stageText = this.add.text(x - 30, y - 30, stageNumber.toString(), {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            fill: '#000000'
        }).setOrigin(0.5);

        // 선택 표시 (처음엔 숨김)
        const selectArrow = this.add.text(x, y - 60, '▼', {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: '#FFFF00'
        }).setOrigin(0.5);
        selectArrow.setVisible(false);

        // 깜빡이는 애니메이션
        this.tweens.add({
            targets: selectArrow,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // 살짝 떠있는 애니메이션
        this.tweens.add({
            targets: [buildingBlock, nameText, labelBg, stageCircle, stageText],
            y: '-=3',
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        building.graphics = {
            block: buildingBlock,
            label: labelBg,
            nameText: nameText,
            arrow: selectArrow,
            stageCircle: stageCircle,
            stageText: stageText
        };

        this.buildings.push(building);
    }

    createPlayer() {
        // 플레이어 (탑뷰 마리오)
        const startX = this.startPoint.x;
        const startY = this.startPoint.y;

        // 그림자 (먼저 그려서 뒤로)
        this.playerShadow = this.add.ellipse(0, 16, 18, 8, 0x000000, 0.3);

        // 마리오 다리
        this.playerLegLeft = this.add.rectangle(-4, 12, 5, 6, 0x0000FF);
        this.playerLegRight = this.add.rectangle(4, 12, 5, 6, 0x0000FF);

        // 마리오 몸
        this.playerBody = this.add.rectangle(0, 4, 14, 12, 0x0000FF);

        // 마리오 얼굴
        this.playerFace = this.add.circle(0, -4, 6, 0xFFDBAC);

        // 마리오 머리 (빨간 모자)
        this.playerHat = this.add.circle(0, -8, 8, 0xFF0000);

        // 플레이어 컨테이너
        this.playerContainer = this.add.container(startX, startY, [
            this.playerShadow,
            this.playerLegLeft,
            this.playerLegRight,
            this.playerBody,
            this.playerFace,
            this.playerHat
        ]);

        // 플레이어 위치
        this.playerX = startX;
        this.playerY = startY;
        this.playerSpeed = 2.5;

        // 걷는 애니메이션
        this.walkAnimation = this.tweens.add({
            targets: [this.playerLegLeft, this.playerLegRight],
            x: '+=2',
            duration: 200,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            paused: true
        });
    }

    createTitle() {
        const title = this.add.text(400, 30, 'CAMPUS ADVENTURE', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            y: 35,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    createControls() {
        this.controlsText = this.add.text(400, 580, '방향키로 이동 | SPACE/ENTER로 선택', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
    }

    update() {
        // 플레이어 이동
        let moving = false;
        let newX = this.playerX;
        let newY = this.playerY;

        if (this.cursors.left.isDown) {
            newX -= this.playerSpeed;
            moving = true;
        } else if (this.cursors.right.isDown) {
            newX += this.playerSpeed;
            moving = true;
        }

        if (this.cursors.up.isDown) {
            newY -= this.playerSpeed;
            moving = true;
        } else if (this.cursors.down.isDown) {
            newY += this.playerSpeed;
            moving = true;
        }

        // 화면 경계 체크
        newX = Phaser.Math.Clamp(newX, 30, 770);
        newY = Phaser.Math.Clamp(newY, 30, 570);

        this.playerX = newX;
        this.playerY = newY;

        // 플레이어 위치 업데이트
        this.playerContainer.setPosition(this.playerX, this.playerY);

        // 걷는 애니메이션
        if (moving) {
            if (!this.walkAnimation.isPlaying()) {
                this.walkAnimation.resume();
            }
        } else {
            this.walkAnimation.pause();
            this.playerLegLeft.x = -4;
            this.playerLegRight.x = 4;
        }

        // 건물 근처에 있는지 체크
        this.checkBuildingProximity();

        // 선택 키 체크
        if ((Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
             Phaser.Input.Keyboard.JustDown(this.enterKey)) &&
            this.selectedBuilding && this.canSelect) {
            this.enterBuilding(this.selectedBuilding);
        }
    }

    checkBuildingProximity() {
        let nearestBuilding = null;
        let minDistance = 60; // 60픽셀 이내

        CONFIG.BUILDINGS.forEach(building => {
            const distance = Phaser.Math.Distance.Between(
                this.playerX, this.playerY,
                building.x, building.y
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestBuilding = building;
            }
        });

        // 이전 선택 해제
        if (this.selectedBuilding && this.selectedBuilding !== nearestBuilding) {
            this.selectedBuilding.graphics.arrow.setVisible(false);
        }

        // 새 선택
        if (nearestBuilding) {
            nearestBuilding.graphics.arrow.setVisible(true);
            this.selectedBuilding = nearestBuilding;
        } else {
            this.selectedBuilding = null;
        }
    }

    enterBuilding(building) {
        this.canSelect = false;

        // 선택 효과
        this.tweens.add({
            targets: this.playerContainer,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            repeat: 2
        });

        // 화면 깜빡임
        this.cameras.main.flash(500, 255, 255, 255);

        this.time.delayedCall(600, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
        });

        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene', {
                buildingId: building.id,
                buildingName: building.name,
                stageIndex: building.stageNumber - 1
            });
        });
    }
}
