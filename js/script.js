//set reusable variables 
const reloadBtn =  document.querySelector('.reload');
const formatBtn =  document.querySelector('.format');
const fileSelector = document.getElementById('file-selector');
const reader = new FileReader();

// detect when file is inserted
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files[0];
    readFile(fileList);
});
            
//read file as text which then fires load event to send data to formatting 
const readFile = (file) => { 
    reader.addEventListener('load', (event) => fileExport(event.target.result));
    reader.readAsText(file);
}

// run file export process when load event triggers
const fileExport = (data) => {
    const workBook = readWorkBook(data);
    const workBookData = formatWorkBookData(workBook);
    const finalData = formatOutput(workBookData[0]);
    saveOutput(finalData);
}

// read the inbound data
const readWorkBook = (workBook) => XLSX.read(workBook, { type: 'binary'});

// format data to json object
const formatWorkBookData = (workBook) => workBook.SheetNames.map(sheetName => XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]));

// format data for export
const formatOutput = (data) => {
    const header = 'npi_number|last_contact_date|brand|vendor';
    // loop through data to grab needed data
    return[
        header,
        ...data.map(object => `${object.NPI}|${object.Keycode2}|${object.Keycode3}|DMD`)]
        .join(`\r\n`);
}
            
// save file to computer
const saveOutput = (data) => { 
    const blob = new Blob([data], { type: "text/plain"});
    const anchor = document.createElement("a");
    const date = new Date().toLocaleString('en-gb').split(",")[0].split("/").reverse().join("");
    anchor.download = `USA_DMD_Suppression_list_${date}.txt`;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target ="_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}
