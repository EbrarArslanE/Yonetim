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
  res.redirect('/pages/anasayfa/anasayfa.html');
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

// POST /kaydet isteği alındığında veriyi JSON dosyasına kaydet
app.post('/kaydet', (req, res) => {
  const { e_musteri_adi, e_durum, e_musteri_numarasi, e_talep_basligi, e_talep } = req.body;

  // Veriyi kontrol et (isteğe bağlı)
  console.log(e_musteri_adi, e_durum, e_musteri_numarasi, e_talep_basligi, e_talep);

  const yeniVeri = {
    e_musteri_adi,
    e_musteri_numarasi,
    e_talep_basligi,
    e_durum,
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
        // Kayıt başarıyla eklendiğinde yönlendirme değil alert göndereceğiz
          res.redirect('/pages/anasayfa/anasayfa.html');
      }
    });
  });
});

app.post('/sil', (req, res) => {
  const { e_musteri_numarasi } = req.body;  // JSON'dan gelen müşteri numarasını alıyoruz

  console.log('Silme işlemi için gelen müşteri numarası:', e_musteri_numarasi);

  // Eğer müşteri numarası gelmediyse, hata mesajı gönderiyoruz
  if (!e_musteri_numarasi) {
    return res.status(400).json({ hata: 'Müşteri numarası sağlanmadı.' });
  }

  // JSON dosyasını okuma
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('Veri okuma hatası:', err);
      return res.status(500).json({ hata: 'Veriler alınamadı.' });
    }

    let veriListesi = [];

    try {
      veriListesi = JSON.parse(data);
    } catch (parseErr) {
      console.error('JSON parse hatası:', parseErr);
      return res.status(500).json({ hata: 'Veri formatı hatalı.' });
    }

    // Silme işlemi
    const yeniListe = veriListesi.filter(item => item.e_musteri_numarasi !== e_musteri_numarasi);

    // Eğer kayıt bulunamadıysa
    if (yeniListe.length === veriListesi.length) {
      return res.status(404).json({ hata: 'Silinecek kayıt bulunamadı.' });
    }

    // Silme sonrası güncel veriyi yazma
    fs.writeFile(DATA_PATH, JSON.stringify(yeniListe, null, 2), (err) => {
      if (err) {
        console.error('Veri silme hatası:', err);
        return res.status(500).json({ hata: 'Kayıt silinemedi.' });
      }

      res.json({ mesaj: 'Kayıt başarıyla silindi.' });
    });
  });
});

// POST /guncelle - Talep durumunu güncelle
app.post('/guncelle', (req, res) => {
  const { e_musteri_numarasi, e_durum } = req.body;

  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ hata: 'Dosya okunamadı.' });

    let veriListesi;
    try {
      veriListesi = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ hata: 'JSON formatı hatalı.' });
    }

    let bulundu = false;

    const guncellenmisListe = veriListesi.map(item => {
      if (item.e_musteri_numarasi === e_musteri_numarasi) {
        item.e_durum = e_durum;
        bulundu = true;
      }
      return item;
    });

    if (!bulundu) {
      return res.status(404).json({ hata: 'Müşteri numarası bulunamadı' });
    }

    fs.writeFile(DATA_PATH, JSON.stringify(guncellenmisListe, null, 2), err => {
      if (err) return res.status(500).json({ hata: 'Dosyaya yazılamadı' });

      res.json({ mesaj: 'Durum güncellendi' });
    });
  });
});





// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
