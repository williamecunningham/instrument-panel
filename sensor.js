// Create and a Variable:
let fuelLevel = 100;
function setInterval(fuelLevel, ms){
        fuelLevel = fuelLevel -= ms;
        console.log("Fuel: ", fuelLevel);
}
setInterval(fuelLevel, 2);
