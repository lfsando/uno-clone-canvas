
class Card {
  ctx: CanvasRenderingContext2D
  config: CardConfigType
  color: string
  x: number
  y: number
  initialX: number
  initialY: number
  state: CardState
  offsetX: number
  offsetY: number

  private _width: number
  private _height: number
  private _borderWidth: number
  private _borderRadius: number
  private _cardFrontFace: CardFrontFace

  constructor(
    context: CanvasRenderingContext2D,
    config: CardConfigType,
    initialX: number,
    initialY: number
  ) {
    this.ctx = context;
    this._width = milimeterToPixel(57);
    this._height = milimeterToPixel(89);
    this.x = this.initialX = initialX;
    this.y = this.initialY = initialY;

    this.state = {
      animationRotationDirection: 1,
      shaking: false,
      movingTop: false,
      hovering: false,
      rotation: 0,
      sizeRatio: 1,
      frontFacing: true,
      grabbing: false,
      inHand: true
    };
    this._borderWidth = 18 * this.state.sizeRatio;
    this._borderRadius = 18 * this.state.sizeRatio;
    this.offsetX = 0;
    this.offsetY = 0;
    this.config = config;
    this._cardFrontFace = new CardFrontFace(this);
    this.color = this.getColor();
  }

  update = () => {
    if (this.state.shaking || this.state.rotation !== 0) {
      this._animateShake();
    }

    if (this.state.movingTop || this.y < this.initialY && !this.state.movingTop) {
      // if state is moving top or this.y is less than initialY while not hovering it
      this._animateMovingTop();
    }
    this._cardFrontFace.update();
  }

  draw = () => {

    roundedRect(this.ctx,
      this.x,
      this.y,
      this.getWidth(),
      this.getHeight(),
      this._borderRadius,
      this.color,
      'rgb(250, 250, 250)',
      this._borderWidth,
      true,
      this.state.rotation
    );

    this._cardFrontFace.draw();
    this.ctx.lineWidth = 3;
  }

  private _drawBoundingRect() {
    this.ctx.strokeStyle = this.state.grabbing ? 'green' : this.state.hovering ? 'magenta' : 'black';
    this.ctx.strokeRect(
      this.x,
      this.y,
      this.getWidth(),
      this.getHeight()
    );
  }

  public getWidth = () => ((this._width) * this.state.sizeRatio) - (this._borderWidth * 2);
  public getHeight = () => ((this._height) * this.state.sizeRatio) - (this._borderWidth * 2);
  public setPos(x: number, y: number) { this.x = this.initialX = x; this.y = this.initialY = y; };


  public shake() {
    if (this.state.shaking) return

    this.state.shaking = true;

    setTimeout(() => {
      this.state.shaking = false;
    }, 50);
  }

  public offsetTop() {
    if (this.state.movingTop) return
    this.state.movingTop = true;
    setTimeout(() => {
      this.state.movingTop = false;
    }, 250);
  }




  public setState(state: (keyof CardState), value: number | boolean) {
    this.state[state] = value;
  }

  public setSizeRatio(ratio: number) {
    if (ratio > 2.0) {
      ratio = 2.0;
    } else if (ratio < 0.3) {
      ratio = 0.5;
    }
    this.state.sizeRatio = ratio;
    this._borderWidth *= ratio;
    this._borderRadius *= ratio;
    return this.state.sizeRatio;
  }

  public isHovering(mouseX: number, mouseY: number): boolean {
    const leftBorder = this.x - this._borderRadius;
    const rightBorder = this.x + this.getWidth() + this._borderRadius;
    if (mouseX >= leftBorder && mouseX <= rightBorder) {
      const topBorder = this.y - this._borderRadius;
      const bottomBorder = this.y + this.getHeight() - this._borderRadius;
      if (mouseY >= topBorder && mouseY <= bottomBorder) {
        return true
      }

    }
    return false
  }


  getColor() {
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

  private _animateShake() {
    const range = 1;
    const speed = .5;
    if (
      this.state.rotation > range && this.state.animationRotationDirection > 0 ||
      this.state.rotation < -range && this.state.animationRotationDirection < 0
    ) {
      this.state.animationRotationDirection *= -1;
    }
    this.state.rotation += speed * this.state.animationRotationDirection;
    this.state.rotation = Number(this.state.rotation.toFixed(2));
  }

  private _animateMovingTop() {
    let range = 50 * this.state.sizeRatio;
    let speed = 20;
    if (this.state.movingTop) {
      if (this.y >= this.initialY - range) {
        this.y -= speed;
      }
    } else {
      speed = 20
      if (this.y <= this.initialY && !this.state.hovering) {
        this.y += speed;
      }
    }

  }



}