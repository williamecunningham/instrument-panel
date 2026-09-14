const sensors = [
        { name: "Fuel", value: 100, unit: "%" },
        { name: "RPM", value: 2400, unit: "rpm" },
        { name: "Oil Pressure", value: 45, unit: "psi" }
];

function readSensorAsync(name, delayMs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const value = Math.random() * 100;
      resolve(value);
    }, delayMs);
  });
}

async function tick(){
    for (const s of sensors) {
        if(s.name === 'Fuel') {
            s.value = await readSensorAsync("Fuel", 500);
        }
        if(s.name === 'RPM'){
            s.value = await readSensorAsync("RPM", 500);
        }
        if(s.name === "Oil Pressure"){
            s.value = await readSensorAsync("Oil Pressure", 500);
        }
        console.log(s.name, s.value, s.unit);

        }
    setTimeout(tick, 1000); // schedule the *next* run, only now
}

tick(); // kick off the first run}
