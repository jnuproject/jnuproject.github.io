// Game Configuration
const CONFIG = {
    GAME_WIDTH: 800,
    GAME_HEIGHT: 600,
    GRAVITY: 1200,
    PLAYER_SPEED: 160,
    PLAYER_JUMP: 420,
    PLAYER_MAX_SPEED: 200,
    PLAYER_ACCELERATION: 800,
    TILE_SIZE: 16,

    // Campus Buildings (맵 상의 위치)
    BUILDINGS: [
        {
            id: 'library',
            name: '도서관',
            x: 200,
            y: 200,
            icon: '📚',
            stageNumber: 1
        },
        {
            id: 'student-hall',
            name: '학생회관',
            x: 450,
            y: 200,
            icon: '🏛️',
            stageNumber: 2
        },
        {
            id: 'engineering',
            name: '공학관',
            x: 350,
            y: 350,
            icon: '🔧',
            stageNumber: 3
        },
        {
            id: 'dormitory',
            name: '기숙사',
            x: 600,
            y: 300,
            icon: '🏠',
            stageNumber: 4
        },
        {
            id: 'gymnasium',
            name: '체육관',
            x: 150,
            y: 400,
            icon: '⚽',
            stageNumber: 5
        }
    ]
};
