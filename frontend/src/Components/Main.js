import React, { useState } from "react";
import '../Css/Main.css';
import { useEffect } from "react";
import TypeWriterEffect from 'react-typewriter-effect';
import Convert from "./Convert";
import { ToastContainer } from "react-toastify";


function Main()
{
    const tagline = "Elevate Your Media Experience : Download, Convert, Delight!";
    const [show,setShow] = useState(true);
    const tryNow = ()=>{
        setShow(false);
    }
    
    useEffect(()=>{
        if(show)
        {
            var ele = document.getElementsByClassName('react-typewriter-text')[0];
            ele.id = 'm-tagline';
        }
    },[])
    
    return(

        <>
        <div className="m-maindiv">
            {show?
                <div className='m-contentdiv'>
                    <div className="m-head">
                        <h2>MixMagnet</h2>
                    </div>
                    <div className="m-tag">
                        <TypeWriterEffect id='m-tagline' cursorColor='white' text={tagline} typeSpeed={50} hideCursorAfterText={true} />
                    </div>
                    <div className="m-btndiv">
                        <button className="m-btn" onClick={tryNow}>Try Now</button>
                    </div>
                </div>
            :
                <Convert />
            }
        </div>
        <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover={false}
            theme="dark"
            bodyClassName="m-toast-body"
        />
        </>

    );

}

export default Main;