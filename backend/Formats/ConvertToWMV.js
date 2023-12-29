const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const convertToWMV = async(fileToConvert)=>{
    const filename = fileToConvert.substring(fileToConvert.lastIndexOf('\\')+1,fileToConvert.length);
    const output_dir = path.join(__dirname,'../convert');
    const audioFileName = path.basename(filename,path.extname(filename));
    const audioFile = path.join(output_dir,`${audioFileName}.wmv`);
    try{
        await new Promise((resolve,reject)=>{
            ffmpeg().input(fileToConvert).audioCodec('wmav2').videoCodec('wmv2').on('end',()=>{
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

module.exports = {convertToWMV};