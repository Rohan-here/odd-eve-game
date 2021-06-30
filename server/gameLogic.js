const batOrBowl = document.getElementById("bat-bowl");
const scoreSpan = document.getElementById("score");
const targetSpan = document.getElementById("target");
const b1 = document.getElementById("b1");
const b2 = document.getElementById("b2");
const b3 = document.getElementById("b3");
const b4 = document.getElementById("b4");
const b5 = document.getElementById("b5");
const finalShow = document.getElementById("chances");
const buttonBox = document.getElementById("ButtonBox");
let score = 0;
let target = 0;
let chance = 15;
let doneBatting = false;
let doneBalling = false;


let gameState = Math.floor(Math.random() * 2) + 1;
gameState--;
console.log(gameState);
if (gameState == 0) {
    batOrBowl.innerHTML = "You are Balling";
}
else {
    batOrBowl.innerHTML = "You are Batting";
}

function computerChoice() {
    return Math.floor(Math.random() * 5) + 1;
}


function gameover() {
    if (doneBatting && doneBalling) {
        var Replay = document.createElement("button");
        var goHome = document.createElement("button");
        var returnForm = document.createElement("form");
        var returnScore = document.createElement("input");
        var returnTarget = document.createElement("input");
        Replay.innerHTML = "Play Again"
        goHome.innerHTML = "Home"
        Replay.classList.add("buttonEnd");
        goHome.classList.add("buttonEnd");
        Replay.name = "savescoreButton";
        Replay.value = "replay";
        goHome.value = "goHome";
        goHome.name = "savescoreButton";
        returnScore.type = "hidden";
        returnTarget.type = "hidden";
        returnScore.name = "returnScore";
        returnTarget.name = "returnTarget";
        returnScore.value = score.toString();
        returnTarget.value = target.toString();
        console.log(` score and target ${returnScore.value} ${returnTarget.value}  `);
        returnForm.appendChild(returnScore);
        returnForm.appendChild(returnTarget);
        returnForm.appendChild(Replay);
        returnForm.appendChild(goHome);
        scoreSpan.innerHTML = score;
        targetSpan.innerHTML = target;
        returnForm.action = "/saveScores"
        returnForm.method = "post";
        if (score < target) {
            finalShow.innerHTML = `You Lost by ${target - score} runs`;
            batOrBowl.remove();
            buttonBox.appendChild(returnForm);

        }
        else {
            finalShow.innerHTML = `You Won by ${score - target} runs`;
            batOrBowl.remove();
            buttonBox.appendChild(returnForm);

        }
        console.log("GAME OVER ");
    }

}


function userBat(input) {
    chance--;
    score += input;

    let computerChose = computerChoice();
    if (computerChose == 5) { computerChose++ };
    console.log("Computer Chose " + computerChose);

    finalShow.innerHTML = `Batting chances left ${chance}`;
    if (chance == 0 || (computerChose == input) || (doneBalling && score >= target)) {
        if (computerChose == input) {
            score -= input;
            batOrBowl.innerHTML = `Opponent Bowled You at score ${score}`;
        }

        if (!doneBalling)
            finalShow.innerHTML = `Your chance to Bowl`;
        chance = 15;
        gameState = 0;
        doneBatting = true;
        gameover();
        return;
    }
    else {
        scoreSpan.innerHTML = score;
    }

}


function userBowl(input) {
    chance--;


    let computerChose = computerChoice();
    if (computerChose == 5) { computerChose++ };
    finalShow.innerHTML = `Balling chances left ${chance}`;
    target += computerChose;
    console.log("Bowling chances left " + chance);
    if (chance == 0 || (computerChose == input) || (doneBatting && target > score)) {
        if (computerChose == input) {
            target -= input;
            batOrBowl.innerHTML = `You Bowled Opponent at score ${target}`;
        }

        if (!doneBatting)
            finalShow.innerHTML = `Your chance to Bat`;
        chance = 15;
        gameState = 1;
        doneBalling = true;
        gameover();
        return;
    }
    else {
        targetSpan.innerHTML = target;
    }
}

function gamePlay(userIn) {
    console.log("User Chose " + userIn);
    if (!doneBatting || !doneBalling) {
        if (gameState == 0) {
            batOrBowl.innerHTML = "You are Balling";
            userBowl(userIn);
        }
        else {
            batOrBowl.innerHTML = "You are Batting";
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



