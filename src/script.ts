const gravity: number = 9.8;
const restitution: number = 0.8;
const listColors: string[] = ["red", "orange", "yellow", "green", "cornflowerblue", "blue", "blueviolet", "violet"];
const size: number = 120;
const windowHeight: number = window.innerHeight - size;
let count: number = 0;

class Ball {
    private velocity: number = 0;
    private animationId: number | null = null;

    constructor(private ballElement: HTMLDivElement, private horizontal: number, private vertical: number) {
        this.ballElement = ballElement;
        this.horizontal = horizontal;
        this.vertical = vertical;
    }

    public startAnimation(): void {
        let lastTime: number = performance.now();
        const tick = (currentTime: number): void => {
            const deltaTime: number = (currentTime - lastTime) / 50;
            lastTime = currentTime;

            this.updatePosition(deltaTime);

            if (Math.abs(this.velocity) < 20 && windowHeight === this.vertical) {
                cancelAnimationFrame(this.animationId!);
            } else {
                this.animationId = requestAnimationFrame(tick);
            }
        };
        this.animationId = requestAnimationFrame(tick);
    }

    private updatePosition(deltaTime: number): void {
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
                        width: `${size *  1.1}px`,
                        height: `${size * 0.9}px`,
                        left: `${this.horizontal - (size *  1.1 - size) / 2}px`,
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

const playingField: Element | null = document.querySelector(".playing-field");
if (playingField instanceof HTMLElement) {
    playingField.addEventListener("click", (event: Event) => {
        const mouseEvent: MouseEvent = event as MouseEvent;
        const ball: HTMLDivElement = document.createElement("div");
        const startY: number = mouseEvent.clientY - size / 2;
        const startX: number = mouseEvent.clientX - size / 2;
        const ballObj: Ball = new Ball(ball, startX, startY);

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
