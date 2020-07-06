import Hand from './hand';
import Card from './card';
import {
    UnoInterface,
    GameStateInterface,
    GameEventInterface,
    GameConfigInterface,
    CardColorType,
    CardNumberType,
    CardColorEnum,
    CardInterface,
} from './types';

class Uno implements UnoInterface {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    state: GameStateInterface;
    events: GameEventInterface[];
    gameConfig: GameConfigInterface;
    running: boolean;
    cards: CardInterface[];
    hand: Hand;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('uno');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.canvas.style.border = '1px solid black';
        this.ctx = this.canvas.getContext('2d');
        this.state = {
            grabbedCard: undefined,
            hoverCard: undefined,
            mouseUpPosition: { x: undefined, y: undefined },
            mouseDownPosition: { x: undefined, y: undefined },
            mouseLastPosition: { x: undefined, y: undefined },
            clicking: false,
        };
        this.events = [];
        this.running = false;
        this.cards = [];
        this.gameConfig = {
            nCards: 108,
        };
        this.hand = undefined;
    }

    public start(): void {
        this.init();
        if (this.running) {
            requestAnimationFrame(this.animate.bind(this));
        }
    }

    public setContextCursor(cursor: string): string {
        if (this.canvas.style.cursor !== cursor) {
            this.canvas.style.cursor = cursor;
        }
        return cursor;
    }

    public grabCard(card: CardInterface): CardInterface {
        // if grab state is not set, set it now
        if (!this.state.grabbedCard) {
            // set the mouse cursor style to `grabbing`
            this.setContextCursor('grabbing');
            // set the card state to grabbing (active)
            card.setState('grabbing', true);
            // set the game grabbedCard state to the card
            this.state.grabbedCard = card;
            // put it on top of the cards list ( for rendering purposes - top of the stack)
            // this.hand.cards.splice(this.hand.cards.indexOf(this.state.hoverCard), 1)
            // this.hand.cards.push(this.state.hoverCard);
            this.state.grabbedCard.setState('inHand', false);
        }
        // find offset from mousepos to card pos
        const offsetX = this.state.mouseDownPosition.x - card.initialX;
        const offsetY = this.state.mouseDownPosition.y - card.initialY;

        // move card offsetted from the position of the mouse
        card.x = Number((this.state.mouseLastPosition.x - offsetX).toFixed(3));
        card.y = Number((this.state.mouseLastPosition.y - offsetY).toFixed(3));
        return card;
    }

    public releaseCard(card: CardInterface): CardInterface {
        this.setContextCursor('grab');
        card.initialX = card.x;
        card.initialY = card.y;
        card.setState('grabbing', false);
        this.state.grabbedCard.setState('inHand', true);
        this.state.grabbedCard = undefined;
        return card;
    }

    private onLoop() {
        this.hand.update();

        // handle hover states
        this.handleHoverCard(this.state.hoverCard);
        if (this.state.hoverCard) {
            if (this.state.clicking) {
                // grabbing
                this.grabCard(this.state.hoverCard);
            } else if (this.state.grabbedCard) {
                // stop grabbing card
                this.releaseCard(this.state.grabbedCard);
            }
        } else if (!this.state.clicking) {
            // no active cards ( no hovering, no grabbing )
            this.setContextCursor('initial');
            if (this.state.hoverCard) {
                this.state.hoverCard = undefined;
            }
        }

        if (this.state.grabbedCard) {
            if (this.state.clicking) {
                // grabbing
                this.grabCard(this.state.grabbedCard);
            } else {
                this.releaseCard(this.state.grabbedCard);
            }
        }

        if (!this.state.clicking) {
            this.state.mouseDownPosition = { x: undefined, y: undefined };
        }
    }

    private init() {
        window.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        window.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
        window.addEventListener('mouseup', this.handleMouseUp.bind(this), false);

        this.hand = new Hand(this.ctx);

        const colors: string[] = Object.keys(CardColorEnum).filter((k) => !parseInt(k, 10) && parseInt(k, 10) !== 0);
        // const types = '';
        for (let i = 0; i < 20; i += 1) {
            const colorIndex = Math.floor(Math.random() * colors.length);
            const card = new Card(
                this.ctx,
                {
                    color: <CardColorType>colors[colorIndex],
                    type: 'NUMBER',
                    value: <CardNumberType>Math.floor(Math.random() * 10),
                },
                0,
                0,
            );
            this.hand.addCard(card);
        }
        this.hand.initHand();
        this.running = true;
    }

    // private onEvent(event: GameEventInterface) {
    //     switch (event) {
    //         default:
    //     }
    // }

    private onRender() {
        this.drawBackground();
        this.hand.drawHand();
        // this.drawDebug();
    }

    private animate() {
        // while (this.events.length > 0) {
        // this.onEvent(this.events.pop());
        // }
        this.onLoop();
        this.onRender();
        requestAnimationFrame(this.animate.bind(this));
    }

    private handleMouseDown(event: MouseEvent) {
        this.state.clicking = true;
        this.state.mouseDownPosition = { x: event.offsetX, y: event.offsetY };
    }

    private handleMouseUp(event: MouseEvent) {
        this.state.clicking = false;
        this.state.mouseUpPosition = { x: event.offsetX, y: event.offsetY };
    }

    private handleMouseMove(event: MouseEvent) {
        this.state.mouseLastPosition = { x: event.offsetX, y: event.offsetY };

        if (!this.state.clicking) {
            const reversedCards = [...this.hand.cards].reverse();
            let gotHover = false;
            reversedCards.forEach((card) => {
                if (card.isHovering(event.offsetX, event.offsetY) && !gotHover) {
                    // Set card to hoverCard
                    this.setContextCursor('grab');
                    this.state.hoverCard = card;
                    gotHover = true;
                }
                card.state.hovering = false;
                return true;
            });
        }
    }

    private drawBackground() {
        const bgColor = 'rgb(230, 230, 230)';
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    private handleHoverCard(card: CardInterface) {
        if (card && card === this.state.hoverCard) {
            // check if mouse is still hovering card
            const isStillHoveringCard = card.isHovering(this.state.mouseLastPosition.x, this.state.mouseLastPosition.y);

            if (isStillHoveringCard) {
                // mouse is still hovering card
                if (!this.state.clicking) {
                    // Start hover animation on card
                    if (card.state.inHand) {
                        this.state.hoverCard.state.hovering = true;
                        card.shake();
                        card.highlight();
                    }
                }
            } else if (!this.state.clicking) {
                // not clicking and not hovering a card, set hoverCard to undefined
                this.state.hoverCard.state.hovering = false;
                this.state.hoverCard = undefined;
            }
        }
    }

    private drawDebug() {
        this.ctx.fillStyle = 'orange';
        this.ctx.fillRect(this.state.mouseLastPosition.x, this.state.mouseLastPosition.y, 5, 5);

        const fontSize = 80;

        const x = 10;
        const y = this.canvas.height - fontSize - 10;
        const w = 60;

        let offset = x;
        // isClicking
        this.ctx.fillStyle = this.state.clicking ? 'green' : 'black';
        this.ctx.fillRect(offset, y, w, w);

        offset += w + 20;

        // isHovering
        this.ctx.fillStyle = this.state.hoverCard ? this.state.hoverCard.getRGB() : 'black';
        this.ctx.fillRect(x + offset, y, w, w);

        offset += w + 20;
        // isGrabbing
        this.ctx.fillStyle = this.state.grabbedCard ? this.state.grabbedCard.getRGB() : 'black';
        this.ctx.fillRect(x + offset, y, w, w);
    }
}
export default Uno;
