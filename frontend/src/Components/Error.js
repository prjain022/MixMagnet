import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../Css/Error.css';

function Error(){
    const {state } = useLocation();
    const [error,setError] = useState("");

    useEffect(()=>{
        if(state!=null){
            setError(state.msg);
        }
        else{
            setError("Something went wrong");
        }
    },[])

 return(
    <div className='err-maindiv'>
        <div className='err-subdiv'>
            {error}
        </div>
    </div>
 );
}

export default Error;