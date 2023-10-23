const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const ExcelJS = require('exceljs');



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
      
      // Adresi seçiyoruz
      const eczaneAddress = $(element).find('.text-capitalize:eq(1)').text().trim();
      
      // İlçeyi almak için ilçenin bulunduğu öğeyi seçiyoruz
      const ilceElement = $(element).find('div.my-2 span');

      // İlçeyi alıyoruz
      const eczaneIlce = ilceElement.text().trim();

      const eczanePhone = $(element).find('a.text-dark').text().trim();

      const eczaneInfo = {
        name: eczaneName,
        address: eczaneAddress,
        ilce: eczaneIlce,
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
  if (eczaneList.length > 1) {
    const jsonData = JSON.stringify(eczaneList, null, 2);
    fs.writeFileSync(`${il}_eczaneler.json`, jsonData);
    console.log(`"${il}" için eczane verileri "${il}_eczaneler.json" olarak kaydedildi.`);
  }
}

async function getListeVer(il) {
  const eczaneList = await getEczaneler(il);
  if (eczaneList.length > 1) {
    const liste = eczaneList.map((eczane, index) => {
      return `Eczane ${index + 1}:\nAdı: ${eczane.name}\nAdres: ${eczane.address}\nIlçe: ${eczane.ilce}\nTelefon: ${eczane.phone}\n\n`;
    });
    fs.writeFileSync(`${il}_eczaneler.txt`, liste.join(''));
    console.log(`"${il}" için eczane listesi "${il}_eczaneler.txt" olarak kaydedildi.`);
  }
}



// Başlık hücreleri için stil oluşturma fonksiyonu
function addHeaderCell(worksheet, cellRef, headerText, headerFill, headerFont) {
  const cell = worksheet.getCell(cellRef);
  cell.value = headerText;
  cell.fill = headerFill;
  cell.font = headerFont;
}

async function getExcelVer(il) {
  const eczaneList = await getEczaneler(il);
  if (eczaneList.length > 1) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(il);
    const analizSheet = workbook.addWorksheet('Analiz');
    
    // Başlık hücreleri için stil oluşturun
    const headerFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '7a66b5' }, // Sarı arka plan rengi
    };

    const headerFont = {
      bold: true, // Kalın yazı
      color: { argb: 'ffffff' }, // Beyaz metin rengi
    };

    // Başlık hücrelerini eklemek için fonksiyonu kullanın
    addHeaderCell(worksheet, 'A1', 'Eczane Adı', headerFill, headerFont);
    addHeaderCell(worksheet, 'B1', 'Adres', headerFill, headerFont);
    addHeaderCell(worksheet, 'C1', 'Ilçe', headerFill, headerFont);
    addHeaderCell(worksheet, 'D1', 'Telefon', headerFill, headerFont);

    // Başlık satırının yüksekliğini ayarlayın
    worksheet.getRow(1).height = 20; // 30 birim yükseklik

    // Başlık hücrelerini ve hücre içeriğini ortalayın (yatay ve dikey)
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('C1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('D1').alignment = { horizontal: 'center', vertical: 'middle' };

    // Sütun genişliklerini ayarlayın
    worksheet.getColumn('A').width = 30; // Eczane Adı
    worksheet.getColumn('B').width = 50; // Adres
    worksheet.getColumn('C').width = 20; // Ilçe
    worksheet.getColumn('D').width = 20; // Telefon

    // Filtre eklemek için autoFilter seçeneğini kullanın
    worksheet.autoFilter = {
      from: 'C1',
      to: 'C',
    };

    // Verileri eklerken her iki satırı farklı renkte yapmak için bir bayrak kullanın
    let isWhiteRow = false;

    // Renkli satır rengi
    const colorRowFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '98c0e5' }, // RGB renk kodu
    };

    eczaneList.forEach((eczane, index) => {
      const rowData = [eczane.name, eczane.address, eczane.ilce, eczane.phone];
      
      // Satır rengini değiştir
      if (isWhiteRow) {
        worksheet.addRow(rowData);
      } else {
        const row = worksheet.addRow(rowData);
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = colorRowFill; // Renkli satır için renkli arka plan
        });
      }

      isWhiteRow = !isWhiteRow;
    });

    // İlçe sayılarını toplamak için ilceDistribution adında bir nesne oluşturun
    const ilceDistribution = {};

    // İlçe dağılımını hesapla
    eczaneList.forEach((eczane) => {
      const ilce = eczane.ilce;
      if (ilce in ilceDistribution) {
        ilceDistribution[ilce]++;
      } else {
        ilceDistribution[ilce] = 1;
      }
    });

    // Excel dosyasını kaydedin
    const excelFileName = `${il}_eczaneler.xlsx`;
    await workbook.xlsx.writeFile(excelFileName);

    // Analiz sayfasını düzenle
    const ilceLabels = Object.keys(ilceDistribution);
    const ilceCount = ilceLabels.length;
    const eczaneCount = eczaneList.length;

    analizSheet.getCell('A1').value = 'Toplam Eczane Sayısı';
    analizSheet.getCell('A2').value = eczaneCount; // Toplam eczane sayısı
    analizSheet.getCell('A4').value = 'Toplam İlçe Sayısı';
    analizSheet.getCell('A5').value = ilceCount; // Toplam ilçe sayısı

    // Kenarlıkları ekleyin
    analizSheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Analiz sayfasını kaydedin
    console.log(`"${il}" için eczane verileri "${excelFileName}" olarak kaydedildi.`);
  }
}


module.exports = {
  getEczaneler,
  getJsonVer,
  getListeVer,
  getExcelVer
};
