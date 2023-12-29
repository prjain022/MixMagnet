const path = require('path');
const ffmpeg = require('fluent-ffmpeg');


const convertToWAV = async(fileToConvert)=>{
    const filename = fileToConvert.substring(fileToConvert.lastIndexOf('\\')+1,fileToConvert.length);
    const output_dir = path.join(__dirname,'../convert');
    const audioFileName = path.basename(filename,path.extname(filename));
    const audioFile = path.join(output_dir,`${audioFileName}.wav`);
    try{
        await new Promise((resolve,reject)=>{
            ffmpeg().input(fileToConvert).audioCodec('pcm_s16le').audioFrequency(44100).toFormat('wav').on('end',()=>{
                resolve();
            }).on('error',(err)=>{
                console.log(err);
                reject();
            }).save(audioFile);
        });
        return(audioFile);
    }
    catch(error)
    {
        console.log(error);
    }
   
}

module.exports = {convertToWAV};