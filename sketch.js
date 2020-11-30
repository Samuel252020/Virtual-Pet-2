var dog, milkBottle;
var dataBase;
var foodStock, foodS;
var fedTime, lastFed;
var DogImg, DogHappyImg, MilkBottleImg
var feed, add;
var foodObj; 

function preload(){
  DogImg = loadImage("images/dogImg.png");
  DogHappyImg = loadImage("images/dogImg1.png");
  MilkBottleImg = loadImage("images/Milk.png");
}

function setup(){
  createCanvas(800, 600);
  
  //get the foodS
  dataBase = firebase.database();
  foodStock = dataBase.ref('Food');
  foodStock.on("value", readStock);
  
  //get the lastFed time
  fedTime = dataBase.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  dog = createSprite(width/2 + 100, height/2, 0, 0);
  dog.addImage(DogImg);
  dog.scale = 0.2;

  

  foodObj = new Food();

  //button - feedDog
  feed = createButton("feed DRAGO");
  feed.position(750, 100);
  feed.mousePressed(feedDog);

  //button - addFoods
  add = createButton("Add Food");
  add.position(850, 100);
  add.mousePressed(addFood);
}


function draw(){
  background(46, 139, 87);

  foodObj.display();
 //if(keyWentDown(UP_ARROW) && gameState == "play"){
    //writeStock(foodS);
    //dog.addImage(DogHappyImg);
    //dog.scale = 0.4;
  //}

  drawSprites();

  //display time in the format of "am" and "pm"
  fill(255, 255, 254);
  textSize(15);
  textAlign(CENTER);
  if(lastFed >= 12){
    text("Last Feed: "+lastFed%12 + ":00 PM", width/2, 30);
  }else if(lastFed == 0){
    text("Last Feed: 12:00 AM", width/2, 30);
  }else{
    text("Last Feed: "+lastFed + ":00 AM", width/2, 30);
  } 

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0;     
  }else{
    x = x-1;
  }
  dataBase.ref('/').update({
    Food:x
  })
}

//feed the dog
function feedDog(){
  dog.addImage(DogHappyImg);
  dog.scale = 0.2;

  milkBottle = createSprite(width/2, height/2 + 25, 0, 0);
  milkBottle.addImage(MilkBottleImg);
  milkBottle.scale = 0.1;

  //foodObj.updateFoodStock(foodObj.getFoodStock()-1); //minus bottles of milk
  foodObj.deductFood();
  dataBase.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//add the food
function addFood(){
  foodS++;
  dataBase.ref('/').update({
    Food:foodS
  })
}

