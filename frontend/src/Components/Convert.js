//importing packages and functions
import React, { useRef } from 'react';
import '../Css/Convert.css';
import { useState } from 'react';
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import formats from './formats.json';
import {makeStyles} from "@mui/styles";
import { convertFile,convertLink } from '../Scripts/functions';
import fileDownload from 'js-file-download';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
//styles
const useStyles = makeStyles((theme) => ({
    select: {
      "& fieldset":{
        border:"none",
      }
    },
  }));

function Convert(){
    const navigate = useNavigate();
    const classes = useStyles();
    const ele = useRef(null);
    //example for placeholder for link
    const pText = "youtube.com/watch?v=YoU-tuBe_23";
    //states
    const[isConverting,setIsConverting] = useState(false);
    const[title,setTitle] = useState("Please insert a valid url or");
    const[btnText,setBtnText] = useState("Upload");
    const [format,setFormat] = useState('mp3');
    const[toDownload,setToDownload]=useState('');
    const[showBtn,setShowBtn]=useState(true);
    const [file,setFile] = useState(null);
    const[width,setWidth] = useState(0);


    useEffect(()=>{
       if(ele.current)
       {
        const extension = title.substring(title.lastIndexOf('.'),title.length);
        const noOfChars = Math.round((ele.current.offsetWidth/840)*66);
        setWidth(noOfChars-extension.length);
       }
    },[isConverting,width])
    //Functions
    const handleUpload = ()=>{
        setTitle("Upload a file or");
        setBtnText("Paste a link");
    }
    const handlePasteLink = ()=>{
        setTitle("Please insert a valid url or");
        setBtnText("Upload");
    }
    const handleFormatChange = (e)=>{
        setFormat(e.target.value);
    }
    const handleLink = ()=>{
        convertLink(navigate , format, setTitle, setShowBtn, setToDownload, setIsConverting);
    }
    const handleFile = ()=>{
        // alert(width);
        convertFile(navigate,file, format, setTitle, setShowBtn, setToDownload, setIsConverting);
    }
    const downloadFile = ()=>{
        fileDownload(toDownload,title);
    }

    
    const convertNext = ()=>{
        setIsConverting(false);
        setShowBtn(true);
        if(btnText=='Upload'){
            setTitle("Insert a valid url or");
        }
        else {
            setTitle("Upload a file or");
        }
    }
    const handleFileChange = (e)=>{
        setFile(e.target.files[0]);
    }
    
    //from here the content that will be shown starts
    if(isConverting)
    {

        return(

            <div className='m-converting-div'  ref={ele}>
                <div className="m-conversion-title">{title.length>width?title.substring(0,width)+`...(${title.substring(title.lastIndexOf('.'),title.length)})`:title}</div>
                <div className='m-conversion-btndiv'>
                    <div className='m-download-btndiv'>
                        <button className='m-converting-btn' onClick={downloadFile}>Download</button>
                    </div>
                    <div className='m-convertnext-btndiv'>
                         <button className='m-converting-btn' onClick={convertNext}>Convert Next</button>
                    </div>
                </div>
            </div>

        );

    }
    
    else
    {

        return(
            <div className="m-conversion-div">
                <div className="m-conversion-title" >
                    {title} {showBtn ? 
                    <button id='m-title-btn' onClick={btnText=='Upload'?handleUpload:handlePasteLink}>{btnText}</button>
                    : null}
                </div>

                <div className="m-conversion-input-div">
                    {btnText=='Upload' ?
                        <input type='text' id='yt-input' placeholder={pText} />
                        :
                        <input type='file' id='upload-input' onChange={handleFileChange} name='uploadfile' />
                    }
                </div>

                <div className="m-conversion-btndiv">
                    <div className="m-selectbox-div">
                        <Select  value={format} style={{fontSize:'1.8rem' , color:'white',fontFamily: 'Lobster, sans-serif'}}  onChange={handleFormatChange} className={`m-select ${classes.select}`}>
                            {formats.map((item)=>(
                                <MenuItem  value={item.value}>{item.text}</MenuItem>
                            ))}
                        </Select>
                    </div>

                    <div className="m-convert-btn-div">
                        <button className="m-convert-btn" onClick={btnText=='Upload'?handleLink:handleFile}>Convert</button>
                    </div>
                </div>
            </div>

        );

    }

}

export default Convert;