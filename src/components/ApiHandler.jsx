import React, {useEffect, useState,useRef} from 'react';

var temperatureAvocado=25,humidityAvocado=30,angleAvocado=0,moistureAvocado=30;
var lastValidSeconds0= 0,lastValidSeconds1= 0,lastValidSeconds2= 0;
const deviceName="Avocado1";
var secondsTime=0;
const topicString ='avo1/sub';
const apiURL="https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy"
let hf=false;

var avocadoData={};

function SendRequest(){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
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
    hf=false;
  // const [data, SetData] = useState([]);
   // const [sent, SetSent] = useState(false);
   const [apiData, setApiData] = useState();
 //  const [hasFetchedData, Setfetched] = useState(false);
   const hasFetchedData = useRef(false);
  // let hasFetchedData = false;
    /*
    const PostRequest= async () =>{
        try{
            const response=await fetch("https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy", requestOptions);
            const json = await response.json();
            SetData(response);
           console.log(response);
          // console.log(json)
        }   catch (error) {
            console.log("error");
            console.error(error);
        } finally {
            SetSent(data.ok);
          //  console.log(data)
        }
    };
    */
  /*
    const PostRequest=  () =>{
        let dataP=[]
        try{
            fetch("https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy", requestOptions)
            .then(response => {
             //   SetData(response);
               // console.log(response);
               dataP=response;;
            }); 
           
          // console.log(json)
        }   catch (error) {
            console.log("error");
            console.error(error);
        } finally {
         //   SetSent(data.ok);
           console.log(dataP)

           
        }
        return dataP;
    };
    */
    useEffect(() => {
        async function fetchData() {
            try {
               await fetch("https://e4a8sq7bka.execute-api.eu-central-1.amazonaws.com/Deploy", requestOptions)
           
              .then(response => response.json())
              .then(data => setApiData(data));
            } catch (e) {
              console.error('Error fetching api data', e);
            };
          };
          if (hasFetchedData.current == false) {
            hasFetchedData.current=true
            hf=true
            fetchData();
          }
      }, [hasFetchedData.current]);
      
      console.log(hasFetchedData,hf);
    return apiData;
}
function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
  
    return true;
  }

async function  UpdateData(){
    angleAvocado=1*avocadoData.ang/1;
    temperatureAvocado=avocadoData.tem;
    
    humidityAvocado=avocadoData.res;
    
    moistureAvocado=avocadoData.hum;

        
  }
  



async function GetResponse(){
   
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");

    var apiUrl=apiURL +"?seconds="+String(lastValidSeconds1) +"&device="+deviceName;
    console.log("last Seconds ",lastValidSeconds0 );
    let response=[]
    try{
        response = await fetch(apiUrl);
    }catch (e) {
        console.error('Error fetching api data', e);
    };
    
 
    if (response.ok) { // if HTTP-status is 200-299
    //   console.log("Response: ",response);  
        // get the response body (the method explained below)
      let json = await response.json();
      
      const body=json.body;
    //  console.log("GOT", body);
        if (isEmpty(body)) {
          return;
        }
      // let pay=json.payload;
      avocadoData=body; 
     console.log("Data: ", avocadoData);
        await UpdateData();
    } else {
      alert("HTTP-Error: " + response.status);
    }
    return response.ok;
  
  }


 async function APISimpleCall(){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
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
    let hf=false;
  //  console.log(hf);
    //const hasFetchedData = useRef(false);
    const apiData= async () =>{
        let dataP=[]
   
        async function fetchData() {
            try {
                const response= await fetch(apiURL, requestOptions);
                dataP=response;
                
            
            } catch (e) {
              console.error('Error fetching api data', e);
            };
        };
        if (hf== false) {
            hf=true
       
            await fetchData();
           // console.log(dataP);

          }
     
        return dataP

    };
    let result= await apiData();
  //  console.log(result);
    return result;
}




export default async function CallAPI(){

  //  const [request, SetRequested] = useState(false);
//  console.log("errordsdasd");
    let data=[]
    const request =await APISimpleCall()
    if (request.ok) {
        console.log("POST :", secondsTime);
        lastValidSeconds1=lastValidSeconds0;
        lastValidSeconds0=secondsTime;
      //  lastValidSeconds2=secondsTime;
        if( await  GetResponse()){
            console.log("angle: ",angleAvocado);
            console.log("temperature: ",temperatureAvocado);
            console.log("humidity: ",humidityAvocado);
            console.log("moisture: ",moistureAvocado);
            data=avocadoData;
        }
       // console.log(request);


    } else {
        console.log(request);
    }
    return data;
}
