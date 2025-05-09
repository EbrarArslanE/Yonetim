const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 1312;

// Public klasörünü statik dosyalar için kullan
app.use(express.static('public'));

// Form verilerini çözümlemek için
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DATA_PATH değişkeni ile data.json dosyasının yolunu belirleyelim
const DATA_PATH = path.join(__dirname, 'data.json');

// Sunucuya her gelen istekle, ana sayfaya yönlendirme
app.get('/', (req, res) => {
  res.redirect('/pages/anasayfa/giris.html');
});

// Verileri JSON formatında almak için GET isteği
app.get('/kayitlar', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('Veri okuma hatası:', err);
      res.status(500).send('Veriler alınamadı.');
    } else {
      res.json(JSON.parse(data)); // JSON verisini döndür
    }
  });
});

// Yeni veri ekleme işlemi (POST /kaydet) 
// POST /kaydet isteği alındığında veriyi JSON dosyasına kaydet
app.post('/kaydet', (req, res) => {
  const { e_musteri_adi, e_musteri_numarasi, e_talep_basligi, e_talep } = req.body;

  // Veriyi kontrol et (isteğe bağlı)
  console.log(e_musteri_adi, e_musteri_numarasi, e_talep_basligi, e_talep);

  const yeniVeri = {
    e_musteri_adi,
    e_musteri_numarasi,
    e_talep_basligi,
    e_talep
  };

  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    let veriListesi = [];

    if (!err) {
      try {
        veriListesi = JSON.parse(data);
      } catch (e) {
        console.error('JSON parse hatası:', e);
      }
    }

    veriListesi.push(yeniVeri);

    fs.writeFile(DATA_PATH, JSON.stringify(veriListesi), (err) => {
      if (err) {
        console.error('Veri kaydetme hatası:', err);
        res.status(500).send('Veri kaydedilemedi.');
      } else {
        res.send('<h2>Veri başarıyla kaydedildi.</h2><a href="/">Ana sayfaya dön</a>');
      }
    });
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
