/**
 *
 * @description Scale the canvas to fit the screen ratio
 * @param canvas
 * @returns
 */
export const scaleCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')!;

  const w = canvas.width;
  const h = canvas.height;

  const ratio = window.devicePixelRatio || 1;
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.scale(ratio, ratio);

  return ctx;
};

/**
 *
 * @description clear the canvas content
 * @param ctx
 */
export const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};
