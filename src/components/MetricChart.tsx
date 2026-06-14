import { BarChart } from './ui';
import type { XYPoint } from '../types';

interface MetricChartProps {
  series: XYPoint[];
  color?: string;
  unit?: string;
  h?: number;
}

/** Progress metric chart. The locked config renders every progress chart
 *  (strength e1RM, weekly volume, bodyweight) as a bar chart. */
export function MetricChart({ series, color, unit, h = 180 }: MetricChartProps) {
  return <BarChart data={series.map((s) => ({ label: s.x, value: s.y }))} color={color} unit={unit} h={h} />;
}
