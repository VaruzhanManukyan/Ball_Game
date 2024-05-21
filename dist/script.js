"use strict";
const gravity = 9.8;
const restitution = 0.8;
const listColors = ["red", "orange", "yellow", "green", "cornflowerblue", "blue", "blueviolet", "violet"];
const size = 120;
const windowHeight = window.innerHeight - size;
let count = 0;
class Ball {
    constructor(ballElement, horizontal, vertical) {
        this.ballElement = ballElement;
        this.horizontal = horizontal;
        this.vertical = vertical;
        this.velocity = 0;
        this.animationId = null;
        this.ballElement = ballElement;
        this.horizontal = horizontal;
        this.vertical = vertical;
    }
    startAnimation() {
        let lastTime = performance.now();
        const tick = (currentTime) => {
            const deltaTime = (currentTime - lastTime) / 50;
            lastTime = currentTime;
            this.updatePosition(deltaTime);
            if (Math.abs(this.velocity) < 20 && windowHeight === this.vertical) {
                cancelAnimationFrame(this.animationId);
            }
            else {
                this.animationId = requestAnimationFrame(tick);
            }
        };
        this.animationId = requestAnimationFrame(tick);
    }
    updatePosition(deltaTime) {
        this.velocity += gravity * deltaTime;
        this.vertical += this.velocity * deltaTime;
        if (this.vertical >= windowHeight) {
            this.velocity *= -restitution;
            this.vertical = windowHeight;
            this.ballElement.animate([
                {
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${this.horizontal}`,
                    top: `${this.vertical}`
                },
                {
                    width: `${size * 1.1}px`,
                    height: `${size * 0.9}px`,
                    left: `${this.horizontal - (size * 1.1 - size) / 2}px`,
                    top: `${this.vertical + (size - size * 0.9) / 2}`
                },
                {
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${this.horizontal}`,
                    top: `${this.vertical}`
                },
            ], 50);
        }
        this.ballElement.style.top = this.vertical + 'px';
    }
}
const playingField = document.querySelector(".playing-field");
if (playingField instanceof HTMLElement) {
    playingField.addEventListener("click", (event) => {
        const mouseEvent = event;
        const ball = document.createElement("div");
        const startY = mouseEvent.clientY - size / 2;
        const startX = mouseEvent.clientX - size / 2;
        const ballObj = new Ball(ball, startX, startY);
        ball.style.top = `${startY}px`;
        ball.style.left = `${startX}px`;
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        ball.style.backgroundColor = listColors[count % listColors.length];
        ball.classList.add("ball");
        count++;
        playingField.appendChild(ball);
        ballObj.startAnimation();
    });
}
