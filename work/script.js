const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Game Object constructor
class Car {
    constructor(x, y, color, controls, speedoId) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 20;
        this.color = color;
        this.velocity = 0; // Current speed
        this.acceleration = 0.2;
        this.friction = 0.98;
        this.controls = controls;
        this.speedoElement = document.getElementById(speedoId);
        this.isFinished = false;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // This function will be called in the game loop
    update() {
        if (this.isFinished) return;
        
        // 1. Handle Input (based on keys pressed)
        if (keysPressed[this.controls.accelerate]) {
            this.velocity += this.acceleration;
        } else if (keysPressed[this.controls.brake]) {
            this.velocity -= this.acceleration;
        }

        // 2. Apply Friction and Speed Limits
        this.velocity *= this.friction;
        this.velocity = Math.min(Math.max(this.velocity, -3), 5); // Limit speed

        // 3. Update Position
        this.x += this.velocity;
        
        // 4. Update Speedometer UI
        // Convert velocity (pixels/frame) to a readable speed (e.g., KM/H)
        const displaySpeed = Math.round(Math.abs(this.velocity * 30)); 
        this.speedoElement.textContent = displaySpeed;

        // 5. Check for Finish Line
        if (this.x > finishLineX && !this.isFinished) {
            this.isFinished = true;
            // You would add win logic here
            alert(`${this.color} Car Wins!`);
        }

        // 6. Handle Ramp (Simple collision/elevation logic)
        // Check if car's x position is on the ramp's X coordinates
        if (this.x + this.width > rampStart && this.x < rampEnd) {
            // Simple visual "jump" effect (you would use complex physics for realistic ramps)
            this.y = groundY - 30; 
        } else {
            this.y = groundY;
        }

        // Keep car on screen (simple bounds)
        this.x = Math.max(0, Math.min(this.x, width - this.width));
    }
}

// Key Controls Setup
const keysPressed = {};
document.addEventListener('keydown', (e) => { keysPressed[e.key] = true; });
document.addEventListener('keyup', (e) => { keysPressed[e.key] = false; });

// Game constants
const groundY = height - 40;
const startLineX = 50;
const finishLineX = width - 70;
const rampStart = 300;
const rampEnd = 450; 
const rampHeight = 40;

// Create the two cars
const car1 = new Car(startLineX, groundY, 'red', { accelerate: 'ArrowRight', brake: 'ArrowLeft' }, 'speedo1');
const car2 = new Car(startLineX, groundY - 10, 'blue', { accelerate: 'd', brake: 'a' }, 'speedo2');

const cars = [car1, car2];
function drawTrack() {
    // Draw Ground
    ctx.fillStyle = 'green';
    ctx.fillRect(0, groundY + 20, width, height - groundY - 20);

    // Draw Ramp (Simple trapezoid or triangle)
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(rampStart, groundY + rampHeight);
    ctx.lineTo(rampStart + (rampEnd - rampStart) / 2, groundY); // Top of the ramp
    ctx.lineTo(rampEnd, groundY + rampHeight);
    ctx.fill();
    
    // Draw Start Line
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(startLineX, groundY + 20);
    ctx.lineTo(startLineX, 0);
    ctx.stroke();

    // Draw Finish Line (Solid line for end)
    ctx.strokeStyle = 'black';
    ctx.setLineDash([]); // Reset to solid line
    ctx.beginPath();
    ctx.moveTo(finishLineX, groundY + 20);
    ctx.lineTo(finishLineX, 0);
    ctx.stroke();

    // Reset line style
    ctx.setLineDash([]);
}
// The main loop that runs constantly
function gameLoop() {
    // 1. Clear the entire canvas for the new frame
    ctx.clearRect(0, 0, width, height);

    // 2. Draw all static track elements
    drawTrack();

    // 3. Update and Draw Cars
    cars.forEach(car => {
        car.update();
        car.draw();
    });

    // Request the browser to call gameLoop again for the next frame (60 FPS)
    requestAnimationFrame(gameLoop);
}

// Start the game!
gameLoop();