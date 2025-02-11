const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');
const path = require('path');
const fs = require('fs');
const Toastify = require('toastify-js');
const xlsx = require('xlsx');

let indexBridge = {
    sendRequestAndGetDetails: async (urls, options) => {
        const result = await ipcRenderer.invoke('sendRequestAndGetDetails', urls, options);
    },
}

function writeExcelFile(jsonArray) {
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
        throw new Error("Invalid or empty data array.");
    }

    const data = jsonArray.map(json => {
        if (typeof json !== 'object') {
            throw new Error("Received data is not a valid object.");
        }

        let DATETIME = json.invoiceResult.sdcTime.toUpperCase().replace("Z", "").replace("T", " ");

        return {
            "ПИБ": json.invoiceRequest.taxId,
            "Име продајног места": json.invoiceRequest.locationName,
            "Адреса": json.invoiceRequest.address,
            "Укупан износ": json.invoiceResult.totalCounter,
            "Бројач по врсти трансакције": json.invoiceResult.transactionTypeCounter,
            "Бројач укупног броја": json.invoiceResult.totalAmount,
            "Екстензија бројача рачуна": json.invoiceResult.invoiceCounterExtension,
            "ПФР време (временска зона сервера)": DATETIME
        };
    });

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Podaci");

    var date = new Date();
    var filename = `${date.getFullYear()}_${(date.getMonth() + 1)}_${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getMilliseconds()}.xlsx`;
    const filePath = path.join(os.homedir(), 'Desktop', filename);

    xlsx.writeFile(wb, filePath);
}

ipcRenderer.on('getData', (event, jsonArray) => {
    try {
        writeExcelFile(jsonArray);
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