
var secondsTime=0;
var lastValidSeconds0= 0,lastValidSeconds1= 0,lastValidSeconds2= 0;
export var diverterData={};

export async function callAPI(){
  
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
     const reply= await  GetResponse();
      return reply;
      
      }else{
        console.log("error POST", request.status);
      }
      return request;
    	

}
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
    

   let json = await response.json();
   
   const body=json.body;
   console.log("GOT", body);


   diverterD=JSON.parse(body); 

 
  } else {
    alert("HTTP-Error: " + response.status);
  }


}


