const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerName = "";
let asteroidSpeed = 2;
let gameOver = false;  


function showStartScreen() {
    const startScreen = document.createElement("div");
    startScreen.id = "startScreen";
    startScreen.style.position = "absolute";
    startScreen.style.top = "0";
    startScreen.style.left = "0";
    startScreen.style.width = "100%";
    startScreen.style.height = "100%";
    startScreen.style.display = "flex";
    startScreen.style.flexDirection = "column";
    startScreen.style.justifyContent = "center";
    startScreen.style.alignItems = "center";
    startScreen.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    startScreen.innerHTML = `
        <h1 style="color: white; font-size: 2.5rem; text-align: center;">¡Esquiva los asteroides!</h1>
        <input type="text" id="playerNameInput" placeholder="Ingresa tu nombre" style="padding: 10px; font-size: 1.2rem; border-radius: 5px; border: none; outline: none; margin: 10px;">
        <button id="startButton" style="padding: 10px 20px; font-size: 1.2rem; border: none; border-radius: 5px; background: #28a745; color: white; cursor: pointer;">Iniciar</button>
    `;
    document.body.appendChild(startScreen);

    document.getElementById("startButton").addEventListener("click", () => {
        const input = document.getElementById("playerNameInput");
        if (input.value.trim() === "") {
            alert("Por favor, ingresa tu nombre para jugar.");
            return;
        }
        playerName = input.value;
        document.body.removeChild(startScreen);
        update();
    });
}
showStartScreen();


const ship = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    dx: 0,
    speed: 5,
};


const stars = [];
const asteroids = [];


function createStar() {
    const size = Math.random() * 2;
    const x = Math.random() * canvas.width;
    stars.push({ x, y: -size, size, dy: Math.random() * 1 + 1 });
}


function drawStars() {
    ctx.fillStyle = "white";
    stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}


function moveStars() {
    stars.forEach((star) => {
        star.y += star.dy;
        if (star.y > canvas.height) {
            star.y = -star.size;
            star.x = Math.random() * canvas.width;
        }
    });
}


function createAsteroid() {
    const size = Math.random() * 30 + 20;
    const x = Math.random() * (canvas.width - size);
    asteroids.push({ x, y: -size, size, dy: asteroidSpeed });
}


function drawAsteroids() {
    ctx.fillStyle = "gray";
    asteroids.forEach((asteroid) => {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
        ctx.fill();
    });
}


function moveAsteroids() {
    asteroids.forEach((asteroid) => {
        asteroid.y += asteroid.dy;
    });
}


function drawShip() {
    ctx.fillStyle = "white";
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}


function moveShip() {
    ship.x += ship.dx;
    if (ship.x < 0) ship.x = 0;
    if (ship.x + ship.width > canvas.width) ship.x = canvas.width - ship.width;
}


function detectCollisions() {
    asteroids.forEach((asteroid, index) => {
        const distX = asteroid.x - ship.x;
        const distY = asteroid.y - ship.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < asteroid.size + ship.width / 2) {
            asteroids.splice(index, 1);
            lives -= 1;
        }
    });
}


let score = 0;
let lives = 3;


function updateScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Jugador: ${playerName}`, 20, 30);
    ctx.fillText(`Puntaje: ${score}`, 20, 60);
    ctx.fillText(`Vidas: ${lives}`, 20, 90);

    
    ctx.fillStyle = "red";
    ctx.fillRect(20, 110, 200, 20);
    ctx.fillStyle = "green";
    ctx.fillRect(20, 110, (200 * lives) / 3, 20);
}


function showGameOver() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
}


function setupSpeedControls() {
    const controls = document.createElement("div");
    controls.style.position = "absolute";
    controls.style.bottom = "20px";
    controls.style.left = "50%";
    controls.style.transform = "translateX(-50%)";
    controls.style.display = "flex";
    controls.style.justifyContent = "space-between";
    controls.style.gap = "20px";

    const increaseSpeed = document.createElement("button");
    increaseSpeed.textContent = "+";
    increaseSpeed.style.padding = "10px 20px";
    increaseSpeed.style.fontSize = "1.2rem";
    increaseSpeed.style.borderRadius = "5px";
    increaseSpeed.style.background = "#28a745";
    increaseSpeed.style.color = "white";
    increaseSpeed.style.border = "none";
    increaseSpeed.style.cursor = "pointer";
    increaseSpeed.addEventListener("click", () => asteroidSpeed += 0.5);

    const decreaseSpeed = document.createElement("button");
    decreaseSpeed.textContent = "-";
    decreaseSpeed.style.padding = "10px 20px";
    decreaseSpeed.style.fontSize = "1.2rem";
    decreaseSpeed.style.borderRadius = "5px";
    decreaseSpeed.style.background = "#dc3545";
    decreaseSpeed.style.color = "white";
    decreaseSpeed.style.border = "none";
    decreaseSpeed.style.cursor = "pointer";
    decreaseSpeed.addEventListener("click", () => asteroidSpeed = Math.max(0.5, asteroidSpeed - 0.5));

    controls.appendChild(decreaseSpeed);
    controls.appendChild(increaseSpeed);
    document.body.appendChild(controls);
}
setupSpeedControls();


document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") ship.dx = ship.speed;
    if (e.key === "ArrowLeft") ship.dx = -ship.speed;
});
document.addEventListener("keyup", () => {
    ship.dx = 0;
});


function update() {
    if (lives <= 0 && !gameOver) {
        gameOver = true;
        showGameOver();
        return;  
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveStars();
    moveShip();
    moveAsteroids();
    detectCollisions();

    drawStars();
    drawShip();
    drawAsteroids();
    updateScore();

    requestAnimationFrame(update);
}


setInterval(createAsteroid, 1000);
setInterval(createStar, 50);
