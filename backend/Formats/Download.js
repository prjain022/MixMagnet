const youtubel = require('youtube-dl-exec');
const path = require('path');
const process = require('process');

const downloadFile = async (videourl) => {
    __dirname = path.join(__dirname, '../original');
    process.chdir(__dirname);

    let filepath = __dirname;
    try {
        const output = await youtubel(videourl,{
            dumpSingleJson:true,
            format:'best'
        });
        let title = output.title.trim();
        let extension = output.ext;
        title = title.replace(/[^a-zA-Z0-9 _]/g, '');
        title = title.replace(/\s+/g, ' ');
        title = title.replace(/\s/g, '_');
        title=title+"."+extension;
        const options = {
            output:title,
            format:extension
        }
        console.log("Saving...");
        await youtubel.exec(videourl,options);
        console.log("Saved");
        filepath = `${filepath}/${title}`;
        return(filepath);
    } catch (error) {
        return "Failed";
    }
};

module.exports = { downloadFile };
