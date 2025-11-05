// Main Game Configuration and Initialization
const gameConfig = {
    type: Phaser.AUTO,
    width: CONFIG.GAME_WIDTH,
    height: CONFIG.GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#5c94fc',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: CONFIG.GRAVITY },
            debug: false // true로 설정하면 디버그 모드
        }
    },
    scene: [BootScene, CampusMapScene, GameScene],
    pixelArt: true, // 픽셀 아트를 선명하게
    antialias: false,
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// 게임 시작
const game = new Phaser.Game(gameConfig);
