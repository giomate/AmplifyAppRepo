import { useEffect} from 'react';
import { useState} from 'react';

let hidden, visibilityChange;

if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
}
let isPageVisible2=true;
const onVisibilityChange = () => {
   
    if (document.visibilityState === 'visible') {
      console.log("Tab reopened, refetch the data!");
      isPageVisible2=true
    }else{
        console.log("Tab navigated out");
        isPageVisible2=false
    }
  
  };
function TabOnFocus(){
  
    const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
    
    useEffect(() => {
      const handleVisibilityChange = () => {
        setIsPageVisible(!document.hidden);
        if (document.visibilityState === 'visible') {
          console.log("Tab reopened, refetch the data!");
          hidden=false;
        }else{
          console.log("Tab navigated out");
          hidden=true;
        }
      };
  
      document.addEventListener('visibilitychange', handleVisibilityChange);
  
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, []);
  
    return isPageVisible;
}

function usePageVisibility() {
    const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
  
    useEffect(() => {
      const handleVisibilityChange = () => {
        setIsPageVisible(!document.hidden);
        if (document.visibilityState === 'visible') {
          console.log("Tab reopened, refetch the data!");
        }else{
          console.log("Tab navigated out");
        }
      };
  
      document.addEventListener('visibilitychange', handleVisibilityChange);
  
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, []);
  
    return isPageVisible;
  }




export default TabOnFocus;