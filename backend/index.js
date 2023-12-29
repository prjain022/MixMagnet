const express = require('express');
const app = express();
const port = process.env.PORT || 2000;
const path = require('path');
const fs = require('fs');
const upload = require('express-fileupload');
const {downloadFile} = require('./Formats/Download');
const { convertToMp4 } = require('./Formats/ConvertToMp4');
const { convertToMp3 } = require('./Formats/ConvertToMp3');
const {convertToWAV} = require('./Formats/ConvertToWAV');
const {convertToMOV} = require('./Formats/ConvertToMOV');
const {convertToAvi} = require('./Formats/ConvertToAvi');
const {convertToWMV} = require('./Formats/ConvertToWMV');
const {convertToWebm} = require('./Formats/ConvertToWebm');
const {convertToFlv} = require('./Formats/ConvertToFlv');
const {convertToAiff} = require('./Formats/ConvertToAiff');
const {convertToFlac} = require('./Formats/ConvertToFlac');
const {convertToWMA} = require('./Formats/ConvertToWMA');
const {convertToAAC} = require('./Formats/ConvertToAAC');
const cors = require('cors');

app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Content-Disposition');
    next();
});


app.use(upload());

app.get('/',(req,res)=>{
    res.send("Welcome");
})
app.post('/api/download/:link',async(req,res)=>{
   
    const file = await downloadFile(req.params.link);
    console.log(file);
    res.send(file);
    //res.download(file);
})

app.get('/api/convert/:link/:type',async(req,res)=>{
    console.log(req.params.link + ' ' + req.params.type);
    try{
        let file = req.params.link;
        const fileType = req.params.type;
        const typeToConverterMap = {
            'mp4': convertToMp4,
            'mp3': convertToMp3,
            'wav': convertToWAV,
            'mov': convertToMOV,
            'avi': convertToAvi,
            'wmv': convertToWMV,
            'webm': convertToWebm,
            'aiff': convertToAiff,
            'flac': convertToFlac,
            'wma': convertToWMA,
            'aac': convertToAAC,
        };
        // ffmpeg.ffprobe(file,(err,metadata)=>{
        //     if(err)
        //     {
        //         console.log("Error");
        //     }
        //     else{
        //         const audioInfo = {
        //             codec: metadata.streams[0].codec_name,
        //             channels: metadata.streams[0].channels,
        //             sampleRate: metadata.streams[0].sample_rate,
        //           };
        //           console.log(audioInfo.codec);
        //     }
        // })
        const conversionFunction = typeToConverterMap[fileType] || convertToFlv;
        const convertedFile = await conversionFunction(file);
        const filename = path.basename(convertedFile);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        // let toSend = path.join(__dirname,'convert',filename);
        res.send(filename);
        // res.on('finish',()=>{
        //     fs.unlinkSync(convertedFile);
        //     fs.unlinkSync(file);
        // })
    }

    catch(error)
    {
        res.status(500).send('File conversion failed');
    }

})

app.post('/api/uploadFile',(req,res)=>{
    if(req.files)
    {
        var file = req.files.uploadfile;
        var filename = file.name;
        var ext = path.extname(filename);
        filename = path.basename(filename,ext);
        console.log('Base: '+filename);
        filename=filename.replace(/[^a-zA-Z0-9 _]/g, '');
        console.log(filename);
        filename = filename.replace(/\s+/g,' ');
        filename = filename.replace(/\s/g,'_');
        filename = filename+ext;
        var filepath = path.join(__dirname,'original');
        filepath = path.join(filepath,filename);
        file.mv(filepath,(err)=>{
            if(err)
            {
                res.send("Failed");
            }
            else{
                console.log(filepath);
                res.send(filepath);
            }
        })
    }
})

app.get('/download/:filename/:filepath',(req,res)=>{
    const filename = req.params.filename;
    const filepath = path.join(__dirname,'convert',filename);
    console.log("Filepatg "+filepath);
    res.sendFile(filepath);
    res.on('finish',()=>{
               fs.unlinkSync(filepath);
               fs.unlinkSync(req.params.filepath);
         })
})


app.listen(port,(err)=>{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log(`App listening on ${port}`);
    }
})