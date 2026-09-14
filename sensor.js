// Create and a Variable:
let fuelLevel = 100;
function tick(){
        fuelLevel = fuelLevel -= 2;
        console.log("Fuel: ", fuelLevel);
}
setInterval(tick, 1000);
