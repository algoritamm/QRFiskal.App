//Click event
$(document).on('click', '#uploadFileBtn', async function () {
    var inputFile = document.getElementById('fileInput');

    try {

        if (!inputFile || !inputFile.files.length) {
            alertWarning("Please choose file.");
            emptyInput(inputFile);
            return;
        } 

        //Get urls from uploaded file
        const file = inputFile.files[0];
        let urls = [];

        if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
            urls = await readExcelFile(file);
        }
        else if (file.name.endsWith(".csv")) {
            urls = await readCsvFile(file);
        }
        else if (file.name.endsWith(".txt")) {
            urls = await readTxtFile(file);
        }
        else {
            alertWarning("Only .xls, .xlsx, .csv or .txt files are allowed.");
            emptyInput(inputFile);
            return;
        }
        
        if (urls.length === 0) {
            alertWarning("No URLs found in the file.");
            emptyInput(inputFile);
            return;
        }

        for(const url of urls) {
            if(!isUrlValid(url)) {
                alertWarning("The file does not contain valid URLs.");
                emptyInput(inputFile);
                return;
            }
        }
        //Send http get request for each url
        urls.forEach(url => sendRequestAndGetDetails(url, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8"
            }
        }));

        emptyInput(inputFile);
        alertSuccess("Successfully loaded invoce data.");
        
    } catch (error) {
        emptyInput(inputFile);
        console.log(error);
        alertError("There was an error. Please try leter.");  
    }  
});

//Private methods
function alertError(message) {
    window.Toastify.toast({
        text: message,
        duration: 2000,
        close: false,
        style: {
            width: '300px',
            height: '35px',
            padding: '7px',
            borderRadius: '5px',
            fontSize: "15px",
            background: '#fa4646',
            color: 'black',
            textAlign: 'left',
            position: 'fixed',
            top: '20px',   
            right: '20px', 
            zIndex: 9999 
        }
    });
}

function alertSuccess(message) {
    window.Toastify.toast({
        text: message,
        duration: 2000,
        close: false,
        style: {
            width: '300px',
            height: '35px',
            padding: '7px',
            borderRadius: '5px',
            fontSize: "15px",
            background: '#228B22',
            color: 'black',
            textAlign: 'left',
            position: 'fixed',
            top: '20px',   
            right: '20px', 
            zIndex: 9999 
        }
    });
}

function alertWarning(message) {
    window.Toastify.toast({
        text: message,
        duration: 2000,
        close: false,
        style: {
            width: '300px',
            height: '35px',
            padding: '7px',
            borderRadius: '5px',
            background: '#fad02c',
            color: 'black',
            fontSize: "15px",
            textAlign: 'left',
            position: 'fixed',
            top: '20px',   
            right: '20px', 
            zIndex: 9999 
        }
    });
}

async function sendRequestAndGetDetails(url, options){
    try {
        await window.indexBridge.sendRequestAndGetDetails(url, options);
    }
    catch(error) {
        console.error("Request failed:", error.message);
        alertError("There was an error with one of the urls."); 
    }
}

const func = async () => {
    const response = await window.versions.ping()
    console.log(response)
}

function emptyInput(inputField) {
    inputField.value = "";
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


function readCsvFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            let csvdata = event.target.result;
            let urls = csvdata.split("\n").map(line => line.trim()).filter(url => url);
            resolve(urls);
        };
        reader.onerror = reject;
    });
}

function readTxtFile(file) {
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

function isUrlValid(url) {
    const regex = new RegExp("^https?:\/\/(.)*$");
    
    return regex.test(url);
}

//Init event
func();
