const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { json } = require('express');


const convertToMp3 = async (fileToConvert)=>{
    //console.log(fileToConvert);
    const filename = fileToConvert.substring(fileToConvert.lastIndexOf('\\')+1,fileToConvert.length);
    const output_dir = path.join(__dirname,'../convert');
    const audioFileName = path.basename(filename,path.extname(filename));
    const audioFile = path.join(output_dir,`${audioFileName}.mp3`);
    try{
        await new Promise((resolve,reject)=>{
            ffmpeg().input(fileToConvert).audioCodec('libmp3lame').toFormat('mp3').on('end',()=>{
                resolve();
            }).on('error',(err)=>{
                reject();
                console.log(err);
            }).save(audioFile);
        })
        return(audioFile);
    }
    catch(error){
        return error;
    }
}

module.exports = {convertToMp3};