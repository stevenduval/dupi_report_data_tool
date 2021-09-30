//set reusable variables 
const reloadBtn =  document.querySelector('.reload');
const formatBtn =  document.querySelector('.format');
const fileSelector = document.getElementById('file-selector');
const reader = new FileReader();
let dataToInsert = 'npi_number|last_contact_date|brand|vendor';
let json;
            
// detect when file is inserted
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files[0];
    readFile(fileList);
});
            
//read file as text which then fires load event to send data to formatting 
const readFile = (file) => { 
    reader.readAsText(file);
    reader.addEventListener('load', (event) => formatData(event.target.result));
}
            
// format data to proper format to then send to save
const formatData = (data) => {
    let workbook = XLSX.read(data, { type: 'binary'});
    workbook.SheetNames.forEach(sheetName => {
        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        let json_object = JSON.stringify(XL_row_object);
        json = JSON.parse(json_object); 
    });
    // loop through data to grab needed data
    json.forEach(object => {
        dataToInsert += `\r\n${object.NPI}|${object.Keycode2}|${object.Keycode3}|DMD`;
    })
    // call to save file
    saveOutput();
    }
            
// save file to computer
const saveOutput = () => { 
    const blob = new Blob([dataToInsert], { type: "text/plain"});
    const anchor = document.createElement("a");
    const date = new Date().toLocaleString('en-gb').split(",")[0].split("/").reverse().join("_");
    anchor.download = `USA_DMD_Suppression_list_${date}.txt`;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target ="_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}