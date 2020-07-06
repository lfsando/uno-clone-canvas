export const milimeterToPixel = (mm: number): number => mm * 3.779527559;

export const roundedRect = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: string,
    strokeColor: string,
    lineWidth: number,
    fill: boolean,
    rotation?: number,
): void => {
    context.save();
    let xPos = x;
    let yPos = y;
    let strokeWidth = lineWidth;

    if (rotation) {
        context.translate(x + width / 2, y + height / 2);
        context.rotate((rotation || 0 * Math.PI) / 180);

        context.fillStyle = 'blue';
        context.fillRect(0, 0, 2, 2);
        xPos = -width / 2;
        yPos = -height / 2;
    }

    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;

    if (fill) {
        strokeWidth *= 2;
    }

    context.lineWidth = strokeWidth;

    context.beginPath();
    context.moveTo(xPos + radius, yPos);
    context.quadraticCurveTo(xPos, yPos, xPos, yPos + radius);
    context.lineTo(xPos, yPos + height - radius);
    context.quadraticCurveTo(xPos, yPos + height, xPos + radius, yPos + height);
    context.lineTo(xPos + width - radius, yPos + height);
    context.quadraticCurveTo(xPos + width, yPos + height, xPos + width, yPos + height - radius);
    context.lineTo(xPos + width, yPos + radius);
    context.quadraticCurveTo(xPos + width, yPos, xPos + width - radius, yPos);
    context.closePath();
    context.stroke();
    if (fill) {
        context.fill();
    }
    context.restore();
};

export const debounce = (func: (...args: unknown[]) => unknown, wait: number): (() => unknown) => {
    let timeout: number;

    return function executedFunction(...args: unknown[]) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const getFont = (size: number, family: string): string => {
    return `${size}px ${family}`;
};
