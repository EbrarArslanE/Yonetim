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

// Veri yolları
const DATA_PATH = path.join(__dirname, 'data.json');
const USER_DATA_PATH = path.join(__dirname, 'userData.json');

// Ana sayfaya yönlendirme
app.get('/', (req, res) => {
  res.redirect('/pages/anasayfa/anasayfa.html');
});

// LİSTELEME İŞLEMLERİ
app.get('/kayitListesi', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('Veri okuma hatası:', err);
      res.status(500).send('Veriler alınamadı.');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.get('/kullaniciListesi', (req, res) => {
  fs.readFile(USER_DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('Kullanıcı verisi okunamadı:', err);
      return res.status(500).json({ hata: 'Kullanıcılar alınamadı.' });
    }

    try {
      const kullaniciListesi = JSON.parse(data);
      res.json(kullaniciListesi);
    } catch (e) {
      return res.status(500).json({ hata: 'Kullanıcı veri formatı hatalı.' });
    }
  });
});

// KULLANICI EKLEME İŞLEMLERİ
app.post('/kullaniciEkle', (req, res) => {
  const { e_onaylayan_kullanici, e_ad, e_soyad, e_durum } = req.body;

  if (!e_onaylayan_kullanici || !e_ad || !e_soyad || !e_durum) {
    return res.status(400).json({ hata: 'Eksik kullanıcı bilgisi' });
  }

  const yeniKullanici = { e_onaylayan_kullanici, e_ad, e_soyad, e_durum };

  fs.readFile(USER_DATA_PATH, 'utf8', (err, data) => {
    let kullaniciListesi = [];

    if (!err && data) {
      try {
        kullaniciListesi = JSON.parse(data);
      } catch (e) {
        console.error('userData.json parse hatası:', e);
      }
    }

    kullaniciListesi.push(yeniKullanici);

    fs.writeFile(USER_DATA_PATH, JSON.stringify(kullaniciListesi, null, 2), err => {
      if (err) {
        console.error('Kullanıcı yazma hatası:', err);
        return res.status(500).json({ hata: 'Kullanıcı eklenemedi.' });
      }

      res.json({ mesaj: 'Kullanıcı başarıyla eklendi.' });
    });
  });
});

// Kayıt ekle
app.post('/kayitIslemiKaydet', (req, res) => {
  const { e_musteri_adi, e_durum, e_musteri_numarasi, e_talep_basligi, e_onaylayan_kullanici, e_talep } = req.body;

  const yeniVeri = {
    e_musteri_adi,
    e_musteri_numarasi,
    e_talep_basligi,
    e_durum,
    e_onaylayan_kullanici,
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

    fs.writeFile(DATA_PATH, JSON.stringify(veriListesi, null, 2), (err) => {
      if (err) {
        console.error('Veri kaydetme hatası:', err);
        res.status(500).send('Veri kaydedilemedi.');
      } else {
        res.redirect('/pages/anasayfa/anasayfa.html');
      }
    });
  });
});

// SİLME İŞLEMLERİ
app.post('/kayitSil', (req, res) => {
  const gelenVeri = req.body;

  if (!gelenVeri || Object.keys(gelenVeri).length === 0) {
    return res.status(400).json({ hata: 'Silinecek veri sağlanmadı.' });
  }

  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ hata: 'Veriler alınamadı.' });

    let veriListesi;
    try {
      veriListesi = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ hata: 'Veri formatı hatalı.' });
    }

    let silindiMi = false;
    const yeniListe = veriListesi.filter(item => {
      const tamEslesen = Object.keys(gelenVeri).every(key => item[key] === gelenVeri[key]);
      if (tamEslesen && !silindiMi) {
        silindiMi = true;
        return false;
      }
      return true;
    });

    if (!silindiMi) {
      return res.status(404).json({ hata: 'Silinecek kayıt bulunamadı.' });
    }

    fs.writeFile(DATA_PATH, JSON.stringify(yeniListe, null, 2), (err) => {
      if (err) return res.status(500).json({ hata: 'Kayıt silinemedi.' });

      res.json({ mesaj: 'Kayıt başarıyla silindi.' });
    });
  });
});

app.post('/kullaniciSil', (req, res) => {
  const gelenVeri = req.body;

  if (!gelenVeri || Object.keys(gelenVeri).length === 0) {
    return res.status(400).json({ hata: 'Silinecek veri sağlanmadı.' });
  }

  fs.readFile(USER_DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ hata: 'Veriler alınamadı.' });

    let veriListesi;
    try {
      veriListesi = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ hata: 'Veri formatı hatalı.' });
    }

    let silindiMi = false;
    const yeniListe = veriListesi.filter(item => {
      const tamEslesen = Object.keys(gelenVeri).every(key => item[key] === gelenVeri[key]);
      if (tamEslesen && !silindiMi) {
        silindiMi = true;
        return false;
      }
      return true;
    });

    if (!silindiMi) {
      return res.status(404).json({ hata: 'Silinecek kayıt bulunamadı.' });
    }

    fs.writeFile(USER_DATA_PATH, JSON.stringify(yeniListe, null, 2), (err) => {
      if (err) return res.status(500).json({ hata: 'Kayıt silinemedi.' });

      res.json({ mesaj: 'Kayıt başarıyla silindi.' });
    });
  });
});

// DÜZENLEME İŞLEMLERİ
app.post('/kayitDurumuGuncelle', (req, res) => {
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

app.post('/kullaniciGuncelle', (req, res) => {
  const { e_onaylayan_kullanici, e_durum, e_ad, e_soyad } = req.body;

  fs.readFile(USER_DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ hata: 'Dosya okunamadı.' });

    let veriListesi;
    try {
      veriListesi = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ hata: 'JSON formatı hatalı.' });
    }

    let bulundu = false;

    const guncellenmisListe = veriListesi.map(item => {
      if (item.e_onaylayan_kullanici === e_onaylayan_kullanici) {
        item.e_onaylayan_kullanici  = e_onaylayan_kullanici;
        item.e_durum                = e_durum;
        item.e_ad                   = e_ad;
        item.e_soyad                = e_soyad;
        bulundu = true;
      }
      return item;
    });

    if (!bulundu) {
      return res.status(404).json({ hata: 'Kullanıcı bulunamadı' });
    }

    fs.writeFile(USER_DATA_PATH, JSON.stringify(guncellenmisListe, null, 2), err => {
      if (err) return res.status(500).json({ hata: 'Dosyaya yazılamadı' });

      res.json({ mesaj: 'Durum güncellendi' });
    });
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
 