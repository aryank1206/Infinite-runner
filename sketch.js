var PLAY = 1;
var END = 0;
var gameState = PLAY;

var nobita, nobita_running, nobita_collided;

var ground, invisibleGround, groundImage;

var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var score=0;

var life = 3;

var gameOver, restart;

var coinSound;
localStorage["HighestScore"] = 0;

function preload(){
  nobita_running = loadAnimation("nobita.png");
  nobita_collided = loadAnimation("nobitadead.png");
  groundImage = loadImage("backg.jpg");
  
  coinImage = loadImage("coin.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle1 = loadImage("obstacle1.png");

  obstacle3 = loadImage("obstacle3.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  coinSound=loadSound("coin.wav");
}

function setup() {
  createCanvas(600, 200);
  nobita = createSprite(50,180,20,50);
  nobita.addAnimation("running", nobita_running);
  
  
  ground = createSprite(0,190,1200,10);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background("blue");
  textSize(20);
  fill(255);
  text("Score: "+ score, 500,40);
//text("life: "+ life , 500,60);
nobita.scale = 0.07;

  drawSprites();
  if (gameState===PLAY){
    
   if(coinGroup.isTouching(nobita)){
     score=score+1
coinGroup[0].destroy();
     coinSound.play();
   }
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && nobita.y >= 139) {
      nobita.velocityY = -12;
    }
  
    nobita.velocityY = nobita.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    nobita.collide(ground);
    
    spawnCoin();
    spawnObstacles();
  
   if(obstaclesGroup.isTouching(nobita)){
     life=life-1;
        gameState = END;
    } 
  }
  
  else if (gameState === END ) {
    //gameOver.visible = true;
    restart.visible = true;
    nobita.addAnimation("collided", nobita_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    nobita.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    nobita.changeAnimation("collided",nobita_collided);
    nobita.scale =0.35;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      if(life>0){
      reset();
      }
    }
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(600,120,40,10);
    coin.y = Math.round(random(80,120));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = nobita.depth;
    nobita.depth = nobita.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,157,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
            
              break;
      case 2: obstacle.addImage(obstacle1);
      
     
              break;
      
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale=0.08;
    obstacle.lifetime = 300;
    obstacle.debug=true;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}



function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  nobita.changeAnimation("running",nobita_running);
  nobita.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  //score = 0;
  
}