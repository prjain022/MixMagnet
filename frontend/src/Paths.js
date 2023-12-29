import { Routes,Route } from "react-router-dom";
import React from 'react';
import App from "./App";
import Error from "./Components/Error";

function Paths(){
 return(
    <div>
        <Routes>
         <Route exact path = '/' Component={App}/>
         <Route path='*' Component={Error} />
        </Routes>
    </div>
 );
}

export default Paths;