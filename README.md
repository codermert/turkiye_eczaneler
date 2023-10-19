
# TÜRKİYE ECZANELER LİSTESİ

[![NPM Version](https://badge.fury.io/js/turkiye_eczaneler.svg)](https://badge.fury.io/js/turkiye_eczaneler) [![JS Modules](https://img.shields.io/badge/JS-Modules-brightgreen)](https://github.com/codermert) [![Powered by Coder Mert](https://img.shields.io/badge/Powered%20By-Coder%20Mert-brightgreen.svg)](https://github.com/codermert) [![Node JS](https://img.shields.io/badge/%3C%2F%3E-Nodejs-blue.svg)](https://nodejs.org/tr)




Türkiye'deki bir ilin **(örneğin "Bursa")** eczane verilerini çekmek ve bu verileri farklı biçimlerde kaydetmek için kullanılır. İşte bu kodun yaptığı temel işlevler:

## Özellikler

- getEczaneler(il): Belirli bir ilin (örneğin, "Bursa") eczane verilerini web sitesinden çeker. Bu veriler ilgili ildeki eczanelerin adı, adresi ve telefon numaralarını içerir.

- getJsonVer(il): Belirli bir ilin eczane verilerini JSON formatında kaydeder. Bu, eczane verilerini daha sonra başka uygulamalarda veya işlemlerde kullanmak için kullanışlıdır.

- getListeVer(il): Belirli bir ilin eczane verilerini metin formatında kaydeder. Bu, insanlar için okunabilir bir biçimde eczane verilerini saklar ve paylaşır.

- **99%** oranında çalışıyor

Ekleme yapmak isterseniz eğer mail : mertbey@bk.ru

## Kurulum

```bash
npm install turkiye_eczaneler
```


## Örnek Proje

```javascript
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

```

## Eczane verilerini almanın basit yolu:

```javascript
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
```


```javascript
getJsonVer(il)
  .then(() => {
    console.log(`"${il}" ilinin eczane verileri JSON olarak kaydedildi.`);
  })
  .catch((error) => {
    console.error(`"${il}" için hata: ${error}`);
  });
```


```javascript
getListeVer(il)
  .then(() => {
    console.log(`"${il}" ilinin eczane verileri metin olarak kaydedildi.`);
  })
  .catch((error) => {
    console.error(`"${il}" için hata: ${error}`);
  });

```
