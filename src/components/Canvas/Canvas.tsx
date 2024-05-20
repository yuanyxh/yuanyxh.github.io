import { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react';

interface ICanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {}

type ExposeKeys = 'beginPath' | 'moveTo' | 'arc' | 'fillText' | 'stroke' | 'lineTo';

export interface CanvasInstance extends Pick<CanvasRenderingContext2D, ExposeKeys> {
  fill(fillRule?: CanvasFillRule): void;
  lineWidth(lineWidth?: number): number;
  fillStyle(
    fillStyle?: string | CanvasGradient | CanvasPattern
  ): string | CanvasGradient | CanvasPattern;
  strokeStyle(
    strokeStyle?: string | CanvasGradient | CanvasPattern
  ): string | CanvasGradient | CanvasPattern;
  font(font?: string): string;
  textAlign(textAlign?: CanvasTextAlign): CanvasTextAlign;
  width(width?: number): number;
  height(height?: number): number;
}

export default memo(
  forwardRef<CanvasInstance, ICanvasProps>(function Canvas(props, ref) {
    const { ...rest } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D>();

    useEffect(() => {
      ctxRef.current = canvasRef.current!.getContext('2d')!;

      const w = canvasRef.current!.width;
      const h = canvasRef.current!.height;

      const ratio = window.devicePixelRatio || 1;
      canvasRef.current!.width = w * ratio;
      canvasRef.current!.height = h * ratio;
      canvasRef.current!.style.width = `${w}px`;
      canvasRef.current!.style.height = `${h}px`;

      ctxRef.current.imageSmoothingEnabled = true;
      ctxRef.current.imageSmoothingQuality = 'high';
      ctxRef.current.scale(ratio, ratio);
    }, []);

    useImperativeHandle(ref, () => ({
      beginPath: (...args) => ctxRef.current!.beginPath(...args),
      moveTo: (...args) => ctxRef.current!.moveTo(...args),
      arc: (...args) => ctxRef.current!.arc(...args),
      fill: (fillRule?: CanvasFillRule) => ctxRef.current!.fill(fillRule),
      fillText: (...args) => ctxRef.current!.fillText(...args),
      stroke: () => ctxRef.current!.stroke(),
      strokeStyle: (strokeStyle) => {
        if (strokeStyle === undefined) return ctxRef.current!.strokeStyle;
        ctxRef.current!.strokeStyle = strokeStyle;
        return ctxRef.current!.strokeStyle;
      },
      lineTo: (...args) => ctxRef.current!.lineTo(...args),
      lineWidth: (lineWidth) => {
        if (lineWidth === undefined) return ctxRef.current!.lineWidth;
        ctxRef.current!.lineWidth = lineWidth;
        return ctxRef.current!.lineWidth;
      },
      fillStyle: (fillStyle) => {
        if (fillStyle === undefined) return ctxRef.current!.fillStyle;
        ctxRef.current!.fillStyle = fillStyle;
        return ctxRef.current!.fillStyle;
      },
      font: (font) => {
        if (font === undefined) return ctxRef.current!.font;
        ctxRef.current!.font = font;
        return ctxRef.current!.font;
      },
      textAlign: (textAlign) => {
        if (textAlign === undefined) return ctxRef.current!.textAlign;
        ctxRef.current!.textAlign = textAlign;
        return ctxRef.current!.textAlign;
      },
      width(width) {
        if (width === undefined) return canvasRef.current!.width;
        canvasRef.current!.width = width;
        return canvasRef.current!.width;
      },
      height(height) {
        if (height === undefined) return canvasRef.current!.height;
        canvasRef.current!.height = height;
        return canvasRef.current!.height;
      }
    }));

    return <canvas ref={canvasRef} {...rest}></canvas>;
  })
);
