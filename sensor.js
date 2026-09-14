const sensors = [
        { name: "Fuel", value: 100, unit: "%" },
        { name: "RPM", value: 2400, unit: "rpm" },
        { name: "Oil Pressure", value: 45, unit: "psi" }
];


function tick(){
        for (const s of sensors) {
                if(s.name == 'Fuel') {
                        s.value -= 2
                        if(s.value <= 0){
                                clearInterval(timerId);}
                }
                if(s.name == 'RPM'){
                        if(s.value <= 2500 && s.value >= 2200){
                                s.value -=5}
                        else if (s.value <= 2200){
                                s.value +=2}}
                if(s.name == "Oil Pressure"){
                                {s.value -= 1}}
                console.log(s.name, s.value, s.unit);

        }
}
const timerId = setInterval(tick, 1000);
