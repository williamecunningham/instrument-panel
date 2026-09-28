import { useState, useEffect } from 'react'

interface Sensor {
  name: string;
  value: number;
  unit: string;
}

interface GaugeProps {
  value: number;
  maxValue: number;
  label: string;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function Gauge({ value, maxValue, label }: GaugeProps) {
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const fraction = Math.min(value / maxValue, 1);
  const valueAngle = fraction * 360;

  return (
    <svg width={size} height={size}>
      <circle cx={center} cy={center} r={radius} stroke="#333" strokeWidth={12} fill="none" />
      <path
        d={describeArc(center, center, radius, 0, valueAngle)}
        stroke="#0f0"
        strokeWidth={12}
        fill="none"
      />
      <text x={center} y={center} textAnchor="middle" fill="#fff" fontSize={20}>
        {label}: {value}
      </text>
    </svg>
  );
}

function App() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  
  const maxValues: Record<string, number> = {
    Fuel: 100,
    RPM: 2500,
    "Oil Pressure": 50,
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = (event) => {
      const data: Sensor[] = JSON.parse(event.data);
      setSensors(data);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Instrument Panel</h1>
      {sensors.map(s => (
        <Gauge key={s.name} value={s.value} maxValue={maxValues[s.name]} label={s.name} />
      ))}
    </div>
  );
}

export default App