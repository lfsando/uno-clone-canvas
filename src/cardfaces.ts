class CardFrontFace {
  ctx: CanvasRenderingContext2D
  card: Card
  private _fontSize: number
  private _fontFamily: string
  private _fontStrokeWidth: number
  constructor(card: Card) {
    this.card = card;
    this.ctx = card.ctx;

    this._fontSize = card.getHeight() / 2.5;
    this._fontFamily = 'Arial Black';
    this._fontStrokeWidth = 3 * this.card.state.sizeRatio;
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.card.x + this.card.getWidth() / 2, this.card.y + this.card.getHeight() / 2);
    this.ctx.rotate(this.card.state.rotation * Math.PI / 180);

    this._drawBackground();

    if (this.card.config.type === 'NUMBER') {
      this._drawNumber(this.card.config.value);
    }
    this.ctx.restore();
  }


  getX() {
    return this.card.x + this.card.getWidth() / 2;
  }

  getY() {
    return this.card.y + this.card.getHeight() / 2;
  }
  private _drawBackground() {

    if (this.card.config.type === 'NUMBER') {
      this.ctx.beginPath();
      this.ctx.lineWidth = 10;
      this.ctx.ellipse(0, 0, this.card.getWidth() - 80, this.card.getHeight() - 133, 15 * Math.PI / 180, 0, Math.PI * 2, false);
      this.ctx.strokeStyle = 'white';
      this.ctx.stroke();
    }
  }

  private _drawNumber(number: string | number) {
    if (typeof number === 'number') number = number.toString();
    const x = 0;
    const y = 0;
    const maxWidth = this.card.getWidth() / 2;
    const font = this._getFont(this._fontSize, this._fontFamily);

    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';

    this._drawText(number, font, x, y, maxWidth);

    if (number === '6' || number === '9') {
      const textWidth = this.ctx.measureText(number).width;
      this._drawBottomDash(
        x - textWidth / 2,
        y + this._fontSize / 3 + (2 * this.card.state.sizeRatio),
        textWidth,
        maxWidth,
        this._fontSize
      );
    }


    // Corner numbers
    const cornerFontSize = this._fontSize / 2 - 10
    const cornerFont = this._getFont(cornerFontSize, this._fontFamily)
    const topX = x - (this.card.getWidth() / 2) + cornerFontSize / 2;
    const topY = y - (this.card.getHeight() / 2) + cornerFontSize / 2 + 10;
    this._drawText(
      number,
      cornerFont,
      topX,
      topY,
      maxWidth / 2,
      5
    );

    const bottomX = x + (this.card.getWidth() / 2) - cornerFontSize / 2;
    const bottomY = y + (this.card.getHeight() / 2) - cornerFontSize / 2 - 10;
    this._drawText(
      number,
      cornerFont,
      bottomX,
      bottomY,
      maxWidth / 2,
      5
    );

    if (number === '6' || number === '9') {
      const sideTextWidth = this.ctx.measureText(number).width;
      this._drawBottomDash(
        topX - sideTextWidth / 2,
        topY + 5 + cornerFontSize / 4 + (2 * this.card.state.sizeRatio),
        sideTextWidth,
        maxWidth / 2,
        cornerFontSize,
        5
      );
      this._drawBottomDash(
        bottomX - sideTextWidth / 2,
        bottomY + 5 + cornerFontSize / 4 + (2 * this.card.state.sizeRatio),
        sideTextWidth,
        maxWidth / 2,
        cornerFontSize,
        5
      );
    }
  }

  update() {

  }

  private _getFont(size: number, family: string): string {
    return `${size}px ${family}`;
  }

  private _drawTextShadow(text: string, font: string, offset: number, x: number, y: number, maxWidth: number) {
    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'black';
    this.ctx.font = font;
    for (let i = 0; i < offset * this.card.state.sizeRatio; i++) {
      this.ctx.fillText(text, x - i, y + i / 2, maxWidth);
    }
  }

  private _drawText(text: string, font: string, x: number, y: number, maxWidth: number, shadowOffset: number = 10) {
    this._drawTextShadow(text, font, shadowOffset, x, y, maxWidth);
    this.ctx.font = font;
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = this._fontStrokeWidth;
    this.ctx.fillText(text, x, y, maxWidth);

    this.ctx.strokeText(text, x, y, maxWidth);

  }


  private _drawRectShadow(offset: number, x: number, y: number, width: number, fontSize: number) {
    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'black';
    for (let i = 0; i < offset * this.card.state.sizeRatio; i++) {
      this.ctx.fillRect(x - i, y + i, width, fontSize);
    }
  }

  private _drawBottomDash(x: number, y: number, width: number, maxWidth: number, fontSize: number, shadowOffset: number = 10) {
    let diff = 0;
    if (width > maxWidth) {
      diff = width - maxWidth;
      width = maxWidth
    }
    // draw dash shadow
    this.ctx.strokeRect(x + diff, y, width, fontSize / 6);
    this._drawRectShadow(shadowOffset, x + diff, y, width, fontSize / 6);

    //draw dash
    this.ctx.strokeStyle = 'black';
    this.ctx.fillStyle = 'white';
    const height = fontSize / 6;
    this.ctx.fillRect(x + diff, y, width, height);
    this.ctx.strokeRect(x + diff, y, width, height);
  }


}