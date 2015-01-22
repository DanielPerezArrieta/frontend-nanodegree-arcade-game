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
     * CANVAS_WIDTH:
     * COL:
     * ROW:
     * OFFSET_PLAYER_ROW:
     * OFFSET_ENEMY_ROW:
     * MIN_SPEED:
     * MAX_SPEED:
     * 
     * PUBLIC METHODS
     * 
     * getMaxSpeed():
     * getMinSpeed():
     * getIconsWidth():
     * getCanvasWidth():
     * getRandom(min,mx):
     * moveX(x):
     * moveEnemyY(y):
     * movePlayerY(y):
     * checkRowLimits(row):
     * checkColLimits(col):
     */

        var CANVAS_WIDTH = 505,
            COL = 101,
            ROW = 83,
            OFFSET_PLAYER_ROW = 44,
            OFFSET_ENEMY_ROW = 25,
            MIN_SPEED = 100,
            MAX_SPEED = 300;
           


        function colorBg(el,color) {
          el.className = color;
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
 * x:
 * y:
 * row:
 * speed:
 * sprite:
 * 
 * 
 * METHODS:
 * update(dt):
 * reset():
 * isInWorld():
 * render():
 */
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
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
  this.row = Helper.getRandom(1,4);
  this.y = Helper.moveEnemyY(this.row);
  this.x = -100*Helper.getRandom(1,4);
  this.speed = Helper.getRandom(Helper.getMinSpeed(),Helper.getMaxSpeed());
};

Enemy.prototype.isInWorld = function() {
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
 *
 * PROPERTIES:
 * x:
 * y:
 * row:
 * col:
 * alive:
 * sprite:
 * 
 * 
 * METHODS:
 * update():
 * reset():
 * isInWater():
 * render():
 * handleInput(move):
 */
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