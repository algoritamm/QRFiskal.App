//Form element id
var formUploadFile = document.getElementById('uploadFileForm');

const toastBackground = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #ff5f6d, #ffc371)",
    warning: "linear-gradient(to right,rgb(255, 204, 95),rgb(252, 242, 100))"
}

//Click event
formUploadFile.addEventListener('submit', async function (event) {
    event.preventDefault();
    var inputFile = document.getElementById('fileInput');

    try {

        //Get urls from uploaded file
        const file = inputFile.files[0];
        let urls = [];

        if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
            urls = await readExcelFile(file);
        }
        else if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
            urls = await readFile(file);
        }
        else {
            showToast("Only .xls, .xlsx, .csv or .txt files are allowed.", "warning");
            formUploadFile.reset();
            return;
        }
        
        if (urls.length === 0) {
            showToast("No URLs found in the file.", "warning");
            formUploadFile.reset();
            return;
        }

        for(const url of urls) {
            if(!URL.canParse(url)) {
                showToast("The file does not contain valid URLs.", "warning");
                formUploadFile.reset();
                return;
            }
        }
        //Send http get request for each url
        sendRequestAndGetDetails(urls, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8"
            }
        });
        formUploadFile.reset();
        
    } catch (error) {
        formUploadFile.reset();
        console.log(error);
        showToast("There was an error. Please try leter.", "error");  
    }  
});

async function sendRequestAndGetDetails(urls, options){
    try {
        await window.indexBridge.sendRequestAndGetDetails(urls, options);
        showToast("Successfully loaded invoce data.", "success");
    }
    catch(error) {
        console.error("Request failed:", error.message);
        showToast("There was an error getting the invoice details.", "error"); 
    }
}

function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function (event) {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            const urls = jsonData.map(row => row[0]).filter(url => url);
            resolve(urls);
        };
        reader.onerror = reject;
    });
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            const urls = event.target.result.split("\n").map(url => url.trim()).filter(url => url);
            resolve(urls);
        };
        reader.onerror = reject;
    });
}

function showToast(message, type) {
    window.Toastify.toast({
        text: message,
        duration: 2000,
        close: false,
        style: {
            background: toastBackground[type],
        }
    });
}

const func = async () => {
    const response = await window.versions.ping();
    console.log(response);
};

//Init event
func();