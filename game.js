// JavaScript code for the Flappy Bird clone
window.onload = function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Setting the canvas dimensions to fit the screen
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight * 0.8; // Leave some space for buttons above
    canvas.width = (window.innerHeight) * 0.5633802816901408;
    canvas.height = window.innerHeight * 0.9; // Leave some space for buttons above


    // Game variables

    const gravity = 0.6;       // Gravity affecting the bird
    const jump = -12.5;          // Jump force when the bird flaps
    const birdSize = 80 * (canvas.height/1439); // Bird size (width and height)
    const pipeWidth = 100;      // Width of the pipes
    const pipeGap = 300;       // Gap between the pipes
    let birdY = canvas.height / 2; // Bird's vertical position
    let birdVelocity = 0;      // Bird's vertical speed
    let pipeX = canvas.width;  // Pipe's horizontal position
    let pipeHeight = Math.random() * ((canvas.height * 0.6) - pipeGap); // Random pipe height
    let score = 0;             // Player's score
    let isGameOver = false;    // Game over flag
    let isRunning = false;     // Game running flag
    let lastFrameTime = 0;      // Frame Limiting Timer

//Moving grass variables
    var grassOffsetX = 0;
    var grassCounter = 0;
   

    //Load images (commented out for now)
    const birdImage = new Image();
    birdImage.src = "./assets/bird-placeholder.png"; // TODO: Placeholder for bird image
    const pipeImage = new Image();
    pipeImage.src = "./assets/pipe-placeholder.png"; // TODO: Placeholder for pipe image
    const backgroundMoving = new Image();
    backgroundMoving.src = "./assets/backgroundMovingStripe.png";
    const backgroundStatic = new Image();
    backgroundStatic.src = "./assets/backgroundLowerStaticField.png";

    // Placeholder sound effects (commented out for now)
    const flapSound = new Audio("./assets/flappingSound.wav");
    const hitSound = new Audio("./assets/hitSound.wav");
    const scoreSound = new Audio("./assets/scoreSound.wav");

    // Event listeners for keyboard and touch controls
    document.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
            birdFlap();
        }
    });

    document.addEventListener("touchstart", function() {
        birdFlap();
    });

    document.getElementById("startButton").addEventListener("click", function() {
        if (!isRunning) {
            isRunning = true;
            update();
        }
    });

    document.getElementById("pauseButton").addEventListener("click", function() {
        isRunning = false;
    });

    function birdFlap() {
        if (isRunning && !isGameOver) {
            birdVelocity = jump;
            flapSound.play(); // TODO: Play flap sound
        }
    }

    function update(timestamp) {
        if (!isRunning) return; // Pause the game if not running

        // Calculate the time since the last frame
        const elapsed = timestamp - lastFrameTime;

        // Only update and draw if enough time has passed (16.67ms for 60 FPS)
        if (elapsed >= 1000 / 60) {
        
        // Bird physics
        birdVelocity += gravity;
        birdY += birdVelocity;

        // Pipe movement
        pipeX -= 5; // Speed of the pipes moving left

        // Check if the pipe is off-screen
        if (pipeX < -pipeWidth) {
            pipeX = canvas.width;
            pipeHeight = Math.random() * (canvas.height - pipeGap);
            score++;
            scoreSound.play(); // TODO: Play score sound
        }

        // Check for collisions with pipes
        if (
            (birdY < pipeHeight || birdY + birdSize > pipeHeight + pipeGap) &&
            (pipeX < birdSize && pipeX + pipeWidth > 0)
        ) {
            isGameOver = true;
            hitSound.play(); // TODO: Play hit sound
        }

        // Check for collisions with the ground or ceiling
        if (birdY + birdSize > canvas.height || birdY < 0) {
            isGameOver = true;
            hitSound.play(); // TODO: Play hit sound
        }

        // If game over, reset game
        if (isGameOver) {
            birdY = canvas.height / 2;
            birdVelocity = 0;
            pipeX = canvas.width;
            score = 0;
            isGameOver = false;
        }

    // Redraw the game
  
     draw();

     lastFrameTime = timestamp;
   console.log(lastFrameTime);
    
    }
    // Request the next frame
    requestAnimationFrame(update);
    
}

    function draw() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the bird
        //ctx.fillStyle = "#FFDD57"; // Placeholder color for the bird
        //ctx.fillRect(50, birdY, birdSize, birdSize);
        ctx.drawImage(birdImage, 50, birdY, birdSize, birdSize); // TODO: Draw the bird image

        // Draw the pipes
        //ctx.fillStyle = "#008000"; // Placeholder color for the pipes
        //ctx.fillRect(pipeX, 0, pipeWidth, pipeHeight);
        //ctx.fillRect(pipeX, pipeHeight + pipeGap, pipeWidth, canvas.height - pipeHeight - pipeGap);
        //ctx.drawImage(pipeImage, pipeX, 0, pipeWidth, pipeHeight); // TODO: Draw the top pipe image
        
        // Draw the top pipe (flipped)
        ctx.save(); // Save the current state
        ctx.scale(1, -1); // Flip vertically
        //ctx.drawImage(pipeImage, 0, 0, pipeWidth, pipeImage.height, pipeX, 0, pipeWidth, pipeHeight);
        ctx.drawImage(pipeImage, pipeX, -pipeHeight, pipeWidth, pipeHeight); // Adjust position for flipped image
        ctx.restore(); // Restore the original state
        
        // Draw the bottom pipe (normal)
        //ctx.drawImage(pipeImage, 0, 0, pipeWidth, pipeImage.height, pipeX, pipeHeight + pipeGap, pipeWidth, canvas.height - pipeHeight - pipeGap);
        ctx.drawImage(pipeImage, pipeX, pipeHeight + pipeGap, pipeWidth, canvas.height - pipeHeight - pipeGap); // TODO: Draw the bottom pipe image
        //Draw Static Background
    
        // Draw moving background stripe
        ctx.drawImage( backgroundMoving, grassOffsetX, 0,
            canvas.width, backgroundMoving.height,
            0, canvas.height *0.7804,
            canvas.width, canvas.height * 0.04309);
            //ctx.drawImage(backgroundStatic,0,canvas.height * .8225,canvas.width,canvas.height*.18);
            // scroll grass
            if ( (grassOffsetX += 6) >= canvas.width )
                grassOffsetX = 0;

       ctx.fillStyle = "Khaki";     
       ctx.fillRect(0,canvas.height * .8225,canvas.width,canvas.height*.18);
        
        //ctx.fillStyle = pattern;
        //ctx.drawImage(backgroundMoving, 0,650,canvas.width,40);
        // Draw the score
        ctx.font = "30px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Score: " + score, 10, 50);
    }
};

console.log("Canvas Width: ",window.innerWidth, "Canvas Height: ", window.innerHeight);
