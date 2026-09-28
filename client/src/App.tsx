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

function Gauge({ value, maxValue, label }: GaugeProps) {
  return (
    <div>{label}: {value}</div>
  );
}

function App() {
  const [sensors, setSensors] = useState<Sensor[]>([]);

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
        <Gauge key={s.name} value={s.value} maxValue={100} label={s.name} />
      ))}
    </div>
  );
}

export default App