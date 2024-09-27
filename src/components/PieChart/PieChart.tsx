import { useEffect, useRef } from 'react';

import { clearCanvas, scaleCanvas } from '@/utils';

export interface PieItemConfig {
  value: number;
  color: string;
}

export interface IPieChartProps {
  radius: number;
  data: PieItemConfig[];
}

const PieChart: React.FC<Readonly<IPieChartProps>> = (props) => {
  const { radius, data } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>();

  useEffect(() => {
    if (!ctxRef.current) {
      ctxRef.current = scaleCanvas(canvasRef.current!);

      clearCanvas(ctxRef.current);
    }

    const ctx = ctxRef.current;

    const circle = Math.PI * 2;

    const total = data.reduce((p, c) => p + c.value, 0);

    let ratio = 0;
    for (let i = 0; i < data.length; i++) {
      const sector = data[i];

      const nextRatio = circle * (sector.value / total || 0);

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, ratio, nextRatio);
      ctx.fillStyle = sector.color;
      ctx.fill();

      ratio = i === data.length - 1 ? circle : nextRatio;
    }
  }, [radius, data]);

  const size = radius * 2;

  return <canvas ref={canvasRef} width={size} height={size}></canvas>;
};

export default PieChart;
