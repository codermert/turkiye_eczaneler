const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const XLSX = require('xlsx');

// İlçe bilgisini çıkarmak için yardımcı bir işlev
const extractIlceFromAddress = (address) => {
  const matches = address.match(/\/([^/]+)$/); // Adresten ilçe kısmını alır
  if (matches) {
    return matches[1].trim();
  } else {
    return '';
  }
};

async function fetchIlIlceData() {
  const ilIlceURL = 'https://raw.githubusercontent.com/codermert/turkiye_eczaneler/main/iller.json';

  try {
    const response = await axios.get(ilIlceURL);
    return response.data.iller;
  } catch (error) {
    console.error('Veri getirilirken hata oluştu "iller.json":', error);
    return [];
  }
}

async function fetchEczaneData(il) {
  const url = `https://www.eczaneler.gen.tr/eczaneler/${il}`;

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36',
    Referer: url,
  };

  try {
    const response = await axios.get(url, { headers });
    const html = response.data;
    const $ = cheerio.load(html);

    const eczaneList = [];

    $('div.row').each((index, element) => {
      const eczaneName = $(element).find('a.text-capitalize.font-weight-bold').text().trim();
      const eczaneAddress = $(element).find('.text-capitalize:eq(1)').text().trim();
      const eczanePhone = $(element).find('a.text-dark').text().trim();

      const eczaneInfo = {
        name: eczaneName,
        address: eczaneAddress,
        phone: eczanePhone,
        ilce: extractIlceFromAddress(eczaneAddress), // İlçe bilgisini alır
      };

      eczaneList.push(eczaneInfo);
    });

    return eczaneList;
  } catch (error) {
    console.error(`"${il}" için hata: ${error}`);
    return [];
  }
}

async function getEczaneler(il) {
  const illerList = await fetchIlIlceData();

  if (illerList.includes(il)) {
    const eczaneList = await fetchEczaneData(il);
    return eczaneList;
  } else {
    console.error(`"${il}" isminde bir il bulunamadı.`);
    return [];
  }
}

async function getJsonVer(il) {
  const eczaneList = await getEczaneler(il);
  if (eczaneList.length > 2) {
    const jsonData = JSON.stringify(eczaneList, null, 2);
    fs.writeFileSync(`${il}_eczaneler.json`, jsonData);
    console.log(`"${il}" için eczane verileri "${il}_eczaneler.json" olarak kaydedildi.`);
  }
}

async function getListeVer(il) {
  const eczaneList = await getEczaneler(il);
  if (eczaneList.length > 2) {
    const liste = eczaneList.map((eczane, index) => {
      return `Eczane ${index + 1}:\nAdı: ${eczane.name}\nAdres: ${eczane.address}\nTelefon: ${eczane.phone}\nİlçe: ${eczane.ilce}\n\n`;
    });
    fs.writeFileSync(`${il}_eczaneler.txt`, liste.join(''));
    console.log(`"${il}" için eczane listesi "${il}_eczaneler.txt" olarak kaydedildi.`);
  }
}

async function getExcelVer(il) {
  const eczaneList = await getEczaneler(il);
  if (eczaneList.length > 2) {
    const workbook = XLSX.utils.book_new();

    const wsData = [
      ['Eczane Adı', 'Adres', 'Telefon', 'İlçe']
    ];

    eczaneList.forEach(eczane => {
      wsData.push([eczane.name, eczane.address, eczane.phone, eczane.ilce]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Filtre eklemek için autoFilter seçeneğini kullanın
    ws['!autofilter'] = { ref: "D1:D" + (eczaneList.length + 1) };
    // İlk satırın stillerini ayarlayın
    ws['A1'].s = { font: { bold: true } };
    ws['B1'].s = { font: { bold: true } };
    ws['C1'].s = { font: { bold: true } };
    ws['D1'].s = { font: { bold: true } };

    XLSX.utils.book_append_sheet(workbook, ws, il);

    XLSX.writeFile(workbook, `${il}_eczaneler.xlsx`);
    console.log(`"${il}" için eczane verileri "${il}_eczaneler.xlsx" olarak kaydedildi.`);
  }
}


module.exports = {
  getEczaneler,
  getJsonVer,
  getListeVer,
  getExcelVer
};
