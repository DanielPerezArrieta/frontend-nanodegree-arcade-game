/**
 * GLOBALS
 */

var allEnemies = [],
    player,
    enemy,
    maxEnemies = 4,// Total 5 enemies on board
    body = document.getElementById('body');
    /**
     * HELPER object
     *
     * Helper Object encapsulates Game CONSTs and helper functions to improve readability 
     * and avoid repetition of code
     */
    Helper = (function(){
    /**
     * PRIVATE CONSTs 
     * 
     * CANVAS_WIDTH: const that holds, obviously, the canvas size of 505 for this case 
     * COL: COL const controls positioning of player as to image layout (distance between two tiles). x moving
     * ROW: Same as COL but for y moving
     * OFFSET_PLAYER_ROW: const used for positioning player inside a tile
     * OFFSET_ENEMY_ROW: const used for positioning enemy inside a tile
     * MIN_SPEED: enemy minimum speed
     * MAX_SPEED: enemy maximum speed
     * 
     * PUBLIC METHODS
     * 
     * getMaxSpeed(): getter function that retrieves MAX_SPEED const
     * getMinSpeed(): getter func that retrieves MIN_SPEED const 
     * getIconsWidth(): getter func that retrieves COL const. Same as image width.
     * getCanvasWidth(): getter func that takes CANVAS_WIDTH const value 
     * getRandom(min,mx): returns a integer random number between min (inclusive) and max (exclusive)
     * moveX(x): translates x (matrix notation) to pixel positioning
     * moveEnemyY(y): translates y (matrix notation: 0..N) to pixel positioning for enemy positioning
     * movePlayerY(y): translates y (matrix notation: 0..N) to pixel positioning for enemy positioning
     * checkRowLimits(row): row (integer: 0..N) is ensure to avoid overflowing visible game layout (--> 0..4)
     * checkColLimits(col): col (integer: 0..N) --> 0..5
     * colorBg(el,css): func that triggers a css class (background color) for 300ms and then backs to the original 
     *                  css class (white background). Helping distinguish between success and collision
     * 
     */

      var CANVAS_WIDTH = 505,
          COL = 101,
          ROW = 83,
          OFFSET_PLAYER_ROW = 44,
          OFFSET_ENEMY_ROW = 25,
          MIN_SPEED = 100,
          MAX_SPEED = 300;
         


      function colorBg(el,css) {
        el.className = css;
        setTimeout(function(){
          el.className = "white";
        },300)            
      }
      function getMaxSpeed() {
        return MAX_SPEED;
      }
      function getMinSpeed() {
        return MIN_SPEED;
      }
      function getIconsWidth() {
        return COL;
      }
      function getCanvasWidth() {
        return CANVAS_WIDTH;
      }
      function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
      function moveX(x) {
          return x*COL;
      }
      function moveEnemyY(y) {
          return y*ROW - OFFSET_ENEMY_ROW;
      }
      function movePlayerY(y) {
          return y*ROW - OFFSET_PLAYER_ROW;
      }
      function checkRowLimits(row) {
          if (row < 0) {
              return 0;
          } else if (row > 4) {
              return 4;
          } else {
              return row;
          }
      }
      function checkColLimits(col) {
          if (col < 0) {
              return 0;
          } else if (col > 5) {
              return 5;
          } else {
              return col;
          }
      }
      //Public methods
      return {
          moveX: moveX,
          movePlayerY: movePlayerY,
          moveEnemyY: moveEnemyY,
          checkRowLimits: checkRowLimits,
          checkColLimits: checkColLimits,
          getRandom: getRandom,
          getCanvasWidth: getCanvasWidth,
          getIconsWidth: getIconsWidth,
          getMinSpeed: getMinSpeed,
          getMaxSpeed: getMaxSpeed,
          colorBg: colorBg
      };
    })();

// Enemies our player must avoid
/**
 * ENEMY CLASS 
 *
 * PROPERTIES:
 * x: pixel positioning
 * y: pixel positioning
 * row: matrix notation of positioning
 * speed: speed of enemy 
 * sprite: path to enemy sprite
 * 
 * 
 * METHODS:
 * update(dt): update state of the enemy properties (speed and position).
 * reset(): Enemies outside world are initialize (randomly at different negative distance, position and speed)
 * isInWorld(): true if enemy inside visible canvas
 * render(): Draw canvas
 */
var Enemy = function() {
  //Initialize position: pixel and integer notation (randomly) and speed (randomly)
  this.x = -100*Helper.getRandom(1,4);
  this.row = Helper.getRandom(1,4);
  this.y = Helper.moveEnemyY(this.row);
  this.speed = Helper.getRandom(Helper.getMinSpeed(),Helper.getMaxSpeed());
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  
  if ( this.isInWorld() ) {
    this.x += (this.speed) * dt;

  } else {
    this.reset();
  }
    
};
Enemy.prototype.reset = function() {
  //set properties to initial state
  this.row = Helper.getRandom(1,4);
  this.y = Helper.moveEnemyY(this.row);
  //this.x is a random integer between [-100,-400)
  this.x = -100*Helper.getRandom(1,4);
  this.speed = Helper.getRandom(Helper.getMinSpeed(),Helper.getMaxSpeed());
};

Enemy.prototype.isInWorld = function() {
  //check whether enemy is in world layout
  return ( this.x < Helper.getCanvasWidth());
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
/**
 * PLAYER CLASS 
 * PROPERTIES:
 * x: pixel positioning
 * y: pixel positioning
 * row: matrix notation of positioning for x positioning (maybe row name is confusing but I understand layout so)
 * col: matrix notation of positioning for y positioning
 * alive: state of player: false  = collision happened 
 * sprite: path to player sprite
 * 
 * 
 * METHODS:
 * update(): update state of the enemy properties (speed and position).
 * reset(): Enemies outside world are initialize (randomly at different negative distance, position and speed)
 * isInWater(): true if player reaches goal
 * render(): Draw canvas 
 * handleInput(move): returns a string pointing movement direction: left, right, down, up. Translates key stroke (integer) into string 
 * */

var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.row = 2, //row values comprises 0 to 4
  this.col = 5, //col values comprises 0 to 5
  this.x = Helper.moveX(this.row);
  this.y = Helper.movePlayerY(this.col);
  this.alive = true;
};

Player.prototype.reset = function() {
  this.row = 2;
  this.col = 5;
  this.x = Helper.moveX(this.row);
  this.y = Helper.movePlayerY(this.col);
  this.alive = true;
};

Player.prototype.isInWater = function() { 
  return ( this.col === 0 );
};

Player.prototype.update = function() {  
  if ( this.isInWater() ) {     
    this.reset();  
    Helper.colorBg(body,'green'); 
  } else if ( !this.alive ) {  
    this.reset();  
    Helper.colorBg(body,'red'); 
  } else {
    this.x = Helper.moveX(this.row);
    this.y = Helper.movePlayerY(this.col);       
  } 
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(move) {
  switch(move) {
    case 'left':
        this.row = Helper.checkRowLimits(--this.row);
        break;
    case 'right':
        this.row = Helper.checkRowLimits(++this.row);
        break;
    case 'down':
        this.col = Helper.checkColLimits(++this.col);
        break;
    case 'up':
        this.col = Helper.checkColLimits(--this.col);
        break;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

for ( var i = maxEnemies; i >= 0; i-- ) {
  allEnemies.push(new Enemy);
}
player = new Player;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});