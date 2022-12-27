


const gaugeElement = document.querySelector(".gauge");
var reductionLabel = document.getElementById("rp");
var iaqLabel= document.getElementById("iaqword");
const _fan = document.querySelector(".loader--default");
var lastPeriod=0;
var reduction;
var gear,lastGear;
var powerON=1, frequency=8000, tone=1200, phase=30;
var secondsCounter=0,powerOnCounter=0;
var nextColor="rgb(0,255,0)";
var frequencyColor="rgb(0,255,0)";
var onFocus=1;
var co2Inlet=400, co2Outlet=400;
var red=0,green=255,blue=0;
var iaq=50;
var diverterData={};
var speed=20;
var inlet=400,outlet=400,exhaust=400;
var secondsTime=0;
var lastValidSeconds0= 0,lastValidSeconds1= 0,lastValidSeconds2= 0;
var rawSeconds={};



const moonsun = document.getElementById('sunmoon');
const target = document.getElementById('target');
const sunColor='#fff'; 
const moonColor='#1C3236';

document.body.style.setProperty('--main-color', sunColor);








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
//  myHeaders.append("Access-Control-Allow-Origin", "*");
  // using built in JSON utility package turn object to string and store in a variable
  // create a JSON object with parameters for API call and store in a variable
  var requestOptions = {
      method: 'GET',
    //  headers: myHeaders,
     body: rawSeconds
     // redirect: 'follow'
  };
  var apiUrl="https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy" +"?seconds="+String(lastValidSeconds0);
  console.log("last Seconds ",lastValidSeconds0 );
  let response = await fetch(apiUrl);
 // let response = await fetch("https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy");
  if (response.ok) { // if HTTP-status is 200-299
    
    // get the response body (the method explained below)
   let json = await response.json();
   
   const body=json.body;
   console.log("GOT", body);

  // let pay=json.payload;
   diverterData=JSON.parse(body); 
 //  let t=diverterData.M;
 //   console.log("GOT",diverterData);
    await UpdateData(diverterData);
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
  //  myHeaders.append("Access-Control-Allow-Origin", "*");
    // using built in JSON utility package turn object to string and store in a variable
    var t= (new Date());
    secondsTime = (parseInt((t.getHours()*3600+t.getMinutes()*60+t.getSeconds())*1))%86400;
    rawSeconds = JSON.stringify({"seconds":secondsTime});
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: rawSeconds,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
  const  request=  await fetch("https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy", requestOptions);
    if (request.ok) {
      console.log("POST :", secondsTime);
      lastValidSeconds0=lastValidSeconds1;
      lastValidSeconds1=lastValidSeconds2;
      lastValidSeconds2=secondsTime;
      await  GetResponse();

    
      }else{
        console.log("error POST", request.status);
      }
    	return request;

}
async function  UpdateData(data){
 // console.log("frequency",data.M.trebina.M.frequency.N);


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
      speed=parseInt(diverterData.M.dif.M.spe.N);
      
}
function ParseIAQColor(iaq){
	if(iaq>0){
		if (iaq<50) {
			blue=64+ (50-iaq)*192/49 ; green=255- (50-iaq)*192/49;
			red=0;
      iaqLabel.innerHTML = "Excelent";

		} else if(iaq<256){
			green=255- (iaq-50)*255/205;
			red=(iaq-50)*255/205;
			blue=0;
        if (iaq<100) {
          iaqLabel.innerHTML = "Fine";
        } else if(iaq<150){
          iaqLabel.innerHTML = "Moderate";
        }else{
          iaqLabel.innerHTML = "Polluted";
        }
		}else{
			red=255;
			blue=(iaq-255)*255/245;
			green=0;
		}
	}
	return green;
}


var chartR = new Highcharts.chart('Reduction', {
  chart: {
    type: 'spline',
  //  backgroundColor: '#2CFFC0'
  },
  title: {
    text: 'Pollutans Reduction'
  },
  subtitle: {
    text: 'Porcentual reduction of pollutans'
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
      text: 'VOC Concentration (ppm)'
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
    name: "reduction",
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

var chartC = new Highcharts.chart('Sensors', {
  chart: {
    type: 'spline'
  },
  title: {
    text: 'VOC Concentration'
  },
  subtitle: {
    text: 'Volatile Organic Compounds  at the test points'
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
      text: 'CO2 Concentration (ppm)'
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
    name: "Outlet",
    color: '#003fff',
    data: []
    },
    {
      name: "Inlet",
      color: '#3f1f00',
      data: []

    },      
    {
      name: "Exhaust",
      color: '#bf3f00',
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


function SetReductionColor(sp) {

  //console.log("value ", value);
  frequencyColor=nextColor;

  reductionLabel.innerHTML = parseInt(iaq>0?iaq:50);
   nextColor= "rgb("+red+","+green+","+blue+")";
//  console.log("NextColor ", nextColor);
 _fan.style.setProperty('--nextColor',nextColor);
 _fan.style.setProperty('--frequencyColor',frequencyColor);
 
  var s=(12 -parseInt(sp*11/40))*0.2;
  //s=0.1;
   period=s+"s";
  if(period==lastPeriod){
    
  }else{
     _fan.style.setProperty('--periodRotation',period);
    lastPeriod=period;
  }
 
  console.log("Speed ", period);
  
}

function SetCharts(){
  let reduction=(inlet-outlet)*speed/100;
  if ((inlet>300)&(outlet>300)&(exhaust>300)) {
    var t = (new Date()).getTime();
  
    if(chartC.series[0].data.length > 40) {
      chartC.series[0].addPoint([t, outlet], true, true, true);
      chartC.series[1].addPoint([t, inlet], true, true, true);
      chartC.series[2].addPoint([t, exhaust], true, true, true);
    } else {
      chartC.series[0].addPoint([t, outlet], true, false, true);
      chartC.series[1].addPoint([t, inlet], true, false, true);
      chartC.series[2].addPoint([t, exhaust], true, false, true);
    }
    if(chartR.series[0].data.length > 40) {
      chartR.series[0].addPoint([t, reduction>0?reduction:0], true, true, true);
    } else {
      chartR.series[0].addPoint([t, reduction>0?reduction:0], true, false, true);
    }
  }

}
  
  setInterval( async function ( ) {

    ParseIAQColor(iaq)
    SetReductionColor(speed);
    SetCharts()
 
 
    secondsCounter++;
    if (onFocus) {
      if(await callAPI().status==200){
       // console.log("get",GetResponse().responseText)
      }
    }
 
 //   console.log("Seconds",secondsCounter);
  }, 1200 ) ;

  function ToogleSunMoon(){
    target.classList.toggle('toggle');
    target.classList.toggle('sun');
    target.classList.toggle('moon');
    if(getComputedStyle(document.body).getPropertyValue('--main-color') == sunColor) {
      document.body.style.setProperty('--main-color', moonColor);
      chartR.update({
        chart: {
          
            backgroundColor: moonColor
        }
       
      });
      chartC.update({
        chart: {
          
            backgroundColor: moonColor
        }
       
      });
        
  
    } else if(getComputedStyle(document.body).getPropertyValue('--main-color') == moonColor) {
      document.body.style.setProperty('--main-color', sunColor);
       chartR.update({
          chart: {
            
              backgroundColor: sunColor
             
          }
        
        });
        chartC.update({
          chart: {
            
              backgroundColor: sunColor
             
          }
        
        });
     
        
    }
  }

  moonsun.addEventListener('click', () => {
    ToogleSunMoon()
   
    powerOnCounter=secondsCounter+3;
  });



