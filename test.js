const { getEczaneler, getJsonVer, getListeVer } = require('turkiye_eczaneler'); 
// Örnek olarak "bursa" ilinin eczane verilerini çekelim
const il = "bursa";

getEczaneler(il)
  .then((eczaneler) => {
    if (eczaneler.length > 0) {
      console.log(`"${il}" ilindeki eczaneler:`);
      eczaneler.forEach((eczane, index) => {
        console.log(`Eczane ${index + 1}:`);
        console.log(`Adı: ${eczane.name}`);
        console.log(`Adres: ${eczane.address}`);
        console.log(`Telefon: ${eczane.phone}`);
      });
    } else {
      console.log(`"${il}" için eczane verisi bulunamadı.`);
    }
  })
  .catch((error) => {
    console.error(`"${il}" için hata: ${error}`);
  });


  getJsonVer(il)
  .then(() => {
    console.log(`"${il}" ilinin eczane verileri JSON olarak kaydedildi.`);
  })
  .catch((error) => {
    console.error(`"${il}" için hata: ${error}`);
  });




getListeVer(il)
  .then(() => {
    console.log(`"${il}" ilinin eczane verileri metin olarak kaydedildi.`);
  })
  .catch((error) => {
    console.error(`"${il}" için hata: ${error}`);
  });
