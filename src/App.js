//import logo from './logo.svg';
//import './App.css';
import { useEffect } from "react";
import { useState,useRef } from "react";
import { Fragment } from "react";
import TabOnFocus from "./components/UserWatcher";
import CallAPI from "./components/ApiHandler";
//import ReactRadialGauge from "./components/AngleCompass";
import Progress_bar from "./components/ProgressBarsG";





function  App() {

  const isPageVisible = TabOnFocus();
//  const isPageVisible = usePageVisibility();
  const timerIdRef = useRef(null);
 // const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const [count, setCount] = useState(0); 
  const [angle, SetAngle] = useState(90); 
  const [temperatureValue, SetTemperature] = useState(-25); 
  const maxValueTem=55;
// const [apiCall,SetAPI]=useState(CallAPI())
let apiCall=[];
 // let count=0;
  useEffect(() => {
    const pollingCallback = async () => {
      // Your polling logic here
   //   console.log('Polling...');
    //  SetAPI(apiCall)
     apiCall= await CallAPI()
     console.log(apiCall);
     SetAngle(apiCall.ang)
     SetTemperature(apiCall.tem)
     
      setCount(count + 1); 
      console.log(count)
      // Simulating an API failure in the polling callback
      const shouldFail = Math.random() < 0.1; // Simulate 20% chance of API failure
      //count=count+1;
      if (shouldFail) {
       // setIsPollingEnabled(false);
        console.log('Polling failed. Stopped polling.');
      }
     
    };

    const startPolling = () => {
      // pollingCallback(); // To immediately start fetching data
      // Polling every 30 seconds
      timerIdRef.current = setInterval(pollingCallback, 3000);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (isPageVisible) {
      startPolling();
    } else {
   
        stopPolling();
      
      
    }

    return () => {
      stopPolling();
     // clearInterval(interval);

    };
  }, [isPageVisible, count]);

   return (

      <Fragment>
      <div style={{ textAlign: "center" }}>
        <h1>Count: {count}</h1>
        <div className="AngleDiv">
            <Progress_bar
                bgcolor="green"
                progress={10+angle}
                height={30}
                maxValue={10}
            />
        </div>
        <div className="TemperatureDiv">
           <Progress_bar
                bgcolor="red"
                progress={60+temperatureValue*2}
                height={30}
                maxValue={maxValueTem}
            />
        </div>
      </div>
      </Fragment>
   
   );
}

export default App;
