  
  
  
  var temperatureLabel= document.getElementById("tempValue");
  var humidityLabel= document.getElementById("humValue");
  const deviceName="Avocado1";
  const topicString ='avo1/sub';
  var avocadoData={};
  var temperatureAvocado=25,humidityAvocado=30,angleAvocado=0,moistureAvocado=30;

  var secondsTime=0;
var lastValidSeconds0= 0,lastValidSeconds1= 0,lastValidSeconds2= 0;

var anglePlant=0;

var onFocus=1;
document.addEventListener("visibilitychange", function (event) {
  if (document.hidden) {
     onFocus=0;
  }else{
    onFocus=1;
  }
});







function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

async function GetResponse(){
  // instantiate a headers object
  var myHeaders = new Headers();
  // add content type header to object
  myHeaders.append("Content-Type", "application/json");
//  myHeaders.append("Access-Control-Allow-Origin", "*");
  // using built in JSON utility package turn object to string and store in a variable
  // create a JSON object with parameters for API call and store in a variable

  var apiUrl="https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy" +"?seconds="+String(lastValidSeconds0) +"&device="+deviceName;
  console.log("last Seconds ",lastValidSeconds0 );
  let response = await fetch(apiUrl);
 // let response = await fetch("https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy");
  if (response.ok) { // if HTTP-status is 200-299
    // console.log("Response: ",response.text());  
      // get the response body (the method explained below)
    let json = await response.json();
    
    const body=json.body;
   // console.log("GOT", body);
      if (isEmpty(body)) {
        return;
      }
    // let pay=json.payload;
    avocadoData=body; 
  // console.log("Data: ", diverterData);
      await UpdateData();
  } else {
    alert("HTTP-Error: " + response.status);
  }

}

  async function callAPI(){
    var status={};
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
  //  myHeaders.append("Access-Control-Allow-Origin", "*");
    // using built in JSON utility package turn object to string and store in a variable
    var t= (new Date());
    secondsTime = (parseInt((t.getHours()*3600+t.getMinutes()*60+t.getSeconds())*1))%86400;
    
   
    var jsonMessage = JSON.stringify({"seconds":secondsTime,"topic":topicString});
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: jsonMessage,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
  const  request=  await fetch("https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy", requestOptions);
    if (request.ok) {
      console.log("POST :", secondsTime);
      lastValidSeconds0=lastValidSeconds1;
      lastValidSeconds1=secondsTime;
    //  lastValidSeconds2=secondsTime;
      await  GetResponse();
   
    
      }else{
        console.log("error POST", request.status);
      }
     // console.log("requests:", request);
      return request;

}
async function  UpdateData(){
  angleAvocado=1*avocadoData.ang/1;
  temperatureAvocado=avocadoData.tem;
  humidityAvocado=avocadoData.res;
  moistureAvocado=avocadoData.hum;
/*
  frequency= parseFloat(diverterData.M.tre.M.fre.N);
  phase= parseFloat(diverterData.M.tre.M.pha.N);
//     console.log(textValues[1]);
    // phase= parseFloat(diverterData.trebina.phase);
//     console.log(textValues[2]);
     tone= parseFloat(diverterData.M.tre.M.ton.N);

     inlet=parseInt(diverterData.M.div.M.co2.N);
      outlet=parseInt(diverterData.M.dif.M.co2.N);
      exhaust=parseInt(diverterData.M.sca.M.co2.N);
      iaq=parseInt(diverterData.M.dif.M.iaq.N);
      speedInlet=parseInt(diverterData.M.div.M.spe.N);
      speedOutlet=parseInt(diverterData.M.dif.M.spe.N);
      speedExhaust=parseInt(diverterData.M.sca.M.spe.N);
      */
      
}









































  setInterval( async  function ( ) {




    if (onFocus) {
      if(await callAPI().ok){
        console.log("angle: ",angleAvocado);
        console.log("temperature: ",temperatureAvocado);
        console.log("humidity: ",humidityAvocado);

  
      }else{

      }
      temperatureLabel.innerHTML=temperatureAvocado;
      const temperatureElement = document.querySelector('.wrapperThermometer');
      temperatureElement.style.setProperty('--temperature',temperatureAvocado);
  

  
      humidityLabel.innerHTML=humidityAvocado;
      const humidityElement = document.querySelector('.plantGroup');
      humidityElement.style.setProperty('--waterFilling',humidityAvocado+"%");
  
      const plantElement = document.querySelector('.grass');
      plantElement.style.setProperty('--angle',angleAvocado+"deg");
      console.log("angle: ",angleAvocado);
      console.log("temperature: ",temperatureAvocado);
      console.log("humidity: ",humidityAvocado);
      console.log("moisture: ",moistureAvocado);

    }

  
    
 

 

  }, 3000 ) ;