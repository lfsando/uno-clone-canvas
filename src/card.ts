import { milimeterToPixel, roundedRect } from './helpers';
import { CardInterface, CardConfigTypeInterface, CardStateInterface } from './types';
import CardFrontFace from './frontface';

class Card implements CardInterface {
    ctx: CanvasRenderingContext2D;
    config: CardConfigTypeInterface;
    state: CardStateInterface;
    color: string;
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    offsetX: number;
    offsetY: number;
    private initialWidth: number;
    private initialHeight: number;
    private borderWidth: number;
    private borderRadius: number;
    private cardFrontFace: CardFrontFace;

    constructor(
        context: CanvasRenderingContext2D,
        config: CardConfigTypeInterface,
        initialX: number,
        initialY: number,
    ) {
        this.ctx = context;
        this.initialWidth = milimeterToPixel(57);
        this.initialHeight = milimeterToPixel(89);
        this.x = initialX;
        this.initialX = initialX;
        this.y = initialY;
        this.initialY = initialY;

        this.state = {
            animationRotationDirection: 1,
            shaking: false,
            highlighting: false,
            hovering: false,
            rotation: 0,
            sizeRatio: 0.8,
            frontFacing: true,
            grabbing: false,
            inHand: true,
        };
        this.borderWidth = 18 * this.state.sizeRatio;
        this.borderRadius = 18 * this.state.sizeRatio;
        this.offsetX = 0;
        this.offsetY = 0;
        this.config = config;
        this.cardFrontFace = new CardFrontFace(this);
        this.color = this.getRGB();
    }

    public get width(): number {
        return this.initialWidth * this.state.sizeRatio - this.borderWidth * 2;
    }

    public get height(): number {
        return this.initialHeight * this.state.sizeRatio - this.borderWidth * 2;
    }

    public get left(): number {
        return this.x - this.borderRadius;
    }

    public get right(): number {
        return this.x + this.width + this.borderRadius;
    }

    public get top(): number {
        return this.y - this.borderRadius;
    }

    public get bottom(): number {
        return this.y + this.height - this.borderRadius;
    }

    public update(): void {
        if (this.state.shaking || this.state.rotation !== 0) {
            this.animateShake();
        }

        if (this.state.highlighting || (this.y < this.initialY && !this.state.highlighting)) {
            // if state is moving top or this.y is less than initialY while not hovering it
            this.animateMovingTop();
        }
    }

    public draw(): void {
        roundedRect(
            this.ctx,
            this.x,
            this.y,
            this.width,
            this.height,
            this.borderRadius,
            this.color,
            'rgb(250, 250, 250)',
            this.borderWidth,
            true,
            this.state.rotation,
        );

        this.cardFrontFace.draw();
        this.ctx.lineWidth = 3;
    }

    public setPos(x: number, y: number): Record<string, number> {
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        return { x: this.x, y: this.y };
    }

    public shake(): void {
        if (this.state.shaking) return;

        this.state.shaking = true;

        setTimeout(() => {
            this.state.shaking = false;
        }, 50);
    }

    public highlight(): void {
        if (this.state.highlighting) return;
        this.state.highlighting = true;
        setTimeout(() => {
            this.state.highlighting = false;
        }, 250);
    }

    public setState(state: keyof CardStateInterface, value: number | boolean): void {
        this.state[state] = value;
    }

    public setSizeRatio(ratio: number): number {
        let r = ratio;
        if (r > 2.0) {
            r = 2.0;
        } else if (r < 0.3) {
            r = 0.5;
        }
        this.state.sizeRatio = r;
        this.borderWidth *= r;
        this.borderRadius *= r;
        return this.state.sizeRatio;
    }

    public isHovering(mouseX: number, mouseY: number): boolean {
        return mouseX >= this.left && mouseX <= this.right && mouseY >= this.top && mouseY <= this.bottom;
    }

    public getRGB(): string {
        switch (this.config.color) {
            case 'BLUE':
                return 'rgb(1, 83, 165)';
            case 'GREEN':
                return 'rgb(98, 167, 50)';
            case 'RED':
                return 'rgb(231, 37, 37)';
            case 'YELLOW':
                return 'rgb(240, 210, 50)';
            case 'ANY':
                return 'rgb(0, 0, 0)';
            default:
                return 'rgb(255, 0, 255)';
        }
    }

    private animateShake() {
        const range = 1;
        const speed = 0.5;
        const { rotation, animationRotationDirection } = this.state;
        if (
            (rotation > range && animationRotationDirection > 0) ||
            (rotation < -range && animationRotationDirection < 0)
        ) {
            this.state.animationRotationDirection *= -1;
        }
        this.state.rotation += speed * animationRotationDirection;
        this.state.rotation = Number(rotation.toFixed(2));
    }

    private animateMovingTop() {
        const range = 50 * this.state.sizeRatio;
        let speed = 20;
        if (this.state.highlighting) {
            if (this.y >= this.initialY - range) {
                this.y -= speed;
            }
        } else {
            speed = 20;
            if (this.y <= this.initialY && !this.state.hovering) {
                this.y += speed;
            }
        }
    }

    private drawBoundingRect() {
        let strokeStyle: string;
        if (this.state.grabbing) {
            strokeStyle = 'green';
        } else if (this.state.hovering) {
            strokeStyle = 'magenta';
        } else {
            strokeStyle = 'black';
        }
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
export default Card;
