const batOrBowl = document.getElementById("bat-bowl");
const scoreSpan = document.getElementById("score");
const targetSpan = document.getElementById("target");
const b1 = document.getElementById("b1");
const b2 = document.getElementById("b2");
const b3 = document.getElementById("b3");
const b4 = document.getElementById("b4");
const b5 = document.getElementById("b5");

let score = 0;
let target = 0;
let chance = 15;
let doneBatting = false;
let doneBalling = false;


let gameState = Math.floor(Math.random() * 2) + 1;
gameState--;
console.log(gameState);
if (gameState == 0) {
    batOrBowl.innerHTML = "Bowling";
}
else {
    batOrBowl.innerHTML = "Batting";
}

function computerChoice() {
    return Math.floor(Math.random() * 5) + 1;
}


function gameover() {
    if (doneBatting && doneBalling) {
        if (score < target) {
            console.log("Lost");
        }
        else {
            console.log("Won");
        }
        console.log("GAME OVER ");
    }
}


function userBat(input) {
    chance--;

    let computerChose = computerChoice();
    if (computerChose == 5) { computerChose++ };
    console.log("Computer Chose " + computerChose);

    console.log("Bowling chances left " + chance);
    if (chance == 0 || (computerChose == input) || (doneBalling && score > target)) {
        if (computerChose === input) {
            console.log("Opponent Bowled You at score " + score);
        }
        chance = 15;
        gameState = 0;
        doneBatting = true;
        gameover();
        return;
    }
    else {
        score += input;
        scoreSpan.innerHTML = score;
    }
}


function userBowl(input) {
    chance--;

    let computerChose = computerChoice();
    if (computerChose == 5) { computerChose++ };
    console.log("Computer Chose " + computerChose);

    console.log("Bowling chances left " + chance);
    if (chance == 0 || (computerChose == input) || (doneBatting && target > score)) {
        if (computerChose === input) {
            console.log("You Bowled Opponent at target " + target);
        }
        chance = 15;
        gameState = 1;
        doneBalling = true;
        gameover();
        return;
    }
    else {
        target += input;
        targetSpan.innerHTML = target;
    }
}

function gamePlay(userIn) {
    console.log("User Chose " + userIn);
    if (!doneBatting || !doneBalling) {
        if (gameState == 0) {
            batOrBowl.innerHTML = "Bowling";
            userBowl(userIn);
        }
        else {
            batOrBowl.innerHTML = "Batting";
            userBat(userIn);
        }
    }


}

b1.addEventListener('click', function () {
    gamePlay(parseInt(this.innerHTML));
})


b2.addEventListener('click', function () {
    gamePlay(parseInt(this.innerHTML));
})

b3.addEventListener('click', function () {
    gamePlay(parseInt(this.innerHTML));
})

b4.addEventListener('click', function () {
    gamePlay(parseInt(this.innerHTML));
})

b5.addEventListener('click', function () {
    gamePlay(parseInt(this.innerHTML));
})




