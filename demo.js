const { getExcelVer, getJsonVer } = require('./changed');
const il = "bursa";

getExcelVer(il)
  .then(() => {
    console.log(`"${il}" ilinin eczane verileri Excel dosyası olarak kaydedildi.`);
  })
  .catch((error) => {
    console.error(`"${il}" için hata: ${error}`);
  });
