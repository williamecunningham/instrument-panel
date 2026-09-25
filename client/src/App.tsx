import { useState, useEffect } from 'react'

interface Sensor {
  name: string;
  value: number;
  unit: string;
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
      <pre>{JSON.stringify(sensors, null, 2)}</pre>
    </div>
  );
}

export default App