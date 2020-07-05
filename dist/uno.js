var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Uno = (function () {
    function Uno() {
        this.canvas = document.getElementById('uno');
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
            clicking: false
        };
        this.events = [];
        this.running = false;
        this.cards = [];
        this.gameConfig = {
            nCards: 108
        };
        this.hand = undefined;
    }
    Uno.prototype._init = function () {
        window.addEventListener('mousemove', this._handleMouseMove.bind(this), false);
        window.addEventListener('mousedown', this._handleMouseDown.bind(this), false);
        window.addEventListener('mouseup', this._handleMouseUp.bind(this), false);
        this.hand = new Hand(this.context);
        var colors = Object.keys(CardColorEnum).filter(function (k) { return !parseInt(k) && parseInt(k) !== 0; });
        var types = '';
        for (var i = 0; i < 20; i++) {
            var colorIndex = Math.floor(Math.random() * colors.length);
            var card = new Card(this.context, {
                color: (colors[colorIndex]),
                type: 'NUMBER',
                value: Math.floor(Math.random() * 10)
            }, 0, 0);
            this.hand.addCard(card);
        }
        this.hand.initHand();
        this.running = true;
    };
    Uno.prototype._onEvent = function (event) {
    };
    Uno.prototype.onLoop = function () {
        this.hand.update();
        this._handleHoverCard(this.state.hoverCard);
        if (this.state.hoverCard) {
            if (this.state.clicking) {
                this.grabCard(this.state.hoverCard);
            }
            else if (this.state.grabbedCard) {
                this.releaseCard(this.state.grabbedCard);
            }
        }
        else {
            if (!this.state.clicking) {
                this.setContextCursor('initial');
                if (this.state.hoverCard) {
                    this.state.hoverCard = undefined;
                }
            }
        }
        if (this.state.grabbedCard) {
            if (this.state.clicking) {
                this.grabCard(this.state.grabbedCard);
            }
            else {
                this.releaseCard(this.state.grabbedCard);
            }
        }
        if (!this.state.clicking) {
            this.state.mouseDownPosition = { x: undefined, y: undefined };
        }
    };
    Uno.prototype._onRender = function () {
        this._drawBackground();
        this.hand.drawHand();
    };
    Uno.prototype._animate = function () {
        while (this.events.length > 0) {
            this._onEvent(this.events.pop());
        }
        this.onLoop();
        this._onRender();
        requestAnimationFrame(this._animate.bind(this));
    };
    Uno.prototype.start = function () {
        this._init();
        if (this.running) {
            requestAnimationFrame(this._animate.bind(this));
        }
    };
    Uno.prototype._handleMouseDown = function (event) {
        this.state.clicking = true;
        this.state.mouseDownPosition = { x: event.offsetX, y: event.offsetY };
    };
    Uno.prototype._handleMouseUp = function (event) {
        this.state.clicking = false;
        this.state.mouseUpPosition = { x: event.offsetX, y: event.offsetY };
    };
    Uno.prototype._handleMouseMove = function (event) {
        var _this = this;
        this.state.mouseLastPosition = { x: event.offsetX, y: event.offsetY };
        if (!this.state.clicking) {
            var _cards = __spreadArrays(this.hand.cards).reverse();
            var gotHover_1 = false;
            _cards.forEach(function (card) {
                if (card.isHovering(event.offsetX, event.offsetY) && !gotHover_1) {
                    _this.setContextCursor('grab');
                    _this.state.hoverCard = card;
                    gotHover_1 = true;
                }
                card.state.hovering = false;
                return true;
            });
        }
    };
    Uno.prototype._drawBackground = function () {
        var bgColor = 'rgb(230, 230, 230)';
        this.context.fillStyle = bgColor;
        this.context.fillRect(0, 0, this.width, this.height);
    };
    Uno.prototype.setContextCursor = function (cursor) {
        if (this.canvas.style.cursor !== cursor) {
            this.canvas.style.cursor = cursor;
        }
    };
    Uno.prototype._handleHoverCard = function (card) {
        if (card && card === this.state.hoverCard) {
            var isStillHoveringCard = card.isHovering(this.state.mouseLastPosition.x, this.state.mouseLastPosition.y);
            if (isStillHoveringCard) {
                if (!this.state.clicking) {
                    this.state.hoverCard.state.hovering = true;
                    if (card.state.inHand) {
                        card.shake();
                        card.offsetTop();
                    }
                }
            }
            else {
                if (!this.state.clicking) {
                    this.state.hoverCard.state.hovering = false;
                    this.state.hoverCard = undefined;
                }
            }
        }
    };
    Uno.prototype.grabCard = function (card) {
        if (!this.state.grabbedCard) {
            this.setContextCursor('grabbing');
            card.setState('grabbing', true);
            this.state.grabbedCard = card;
            this.state.grabbedCard.setState('inHand', false);
        }
        var offsetX = this.state.mouseDownPosition.x - card.initialX;
        var offsetY = this.state.mouseDownPosition.y - card.initialY;
        card.x = Number((this.state.mouseLastPosition.x - offsetX).toFixed(3));
        card.y = Number((this.state.mouseLastPosition.y - offsetY).toFixed(3));
    };
    Uno.prototype.releaseCard = function (card) {
        console.log('releasing card');
        this.setContextCursor('grab');
        card.initialX = card.x;
        card.initialY = card.y;
        card.setState('grabbing', false);
        this.state.grabbedCard.setState('inHand', true);
        this.state.grabbedCard = undefined;
    };
    Uno.prototype._drawDebug = function () {
        this.context.fillStyle = 'orange';
        this.context.fillRect(this.state.mouseLastPosition.x, this.state.mouseLastPosition.y, 5, 5);
        var fontSize = 80;
        var fontFamily = 'Arial Black';
        var font = fontSize + "px " + fontFamily;
        var x = 10;
        var y = this.canvas.height - fontSize - 10;
        var w = 60;
        var offset = x;
        this.context.fillStyle = this.state.clicking ? 'green' : 'black';
        this.context.fillRect(offset, y, w, w);
        offset += w + 20;
        this.context.fillStyle = !!this.state.hoverCard ? this.state.hoverCard.getColor() : 'black';
        this.context.fillRect(x + offset, y, w, w);
        offset += w + 20;
        this.context.fillStyle = !!this.state.grabbedCard ? this.state.grabbedCard.getColor() : 'black';
        this.context.fillRect(x + offset, y, w, w);
    };
    return Uno;
}());
//# sourceMappingURL=uno.js.map