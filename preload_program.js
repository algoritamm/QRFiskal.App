const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');
const path = require('path');
const fs = require('fs');
const Toastify = require('toastify-js');

let indexBridge = {
    sendRequestAndGetDetails: async (url, options) => {
        const result = await ipcRenderer.invoke('sendRequestAndGetDetails', url, options);
    },
}

ipcRenderer.on('getData', (event, json) => {
    try {
        if (typeof json !== 'object') {
            throw new Error("Received data is not a valid object.");
        }
        var date = new Date();
        var filename = `${json.invoiceResult.transactionTypeCounter}_${date.getFullYear()}_${(date.getMonth() + 1)}_${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getMilliseconds()}.txt`;
        const desktopPath = path.join(os.homedir(), 'Desktop', filename);

        /*var jsonToWrite = {};
        jsonToWrite.taxId = json.invoiceRequest.taxId;
        jsonToWrite.businessName = json.invoiceRequest.businessName;
        jsonToWrite.locationName = json.invoiceRequest.locationName;
        jsonToWrite.address = json.invoiceRequest.address;
        jsonToWrite.city = json.invoiceRequest.city;
        jsonToWrite.totalAmount = json.invoiceResult.totalAmount;
        jsonToWrite.transactionTypeCounter = json.invoiceResult.transactionTypeCounter;
        jsonToWrite.invoiceCounterExtension = json.invoiceResult.invoiceCounterExtension;
        jsonToWrite.sdcTime = json.invoiceResult.sdcTime;
        jsonToWrite.totalCounter = json.invoiceResult.totalCounter;
        const dataToWrite = JSON.stringify(jsonToWrite, null, 2);*/
        
        var DATETIME = json.invoiceResult.sdcTime.toUpperCase();
        var DATETIME = DATETIME.replace("Z", "");
        var DATETIME = DATETIME.replace("T", " ");
        var dataToWrite = "";
        dataToWrite += "\r\t ПИБ: " + json.invoiceRequest.taxId + "\n";
        dataToWrite += "\r\t Име продајног места: " + json.invoiceRequest.locationName + "\n";
        dataToWrite += "\r\t Адреса: " + json.invoiceRequest.address + "\n";
        dataToWrite += "\r\t Укупан износ: " + json.invoiceResult.totalCounter + "\n";
        dataToWrite += "\r\t Бројач по врсти трансакције: " + json.invoiceResult.transactionTypeCounter + "\n";
        dataToWrite += "\r\t Бројач укупног броја: " + json.invoiceResult.totalAmount + "\n";
        dataToWrite += "\r\t Екстензија бројача рачуна: " + json.invoiceResult.invoiceCounterExtension + "\n";
        dataToWrite += "\r\t ПФР време (временска зона сервера): " + DATETIME + "\n";
        
        fs.writeFileSync(desktopPath, dataToWrite, { flag: 'w' });
    }
    catch (error) {
        event.reply('errorWritingData', { error: error.message });
    }
});


contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping')
});

contextBridge.exposeInMainWorld('os', {
    homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld('path', {
    join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld('Toastify', { 
    toast: (options) => Toastify(options).showToast(),
});

contextBridge.exposeInMainWorld('indexBridge', indexBridge);