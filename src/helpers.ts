
const milimeterToPixel = (mm: number) => <number>(mm * 3.779527559);

const roundedRect = (
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
  rotation?: number
) => {

  context.save();
  if (rotation === undefined) rotation = 0;

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
}


const debounce = (func: Function, wait: number) => {
  let timeout: number;
  return function executedFunction(...args: any[]) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};


const _roundedRect = (
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
  rotation?: number
) => {

  if (rotation === undefined) rotation = Number((<HTMLInputElement>document.getElementById('rot')).value);
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
}
