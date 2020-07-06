import { CardInterface, HandInterface } from './types';

class Hand implements HandInterface {
    ctx: CanvasRenderingContext2D;
    cards: CardInterface[];
    bottomMargin: number;

    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
        this.cards = [];
        this.bottomMargin = 100;
    }

    public initHand(): void {
        const c = this.ctx.canvas;
        if (this.cards.length > 0) {
            let xOffset = (c.width / this.cards.length) * 2;
            const overlap = 0.6;
            this.cards.forEach((card: CardInterface, i: number) => {
                const x = xOffset;

                const y = c.height - 100 - card.height - i * 0.9;
                card.setPos(x, y);
                xOffset += card.width - card.width * overlap;
            });
        }
    }

    public addCard(card: CardInterface): CardInterface {
        this.cards.push(card);
        return card;
    }

    public update(): void {
        this.cards.forEach((card) => {
            card.update();
        });
    }

    public drawHand(): void {
        this.cards.forEach((card) => {
            card.draw();
        });
    }
}

export default Hand;
