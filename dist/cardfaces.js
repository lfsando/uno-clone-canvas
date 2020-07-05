var CardFrontFace = (function () {
    function CardFrontFace(card) {
        this.card = card;
        this.ctx = card.ctx;
        this._fontSize = card.getHeight() / 2.5;
        this._fontFamily = 'Arial Black';
        this._fontStrokeWidth = 3 * this.card.state.sizeRatio;
    }
    CardFrontFace.prototype.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.card.x + this.card.getWidth() / 2, this.card.y + this.card.getHeight() / 2);
        this.ctx.rotate(this.card.state.rotation * Math.PI / 180);
        this._drawBackground();
        if (this.card.config.type === 'NUMBER') {
            this._drawNumber(this.card.config.value);
        }
        this.ctx.restore();
    };
    CardFrontFace.prototype.getX = function () {
        return this.card.x + this.card.getWidth() / 2;
    };
    CardFrontFace.prototype.getY = function () {
        return this.card.y + this.card.getHeight() / 2;
    };
    CardFrontFace.prototype._drawBackground = function () {
        if (this.card.config.type === 'NUMBER') {
            this.ctx.beginPath();
            this.ctx.lineWidth = 10;
            this.ctx.ellipse(0, 0, this.card.getWidth() - 80, this.card.getHeight() - 133, 15 * Math.PI / 180, 0, Math.PI * 2, false);
            this.ctx.strokeStyle = 'white';
            this.ctx.stroke();
        }
    };
    CardFrontFace.prototype._drawNumber = function (number) {
        if (typeof number === 'number')
            number = number.toString();
        var x = 0;
        var y = 0;
        var maxWidth = this.card.getWidth() / 2;
        var font = this._getFont(this._fontSize, this._fontFamily);
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this._drawText(number, font, x, y, maxWidth);
        if (number === '6' || number === '9') {
            var textWidth = this.ctx.measureText(number).width;
            this._drawBottomDash(x - textWidth / 2, y + this._fontSize / 3 + (2 * this.card.state.sizeRatio), textWidth, maxWidth, this._fontSize);
        }
        var cornerFontSize = this._fontSize / 2 - 10;
        var cornerFont = this._getFont(cornerFontSize, this._fontFamily);
        var topX = x - (this.card.getWidth() / 2) + cornerFontSize / 2;
        var topY = y - (this.card.getHeight() / 2) + cornerFontSize / 2 + 10;
        this._drawText(number, cornerFont, topX, topY, maxWidth / 2, 5);
        var bottomX = x + (this.card.getWidth() / 2) - cornerFontSize / 2;
        var bottomY = y + (this.card.getHeight() / 2) - cornerFontSize / 2 - 10;
        this._drawText(number, cornerFont, bottomX, bottomY, maxWidth / 2, 5);
        if (number === '6' || number === '9') {
            var sideTextWidth = this.ctx.measureText(number).width;
            this._drawBottomDash(topX - sideTextWidth / 2, topY + 5 + cornerFontSize / 4 + (2 * this.card.state.sizeRatio), sideTextWidth, maxWidth / 2, cornerFontSize, 5);
            this._drawBottomDash(bottomX - sideTextWidth / 2, bottomY + 5 + cornerFontSize / 4 + (2 * this.card.state.sizeRatio), sideTextWidth, maxWidth / 2, cornerFontSize, 5);
        }
    };
    CardFrontFace.prototype.update = function () {
    };
    CardFrontFace.prototype._getFont = function (size, family) {
        return size + "px " + family;
    };
    CardFrontFace.prototype._drawTextShadow = function (text, font, offset, x, y, maxWidth) {
        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'black';
        this.ctx.font = font;
        for (var i = 0; i < offset * this.card.state.sizeRatio; i++) {
            this.ctx.fillText(text, x - i, y + i / 2, maxWidth);
        }
    };
    CardFrontFace.prototype._drawText = function (text, font, x, y, maxWidth, shadowOffset) {
        if (shadowOffset === void 0) { shadowOffset = 10; }
        this._drawTextShadow(text, font, shadowOffset, x, y, maxWidth);
        this.ctx.font = font;
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = this._fontStrokeWidth;
        this.ctx.fillText(text, x, y, maxWidth);
        this.ctx.strokeText(text, x, y, maxWidth);
    };
    CardFrontFace.prototype._drawRectShadow = function (offset, x, y, width, fontSize) {
        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'black';
        for (var i = 0; i < offset * this.card.state.sizeRatio; i++) {
            this.ctx.fillRect(x - i, y + i, width, fontSize);
        }
    };
    CardFrontFace.prototype._drawBottomDash = function (x, y, width, maxWidth, fontSize, shadowOffset) {
        if (shadowOffset === void 0) { shadowOffset = 10; }
        var diff = 0;
        if (width > maxWidth) {
            diff = width - maxWidth;
            width = maxWidth;
        }
        this.ctx.strokeRect(x + diff, y, width, fontSize / 6);
        this._drawRectShadow(shadowOffset, x + diff, y, width, fontSize / 6);
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = 'white';
        var height = fontSize / 6;
        this.ctx.fillRect(x + diff, y, width, height);
        this.ctx.strokeRect(x + diff, y, width, height);
    };
    return CardFrontFace;
}());
//# sourceMappingURL=cardfaces.js.map