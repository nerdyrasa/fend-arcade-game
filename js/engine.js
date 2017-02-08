/* Engine.js
 *  This file
 *  (1) draws the initial game board on the screen,
 *  and then
 *  (2) calls the update and render methods on both player and enemy objects which are defined in app.js.
 *
 *
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        collision = false,
        lastTime;

    var game;
    var gameWidth = 505;
    var gameHeight = 606;

    canvas.width = gameWidth;
    canvas.height = gameHeight;

    doc.body.appendChild(canvas);
    canvas.className = "hide";

    var keyupHandler;

    var playButton = doc.getElementById("myBtn");
    myBtn.addEventListener("click", function(){
        // get rid of modal and start
        var startModal = document.getElementById('myModal');
        startModal.style.display = "none";
        // get the selected character to pass to the Game constructor

        game = new Game();
        keyupHandler = function(e) {
              var allowedKeys = {
                  37: 'left',
                  38: 'up',
                  39: 'right',
                  40: 'down'
              };
              console.log("keyup");
              game.player.handleInput(allowedKeys[e.keyCode]);
        };
        doc.addEventListener('keyup', keyupHandler);
        console.log("keyup");

        Resources.load([
            'images/stone-block.png',
            'images/water-block.png',
            'images/grass-block.png',
            'images/enemy-bug.png',
            'images/char-boy.png',
            'images/char-horn-girl.png'
        ]);
        Resources.onReady(init);
        canvas.className = "";

    });

    var playAgainButton = doc.getElementById("play-again-btn");
    playAgainButton.addEventListener("click", function(){

        // get rid of modal
        var gameEndScreen = doc.getElementById("end-play");
        gameEndScreen.className = "modal hide";

        console.log("clearing rect");
        game = new Game();
        keyupHandler = function(e) {
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };
            console.log("keyup");
            game.player.handleInput(allowedKeys[e.keyCode]);
        };

        doc.addEventListener('keyup', keyupHandler);

        renderBoard();
        renderEntities();
        init();

        canvas.className = "";
    });


    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */

    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
          dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */

        if (game.player.score >= game.winningScore) {

            // game over

            console.log("you win");
            canvas.className = "hide";
            //var gameStartScreen = document.getElementById("start");
            //gameStartScreen.className = "hide";
            var gameEndScreen = doc.getElementById("end-play");
            gameEndScreen.className = "modal show";
            doc.removeEventListener("keyup", keyupHandler);
            // remove event handler


        } else {

            update(dt);
            render();

            /* Set our lastTime variable which is used to determine the time delta
             * for the next time this function is called.
             */
            lastTime = now;

            /* Use the browser's requestAnimationFrame function to call this
             * function again as soon as the browser is able to draw another frame.
             */
            win.requestAnimationFrame(main);
        }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */

    function update(dt) {

        game.update(dt);

    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        game.update(dt);

    }

    /* This function initially draws the "game level", it will then call
     * the Entities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {

        renderBoard();
        renderEntities();
    }

    function renderBoard() {
        var rowImages = [
              'images/water-block.png',   // Top row is water
              'images/stone-block.png',   // Row 1 of 3 of stone
              'images/stone-block.png',   // Row 2 of 3 of stone
              'images/stone-block.png',   // Row 3 of 3 of stone
              'images/grass-block.png',   // Row 1 of 2 of grass
              'images/grass-block.png'    // Row 2 of 2 of grass
          ],
          numRows = 6,
          numCols = 5,
          row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        //allEnemies.forEach(function(enemy) {
        //    enemy.render();
        //});
        //
        //player.render();

        game.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }


    function startGame(){
        Resources.load([
            'images/stone-block.png',
            'images/water-block.png',
            'images/grass-block.png',
            'images/enemy-bug.png',
            'images/char-boy.png',
            'images/char-horn-girl.png'
        ]);
        Resources.onReady(init);
    }

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
