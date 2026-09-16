const sensors = [
  { name: "Fuel", value: 100, unit: "%" },
  { name: "RPM", value: 2400, unit: "rpm" },
  { name: "Oil Pressure", value: 45, unit: "psi" },
];

function getRandomReading(maxChange) {
  return Math.round((Math.random() * 2 - 1) * maxChange);
}

function readSensorAsync(name, sensorReading, delayMs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let value = 0;
      let maxChange = 100;
      if (name === "Fuel"){
        sensorReading -= 2;
        value = sensorReading;
      }
      if (name === "RPM"){
        value = sensorReading + getRandomReading(100);
      }
      if( name === "Oil Pressure"){
        value = sensorReading - getRandomReading(4);
      }
      resolve(value);
    }, delayMs);
  });
}

async function tick() {
  for (const s of sensors) {
    if (s.name === "Fuel") {
      if (s.value > 0) {
        s.value = await readSensorAsync("Fuel", s.value, 500);
      }
    }
    if (s.name === "RPM") {
      if (s.value > 0) {
        s.value = await readSensorAsync("RPM", s.value, 500);
      }
    }
    if (s.name === "Oil Pressure") {
      if (s.value > 0) {
        s.value = await readSensorAsync("Oil Pressure", s.value, 500);
      }
    }
    console.log(s.name, s.value, s.unit);
  }
  setTimeout(tick, 1000); // schedule the *next* run, only now
}

tick(); // kick off the first run
