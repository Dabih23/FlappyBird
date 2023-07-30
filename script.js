const imgURL = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = imgURL;

const pipeUp = new Image(); 
const pipeBottom = new Image(); 
const fg = new Image();

pipeUp.src = "img/pipeUp.png"; 
pipeBottom.src = "img/pipeBottom.png"; 
fg.src = "img/fg.png"


//Звук
const fly = new Audio();
const score_audio = new Audio();

fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";

const SPEED = 1;

// ширина и высота птицы
const SIZE = [51, 36];

let index = 0;

let score = 0;

let gap = 90;
let gravity = 1.5;
let yPos = 200;

let bestScore = localStorage.getItem("bestScore") || 0

let pipe = [];

pipe[0] = {
 x : canvas.width,
 y : 0
};

document.addEventListener("keydown", moveUp);

function moveUp() {
    yPos -= 30;
    fly.currentTime = 0;
    fly.play();
   };

const render = () => {
  index += 0.3;

  const backgroudX = -((index * SPEED) % canvas.width);

  const bgSource = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  const bgPartOneResult = {
    x: backgroudX + canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  const bgPartTwoResult = {
    x: backgroudX,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  ctx.drawImage(
    img,

    bgSource.x,
    bgSource.y,
    bgSource.width,
    bgSource.height,

    bgPartOneResult.x,
    bgPartOneResult.y,
    bgPartOneResult.width,
    bgPartOneResult.height
  );
  
  ctx.drawImage(
    img,

    bgSource.x,
    bgSource.y,
    bgSource.width,
    bgSource.height,

    bgPartTwoResult.x,
    bgPartTwoResult.y,
    bgPartTwoResult.width,
    bgPartTwoResult.height
  );

  // изображение птицы, которое копируем
  // из изображения-источника
  const birdSource = {
    x: 432,
    y: Math.floor((index % 9) / 3) * SIZE[1],
    width: SIZE[0],
    height: SIZE[1],
  };

  
  // координаты, по которым птица
  // будет расположена на Canvas
  const birdResult = {
    x: canvas.width / 2 - SIZE[0] / 2,
    y: yPos,
    width: SIZE[0] / 1.7,
    height: SIZE[1] / 1.7,
  };


  ctx.drawImage(
    img,

    birdSource.x,
    birdSource.y,
    birdSource.width,
    birdSource.height,

    birdResult.x,
    birdResult.y,
    birdResult.width,
    birdResult.height
  );

  for(var i = 0; i < pipe.length; i++) {
    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
   
    pipe[i].x--;
   
    if(pipe[i].x == 100) {
    pipe.push({
    x : canvas.width,
    y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
     });
    }

    //логика столкновения
    if(birdResult.x + birdResult.width >= pipe[i].x
        && birdResult.x <= pipe[i].x + pipeUp.width
        && (yPos <= pipe[i].y + pipeUp.height
        || yPos + birdResult.height >= pipe[i].y + pipeUp.height + gap) 
        || yPos + birdResult.height >= canvas.height - fg.height) {
        location.reload(); // Перезагрузка страницы
        }
   
    if(pipe[i].x == 100) {
    score++;
    score_audio.play();
    }
  }

  ctx.drawImage(fg, 0, canvas.height - fg.height);

  //падение птицы
  yPos += gravity;

  // Сохранить обновленный лучший счет в localStorage
  if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("bestScore", bestScore);
    }

  ctx.fillStyle = "#000";
  ctx.font = "24px Verdana";
  ctx.fillText("Счет: " + score, 10, canvas.height - 20);
  ctx.fillText("Лучший счет: " + bestScore, 10, canvas.height - 50);

  window.requestAnimationFrame(render);
};

img.onload = render;