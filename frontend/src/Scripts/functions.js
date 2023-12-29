// Import necessary modules and JSON data
import axios from 'axios';
import formats from '../Components/formats.json';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Function to download a file from a given URL and set it to download
const download = async (navigate, downloadURL, setToDownload) => {
    try {
        const response = await axios.get(downloadURL, { responseType: 'blob' });
        setToDownload(response.data);
    } catch (error) {
        // Handle errors and navigate to the error page
        let error_message = "";
        if (error.response) {
            error_message = `Error : ${error.response.status} ${error.response.statusText}`;
        } else {
            error_message = `Error : ${error.message}`;
        }
        navigateToErrorPage(navigate, error_message);
    }
};

// Function to convert file field for UI feedback
const convertFileField = () => {
    let field = document.getElementById('upload-input');
    field.type = 'text';
    field.readOnly = true;
    field.value = 'Preparing...';
    field.style.color = "#707070";
};

// Function to navigate to the error page with a given error message
const navigateToErrorPage = (navigate, err_msg) => {
    navigate('/error', {
        state: {
            msg: err_msg
        }
    });
};

// Function to upload a file using FormData
const uploadFile = async (navigate, file) => {
    try {
        const formData = new FormData();
        formData.append('uploadfile', file);
        const output = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/uploadFile`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        return output.data;
    } catch (error) {
        // Handle errors and navigate to the error page
        let error_message = "";
        if (error.response) {
            error_message = `Error : ${error.response.status} ${error.response.statusText}`;
        } else {
            error_message = `Error : ${error.message}`;
        }
        navigateToErrorPage(navigate, error_message);
    }
};

// Function to convert a file to a desired format
const convertToDesiredFormat = async (navigate, uploadFilepath, convertInto) => {
    try {
        const output = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/convert/${encodeURIComponent(uploadFilepath)}/${convertInto}`);
        return (output.data);
    } catch (error) {
        // Handle errors and navigate to the error page
        let error_message = "";
        if (error.response) {
            error_message = `Error : ${error.response.status} ${error.response.statusText}`;
        } else {
            error_message = `Error : ${error.message}`;
        }
        navigateToErrorPage(navigate, error_message);
    }
};

// Function to upload and convert a file
const uploadAndConvert = async (navigate, full_file_name, file, format, setTitle, setShowBtn, setToDownload, setIsConverting) => {
    // Extract file extension
    let ext = full_file_name.substring(full_file_name.lastIndexOf('.') + 1, full_file_name.length);
    ext = ext.toLowerCase();
    // Check if the extension is valid
    let isValidExt = formats.find(format => format['value'] === ext)
    isValidExt = isValidExt != undefined ? true : false;

    if (isValidExt) {
        setTitle('Uploading File...');
        convertFileField();
        setShowBtn(false);
        let uploadFilepath = await uploadFile(navigate, file);
        if (uploadFilepath != undefined) {
            // Format file path for the server
            const parts = uploadFilepath.split('\\');
            uploadFilepath = parts.join('\\\\');
            document.getElementById('upload-input').value = "Converting...";
            setTitle("Finding Title");
            let conversionFilename = await convertToDesiredFormat(navigate, uploadFilepath, format);
            if (conversionFilename != undefined) {
                const downloadURL = `${process.env.REACT_APP_BASE_URL}/download/${conversionFilename}/${encodeURIComponent(uploadFilepath)}`;
                download(navigate, downloadURL, setToDownload);
                setTitle(conversionFilename);
                setIsConverting(true);
            }
        }
    } else {
        toast.error("Not a valid file extension");
    }
};

// Exported function to convert a file with additional UI checks
export const convertFile = async (navigate, file, format, setTitle, setShowBtn, setToDownload, setIsConverting) => {
    const full_file_name = document.getElementById('upload-input').value;
    if (full_file_name == '') {
        toast.error("No File Selected");
    } else {
        uploadAndConvert(navigate, full_file_name, file, format, setTitle, setShowBtn, setToDownload, setIsConverting);
    }
};

// Function to convert a given link to a video file
const convertLinkToVideo = async (navigate, link) => {
    try {
        const output = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/download/${encodeURIComponent(link)}`);
        return output.data;
    } catch (error) {
        // Handle errors and navigate to the error page
        let error_message = "";
        if (error.response) {
            error_message = `Error : ${error.response.status} ${error.response.statusText}`;
        } else {
            error_message = `Error : ${error.message}`;
        }
        navigateToErrorPage(navigate, error_message);
    }
};

// Function to convert a link to a desired format
const convertLinkToDesiredFormat = async (navigate, pathToVideo, format) => {
    try {
        const output = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/convert/${encodeURIComponent(pathToVideo)}/${format}`, {}, { responseType: 'blob' });
        return output.data;
    } catch (error) {
        // Handle errors and navigate to the error page
        let error_message = "";
        if (error.response) {
            error_message = `Error : ${error.response.status} ${error.response.statusText}`;
        } else {
            error_message = `Error : ${error.message}`;
        }
        navigateToErrorPage(navigate, error_message);
    }
};

// Function to upload and convert a link
const uploadAndConvertLink = async (navigate, link, format, setTitle, setShowBtn, setToDownload, setIsConverting) => {
    document.getElementById('yt-input').value = "Preparing...";
    document.getElementById('yt-input').readOnly = true;
    // Convert link to video path
    let pathToVideo = await convertLinkToVideo(navigate, link);
    if (pathToVideo != "Failed" && pathToVideo != undefined) {
        setShowBtn(false);
        setTitle('Finding title...');
        document.getElementById('yt-input').value = "Converting...";
        // Format video path for the server
        var parts = pathToVideo.split('\\');
        pathToVideo = parts.join('\\\\');
        const filename = await convertLinkToDesiredFormat(navigate, pathToVideo, format);
        setTitle(filename);
        setIsConverting(true);
        const downloadURL = `${process.env.REACT_APP_BASE_URL}/download/${filename}/${encodeURIComponent(pathToVideo)}`;
        download(navigate, downloadURL, setToDownload);
    } else {
        setShowBtn(false);
        setTitle('Error');
        document.getElementById('yt-input').value = "Please insert a valid link";
    }
};

// Exported function to convert a link with additional checks
export const convertLink = (navigate, format, setTitle, setShowBtn, setToDownload, setIsConverting) => {
    const link = document.getElementById('yt-input').value;
    const linkRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    const ytlinkRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const instalinkRegex = /((?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([^/?#&]+)).*/g;
    var flag = false;
    if (linkRegex.test(link)) {
        flag = true;
        if (link.includes('youtu.be') || link.includes('youtube')) {
            flag = ytlinkRegex.test(link) ? true : false;
        } else if (link.includes('instagram')) {
            flag = instalinkRegex.test(link) ? true : false;
        }
    }
    flag == true ?
        uploadAndConvertLink(navigate, link, format, setTitle, setShowBtn, setToDownload, setIsConverting)
        : toast.error("Not a valid link");
};
