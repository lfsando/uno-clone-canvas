class Uno {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  width: number
  height: number
  state: GameState
  events: GameEvent[]
  running: boolean
  cards: Card[]
  gameConfig: GameConfig
  hand: Hand

  constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById('uno');
    this.width = this.canvas.width = innerWidth;
    this.height = this.canvas.height = innerHeight;
    this.canvas.style.border = '1px solid black';
    this.context = this.canvas.getContext('2d');
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
      nCards: 108
    }
    this.hand = undefined;

  }

  private _init() {

    window.addEventListener('mousemove', this._handleMouseMove.bind(this), false);
    window.addEventListener('mousedown', this._handleMouseDown.bind(this), false);
    window.addEventListener('mouseup', this._handleMouseUp.bind(this), false);

    this.hand = new Hand(this.context);


    const colors: string[] = Object.keys(CardColorEnum).filter(k => !parseInt(k) && parseInt(k) !== 0);
    const types = ''
    for (let i = 0; i < 20; i++) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      const card = new Card(this.context, {
        color: <CardColor>(colors[colorIndex]),
        type: 'NUMBER',
        value: <CardValueType>Math.floor(Math.random() * 10)
      }, 0, 0)
      this.hand.addCard(card);
    }
    this.hand.initHand();
    this.running = true;
  }

  private _onEvent(event: GameEvent) {

  }



  onLoop() {
    this.hand.update();

    // handle hover states
    this._handleHoverCard(this.state.hoverCard);
    if (this.state.hoverCard) {
      if (this.state.clicking) {
        // grabbing
        this.grabCard(this.state.hoverCard);
      } else if (this.state.grabbedCard) {
        // stop grabbing card
        this.releaseCard(this.state.grabbedCard);
      }
    } else {
      if (!this.state.clicking) {
        // no active cards ( no hovering, no grabbing )
        this.setContextCursor('initial');
        if (this.state.hoverCard) {
          this.state.hoverCard = undefined;
        }
      }
    }

    if (this.state.grabbedCard) {
      if (this.state.clicking) {
        //grabbing
        this.grabCard(this.state.grabbedCard);
      } else {
        this.releaseCard(this.state.grabbedCard);
      }
    }

    if (!this.state.clicking) {
      this.state.mouseDownPosition = { x: undefined, y: undefined };
    }
  }

  private _onRender() {
    this._drawBackground();
    this.hand.drawHand();
    // this._drawDebug();


  }

  private _animate() {
    while (this.events.length > 0) {
      this._onEvent(this.events.pop());
    }
    this.onLoop();
    this._onRender();
    requestAnimationFrame(this._animate.bind(this));
  }

  public start() {
    this._init();
    if (this.running) {
      requestAnimationFrame(this._animate.bind(this));
    }
  }



  private _handleMouseDown(event: MouseEvent) {
    this.state.clicking = true;
    this.state.mouseDownPosition = { x: event.offsetX, y: event.offsetY };
  }

  private _handleMouseUp(event: MouseEvent) {
    this.state.clicking = false;
    this.state.mouseUpPosition = { x: event.offsetX, y: event.offsetY };
  }

  private _handleMouseMove(event: MouseEvent) {
    this.state.mouseLastPosition = { x: event.offsetX, y: event.offsetY }

    if (!this.state.clicking) {
      const _cards = [...this.hand.cards].reverse();
      let gotHover = false;
      _cards.forEach(card => {
        if (card.isHovering(event.offsetX, event.offsetY) && !gotHover) {
          // Set card to hoverCard
          this.setContextCursor('grab');
          this.state.hoverCard = card;
          gotHover = true;
        }
        card.state.hovering = false;
        return true
      })
    }
  }

  private _drawBackground() {
    let bgColor = 'rgb(230, 230, 230)';
    this.context.fillStyle = bgColor;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  public setContextCursor(cursor: string) {
    if (this.canvas.style.cursor !== cursor) {
      this.canvas.style.cursor = cursor;
    }
  }

  private _handleHoverCard(card: Card) {
    if (card && card === this.state.hoverCard) {
      // check if mouse is still hovering card
      const isStillHoveringCard = card.isHovering(
        this.state.mouseLastPosition.x,
        this.state.mouseLastPosition.y
      );

      if (isStillHoveringCard) {
        // mouse is still hovering card
        if (!this.state.clicking) {
          // Start hover animation on card
          this.state.hoverCard.state.hovering = true;
          if (card.state.inHand) {
            card.shake();
            card.offsetTop();
          }
        }
      } else {
        if (!this.state.clicking) {
          // not clicking and not hovering a card, set hoverCard to undefined
          this.state.hoverCard.state.hovering = false;
          this.state.hoverCard = undefined;
        }
      }
    }
  }
  public grabCard(card: Card) {
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
  }

  public releaseCard(card: Card) {
    console.log('releasing card')
    this.setContextCursor('grab');
    card.initialX = card.x;
    card.initialY = card.y;
    card.setState('grabbing', false);
    this.state.grabbedCard.setState('inHand', true);
    this.state.grabbedCard = undefined;
  }


  private _drawDebug() {

    this.context.fillStyle = 'orange';
    this.context.fillRect(this.state.mouseLastPosition.x, this.state.mouseLastPosition.y, 5, 5)

    const fontSize = 80;
    const fontFamily = 'Arial Black';
    const font = `${fontSize}px ${fontFamily}`;

    const x = 10;
    const y = this.canvas.height - fontSize - 10;
    const w = 60;

    let offset = x;
    // isClicking
    this.context.fillStyle = this.state.clicking ? 'green' : 'black';
    this.context.fillRect(offset, y, w, w);

    offset += w + 20;

    // isHovering
    this.context.fillStyle = !!this.state.hoverCard ? this.state.hoverCard.getColor() : 'black';
    this.context.fillRect(x + offset, y, w, w);


    offset += w + 20;
    // isGrabbing
    this.context.fillStyle = !!this.state.grabbedCard ? this.state.grabbedCard.getColor() : 'black';
    this.context.fillRect(x + offset, y, w, w);

  }


}