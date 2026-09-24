interface Sensor {
  name: string;
  value: number;
  unit: string;
}

  const socket = new WebSocket("ws://localhost:3000");
function getCtx(id: string): CanvasRenderingContext2D {
  const canvas = document.getElementById(id);
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`Canvas #${id} not found`);
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error(`2D context not available for #${id}`);
  }
  return ctx;
}

function drawGauge(ctx:CanvasRenderingContext2D, value:number, maxValue:number, label:string) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = 80;

    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);

    // background arc (full circle, faint)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 12;
    ctx.stroke();

    // value arc (propotional to value/maxValue)
    const fraction = value / maxValue;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + fraction * Math.PI * 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = "#0f0";
    ctx.lineWidth = 12;
    ctx.stroke();

    // label + value text
    ctx.fillStyle = "#fff";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${label}: ${value}`, centerX, centerY + 5);
}

    socket.onopen = () => {
      console.log("Connected to server");
    };

    
    socket.onmessage = (event) => {
      const sensors: Sensor[] = JSON.parse(event.data);
      const ctxFuel = getCtx("fuelGauge");
      const ctxRPM = getCtx("rpmGauge");
      const ctxOil = getCtx("oilGauge");    
      const fuel = sensors.find(s=> s.name === "Fuel")
      const rpm = sensors.find(s=>s.name === "RPM")
      const pressure = sensors.find(s=>s.name === "Oil Pressure")
      if(fuel && rpm && pressure){
        drawGauge(ctxFuel, fuel.value, 100, "Fuel")
        drawGauge(ctxRPM, rpm.value, 2500, "RPM")
        drawGauge(ctxOil, pressure.value, 50, "Oil Pressure")
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from server");
    };