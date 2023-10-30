const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=1;
const cars=generateCars(N);
let bestCar=cars[0];
// Mimic example of the neuron
localStorage.settem("bestBrain", '{"levels":[{"inputs":[0,0.5063430497109496,0.4555429498400463,0.26156786051147285,0.5261607272993847],"outputs":[0,1,1,1,1,0],"biases":[-0.4454135540874447,0.13215082423642743,-0.3359853980485038,0.2630980437533179,-0.40133581911927085,0.3877364605831146],"weights":[[0.43130984684932183,-0.25194466256493253,-0.16064244590690466,0.4797103883120736,-0.15944897842963465,0.5325708999951964],[-0.6438361855724744,0.12172480048509526,-0.14323591277186928,-0.022475536198108576,0.38551167111496343,-0.24746236775225258],[-0.5906933038209754,-0.19253423261218533,-0.2499320067403677,0.28274231465273125,-0.37570444990093654,0.22180941440657356],[-0.6872637193378173,0.6815893320206216,0.0054991401777915935,0.708697374748903,0.060997737658753465,-0.4042972288014857],[0.2203938797584198,0.15844552771602205,0.5266538070239414,0.18375208064351606,0.04240434593634032,0.5678150987960046]]},{"inputs":[0,1,1,1,1,0],"outputs":[1,0,1,0],"biases":[0.5343846043949058,-0.19099841791254538,0.08884998894416955,-0.3014079230642998],"weights":[[-0.30201510787413305,0.2951859364543764,-0.5813571450401956,-0.7742195550300115],[0.48069959843861726,-0.08856861565764945,-0.499224677619151,-0.4103305659474976],[0.250203666600316,0.09010980441960235,0.45211661271097825,-0.42821360970758804],[-0.2749097204385925,0.21697388741641485,0.2726801574875074,-0.3664558154094286],[0.662624926773608,-0.6431376215854514,0.4169260995055639,-0.40371858566382657],[0.5460739753850825,0.48855935220011604,0.473896776612439,0.027074480740230042]]}]}')
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(2),-500,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",1),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",1),
];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"#00cf9b");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"#236b01");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"#236b01",true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}
