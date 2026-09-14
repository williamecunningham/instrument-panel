// Create and a Variable:
let fuelLevel = 100;

function tick(){
        fuelLevel -= 2;
        if(fuelLevel <= 0){
                clearInterval(timerId);
        }
        console.log(`Fuel: ${fuelLevel}`);      
}
const timerId = setInterval(tick, 1000);
