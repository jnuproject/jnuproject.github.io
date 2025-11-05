// Game Scene - 진짜 슈퍼 마리오 브라더스 스타일 게임플레이
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.buildingId = data.buildingId;
        this.buildingName = data.buildingName;
        this.stageIndex = data.stageIndex;

        // 게임 상태 초기화
        this.goalReached = false;
        this.gameTime = 300; // 300초 타임 리미트
        this.timerStarted = false;
    }

    create() {
        const width = CONFIG.GAME_WIDTH;
        const height = CONFIG.GAME_HEIGHT;

        // 월드 크기 설정 (각 스테이지마다 다른 길이)
        const worldWidth = this.getWorldWidth();
        this.physics.world.bounds.width = worldWidth;
        this.physics.world.bounds.height = height;

        // 배경 생성
        this.createBackground();

        // 아이템 그룹 초기화 (레벨 생성 전에 필요)
        this.coins = this.physics.add.group();
        this.powerups = this.physics.add.group();

        // 레벨 맵 생성
        this.createLevel();

        // 적들 생성
        this.enemies = [];
        this.createEnemies();

        // 플레이어 생성
        this.player = new Player(this, 100, height - 200);

        // 카메라 설정 (부드러운 스크롤)
        this.cameras.main.setBounds(0, 0, worldWidth, height);
        this.cameras.main.startFollow(this.player.getSprite(), true, 0.08, 0.08);
        this.cameras.main.setDeadzone(200, 150);
        this.cameras.main.setZoom(1);

        // 충돌 설정
        this.setupCollisions();

        // UI 생성
        this.createUI();

        // 골 깃발
        this.createGoal();

        // 카메라 페이드 인
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // ESC 키로 맵으로 돌아가기
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // 타이머 시작
        this.startTimer();
    }

    getWorldWidth() {
        // 스테이지별로 다른 월드 너비
        const widths = [
            CONFIG.GAME_WIDTH * 4,  // Stage 1: 도서관 (쉬움)
            CONFIG.GAME_WIDTH * 5,  // Stage 2: 학생회관 (중간)
            CONFIG.GAME_WIDTH * 4.5, // Stage 3: 공학관 (수직)
            CONFIG.GAME_WIDTH * 5.5, // Stage 4: 기숙사 (동굴)
            CONFIG.GAME_WIDTH * 6    // Stage 5: 체육관 (하늘)
        ];
        return widths[this.stageIndex] || CONFIG.GAME_WIDTH * 4;
    }

    createBackground() {
        const width = this.getWorldWidth();
        const height = CONFIG.GAME_HEIGHT;

        // 스테이지별 배경색
        const bgColors = this.getBackgroundColors();

        // 그라디언트 하늘
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(bgColors.top, bgColors.top, bgColors.bottom, bgColors.bottom, 1);
        gradient.fillRect(0, 0, width, height);
        gradient.setScrollFactor(0);

        // 구름들 (패럴랙스 효과)
        for (let i = 0; i < Math.floor(width / 200); i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(50, 200);
            this.createCloud(x, y);
        }

        // 스테이지별 배경 장식
        this.createStageBackground();
    }

    getBackgroundColors() {
        const colors = [
            { top: 0x5C94FC, bottom: 0x90CAF9 },  // Stage 1: 밝은 하늘
            { top: 0x87CEEB, bottom: 0xB0E0E6 },  // Stage 2: 청명한 하늘
            { top: 0x4A90E2, bottom: 0x7FB3D5 },  // Stage 3: 공학관 하늘
            { top: 0x2C3E50, bottom: 0x34495E },  // Stage 4: 어두운 동굴
            { top: 0xFF6B6B, bottom: 0xFFD93D }   // Stage 5: 석양 하늘
        ];
        return colors[this.stageIndex] || colors[0];
    }

    createCloud(x, y) {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xFFFFFF, 0.8);

        // 구름 모양
        graphics.fillCircle(x, y, 18);
        graphics.fillCircle(x + 12, y, 22);
        graphics.fillCircle(x + 24, y, 18);
        graphics.fillCircle(x + 12, y - 8, 16);

        graphics.setScrollFactor(0.2);

        // 천천히 움직이기
        this.tweens.add({
            targets: graphics,
            x: x + 150,
            duration: 40000,
            ease: 'Linear',
            repeat: -1
        });
    }

    createStageBackground() {
        const height = CONFIG.GAME_HEIGHT;

        if (this.stageIndex === 0) {
            // Stage 1: 작은 언덕들
            this.createHills();
        } else if (this.stageIndex === 1) {
            // Stage 2: 먼 산들
            this.createMountains();
        } else if (this.stageIndex === 2) {
            // Stage 3: 도시 실루엣
            this.createCityscape();
        } else if (this.stageIndex === 3) {
            // Stage 4: 동굴 배경 (어둡고 돌)
            this.createCaveBackground();
        } else if (this.stageIndex === 4) {
            // Stage 5: 구름 많은 하늘
            this.createSkyBackground();
        }
    }

    createHills() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x7EC850, 0.6);

        for (let i = 0; i < 8; i++) {
            const x = i * 400;
            const hillHeight = Phaser.Math.Between(100, 150);

            graphics.beginPath();
            graphics.moveTo(x, CONFIG.GAME_HEIGHT);
            graphics.lineTo(x + 150, CONFIG.GAME_HEIGHT - hillHeight);
            graphics.lineTo(x + 300, CONFIG.GAME_HEIGHT);
            graphics.closePath();
            graphics.fillPath();
        }

        graphics.setScrollFactor(0.4);
    }

    createMountains() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x2ECC71, 0.5);

        for (let i = 0; i < 10; i++) {
            const x = i * 500;
            const height = Phaser.Math.Between(150, 250);

            graphics.beginPath();
            graphics.moveTo(x, CONFIG.GAME_HEIGHT);
            graphics.lineTo(x + 250, CONFIG.GAME_HEIGHT - height);
            graphics.lineTo(x + 500, CONFIG.GAME_HEIGHT);
            graphics.closePath();
            graphics.fillPath();
        }

        graphics.setScrollFactor(0.3);
    }

    createCityscape() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x34495E, 0.4);

        for (let i = 0; i < 20; i++) {
            const x = i * 150;
            const buildingHeight = Phaser.Math.Between(100, 300);
            const buildingWidth = Phaser.Math.Between(50, 100);

            graphics.fillRect(x, CONFIG.GAME_HEIGHT - buildingHeight, buildingWidth, buildingHeight);
        }

        graphics.setScrollFactor(0.5);
    }

    createCaveBackground() {
        const graphics = this.add.graphics();

        // 어두운 돌들
        graphics.fillStyle(0x4A4A4A, 0.3);
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, this.getWorldWidth());
            const y = Phaser.Math.Between(0, CONFIG.GAME_HEIGHT);
            const size = Phaser.Math.Between(20, 50);
            graphics.fillCircle(x, y, size);
        }

        graphics.setScrollFactor(0.3);
    }

    createSkyBackground() {
        // 더 많은 구름들
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, this.getWorldWidth());
            const y = Phaser.Math.Between(20, 300);
            this.createCloud(x, y);
        }
    }

    createLevel() {
        // 플랫폼 그룹
        this.platforms = this.physics.add.staticGroup();
        this.bricks = this.physics.add.staticGroup();
        this.questionBlocks = this.physics.add.staticGroup();
        this.pipes = this.physics.add.staticGroup();

        const t = CONFIG.TILE_SIZE;

        // 바닥 생성 (구멍 포함)
        this.createGround();

        // 스테이지별 고유 레벨 디자인
        switch (this.stageIndex) {
            case 0:
                this.createStage1_Library();
                break;
            case 1:
                this.createStage2_StudentHall();
                break;
            case 2:
                this.createStage3_Engineering();
                break;
            case 3:
                this.createStage4_Dormitory();
                break;
            case 4:
                this.createStage5_Gymnasium();
                break;
        }
    }

    createGround() {
        const t = CONFIG.TILE_SIZE;
        const width = this.getWorldWidth();
        const groundY = CONFIG.GAME_HEIGHT - t;

        // 스테이지별 구멍 위치 정의
        const gaps = this.getGroundGaps();

        for (let x = 0; x < width / t; x++) {
            const isGap = gaps.some(gap => x >= gap.start && x < gap.end);

            if (!isGap) {
                // 바닥 타일
                this.platforms.create(x * t + t / 2, groundY + t / 2, 'tile-ground');
                // 지하 타일 (2층)
                this.platforms.create(x * t + t / 2, groundY + t * 1.5, 'tile-ground');
            }
        }
    }

    getGroundGaps() {
        // 스테이지별 구멍 위치
        const gaps = [
            // Stage 1: 쉬운 구멍들
            [{ start: 40, end: 43 }, { start: 80, end: 84 }, { start: 130, end: 134 }],
            // Stage 2: 중간 난이도
            [{ start: 50, end: 54 }, { start: 90, end: 95 }, { start: 140, end: 146 }, { start: 190, end: 195 }],
            // Stage 3: 적당한 구멍
            [{ start: 60, end: 64 }, { start: 110, end: 116 }, { start: 170, end: 175 }],
            // Stage 4: 많은 구멍
            [{ start: 45, end: 50 }, { start: 80, end: 86 }, { start: 120, end: 127 }, { start: 165, end: 172 }, { start: 210, end: 217 }],
            // Stage 5: 긴 구멍들
            [{ start: 55, end: 62 }, { start: 100, end: 108 }, { start: 150, end: 160 }, { start: 200, end: 210 }]
        ];

        return gaps[this.stageIndex] || [];
    }

    // ========== STAGE 1: 도서관 (초보자 친화적) ==========
    createStage1_Library() {
        const t = CONFIG.TILE_SIZE;
        const groundY = CONFIG.GAME_HEIGHT - t;

        // 시작 부분 - 간단한 연습 구간
        this.createQuestionBlock(200, groundY - t * 4, true);
        this.createQuestionBlock(250, groundY - t * 4, true);

        // 첫 번째 계단
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j <= i; j++) {
                this.createBrick(350 + i * t, groundY - j * t - t);
            }
        }

        // 물음표 블록 그룹 1
        this.createQuestionBlock(500, groundY - t * 5, true);
        this.createBrick(540, groundY - t * 5);
        this.createQuestionBlock(580, groundY - t * 5, true);
        this.createBrick(620, groundY - t * 5);
        this.createQuestionBlock(660, groundY - t * 5, true);

        // 낮은 파이프 (장애물)
        this.createPipe(750, groundY - t * 2, 2);

        // 공중 플랫폼 (쉬운 점프)
        for (let i = 0; i < 5; i++) {
            this.createBrick(900 + i * t, groundY - t * 6);
        }
        this.createQuestionBlock(960, groundY - t * 9, true, 'coin');

        // 긴 벽돌 플랫폼
        for (let i = 0; i < 8; i++) {
            this.createBrick(1100 + i * t, groundY - t * 4);
        }
        this.createQuestionBlock(1140, groundY - t * 8, true, 'powerup');

        // 계단 내려가기
        for (let i = 3; i >= 0; i--) {
            for (let j = 0; j <= i; j++) {
                this.createBrick(1300 + (3 - i) * t, groundY - j * t - t);
            }
        }

        // 중간 파이프
        this.createPipe(1500, groundY - t * 3, 3);

        // 숨겨진 블록 (보이지 않는 코인 블록)
        const hiddenBlock = this.createQuestionBlock(1600, groundY - t * 8, true, 'coin');
        hiddenBlock.setAlpha(0.3);

        // 연속 물음표 블록 (책장 느낌)
        for (let i = 0; i < 7; i++) {
            this.createQuestionBlock(1750 + i * t * 2, groundY - t * 5, i % 2 === 0);
        }

        // 높은 플랫폼 섬
        for (let i = 0; i < 6; i++) {
            this.createBrick(1950 + i * t, groundY - t * 10);
        }
        // 섬 위의 코인들
        for (let i = 0; i < 5; i++) {
            this.createCoin(1960 + i * t, groundY - t * 12);
        }

        // 마지막 구간 - 파이프 지대
        this.createPipe(2150, groundY - t * 2, 2);
        this.createPipe(2250, groundY - t * 3, 3);
        this.createPipe(2350, groundY - t * 4, 4);
        this.createPipe(2450, groundY - t * 3, 3);
    }

    // ========== STAGE 2: 학생회관 (더 많은 플랫폼과 적) ==========
    createStage2_StudentHall() {
        const t = CONFIG.TILE_SIZE;
        const groundY = CONFIG.GAME_HEIGHT - t;

        // 지그재그 물음표 블록
        for (let i = 0; i < 10; i++) {
            const y = i % 2 === 0 ? groundY - t * 5 : groundY - t * 7;
            this.createQuestionBlock(200 + i * t * 2, y, i % 3 === 0);
        }

        // 벽돌 피라미드
        for (let layer = 0; layer < 5; layer++) {
            for (let i = 0; i < (5 - layer) * 2; i++) {
                this.createBrick(500 + (layer * t) + i * t, groundY - t * (layer + 1));
            }
        }

        // 파이프 장애물
        this.createPipe(750, groundY - t * 5, 5);

        // 긴 공중 플랫폼 with 코인들
        for (let i = 0; i < 12; i++) {
            this.createBrick(950 + i * t, groundY - t * 8);
            if (i % 2 === 0) {
                this.createCoin(950 + i * t, groundY - t * 10);
            }
        }
        this.createQuestionBlock(1010, groundY - t * 12, true, 'powerup');

        // 움직이는 플랫폼 느낌 (시각적으로만)
        for (let i = 0; i < 5; i++) {
            const x = 1300 + i * t * 3;
            this.createBrick(x, groundY - t * 6);
            this.createBrick(x + t, groundY - t * 6);
        }

        // 물음표 블록 계단
        for (let i = 0; i < 6; i++) {
            this.createQuestionBlock(1550 + i * t * 2, groundY - t * (4 + i), i % 2 === 0);
        }

        // 높은 벽
        for (let i = 0; i < 8; i++) {
            this.createBrick(1800, groundY - t * (i + 1));
        }

        // 벽 너머 비밀 지역
        for (let i = 0; i < 8; i++) {
            this.createBrick(1850 + i * t, groundY - t * 10);
            this.createCoin(1850 + i * t, groundY - t * 12);
        }
        this.createQuestionBlock(1890, groundY - t * 13, true, 'coin');

        // 파이프 군집
        this.createPipe(2100, groundY - t * 2, 2);
        this.createPipe(2200, groundY - t * 4, 4);
        this.createPipe(2300, groundY - t * 6, 6);
        this.createPipe(2400, groundY - t * 4, 4);
        this.createPipe(2500, groundY - t * 2, 2);

        // 마지막 점프 챌린지
        for (let i = 0; i < 5; i++) {
            this.createBrick(2700 + i * t * 3, groundY - t * (6 + Math.floor(i / 2)));
            this.createQuestionBlock(2700 + i * t * 3 + t, groundY - t * (6 + Math.floor(i / 2)), true);
        }
    }

    // ========== STAGE 3: 공학관 (수직 섹션 많음) ==========
    createStage3_Engineering() {
        const t = CONFIG.TILE_SIZE;
        const groundY = CONFIG.GAME_HEIGHT - t;

        // 시작 - 급격한 상승
        for (let i = 0; i < 10; i++) {
            this.createBrick(200 + i * t * 1.5, groundY - t * (2 + i));
            if (i % 2 === 0) {
                this.createQuestionBlock(200 + i * t * 1.5 + t, groundY - t * (2 + i), true);
            }
        }

        // 높은 플랫폼 지대
        for (let i = 0; i < 10; i++) {
            this.createBrick(600 + i * t, groundY - t * 12);
        }
        this.createQuestionBlock(640, groundY - t * 15, true, 'powerup');
        this.createQuestionBlock(680, groundY - t * 15, true, 'coin');

        // 수직 타워
        for (let i = 0; i < 12; i++) {
            this.createBrick(850, groundY - t * (i + 1));
            this.createBrick(850 + t * 5, groundY - t * (i + 1));
        }
        // 타워 사이 플랫폼들
        for (let floor = 0; floor < 4; floor++) {
            for (let i = 0; i < 3; i++) {
                this.createBrick(850 + t + i * t, groundY - t * (3 + floor * 3));
            }
        }

        // 내려가는 계단
        for (let i = 0; i < 8; i++) {
            this.createBrick(1100 + i * t, groundY - t * (12 - i));
            if (i % 2 === 1) {
                this.createCoin(1100 + i * t, groundY - t * (14 - i));
            }
        }

        // 복잡한 구조물 (기계 같은 느낌)
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if ((i + j) % 2 === 0) {
                    this.createBrick(1350 + i * t * 2, groundY - t * (3 + j * 2));
                }
            }
        }

        // 파이프 타워
        this.createPipe(1600, groundY - t * 8, 8);

        // 긴 다리 (중간에 구멍)
        for (let i = 0; i < 20; i++) {
            if (i < 7 || i > 12) {
                this.createBrick(1750 + i * t, groundY - t * 6);
            }
        }

        // 다리 위 물음표 블록
        for (let i = 0; i < 5; i++) {
            this.createQuestionBlock(1750 + i * t * 4, groundY - t * 10, i % 2 === 0);
        }

        // 최종 수직 섹션
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {
                this.createBrick(2100 + j * t, groundY - t * (2 + i * 2));
            }
            this.createQuestionBlock(2100 + t, groundY - t * (3 + i * 2), i === 3, i === 3 ? 'powerup' : 'coin');
        }
    }

    // ========== STAGE 4: 기숙사 (동굴 테마, 좁은 공간) ==========
    createStage4_Dormitory() {
        const t = CONFIG.TILE_SIZE;
        const groundY = CONFIG.GAME_HEIGHT - t;

        // 천장 만들기 (동굴 느낌)
        for (let i = 0; i < 50; i++) {
            if (i % 4 !== 2) { // 일부 구멍
                this.createBrick(200 + i * t, t * 2);
            }
        }

        // 좁은 복도 시작
        for (let i = 0; i < 8; i++) {
            this.createBrick(200 + i * t, groundY - t * 5);
        }
        this.createQuestionBlock(240, groundY - t * 8, true, 'coin');

        // 파이프 미로
        this.createPipe(450, groundY - t * 7, 7);
        this.createPipe(550, groundY - t * 5, 5);
        this.createPipe(650, groundY - t * 7, 7);

        // 낮은 천장 구간 (웅크려야 하는 느낌)
        for (let i = 0; i < 15; i++) {
            this.createBrick(750 + i * t, groundY - t * 8);
            this.createBrick(750 + i * t, t * 6);
        }
        // 중간에 물음표 블록
        for (let i = 0; i < 5; i++) {
            this.createQuestionBlock(800 + i * t * 3, t * 9, i % 2 === 0);
        }

        // 계단 구조 (기숙사 층)
        for (let floor = 0; floor < 5; floor++) {
            const floorY = groundY - t * (4 + floor * 4);
            for (let i = 0; i < 6; i++) {
                this.createBrick(1150 + i * t, floorY);
            }
            this.createQuestionBlock(1170, floorY - t * 3, floor % 2 === 0);

            // 층 사이 작은 플랫폼
            this.createBrick(1220, floorY - t * 2);
            this.createBrick(1221 + t, floorY - t * 2);
        }

        // 비밀 방 (위쪽)
        for (let i = 0; i < 8; i++) {
            this.createBrick(1350 + i * t, t * 8);
        }
        for (let i = 0; i < 6; i++) {
            this.createCoin(1360 + i * t, t * 6);
        }
        this.createQuestionBlock(1385, t * 11, true, 'powerup');

        // 좁은 통로와 함정
        for (let i = 0; i < 12; i++) {
            if (i % 3 !== 1) {
                this.createBrick(1550 + i * t, groundY - t * 4);
            }
        }

        // 파이프 정글
        this.createPipe(1800, groundY - t * 3, 3);
        this.createPipe(1900, groundY - t * 5, 5);
        this.createPipe(2000, groundY - t * 7, 7);
        this.createPipe(2100, groundY - t * 9, 9);
        this.createPipe(2200, groundY - t * 7, 7);
        this.createPipe(2300, groundY - t * 5, 5);

        // 최종 챌린지 - 높은 점프
        for (let i = 0; i < 6; i++) {
            this.createBrick(2500 + i * t * 3, groundY - t * (5 + i * 2));
            this.createQuestionBlock(2500 + i * t * 3 + t, groundY - t * (5 + i * 2), i % 2 === 0);
        }

        // 동굴 출구
        for (let i = 0; i < 10; i++) {
            this.createBrick(2750 + i * t, t * 4);
            this.createCoin(2750 + i * t, t * 2);
        }
    }

    // ========== STAGE 5: 체육관 (하늘/운동 테마, 움직이는 플랫폼) ==========
    createStage5_Gymnasium() {
        const t = CONFIG.TILE_SIZE;
        const groundY = CONFIG.GAME_HEIGHT - t;

        // 트램폴린 같은 시작
        for (let i = 0; i < 8; i++) {
            const y = groundY - t * 4 + Math.sin(i * 0.8) * t * 2;
            this.createBrick(200 + i * t * 2, y);
        }

        // 높은 점프대
        for (let i = 0; i < 3; i++) {
            this.createBrick(450 + i * t, groundY - t * 10);
        }
        this.createQuestionBlock(460, groundY - t * 13, true, 'powerup');

        // 구름 플랫폼들 (떠있는 느낌)
        const cloudPlatforms = [
            { x: 600, y: groundY - t * 12 },
            { x: 700, y: groundY - t * 14 },
            { x: 800, y: groundY - t * 16 },
            { x: 900, y: groundY - t * 14 },
            { x: 1000, y: groundY - t * 12 },
        ];

        cloudPlatforms.forEach(platform => {
            for (let i = 0; i < 4; i++) {
                this.createBrick(platform.x + i * t, platform.y);
            }
            this.createCoin(platform.x + t, platform.y - t * 2);
            this.createCoin(platform.x + t * 2, platform.y - t * 2);
        });

        // 물음표 블록 서클
        const centerX = 1200;
        const centerY = groundY - t * 10;
        const radius = t * 5;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            this.createQuestionBlock(x, y, i % 2 === 0);
        }

        // 파이프 계단 (점점 높아짐)
        for (let i = 0; i < 8; i++) {
            this.createPipe(1450 + i * t * 6, groundY - t * (2 + i), 2 + i);
        }

        // 하늘 섬들
        for (let island = 0; island < 5; island++) {
            const islandX = 1950 + island * t * 12;
            const islandY = groundY - t * (15 - island);

            for (let i = 0; i < 5; i++) {
                this.createBrick(islandX + i * t, islandY);
            }

            this.createQuestionBlock(islandX + t * 2, islandY - t * 3, island % 2 === 0, island === 2 ? 'powerup' : 'coin');

            // 섬 주변 코인들
            for (let i = 0; i < 3; i++) {
                this.createCoin(islandX + (i + 1) * t, islandY - t * 5);
            }
        }

        // 최종 챌린지 - 높은 타워
        for (let i = 0; i < 15; i++) {
            this.createBrick(2550, groundY - t * (i + 1));
            this.createBrick(2550 + t * 8, groundY - t * (i + 1));
        }

        // 타워 내부 플랫폼
        for (let floor = 0; floor < 5; floor++) {
            for (let i = 0; i < 6; i++) {
                this.createBrick(2551 + t + i * t, groundY - t * (3 + floor * 3));
            }
            this.createQuestionBlock(2554 + t * 3, groundY - t * (5 + floor * 3), true);
        }

        // 타워 꼭대기
        for (let i = 0; i < 10; i++) {
            this.createBrick(2540 + i * t, groundY - t * 18);
            this.createCoin(2540 + i * t, groundY - t * 20);
        }

        // 내려가는 긴 슬라이드
        for (let i = 0; i < 25; i++) {
            this.createBrick(2700 + i * t, groundY - t * (18 - Math.floor(i / 3)));
        }

        // 마지막 구름 다리
        for (let i = 0; i < 15; i++) {
            if (i % 3 !== 1) {
                this.createBrick(3100 + i * t * 2, groundY - t * 8);
            }
        }
    }

    // ========== 헬퍼 함수들 ==========

    createBrick(x, y) {
        const brick = this.bricks.create(x, y, 'tile-brick');
        brick.setData('destructible', true);
        brick.refreshBody();
        return brick;
    }

    createQuestionBlock(x, y, hasItem = true, itemType = 'coin') {
        const block = this.questionBlocks.create(x, y, 'tile-question');
        block.setData('hasItem', hasItem);
        block.setData('itemType', itemType);
        block.refreshBody();

        // 물음표 블록 반짝임 애니메이션
        this.tweens.add({
            targets: block,
            alpha: 0.7,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return block;
    }

    createPipe(x, y, height) {
        const t = CONFIG.TILE_SIZE;

        // 파이프 상단
        const top = this.pipes.create(x, y, 'tile-pipe-top');
        top.refreshBody();

        // 파이프 몸통
        for (let i = 1; i < height; i++) {
            const body = this.pipes.create(x, y + i * t, 'tile-pipe-body');
            body.refreshBody();
        }
    }

    createCoin(x, y) {
        const coin = this.coins.create(x, y, 'coin');
        coin.setScale(1.5);

        // 코인 애니메이션
        this.tweens.add({
            targets: coin,
            y: y - 8,
            duration: 600,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: coin,
            angle: 360,
            duration: 2000,
            ease: 'Linear',
            repeat: -1
        });
    }

    createEnemies() {
        const positions = this.getEnemyPositions();

        positions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, pos.type);
            this.enemies.push(enemy);
        });
    }

    getEnemyPositions() {
        const groundY = CONFIG.GAME_HEIGHT - CONFIG.TILE_SIZE;
        const positions = [];

        if (this.stageIndex === 0) {
            // Stage 1: 적은 수의 쉬운 적
            positions.push(
                { x: 400, y: groundY - 50, type: 'goomba' },
                { x: 800, y: groundY - 50, type: 'goomba' },
                { x: 1200, y: groundY - 50, type: 'troopa' },
                { x: 1600, y: groundY - 50, type: 'goomba' },
                { x: 2000, y: groundY - 50, type: 'goomba' }
            );
        } else if (this.stageIndex === 1) {
            // Stage 2: 더 많은 적
            positions.push(
                { x: 350, y: groundY - 50, type: 'goomba' },
                { x: 600, y: groundY - 50, type: 'troopa' },
                { x: 900, y: groundY - 50, type: 'goomba' },
                { x: 1100, y: groundY - 50, type: 'goomba' },
                { x: 1400, y: groundY - 50, type: 'troopa' },
                { x: 1700, y: groundY - 50, type: 'goomba' },
                { x: 2000, y: groundY - 50, type: 'troopa' },
                { x: 2300, y: groundY - 50, type: 'goomba' }
            );
        } else if (this.stageIndex === 2) {
            // Stage 3: 수직 레벨에 맞는 배치
            positions.push(
                { x: 500, y: groundY - 50, type: 'troopa' },
                { x: 750, y: groundY - 200, type: 'goomba' },
                { x: 1000, y: groundY - 150, type: 'troopa' },
                { x: 1300, y: groundY - 100, type: 'goomba' },
                { x: 1600, y: groundY - 50, type: 'troopa' },
                { x: 1900, y: groundY - 100, type: 'goomba' },
                { x: 2100, y: groundY - 50, type: 'troopa' }
            );
        } else if (this.stageIndex === 3) {
            // Stage 4: 동굴 - 많은 적
            positions.push(
                { x: 400, y: groundY - 50, type: 'goomba' },
                { x: 600, y: groundY - 50, type: 'goomba' },
                { x: 900, y: groundY - 50, type: 'troopa' },
                { x: 1200, y: groundY - 100, type: 'goomba' },
                { x: 1500, y: groundY - 50, type: 'troopa' },
                { x: 1700, y: groundY - 50, type: 'goomba' },
                { x: 2000, y: groundY - 100, type: 'troopa' },
                { x: 2200, y: groundY - 50, type: 'goomba' },
                { x: 2500, y: groundY - 50, type: 'troopa' }
            );
        } else if (this.stageIndex === 4) {
            // Stage 5: 하늘 레벨 - 전략적 배치
            positions.push(
                { x: 500, y: groundY - 50, type: 'troopa' },
                { x: 850, y: groundY - 260, type: 'goomba' },
                { x: 1300, y: groundY - 200, type: 'troopa' },
                { x: 1800, y: groundY - 50, type: 'goomba' },
                { x: 2100, y: groundY - 250, type: 'troopa' },
                { x: 2400, y: groundY - 300, type: 'goomba' },
                { x: 2800, y: groundY - 150, type: 'troopa' }
            );
        }

        return positions;
    }

    setupCollisions() {
        // 플레이어와 플랫폼 충돌
        this.physics.add.collider(this.player.getSprite(), this.platforms);
        this.physics.add.collider(
            this.player.getSprite(),
            this.bricks,
            this.hitBrick,
            null,
            this
        );
        this.physics.add.collider(this.player.getSprite(), this.pipes);

        // 플레이어와 물음표 블록 충돌 (아래에서 칠 수 있음)
        this.physics.add.collider(
            this.player.getSprite(),
            this.questionBlocks,
            this.hitQuestionBlock,
            null,
            this
        );

        // 적과 플랫폼 충돌
        this.enemies.forEach(enemy => {
            this.physics.add.collider(enemy.getSprite(), this.platforms);
            this.physics.add.collider(enemy.getSprite(), this.bricks);
            this.physics.add.collider(enemy.getSprite(), this.pipes);
            this.physics.add.collider(enemy.getSprite(), this.questionBlocks);
        });

        // 플레이어와 적 충돌
        this.enemies.forEach(enemy => {
            this.physics.add.overlap(
                this.player.getSprite(),
                enemy.getSprite(),
                this.handlePlayerEnemyCollision,
                null,
                this
            );
        });

        // 플레이어와 코인 충돌
        this.physics.add.overlap(
            this.player.getSprite(),
            this.coins,
            this.collectCoin,
            null,
            this
        );

        // 플레이어와 파워업 충돌
        this.physics.add.overlap(
            this.player.getSprite(),
            this.powerups,
            this.collectPowerup,
            null,
            this
        );
    }

    hitBrick(playerSprite, brick) {
        if (!brick || !brick.active) return;

        const hittingFromBelow =
            playerSprite.body.velocity.y < 0 &&
            playerSprite.y > brick.y &&
            Math.abs(playerSprite.x - brick.x) < CONFIG.TILE_SIZE;

        if (!hittingFromBelow) {
            return;
        }

        if (brick.getData('destructible') && this.player.sizeState === 'big') {
            this.breakBrick(brick);
        } else {
            this.bumpBrick(brick);
        }
    }

    breakBrick(brick) {
        if (!brick || !brick.active) return;

        const x = brick.x;
        const y = brick.y;

        brick.destroy();

        const debrisVectors = [
            { x: -18, y: -28 },
            { x: 18, y: -28 },
            { x: -12, y: -18 },
            { x: 12, y: -18 }
        ];

        debrisVectors.forEach(vector => {
            const piece = this.add.rectangle(x, y, 6, 6, 0xCD853F).setOrigin(0.5);

            this.tweens.add({
                targets: piece,
                x: x + vector.x,
                y: y + vector.y,
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => piece.destroy()
            });
        });

        this.player.addScore(50);
        this.updateUI();
    }

    bumpBrick(brick) {
        if (!brick || brick.getData('isBouncing')) return;

        brick.setData('isBouncing', true);

        this.tweens.add({
            targets: brick,
            y: brick.y - 6,
            duration: 90,
            yoyo: true,
            ease: 'Power2',
            onUpdate: () => brick.refreshBody(),
            onComplete: () => {
                brick.setData('isBouncing', false);
                brick.refreshBody();
            }
        });
    }

    hitQuestionBlock(playerSprite, block) {
        // 아래에서 블록을 쳤는지 확인
        if (playerSprite.body.velocity.y < 0 &&
            playerSprite.y > block.y &&
            Math.abs(playerSprite.x - block.x) < CONFIG.TILE_SIZE) {

            const hasItem = block.getData('hasItem');

            if (hasItem) {
                block.setData('hasItem', false);
                block.setTexture('tile-brick'); // 빈 블록으로 변경

                const itemType = block.getData('itemType');

                if (itemType === 'powerup') {
                    // 파워업 생성
                    this.spawnPowerup(block.x, block.y);
                } else {
                    // 코인 생성
                    this.spawnCoinFromBlock(block.x, block.y);
                }

                // 블록 튕기는 애니메이션
                this.tweens.add({
                    targets: block,
                    y: block.y - 8,
                    duration: 100,
                    yoyo: true,
                    ease: 'Power2'
                });
            } else {
                // 빈 블록 작은 튕김
                this.tweens.add({
                    targets: block,
                    y: block.y - 4,
                    duration: 50,
                    yoyo: true
                });
            }
        }
    }

    spawnCoinFromBlock(x, y) {
        const coin = this.coins.create(x, y - 40, 'coin');
        coin.setScale(1.5);

        // 코인 튀어나오는 애니메이션
        this.tweens.add({
            targets: coin,
            y: y - 60,
            duration: 200,
            ease: 'Power2',
            yoyo: true,
            onComplete: () => {
                // 코인 자동 수집
                this.player.collectCoin();

                const scoreText = this.add.text(x, y - 60, '+100', {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '10px',
                    fill: '#FFD700'
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: scoreText,
                    y: y - 90,
                    alpha: 0,
                    duration: 800,
                    onComplete: () => scoreText.destroy()
                });

                coin.destroy();
                this.updateUI();
            }
        });

        // 회전
        this.tweens.add({
            targets: coin,
            angle: 360,
            duration: 400
        });
    }

    spawnPowerup(x, y) {
        // 버섯 파워업
        const powerup = this.powerups.create(x, y - 16, 'powerup-mushroom');
        powerup.setScale(2);
        powerup.body.setAllowGravity(false);
        powerup.body.setSize(12, 14);
        powerup.body.setOffset(2, 2);
        powerup.setData('moveSpeed', 80);
        powerup.setDepth(5);

        const bouncePowerup = (mushroom) => {
            if (!mushroom.body) return;
            const speed = mushroom.getData('moveSpeed') || 80;
            if (mushroom.body.blocked.left) {
                mushroom.setVelocityX(Math.abs(speed));
            } else if (mushroom.body.blocked.right) {
                mushroom.setVelocityX(-Math.abs(speed));
            }
        };

        // 위로 튀어나오기
        this.tweens.add({
            targets: powerup,
            y: y - CONFIG.TILE_SIZE * 2,
            duration: 280,
            ease: 'Power2',
            onComplete: () => {
                powerup.body.setAllowGravity(true);
                powerup.setVelocityX(powerup.getData('moveSpeed'));
            }
        });

        this.physics.add.collider(powerup, this.platforms, bouncePowerup);
        this.physics.add.collider(powerup, this.bricks, bouncePowerup);
        this.physics.add.collider(powerup, this.pipes, bouncePowerup);
    }

    collectCoin(playerSprite, coin) {
        coin.destroy();
        this.player.collectCoin();

        // 코인 수집 효과
        const text = this.add.text(coin.x, coin.y, '+100', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: coin.y - 40,
            alpha: 0,
            duration: 800,
            onComplete: () => text.destroy()
        });

        this.updateUI();
    }

    collectPowerup(playerSprite, powerup) {
        powerup.destroy();
        this.player.powerUp();

        const text = this.add.text(powerup.x, powerup.y, 'POWER UP!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            fill: '#FF69B4',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: powerup.y - 50,
            alpha: 0,
            duration: 1500,
            onComplete: () => text.destroy()
        });

        this.updateUI();
    }

    handlePlayerEnemyCollision(playerSprite, enemySprite) {
        const enemy = enemySprite.getData('enemy');
        if (!enemy || enemy.isDead) return;

        // 플레이어가 적을 위에서 밟았는지 확인
        if (playerSprite.body.velocity.y > 0 &&
            playerSprite.y < enemySprite.y - 8) {
            // 적을 밟음
            const score = enemy.stompedByPlayer(this.player);
            this.player.addScore(score);
            this.updateUI();
        } else {
            // 적에게 맞음
            if (!this.player.isDead && !this.player.isInvincible) {
                enemy.hitPlayer(this.player);
                this.updateUI();
            }
        }
    }

    createGoal() {
        const goalX = this.getWorldWidth() - 150;
        const goalY = CONFIG.GAME_HEIGHT - 250;
        const t = CONFIG.TILE_SIZE;

        // 깃발 기둥
        const pole = this.add.rectangle(goalX, goalY + 100, 8, 250, 0x2ECC71);
        pole.setOrigin(0.5, 1);

        // 깃발
        const flag = this.add.rectangle(goalX + 30, goalY - 80, 50, 35, 0xE74C3C);
        flag.setOrigin(0, 0.5);

        // 깃발 흔들림
        this.tweens.add({
            targets: flag,
            scaleX: 0.85,
            scaleY: 1.1,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 골 영역
        this.goalZone = this.add.zone(goalX, goalY + 50, 80, 300);
        this.physics.add.existing(this.goalZone);
        this.physics.add.overlap(
            this.player.getSprite(),
            this.goalZone,
            this.reachGoal,
            null,
            this
        );
    }

    reachGoal() {
        if (this.goalReached) return;
        this.goalReached = true;

        // 플레이어 멈춤
        this.player.getSprite().setVelocity(0, 0);

        // 승리 텍스트
        const centerX = this.cameras.main.scrollX + CONFIG.GAME_WIDTH / 2;
        const centerY = CONFIG.GAME_HEIGHT / 2;

        const stageClearText = this.add.text(
            centerX,
            centerY - 50,
            'STAGE CLEAR!',
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '36px',
                fill: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5).setScrollFactor(0);

        // 점수 표시
        const scoreText = this.add.text(
            centerX,
            centerY + 20,
            `COINS: ${this.player.getCoins()}  SCORE: ${this.player.getScore()}`,
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '14px',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setScrollFactor(0);

        // 시간 보너스
        const timeBonus = this.gameTime * 10;
        this.player.addScore(timeBonus);

        const bonusText = this.add.text(
            centerX,
            centerY + 60,
            `TIME BONUS: ${timeBonus}`,
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '12px',
                fill: '#00FF00',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5).setScrollFactor(0);

        // 애니메이션
        stageClearText.setScale(0);
        this.tweens.add({
            targets: stageClearText,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        scoreText.setAlpha(0);
        this.tweens.add({
            targets: scoreText,
            alpha: 1,
            duration: 500,
            delay: 300
        });

        bonusText.setAlpha(0);
        this.tweens.add({
            targets: bonusText,
            alpha: 1,
            duration: 500,
            delay: 600
        });

        // 3초 후 캠퍼스 맵으로
        this.time.delayedCall(3000, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('CampusMapScene');
            });
        });
    }

    createUI() {
        const padding = 24;
        const top = 16;

        this.uiPanel = this.add.rectangle(0, 0, CONFIG.GAME_WIDTH, 72, 0x000000, 0.65)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(100);

        const labelStyle = {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        };

        const valueStyle = {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        };

        const smallStyle = {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        };

        // 좌측: MARIO / SCORE / COIN / LIVES
        this.scoreLabel = this.add.text(padding, top, 'MARIO', labelStyle)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(101);

        this.scoreText = this.add.text(padding, top + 22, '000000', valueStyle)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(101);

        this.coinIcon = this.add.image(padding + 6, top + 52, 'coin')
            .setOrigin(0, 0.5)
            .setScale(1.3)
            .setScrollFactor(0)
            .setDepth(101);

        this.coinText = this.add.text(padding + 36, top + 52, 'x00', smallStyle)
            .setOrigin(0, 0.5)
            .setScrollFactor(0)
            .setDepth(101);
        this.coinText.setColor('#FFD700');

        this.lifeIcon = this.add.image(padding + 108, top + 52, 'player-small-idle')
            .setOrigin(0, 0.5)
            .setScale(1.3)
            .setScrollFactor(0)
            .setDepth(101);

        this.livesText = this.add.text(padding + 144, top + 52, 'x03', smallStyle)
            .setOrigin(0, 0.5)
            .setScrollFactor(0)
            .setDepth(101);

        // 중앙: WORLD
        this.worldLabel = this.add.text(CONFIG.GAME_WIDTH / 2, top, 'WORLD', labelStyle)
            .setOrigin(0.5, 0)
            .setScrollFactor(0)
            .setDepth(101);

        this.worldText = this.add.text(
            CONFIG.GAME_WIDTH / 2,
            top + 22,
            `1-${this.stageIndex + 1}`,
            valueStyle
        ).setOrigin(0.5, 0).setScrollFactor(0).setDepth(101);

        this.stageTitleText = this.add.text(CONFIG.GAME_WIDTH / 2, top + 46, this.buildingName.toUpperCase(), {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            fill: '#E0E0E0',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(101);

        // 우측: TIME
        this.timeLabel = this.add.text(CONFIG.GAME_WIDTH - padding, top, 'TIME', labelStyle)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(101);

        this.timerText = this.add.text(CONFIG.GAME_WIDTH - padding, top + 22, `${this.gameTime}`, valueStyle)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(101);

        this.timerWarningTween = null;

        this.updateUI();
    }

    updateUI() {
        const score = this.player.getScore().toString().padStart(6, '0');
        const coins = this.player.getCoins().toString().padStart(2, '0');
        const lives = this.player.getLives().toString().padStart(2, '0');
        const timeText = this.gameTime.toString().padStart(3, '0');

        this.scoreText.setText(score);
        this.coinText.setText(`x${coins}`);
        this.livesText.setText(`x${lives}`);
        this.timerText.setText(timeText);

        if (this.gameTime > 30) {
            this.timerText.setFill('#FFFFFF');
            this.timerText.setScale(1);
            if (this.timerWarningTween) {
                this.timerWarningTween.stop();
                this.timerWarningTween = null;
            }
        } else {
            this.timerText.setFill('#FF0000');

            if (this.gameTime <= 10) {
                if (!this.timerWarningTween) {
                    this.timerWarningTween = this.tweens.add({
                        targets: this.timerText,
                        scaleX: 1.2,
                        scaleY: 1.2,
                        duration: 120,
                        yoyo: true,
                        repeat: 2,
                        onComplete: () => {
                            this.timerText.setScale(1);
                            this.timerWarningTween = null;
                        }
                    });
                }
            } else {
                this.timerText.setScale(1);
                if (this.timerWarningTween) {
                    this.timerWarningTween.stop();
                    this.timerWarningTween = null;
                }
            }
        }
    }

    startTimer() {
        this.timerStarted = true;

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.goalReached && this.gameTime > 0) {
                    this.gameTime--;
                    this.updateUI();

                    if (this.gameTime === 0) {
                        this.timeUp();
                    }
                }
            },
            loop: true
        });
    }

    timeUp() {
        if (this.goalReached) return;

        // 시간 초과 - 플레이어 사망
        const timeUpText = this.add.text(
            this.cameras.main.scrollX + CONFIG.GAME_WIDTH / 2,
            CONFIG.GAME_HEIGHT / 2,
            'TIME UP!',
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '32px',
                fill: '#FF0000',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5).setScrollFactor(0);

        this.player.die();
    }

    showGameOver() {
        const centerX = this.cameras.main.scrollX + CONFIG.GAME_WIDTH / 2;
        const centerY = CONFIG.GAME_HEIGHT / 2;

        const gameOverText = this.add.text(
            centerX,
            centerY,
            'GAME OVER',
            {
                fontFamily: '"Press Start 2P"',
                fontSize: '40px',
                fill: '#FF0000',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5).setScrollFactor(0);

        gameOverText.setScale(0);
        this.tweens.add({
            targets: gameOverText,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // 3초 후 맵으로 복귀
        this.time.delayedCall(3000, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('CampusMapScene');
            });
        });
    }

    update(time, delta) {
        // 플레이어 업데이트
        if (!this.goalReached) {
            this.player.update(time, delta);
        }

        // 적들 업데이트
        this.enemies.forEach(enemy => {
            if (!enemy.isDead) {
                enemy.update();
            }
        });

        // ESC로 맵으로 돌아가기
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('CampusMapScene');
            });
        }

        // UI 업데이트
        this.updateUI();
    }
}
