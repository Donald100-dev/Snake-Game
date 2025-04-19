const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#score");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "black";
const snakeBodyColor = "#4dd0e1"; // Màu xanh nhạt cho thân rắn
const snakeHeadColor = "#b2f7ef"; // Màu xanh nhạt sáng cho đầu rắn
const snakeBorder = "#00bcd4"; // Màu viền xanh lam
const foodColor = "#73fc03";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity  = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
]

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
};
function nextTick(){
    if (running){
        gameLoop = setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize
        return randNum;
    };
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.shadowColor = "#98fc0a";
    ctx.shadowBlur = 40; // Độ tỏa sáng lớn hơn
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
    ctx.shadowBlur = 0; // Tắt bóng cho các phần khác
};
function moveSnake(){
    const head = {
        x: (snake[0].x + xVelocity) % gameWidth,
        y: (snake[0].y + yVelocity) % gameHeight
    };
    if (head.x < 0){
        head.x = gameWidth - unitSize;
    }
    if (head.y < 0){
        head.y = gameHeight - unitSize;
    };
    snake.unshift(head);
    if (head.x == foodX && head.y == foodY){
        score++;
        scoreText.textContent = score;
        createFood();
    }
    else{
        snake.pop();
    };
};
function drawSnake(){
    ctx.strokeStyle = snakeBorder;
    snake.forEach((snakePart, index) =>{
        // Đầu rắn có thể sáng hơn một chút
        if(index === 0){
            ctx.fillStyle = snakeHeadColor; // Xanh nhạt sáng cho đầu
            ctx.shadowBlur = 25; // Độ tỏa sáng lớn hơn
        } else {
            ctx.fillStyle = snakeBodyColor; // Xanh nhạt cho thân
            ctx.shadowBlur = 15;
        }
        ctx.shadowColor = "#00fff7";
        ctx.strokeStyle = "#00bcd4";
        ctx.lineWidth = 2.5; // Độ dày viền
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.shadowBlur = 0; // Tắt bóng cho các phần khác
    });
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUP = (yVelocity == -unitSize);
    const goingDOWN = (yVelocity == unitSize);
    const goingLEFT = (xVelocity == -unitSize);
    const goingRIGHT = (xVelocity == unitSize);
    switch(true){
        case(keyPressed == LEFT && !goingRIGHT):
            xVelocity = -unitSize;
            yVelocity = 0; 
            break;
        case(keyPressed == RIGHT && !goingLEFT):
            xVelocity = unitSize;
            yVelocity = 0; 
            break;
        case(keyPressed == UP && !goingDOWN):
            xVelocity = 0;
            yVelocity = -unitSize; 
            break;
        case(keyPressed == DOWN && !goingUP):
            xVelocity = 0;
            yVelocity = unitSize; 
            break;
    }
};
function checkGameOver(){
    const head = snake[0];
    for (let i = 1; i < snake.length; i+=1){
        if(head.x == snake[i].x && head.y == snake[i].y){
            running = false;
            drawSnake();
            break;
        }
    }
};
function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
};
function resetGame(){
        clearTimeout(gameLoop);
        xVelocity = unitSize;
        yVelocity  = 0;
        score = 0;
        snake = [
            {x:unitSize * 4, y:0},
            {x:unitSize * 3, y:0},
            {x:unitSize * 2, y:0},
            {x:unitSize, y:0},
            {x:0, y:0}
        ];
        running = true;
        scoreText.textContent = score;
        createFood();
        nextTick();
};
