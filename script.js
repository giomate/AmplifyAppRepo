

// Require JS

;

const gaugeElement = document.querySelector(".gauge");
var lastPeriod=0;
var reduction;
var gear,lastGear;
var powerON=1, frequency=8000, tone=1200, phase=30;
var secondsCounter=0,powerOnCounter=0;
var nextColor="rgb(0,255,0)";
var frequencyColor="rgb(0,255,0)";
var onFocus=1;
var co2Inlet=400, co2Outlet=400;
var diverterData={
  "diverter": {
    "co2Inlet": 1740
  },
  "diffusor": {
    "co2Outlet": 799
  },
  "trebina": {
    "frequency": 17622,
    "phase": 52
  }
};


const moonsun = document.getElementById('sunmoon');
const target = document.getElementById('target');
const sunColor='#fff'; 
const moonColor='#1C3236';

document.body.style.setProperty('--main-color', sunColor);

function SetFrequencyColor(){
  frequencyColor=nextColor;
  if (reduction>0){
    var R = parseInt(64 +63*(1-reduction));
    var G = parseInt(255*reduction);
    nextColor= "rgb(" + R + "," + G +",0)";
    console.log("Nextcolor ",nextColor);
  }else{
    nextColor= "rgb(64,128,0)";
  }
 
}


function setGaugeValue() {
  SetFrequencyColor();
  var f=(frequency-400)/(1*17600);

  gaugeElement.querySelector(".gauge__frequency").style.setProperty('--frequency-color', frequencyColor);
  gaugeElement.querySelector(".gauge__frequency").style.setProperty('--nextFrequency-color', nextColor);
  gaugeElement.querySelector(".gauge__frequency").style.transform = `rotate(${
    f/2
  }turn)`;
  //gaugeElement.querySelector(".gauge__frequency").classList.add("one");
  //gaugeElement.querySelector(".gauge__frequency").style.animationDuration = `1s`;
  //gaugeElement.querySelector(".gauge__frequency").style.animation = 'fadeBackground 1s ease-in-out 0s 1';
 // gaugeElement.querySelector(".gauge__frequency").style.animationPLayState= `running`; 
  
  var t=tone/170000;
  gaugeElement.querySelector(".gauge__tone").style.transform = `rotate(${
    (f/2+t)
  }turn)`;
  
      var  p = phase/120;
  gaugeElement.querySelector(".gauge__phase").style.transform = `rotate(${
    p / 2 
  }turn)`;
  gaugeElement.querySelector(".gauge__cover").textContent = `${Math.round(
    frequency
  )} MHz`;
}


/*

  var chartF = new Highcharts.chart('Frequency', {
    chart: {
      type: 'spline',
    //  backgroundColor: '#2CFFC0'
    },
    title: {
      text: 'Frequency Resonator'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { // don't display the dummy year
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Frequency (MHz)'
      },
     // min: 0
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b}: {point.y:.2f} ppm'
    },
  
    plotOptions: {
      series: {
        marker: {
          enabled: true
        }
      }
    },
     // Define the data points. All series have a dummy year
    // of 1970/71 in order to be compared on the same x axis. Note
    // that in JavaScript, months start at 0 for January, 1 for February etc.
    series: [
      {
      name: "Frequency",
      data: []
      }
   
    ],
  
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          plotOptions: {
            series: {
              marker: {
                radius: 2.5
              }
            }
          }
        }
      }]
    }
  });

  var chartP = new Highcharts.chart('Phase', {
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Phase diffrence Trebina I and Q'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { // don't display the dummy year
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Degrees (Â°)'
      },
     // min: 0
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b}: {point.y:.2f} ppm'
    },
  
    plotOptions: {
      series: {
        marker: {
          enabled: true
        }
      }
    },
     // Define the data points. All series have a dummy year
    // of 1970/71 in order to be compared on the same x axis. Note
    // that in JavaScript, months start at 0 for January, 1 for February etc.
    series: [
      {
      name: "Phase",
      data: []
      }     
    ],
  
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          plotOptions: {
            series: {
              marker: {
                radius: 2.5
              }
            }
          }
        }
      }]
    }
  });

  var chartT = new Highcharts.chart('Tone', {
    chart: {
      type: 'spline',
    //  backgroundColor: '#2CFFC0'
    },
    title: {
      text: 'Resonance tone'
    },
     xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { // don't display the dummy year
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Frequency Shift (Hz)'
      },
     // min: 0
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b}: {point.y:.2f} ppm'
    },
  
    plotOptions: {
      series: {
        marker: {
          enabled: true
        }
      }
    },
     // Define the data points. All series have a dummy year
    // of 1970/71 in order to be compared on the same x axis. Note
    // that in JavaScript, months start at 0 for January, 1 for February etc.
    series: [
      {
      name: "tone",
      data: []
      }
   
    ],
  
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          plotOptions: {
            series: {
              marker: {
                radius: 2.5
              }
            }
          }
        }
      }]
    }
  });

  function ToogleSunMoon(){
    target.classList.toggle('toggle');
    target.classList.toggle('sun');
    target.classList.toggle('moon');
    if(getComputedStyle(document.body).getPropertyValue('--main-color') == sunColor) {
      document.body.style.setProperty('--main-color', moonColor);
      chartT.update({
        chart: {
          
            backgroundColor: moonColor
        }
       
      });
      chartF.update({
        chart: {
          
            backgroundColor: moonColor
        }
       
      });
      chartP.update({
        chart: {
          
            backgroundColor: moonColor
        }
       
      });
        
  
    } else if(getComputedStyle(document.body).getPropertyValue('--main-color') == moonColor) {
      document.body.style.setProperty('--main-color', sunColor);
       chartT.update({
          chart: {
            
              backgroundColor: sunColor
             
          }
        
        });
        chartP.update({
          chart: {
            
              backgroundColor: sunColor
             
          }
        
        });
        chartF.update({
          chart: {
            
              backgroundColor: sunColor
          }
         
        });
     
        
    }
  }
  */
  document.addEventListener("visibilitychange", function (event) {
    if (document.hidden) {
       onFocus=0;
    }else{
      onFocus=1;
    }
 });


 async function GetResponse(){
  // instantiate a headers object
  var myHeaders = new Headers();
  // add content type header to object
  myHeaders.append("Content-Type", "application/json");
  // using built in JSON utility package turn object to string and store in a variable
  var raw = JSON.stringify({"message":"Where is the data?"});
  // create a JSON object with parameters for API call and store in a variable
  var requestOptions = {
      method: 'GET',
      headers: myHeaders
     // redirect: 'follow'
  };

  let response = await fetch("https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy");
  if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
   let json = await response.json();
   diverterData=json.payload;
 //  let t=diverterData.M;
    console.log("GET",diverterData);
    UpdateData();
  } else {
    alert("HTTP-Error: " + response.status);
  }
  // make API call with parameters and use promises to get response
  /*
  fetch("https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy")
  .then(response =>{
    response.text()
 //   console.log("GET", text);
  } )
 .then(result => console.log(JSON.parse(result).body))
  .catch(error => console.log('error', error));
  */
}
  async function callAPI(){
    var status={};
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({"message":"Hello from Webapp"});
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
  const  request=  await fetch("https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy", requestOptions);
    if (request.ok) {
      console.log("POST", request);

    await  GetResponse();
    }else{
      console.log("error POST", request.status);
    }
    	return request;
  /*.then(response =>{
      response.text();
      if (response.status==200) {
        console.log("POST", response);
       await  GetResponse();
      }
     */
   //   return response;
//      status=JSON.parse(response.text());
 //   } )
  //  .then(result => alert(JSON.parse(result).body))
  // .then(result => console.log("post", result))
   // .catch(error => console.log('error', error));
 //   console.log("post", request)
   // return request;
}
function  UpdateData(){

 // console.log("data: ",data);
 // var json=JSON.parse(data);
  //console.log("Json: ",json);
 // let t=json.trebina;
  //console.log("Json: ",diverterData.M);

  frequency= parseFloat(diverterData.M.trebina.M.frequency.N);
  phase= parseFloat(diverterData.M.trebina.M.phase.N);
//     console.log(textValues[1]);
    // phase= parseFloat(diverterData.trebina.phase);
//     console.log(textValues[2]);
     tone= parseFloat(diverterData.M.trebina.M.tone.N);

     co2Inlet=parseInt(diverterData.M.diverter.M.co2Inlet.N);
      co2Outlet=parseInt(diverterData.M.diffusor.M.co2Outlet.N);
}


  
  setInterval( async function ( ) {
    
 
    //   console.log(this.responseText);
     //   let textValues=(this.responseText).split(',');
        powerON= 1;
   //     console.log(textValues[0]);
  //  UpdateData();

        reduction=(co2Inlet-co2Outlet)/(1+co2Inlet);
        
        
     
        if ((frequency>300)&(phase>0)&(tone>0)) {
          var t = (new Date()).getTime();
        
       /*  
          if(chartF.series[0].data.length > 40) {
            chartF.series[0].addPoint([t, frequency], true, true, true);
          } else {
            chartF.series[0].addPoint([t, frequency], true, false, true);
          }
          if(chartP.series[0].data.length > 40) {
            chartP.series[0].addPoint([t, phase], true, true, true);
          } else {
            chartP.series[0].addPoint([t, phase], true, false, true);
          }
          if(chartT.series[0].data.length > 40) {
            chartT.series[0].addPoint([t, tone], true, true, true);
          } else {
            chartT.series[0].addPoint([t, tone], true, false, true);
          }
          */
          setGaugeValue();
          if (powerON>0) {         
            if(getComputedStyle(document.body).getPropertyValue('--main-color') == sunColor) {
                
                
            } else if(getComputedStyle(document.body).getPropertyValue('--main-color') == moonColor) {
              if (powerOnCounter<secondsCounter) {
                ToogleSunMoon();
              }
                
            }
          }else{
            if(getComputedStyle(document.body).getPropertyValue('--main-color') == sunColor) {
              if (powerOnCounter<secondsCounter) {
                ToogleSunMoon();
              }
            
                
            } else if(getComputedStyle(document.body).getPropertyValue('--main-color') == moonColor) {
            
                
            }
          }
        }
       
       
       //  if ((Math.abs(reduction)<2000)&(inlet>200)&(outlet>200)) {
       
        
        
     
        /*
        var t = (new Date()).getTime();
        var  x =  400+Math.random()*800;
        var  y =  400+Math.random()*800;
         var z =  400+Math.random()*800;
        //console.log(this.responseText);
        if(chartC.series[0].data.length > 40) {
          chartC.series[0].addPoint([t, x], true, true, true);
          chartC.series[1].addPoint([t, y], true, true, true);
          chartC.series[2].addPoint([t, z], true, true, true);
        } else {
          chartC.series[0].addPoint([t, x], true, false, true);
          chartC.series[1].addPoint([t,y], true, false, true);
          chartC.series[2].addPoint([t, z], true, false, true);
        }
        */
       
      

   
    secondsCounter++;
    if (onFocus) {
      if(await callAPI().status==200){
       // console.log("get",GetResponse().responseText)
      }
    }
 
 //   console.log("Seconds",secondsCounter);
  }, 1000 ) ;



