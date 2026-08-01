let body = document.body;
let menu = document.getElementById('menu');
let gameOverMenu = document.getElementById('gameOver');
let youWinMenu = document.getElementById('youWin');
let levels = document.querySelector(".levels")
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let record = document.getElementById("recordCount")
let recordbox = document.querySelector(".record")
let score = document.getElementById("scoreCount")

let mode = 'menu';
// menu.style.display = 'none'
// let mode = 'game'

let levelOne = document.getElementById('levelOne');
let levelTwo = document.getElementById('levelTwo')
let levelThree = document.getElementById('levelThree')

let gameLevels = [levelOne, levelTwo, levelThree];//up to ten then infinite then infinite speed up
let gameLevel = 0
//gameLevels[gamelevel]
let cubeY = 100;
let velocity = 0
let gravity = 0.1
let jumpStrength = -3
let speed = 3;
let jumping = false;

let current = 0;

let pilars = []
newPilar()

function newPilar(){
    pilars.push({
        x: canvas.width + 50,
        y: 0,
        width: 50,
        height: canvas.height,
        spawnDistance: Math.floor(Math.random() * 300) + 201,
        passed: false,
        gapSize: 200,
        topHeight: Math.floor(Math.random() * 300) + 0
    })

}
//let jumping = false;
recordbox.style.visibility = 'hidden'
function play(){
    if (mode == 'game'){
        
        cubeY += velocity;  //-=
        velocity += gravity;  //-=

        // if (cubeY < 0) cubeY = 0;/////////////////////////////////////////////////////
        // if (cubeY > canvas.height - 50) cubeY = canvas.height - 50;

        // velocity = Math.max(-10, Math.min(10, velocity));

        if (jumping && velocity>0){
            jumping =false;
            // velocity += gravity;
            // cubeY += velocity;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        //ctx.translate(200 + 25, cubeY + 25);
        ctx.fillStyle = 'rgb(42, 93, 103)';
        //ctx.fillRect()
        ctx.beginPath()
        ctx.roundRect(200+25,cubeY+25,50,50,5);

        //ctx.roundRect(-25,-25,50,50,5);
        ctx. fill()

        //ctx.fillRect(50,cubeY,50,50);
        //ctx.restore()

        if(level == 'one'){
            firstLevel()
        }
        if(level == 'two'){
            secondLevel()
        }
        if(level == 'three'){
            thirdLevel()
        }
        
    }
    window.requestAnimationFrame(play)
}

let selectedIcon = undefined;
let level;
function firstLevel(){
    game()
}
function secondLevel(){
    recordbox.style.visibility = 'visible'
    game()
}
function thirdLevel(){
    recordbox.style.visibility = 'visible'
    game()
}
function game(){
    for (let i = 0; i < pilars.length; i++){
        let pilar = pilars[i];
        pilar.x -= speed;

        ctx.beginPath();
        ctx.fillStyle = "#94b495";
        ctx.fillRect(pilar.x, 0, pilar.width, pilar.topHeight);
        ctx.fillRect(pilar.x, pilar.topHeight + pilar.gapSize, pilar.width, canvas.height);
    
        if (!pilar.passed && pilar.x + pilar.width < 225){
            pilar.passed = true;
            updateScore();
        }

        let cubeLeft = 225;
        let cubeRight = 275;
        let cubeTop = cubeY+25;
        let cubeBottom = cubeY + 50 +25;

        let pilarLeft = pilar.x;
        let pilarRight = pilar.x + pilar.width;
        let pilarTop = pilar.topHeight;
        let pilarBottom = pilar.topHeight + pilar.gapSize;

        let xCollision = cubeRight > pilarLeft && cubeLeft < pilarRight;

        let yCollision = cubeTop < pilarTop || cubeBottom > pilarBottom;


        if (xCollision && yCollision) {
            gameOver();
        }
        if (level == 'one'){
            if (current >= 10){
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////win
                mode = "gameOver"
                youWinMenu.style.visibility = 'visible';
            }
        }
    }
    if (level == 'three') {
        gravity = 0.1 + current * 0.009;      // noticeable but stable
        speed = 3 + current * 0.2;           // pillars move faster
        // jumpStrength = -3 + current * 0.05;  // jumps get slightly stronger
    }

    let lastPilar = pilars[pilars.length-1];

    if (lastPilar.x < canvas.width - lastPilar.spawnDistance){
        newPilar()
    }
    
}

function selectIcon(element){
    element.classList.add("selected");
    selectedIcon = element
}
function deselectIcon(element){
    element.classList.remove("selected");
    selectedIcon = undefined
}

//mode methods
function nextLevel() {
    deselectIcon(gameLevels[gameLevel]);
    gameLevel = (gameLevel + 1) % gameLevels.length;
    selectIcon(gameLevels[gameLevel]);
}

function confirmLevel() {
    if (gameLevel == 0){
        level = 'one'
    }
    else if (gameLevel == 1){
        level = 'two'
    }
    else{
        level = 'three'
    }
    mode = "game";
    menu.style.visibility = 'hidden'
    if (level == 'two'){
        record.innerHTML = newRecordTwo;
    }
    else  if (level == 'three'){
        record.innerHTML = newRecordThree
    }
    // restart();
}

function chooseGameLevel() {
    if (mode !== 'menu') return;
    gameLevel = 0
    selectIcon(gameLevels[gameLevel]);
}

//menu methods
function resumeGame() {
    mode = "game";
    menu.style.visibility = 'hidden';
}
function changeLevel() {
    mode = "menu";
    gameOverMenu.style.visibility = 'hidden';
    youWinMenu.style.visibility = 'hidden';
    menu.style.visibility = 'visible';
    
    current = 0;
    score.innerHTML = 0;
    chooseGameLevel()
    // if(mode == 'game'){
        
    //     // restartGame()
    // }
    
}
let newRecordTwo = 0;
let newRecordThree = 0;

function updateScore(){
    if (mode != 'gameOver'){
        current = pilars.filter(p=>p.passed).length
        score.innerHTML = current;
        if (level == 'two'){
            if (current > newRecordTwo){
                newRecordTwo = current;
                record.innerHTML = newRecordTwo;
            }
        }
        else if (level == 'three'){
            if (current > newRecordThree){
                newRecordThree = current;
                record.innerHTML = newRecordThree;
            }
        }
    }
}
function jump() {
    jumping =true;
    velocity = jumpStrength; // jump strength
    //    window.requestAnimationFrame(jump)
}

function gameOver(){
    mode = 'gameOver';
    gameOverMenu.style.visibility = 'visible';
    //deathAnimation = true;
}
function restartGame(){
    gameOverMenu.style.visibility = "hidden";
    youWinMenu.style.visibility = "hidden";
    
    current = 0;
    score.innerHTML = 0;
    jumpStrength = -3
    jumping = false
    velocity = 0;
    // confirmLevel();
    //lastMilestone 
    gravity = 0.1;
    speed = 3
    pilars = []
    newPilar()
    cubeY = 100;
    mode = "game"
}

function inputRouter(input) {
    if (mode == "menu"){
        if (input === "hold"){
            confirmLevel()
        }
        else if (input === "tap"){
            nextLevel();
        }
    }
    else if (mode == "game"){
        if (input === "tap"){ jump() }
        //else if (input == "hold"){}
    }
    else if (mode == "gameOver"){
        if (input == "tap"){
            restartGame()
        }
        else if (input == "hold"){
            changeLevel()
        }
    }
}

let pressTimer = null;
let holdThreshold = 500;
let keyState = { held: false };
function keyInput(){
    document.addEventListener('keydown', (event) => {
        if (event.repeat) return;
        pressTimer = setTimeout(() => {
            keyState.held = true;
            inputRouter("hold");
        }, holdThreshold);
    });

    document.addEventListener('keyup', () => {
        clearTimeout(pressTimer);
        if (!keyState.held) {
            inputRouter("tap");
        }
        keyState.held = false;
    });
}

chooseGameLevel()
keyInput()
play()
