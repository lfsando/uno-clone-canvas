class Hand {
  ctx: CanvasRenderingContext2D
  cards: Card[]
  bottomMargin: number
  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
    this.cards = [];
    this.bottomMargin = 100;

  }

  initHand() {
    const c = this.ctx.canvas;
    if (this.cards.length > 0) {
      let xOffset = (c.width / this.cards.length) * 2;
      const overlap = .6;
      this.cards.forEach((card: Card, i: number) => {
        const x = xOffset;



        const y = c.height - 100 - card.getHeight() - (i * 0.9);
        card.setPos(x, y);
        xOffset += card.getWidth() - card.getWidth() * overlap;
      })
    }

  }

  addCard(card: Card): Card {
    this.cards.push(card);
    return card;
  }

  update() {
    this.cards.forEach(card => {
      card.update();
    });
  }

  drawHand() {
    this.cards.forEach(card => {
      card.draw();
    })
  }
}