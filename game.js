let score = 0, combo = 1, timeLeft = 60, lives = 3, playing = true, mode = "classique";
let bestScore = localStorage.getItem("bestScore")||0;
let bestCombo = localStorage.getItem("bestCombo")||0;

const circle = document.getElementById("circle");
const scoreBox = document.getElementById("score");
const comboBox = document.getElementById("combo");
const timerBox = document.getElementById("timer");
const livesBox = document.getElementById("lives");

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const gameoverBox = document.getElementById("gameover");
const finalScoreBox = document.getElementById("final-score");
const restartBtn = document.getElementById("restart");

const bestScoreBox = document.getElementById("best-score");
const bestComboBox = document.getElementById("best-combo");

const clickSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_4da31ef67b.mp3?filename=ui-click-112.wav");
const explosionSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_609d12fec1.mp3?filename=impact-110.wav");

bestScoreBox.innerText = "Meilleur Score : "+bestScore;
bestComboBox.innerText = "Meilleur Combo : x"+bestCombo;

function randomColor(){ return `hsl(${Math.random()*360},100%,50%)`; }

function explodeParticles(x,y){
    for(let i=0;i<8;i++){
        const p=document.createElement("div");
        p.className="particle";
        p.style.background=circle.style.background;
        p.style.left=x+"px";
        p.style.top=y+"px";
        document.body.appendChild(p);
        setTimeout(()=>p.remove(),500);
    }
}

function createTrail(x,y){
    const t=document.createElement("div");
    t.className="trail";
    t.style.left=(x-20)+"px";
    t.style.top=(y-20)+"px";
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),400);
}

function moveCircle(){
    const maxX=window.innerWidth-circle.offsetWidth;
    const maxY=window.innerHeight-circle.offsetHeight-100;
    circle.style.left=Math.random()*maxX+"px";
    circle.style.top=Math.random()*maxY+"px";
    createTrail(circle.offsetLeft+50,circle.offsetTop+50);
}

function startGame(selectedMode){
    mode=selectedMode;
    menu.classList.add("hidden");
    game.classList.remove("hidden");
    score=0; combo=1; timeLeft=60; lives=3; playing=true;

    scoreBox.innerText="Score : 0";
    comboBox.innerText="Combo x1";
    timerBox.innerText=mode==="infini"?"♾️":timeLeft+"s";
    livesBox.innerText="❤️❤️❤️";

    moveCircle();

    if(mode!=="infini"){
        const timer=setInterval(()=>{
            if(!playing) return clearInterval(timer);
            timeLeft--;
            timerBox.innerText=timeLeft+"s";
            if(timeLeft<=0) endGame();
        },1000);
    }
}

circle.addEventListener("click",()=>{
    if(!playing) return;
    clickSound.play();

    combo++;
    score+=5*combo;
    scoreBox.innerText="Score : "+score;
    comboBox.innerText="Combo x"+combo;

    const newColor=randomColor();
    circle.style.background=newColor;
    circle.style.boxShadow=`0 0 25px ${newColor},0 0 50px ${newColor}`;

    const rect=circle.getBoundingClientRect();
    explodeParticles(rect.left+50,rect.top+50);
    explosionSound.play();

    if(mode==="hardcore"){
        let size=circle.offsetWidth;
        if(size>40){size-=5; circle.style.width=size+"px"; circle.style.height=size+"px";}
    }

    if(combo>=20){
        document.body.style.transform="scale(0.98)";
        setTimeout(()=>document.body.style.transform="scale(1)",100);
    }

    moveCircle();
    circle.style.transform="scale(0.8)";
    setTimeout(()=>circle.style.transform="scale(1)",100);
});

function endGame(){
    playing=false;
    circle.style.display="none";
    gameoverBox.classList.remove("hidden");
    finalScoreBox.innerText="Ton score final : "+score;

    if(score>bestScore){ bestScore=score; localStorage.setItem("bestScore",bestScore);}
    if(combo>bestCombo){ bestCombo=combo; localStorage.setItem("bestCombo",bestCombo);}
}

restartBtn.addEventListener("click",()=>location.reload());
