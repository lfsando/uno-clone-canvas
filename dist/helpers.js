var milimeterToPixel = function (mm) { return (mm * 3.779527559); };
var roundedRect = function (context, x, y, width, height, radius, fillColor, strokeColor, lineWidth, fill, rotation) {
    context.save();
    if (rotation === undefined)
        rotation = 0;
    if (rotation) {
        context.translate(x + width / 2, y + height / 2);
        context.rotate(rotation * Math.PI / 180);
        context.fillStyle = 'blue';
        context.fillRect(0, 0, 2, 2);
        x = -width / 2;
        y = -height / 2;
    }
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;
    if (fill) {
        lineWidth *= 2;
    }
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(x + radius, y);
    context.quadraticCurveTo(x, y, x, y + radius);
    context.lineTo(x, y + height - radius);
    context.quadraticCurveTo(x, y + height, x + radius, y + height);
    context.lineTo(x + width - radius, y + height);
    context.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    context.lineTo(x + width, y + radius);
    context.quadraticCurveTo(x + width, y, x + width - radius, y);
    context.closePath();
    context.stroke();
    if (fill) {
        context.fill();
    }
    context.restore();
};
var debounce = function (func, wait) {
    var timeout;
    return function executedFunction() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var later = function () {
            timeout = null;
            func.apply(void 0, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
var _roundedRect = function (context, x, y, width, height, radius, fillColor, strokeColor, lineWidth, fill, rotation) {
    if (rotation === undefined)
        rotation = Number(document.getElementById('rot').value);
    context.save();
    context.translate(x, y);
    if (rotation) {
        context.fillStyle = 'blue';
        context.fillRect(5, 5, 10, 10);
        context.rotate(rotation * Math.PI / 180);
    }
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;
    if (fill) {
        lineWidth *= 2;
    }
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(x + radius, y);
    context.quadraticCurveTo(x, y, x, y + radius);
    context.lineTo(x, y + height - radius);
    context.quadraticCurveTo(x, y + height, x + radius, y + height);
    context.lineTo(x + width - radius, y + height);
    context.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    context.lineTo(x + width, y + radius);
    context.quadraticCurveTo(x + width, y, x + width - radius, y);
    context.closePath();
    context.stroke();
    if (fill) {
        context.fill();
        context.fillStyle = 'black';
        context.fill();
    }
    context.restore();
};
//# sourceMappingURL=helpers.js.map