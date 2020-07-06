import { getFont } from './helpers';
import { CardInterface, CardActionType } from './types';

class CardFrontFace {
    public ctx: CanvasRenderingContext2D;
    public card: CardInterface;
    private fontSize: number;
    private fontFamily: string;
    private fontStrokeWidth: number;

    constructor(card: CardInterface) {
        this.card = card;
        this.ctx = card.ctx;

        this.fontSize = card.height / 2.5;
        this.fontFamily = 'Arial Black';
        this.fontStrokeWidth = 3 * this.card.state.sizeRatio;
    }

    public draw(): void {
        this.ctx.save();
        this.ctx.translate(this.card.x + this.card.width / 2, this.card.y + this.card.height / 2);
        this.ctx.rotate((this.card.state.rotation * Math.PI) / 180);

        this.drawBackground();

        if (this.card.config.type === <CardActionType>'NUMBER') {
            this.drawNumber(this.card.config.value.toString());
        }
        this.ctx.restore();
    }

    public getX(): number {
        return this.card.x + this.card.width / 2;
    }

    public getY(): number {
        return this.card.y + this.card.height / 2;
    }

    private drawBackground() {
        if (this.card.config.type === 'NUMBER') {
            this.ctx.beginPath();
            this.ctx.lineWidth = 10;
            this.ctx.ellipse(
                0,
                0,
                this.card.width - 80,
                this.card.height - 133,
                (15 * Math.PI) / 180,
                0,
                Math.PI * 2,
                false,
            );
            this.ctx.strokeStyle = 'white';
            this.ctx.stroke();
        }
    }

    private drawNumber(number: string) {
        const x = 0;
        const y = 0;
        const maxWidth = this.card.width / 2;
        const font = getFont(this.fontSize, this.fontFamily);

        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';

        this.drawText(number, font, x, y, maxWidth);

        if (number === '6' || number === '9') {
            const textWidth = this.ctx.measureText(number).width;
            this.drawBottomDash(
                x - textWidth / 2,
                y + this.fontSize / 3 + 2 * this.card.state.sizeRatio,
                textWidth,
                maxWidth,
                this.fontSize,
            );
        }

        // Corner numbers
        const cornerFontSize = this.fontSize / 2 - 10;
        const cornerFont = getFont(cornerFontSize, this.fontFamily);
        const topX = x - this.card.width / 2 + cornerFontSize / 2;
        const topY = y - this.card.height / 2 + cornerFontSize / 2 + 10;
        this.drawText(number, cornerFont, topX, topY, maxWidth / 2, 5);

        const bottomX = x + this.card.width / 2 - cornerFontSize / 2;
        const bottomY = y + this.card.height / 2 - cornerFontSize / 2 - 10;
        this.drawText(number, cornerFont, bottomX, bottomY, maxWidth / 2, 5);

        if (number === '6' || number === '9') {
            const sideTextWidth = this.ctx.measureText(number).width;
            this.drawBottomDash(
                topX - sideTextWidth / 2,
                topY + 5 + cornerFontSize / 4 + 2 * this.card.state.sizeRatio,
                sideTextWidth,
                maxWidth / 2,
                cornerFontSize,
                5,
            );
            this.drawBottomDash(
                bottomX - sideTextWidth / 2,
                bottomY + 5 + cornerFontSize / 4 + 2 * this.card.state.sizeRatio,
                sideTextWidth,
                maxWidth / 2,
                cornerFontSize,
                5,
            );
        }
    }

    private drawTextShadow(text: string, font: string, offset: number, x: number, y: number, maxWidth: number) {
        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'black';
        this.ctx.font = font;
        for (let i = 0; i < offset * this.card.state.sizeRatio; i += 1) {
            this.ctx.fillText(text, x - i, y + i / 2, maxWidth);
        }
    }

    private drawText(text: string, font: string, x: number, y: number, maxWidth: number, shadowOffset = 10) {
        this.drawTextShadow(text, font, shadowOffset, x, y, maxWidth);
        this.ctx.font = font;
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = this.fontStrokeWidth;
        this.ctx.fillText(text, x, y, maxWidth);

        this.ctx.strokeText(text, x, y, maxWidth);
    }

    private drawRectShadow(offset: number, x: number, y: number, width: number, fontSize: number) {
        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'black';
        for (let i = 0; i < offset * this.card.state.sizeRatio; i += 1) {
            this.ctx.fillRect(x - i, y + i, width, fontSize);
        }
    }

    private drawBottomDash(x: number, y: number, width: number, maxWidth: number, fontSize: number, shadowOffset = 10) {
        let diff = 0;
        let dashWidth = width;
        if (width > maxWidth) {
            diff = width - maxWidth;
            dashWidth = maxWidth;
        }
        // draw dash shadow
        this.ctx.strokeRect(x + diff, y, dashWidth, fontSize / 6);
        this.drawRectShadow(shadowOffset, x + diff, y, dashWidth, fontSize / 6);

        // draw dash
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = 'white';
        const height = fontSize / 6;
        this.ctx.fillRect(x + diff, y, dashWidth, height);
        this.ctx.strokeRect(x + diff, y, dashWidth, height);
    }
}

export default CardFrontFace;
