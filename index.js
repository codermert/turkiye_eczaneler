const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const illerJson = fs.readFileSync('iller.json', 'utf8');
const illerList = JSON.parse(illerJson).iller;

// Eczaneler verilerini tutmak için boş bir nesne oluştur
const allEczaneler = {};

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
      };

      eczaneList.push(eczaneInfo);
    });

    return eczaneList;
  } catch (error) {
    console.error(`"${il}" için hata: ${error}`);
    return [];
  }
}

// Özel bir ilin eczane verilerini çekmek için işlev
async function getEczaneler(il) {
  if (illerList.includes(il)) {
    const eczaneList = await fetchEczaneData(il);
    return eczaneList;
  } else {
    console.error(`"${il}" isminde bir il bulunamadı.`);
    return [];
  }
}

// Eczane verilerini JSON olarak kaydetmek için işlev
async function getJsonVer(il) {
  const eczaneList = await getEczaneler(il);
  if (eczaneList.length > 0) {
    const jsonData = JSON.stringify(eczaneList, null, 2);
    fs.writeFileSync(`${il}_eczaneler.json`, jsonData);
    console.log(`"${il}" için eczane verileri "${il}_eczaneler.json" olarak kaydedildi.`);
  }
}

// Eczane verilerini metin olarak kaydetmek için işlev
async function getListeVer(il) {
  const eczaneList = await getEczaneler(il);
  if (eczaneList.length > 0) {
    const liste = eczaneList.map((eczane, index) => {
      return `Eczane ${index + 1}:\nAdı: ${eczane.name}\nAdres: ${eczane.address}\nTelefon: ${eczane.phone}\n\n`;
    });
    fs.writeFileSync(`${il}_eczaneler.txt`, liste.join(''));
    console.log(`"${il}" için eczane listesi "${il}_eczaneler.txt" olarak kaydedildi.`);
  }
}

module.exports = {
  getEczaneler,
  getJsonVer,
  getListeVer,
};
