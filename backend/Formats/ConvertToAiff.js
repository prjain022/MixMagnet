const path = require('path');
const ffmpeg = require('fluent-ffmpeg');


const convertToAiff = async (fileToConvert)=>{
    //console.log(fileToConvert);
    const filename = fileToConvert.substring(fileToConvert.lastIndexOf('\\')+1,fileToConvert.length);
    const output_dir = path.join(__dirname,'../convert');
    const audioFileName = path.basename(filename,path.extname(filename));
    const audioFile = path.join(output_dir,`${audioFileName}.aiff`);
    try{
        await new Promise((resolve,reject)=>{
            ffmpeg().input(fileToConvert).audioCodec('pcm_s16le').audioFrequency(44100).on('end',()=>{
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

module.exports = {convertToAiff};