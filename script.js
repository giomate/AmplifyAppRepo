  
  
  
  var temperatureLabel= document.getElementById("tempValue");
  var humidityLabel= document.getElementById("humValue");
var anglePlant=0;

  setInterval(  function ( ) {

    anglePlant+=(Math.random()*2)-1;
  
    var t= parseInt(10+Math.random()*40);

    temperatureLabel.innerHTML=t;
    const temperatureElement = document.querySelector('.wrapperThermometer');
    temperatureElement.style.setProperty('--temperature',t);

    var h= parseInt(10+Math.random()*90);

    humidityLabel.innerHTML=h;
    const humidityElement = document.querySelector('.humidityGroup');
    humidityElement.style.setProperty('--waterFilling',h+"%");

    const plantElement = document.querySelector('.grass');
    plantElement.style.setProperty('--angle',anglePlant+"deg");
    
 

 
    console.log("Angle: ",anglePlant);
  }, 3000 ) ;