var Card = (function () {
    function Card(context, config, initialX, initialY) {
        var _this = this;
        this.update = function () {
            if (_this.state.shaking || _this.state.rotation !== 0) {
                _this._animateShake();
            }
            if (_this.state.movingTop || _this.y < _this.initialY && !_this.state.movingTop) {
                _this._animateMovingTop();
            }
            _this._cardFrontFace.update();
        };
        this.draw = function () {
            roundedRect(_this.ctx, _this.x, _this.y, _this.getWidth(), _this.getHeight(), _this._borderRadius, _this.color, 'rgb(250, 250, 250)', _this._borderWidth, true, _this.state.rotation);
            _this._cardFrontFace.draw();
            _this.ctx.lineWidth = 3;
        };
        this.getWidth = function () { return ((_this._width) * _this.state.sizeRatio) - (_this._borderWidth * 2); };
        this.getHeight = function () { return ((_this._height) * _this.state.sizeRatio) - (_this._borderWidth * 2); };
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
    Card.prototype._drawBoundingRect = function () {
        this.ctx.strokeStyle = this.state.grabbing ? 'green' : this.state.hovering ? 'magenta' : 'black';
        this.ctx.strokeRect(this.x, this.y, this.getWidth(), this.getHeight());
    };
    Card.prototype.setPos = function (x, y) { this.x = this.initialX = x; this.y = this.initialY = y; };
    ;
    Card.prototype.shake = function () {
        var _this = this;
        if (this.state.shaking)
            return;
        this.state.shaking = true;
        setTimeout(function () {
            _this.state.shaking = false;
        }, 50);
    };
    Card.prototype.offsetTop = function () {
        var _this = this;
        if (this.state.movingTop)
            return;
        this.state.movingTop = true;
        setTimeout(function () {
            _this.state.movingTop = false;
        }, 250);
    };
    Card.prototype.setState = function (state, value) {
        this.state[state] = value;
    };
    Card.prototype.setSizeRatio = function (ratio) {
        if (ratio > 2.0) {
            ratio = 2.0;
        }
        else if (ratio < 0.3) {
            ratio = 0.5;
        }
        this.state.sizeRatio = ratio;
        this._borderWidth *= ratio;
        this._borderRadius *= ratio;
        return this.state.sizeRatio;
    };
    Card.prototype.isHovering = function (mouseX, mouseY) {
        var leftBorder = this.x - this._borderRadius;
        var rightBorder = this.x + this.getWidth() + this._borderRadius;
        if (mouseX >= leftBorder && mouseX <= rightBorder) {
            var topBorder = this.y - this._borderRadius;
            var bottomBorder = this.y + this.getHeight() - this._borderRadius;
            if (mouseY >= topBorder && mouseY <= bottomBorder) {
                return true;
            }
        }
        return false;
    };
    Card.prototype.getColor = function () {
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
    };
    Card.prototype._animateShake = function () {
        var range = 1;
        var speed = .5;
        if (this.state.rotation > range && this.state.animationRotationDirection > 0 ||
            this.state.rotation < -range && this.state.animationRotationDirection < 0) {
            this.state.animationRotationDirection *= -1;
        }
        this.state.rotation += speed * this.state.animationRotationDirection;
        this.state.rotation = Number(this.state.rotation.toFixed(2));
    };
    Card.prototype._animateMovingTop = function () {
        var range = 50 * this.state.sizeRatio;
        var speed = 20;
        if (this.state.movingTop) {
            if (this.y >= this.initialY - range) {
                this.y -= speed;
            }
        }
        else {
            speed = 20;
            if (this.y <= this.initialY && !this.state.hovering) {
                this.y += speed;
            }
        }
    };
    return Card;
}());
//# sourceMappingURL=card.js.map