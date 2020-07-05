var Hand = (function () {
    function Hand(context) {
        this.ctx = context;
        this.cards = [];
        this.bottomMargin = 100;
    }
    Hand.prototype.initHand = function () {
        var c = this.ctx.canvas;
        if (this.cards.length > 0) {
            var xOffset_1 = (c.width / this.cards.length) * 2;
            var overlap_1 = .6;
            this.cards.forEach(function (card, i) {
                var x = xOffset_1;
                var y = c.height - 100 - card.getHeight() - (i * 0.9);
                card.setPos(x, y);
                xOffset_1 += card.getWidth() - card.getWidth() * overlap_1;
            });
        }
    };
    Hand.prototype.addCard = function (card) {
        this.cards.push(card);
        return card;
    };
    Hand.prototype.update = function () {
        this.cards.forEach(function (card) {
            card.update();
        });
    };
    Hand.prototype.drawHand = function () {
        this.cards.forEach(function (card) {
            card.draw();
        });
    };
    return Hand;
}());
//# sourceMappingURL=hand.js.map