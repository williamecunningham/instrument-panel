const sensors = [
  { name: "Fuel", value: 100, unit: "%" },
  { name: "RPM", value: 2400, unit: "rpm" },
  { name: "Oil Pressure", value: 45, unit: "psi" },
];

function getRandomReading(currentValue, targetCenter, maxChange) {
  const jitter = (Math.random() * 2 - 1) * maxChange;
  const pullback = (targetCenter - currentValue) * 0.1;
  return Math.round(currentValue + jitter + pullback);
}

function readSensorAsync(name, sensorReading, delayMs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let value = 0;
      if (name === "Fuel"){
        sensorReading -= 2;
        value = sensorReading;
      }
      if (name === "RPM"){
        value = getRandomReading(sensorReading, 2400, 15);
      }
      if (name === "Oil Pressure"){
        value = getRandomReading(sensorReading, 45, 2);
      }
      resolve(value);
    }, delayMs);
  });
}

async function tick() {
  await Promise.all(
    sensors.map(async (s) => {
      if (s.value > 0) {
        s.value = await readSensorAsync(s.name, s.value, 500);
      }
    })
  );

  for (const s of sensors) {
    console.log(s.name, s.value, s.unit);
  }
  const fuel = sensors.find(sensor => sensor.name === "Fuel");
  if (fuel.value >0 ) {
  setTimeout(tick, 1000); // schedule the *next* run, only now
  }
}

tick(); // kick off the first run
