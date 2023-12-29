const path = require('path');
const ffmpeg = require('fluent-ffmpeg');


const convertToFlac = async (fileToConvert)=>{
    //console.log(fileToConvert);
    const filename = fileToConvert.substring(fileToConvert.lastIndexOf('\\')+1,fileToConvert.length);
    const output_dir = path.join(__dirname,'../convert');
    const audioFileName = path.basename(filename,path.extname(filename));
    const audioFile = path.join(output_dir,`${audioFileName}.flac`);
    try{
        await new Promise((resolve,reject)=>{
            ffmpeg().input(fileToConvert).audioCodec('flac').on('end',()=>{
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

module.exports = {convertToFlac};