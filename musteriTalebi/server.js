const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 1312;
app.use(express.json());
const MUSTERI_ID_OLUSTUR = path.join(__dirname, '/DATA/ID_DATA/musteriID.txt');
const GOREV_ID_OLUSTUR = path.join(__dirname, '/DATA/ID_DATA/gorevID.txt');
const KULLANICI_ID_OLUSTUR = path.join(__dirname, '/DATA/ID_DATA/kullaniciID.txt');

function YENI_MUSTERI_ID(MUSTERI_ID_OLUSTUR, callback) {
  fs.readFile(MUSTERI_ID_OLUSTUR, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Dosya yoksa yeni dosya oluştur ve 1 yaz
        fs.writeFile(MUSTERI_ID_OLUSTUR, '1', (err) => {
          if (err) return callback(err);
          callback(null, 1);
        });
      } else {
        return callback(err);
      }
    } else {
      let currentId = parseInt(data, 10);
      if (isNaN(currentId)) currentId = 0;
      const newId = currentId + 1;
      fs.writeFile(MUSTERI_ID_OLUSTUR, newId.toString(), (err) => {
        if (err) return callback(err);
        callback(null, newId);
      });
    }
  });
}

function YENI_GOREV_ID(GOREV_ID_OLUSTUR, callback) {
  fs.readFile(GOREV_ID_OLUSTUR, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Dosya yoksa oluştur ve 1 ile başlat
        fs.writeFile(GOREV_ID_OLUSTUR, '1', (err) => {
          if (err) return callback(err);
          callback(null, 1);
        });
      } else {
        return callback(err);
      }
    } else {
      let currentId = parseInt(data, 10);
      if (isNaN(currentId)) currentId = 0;
      const newId = currentId + 1;
      fs.writeFile(GOREV_ID_OLUSTUR, newId.toString(), (err) => {
        if (err) return callback(err);
        callback(null, newId);
      });
    }
  });
}

function YENI_KULLANICI_ID(KULLANICI_ID_OLUSTUR, callback) {
  fs.readFile(KULLANICI_ID_OLUSTUR, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Dosya yoksa oluştur ve 1 ile başlat
        fs.writeFile(KULLANICI_ID_OLUSTUR, '1', (err) => {
          if (err) return callback(err);
          callback(null, 1);
        });
      } else {
        return callback(err);
      }
    } else {
      let currentId = parseInt(data, 10);
      if (isNaN(currentId)) currentId = 0;
      const newId = currentId + 1;
      fs.writeFile(KULLANICI_ID_OLUSTUR, newId.toString(), (err) => {
        if (err) return callback(err);
        callback(null, newId);
      });
    }
  });
}

// Public klasörünü statik dosyalar için kullan
app.use(express.static('public'));

// Form verilerini çözümlemek için
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Veri yolları
const DATA_PATH = path.join(__dirname, '/DATA/data.json');
const USER_DATA_PATH = path.join(__dirname, '/DATA/userData.json');
const TALEP_DATA_PATH = path.join(__dirname, '/DATA/gorevData.json');

// Ana sayfaya yönlendirme
app.get('/', (req, res) => {
  res.redirect('/pages/anasayfa/anasayfa.html');
});

// LİSTELEME İŞLEMLERİ
app.get('/musteriTalepListesi', (req, res) => {
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

app.get('/gorevListesi', (req, res) => {
  fs.readFile(TALEP_DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('Görev verisi okunamadı:', err);
      return res.status(500).json({ hata: 'Görev Listesi alınamadı.' });
    }

    try {
      const gorevListesi = JSON.parse(data);
      res.json(gorevListesi);
    } catch (e) {
      return res.status(500).json({ hata: 'Görev Listesi formatı hatalı.' });
    }
  });
});

// EKLEME İŞLEMLERİ
app.post('/kullaniciEkle', (req, res) => {
  const { e_onaylayan_kullanici, e_ad, e_soyad, e_durum } = req.body;

  if (!e_onaylayan_kullanici || !e_ad || !e_soyad || !e_durum) {
    return res.status(400).json({ hata: 'Eksik kullanıcı bilgisi' });
  }

  // ID üret
  YENI_KULLANICI_ID(KULLANICI_ID_OLUSTUR, (err, newId) => {
    if (err) {
      console.error('ID üretme hatası:', err);
      return res.status(500).json({ hata: 'ID üretilemedi.' });
    }

    const yeniKullanici = {
      e_id: String(newId),
      e_onaylayan_kullanici,
      e_ad,
      e_soyad,
      e_durum
    };

    // Kullanıcı verisini oku ve yaz
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

        res.json({ mesaj: 'Kullanıcı başarıyla eklendi.', e_id: newId });
      });
    });
  });
});


app.post('/gorevEkle', (req, res) => {
  const { e_gorevli_kullanici, e_onaylayan_kullanici, e_gorev, e_durum } = req.body;

  if (!e_gorevli_kullanici || !e_onaylayan_kullanici || !e_gorev || !e_durum) {
    return res.status(400).json({ hata: 'Eksik görev bilgisi' });
  }

  // ID üretimini burada yap
  YENI_GOREV_ID(GOREV_ID_OLUSTUR, (err, newId) => {
    if (err) {
      console.error('ID üretme hatası:', err);
      return res.status(500).json({ hata: 'ID üretilemedi.' });
    }

    const yeniGorev = {
      e_id: newId,
      e_gorevli_kullanici,
      e_onaylayan_kullanici,
      e_gorev,
      e_durum
    };

    fs.readFile(TALEP_DATA_PATH, 'utf8', (err, data) => {
      let gorevListesi = [];

      if (!err && data) {
        try {
          gorevListesi = JSON.parse(data);
        } catch (e) {
          console.error('gorevData.json parse hatası:', e);
        }
      }

      gorevListesi.push(yeniGorev);

      fs.writeFile(TALEP_DATA_PATH, JSON.stringify(gorevListesi, null, 2), err => {
        if (err) {
          console.error('Görev yazma hatası:', err);
          return res.status(500).json({ hata: 'Görev eklenemedi.' });
        }

        res.json({ mesaj: 'Görev başarıyla eklendi.', e_id: newId });
      });
    });
  });
});


app.post('/musteriTalepEkle', (req, res) => {
  const { e_musteri_adi, e_durum, e_musteri_numarasi, e_firma_adi, e_onaylayan_kullanici, e_talep } = req.body;

  if (!e_musteri_adi || !e_durum || !e_musteri_numarasi || !e_firma_adi || !e_onaylayan_kullanici || !e_talep) {
    return res.status(400).json({ hata: 'Eksik müşteri talep bilgisi' });
  }

  YENI_MUSTERI_ID(MUSTERI_ID_OLUSTUR, (err, newId) => {
    if (err) {
      console.error('ID üretme hatası:', err);
      return res.status(500).json({ hata: 'ID üretilemedi.' });
    }

    const yeniVeri = {
      e_id: newId,
      e_musteri_adi,
      e_musteri_numarasi,
      e_firma_adi,
      e_durum,
      e_onaylayan_kullanici,
      e_talep
    };

    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
      let veriListesi = [];

      if (!err && data) {
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
          return res.status(500).json({ success: false, mesaj: 'Veri kaydedilemedi.' });
        }
        res.json({ success: true, mesaj: 'Kayıt başarılı.', e_id: newId });
      });
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

    let kullaniciListesi;
    try {
      kullaniciListesi = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ hata: 'Veri formatı hatalı.' });
    }

    let silindiMi = false;
    const yeniListe = kullaniciListesi.filter(item => {
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

      res.json({ mesaj: 'Kullanıcı başarıyla silindi.' });
    });
  });
});

app.post('/gorevSil', (req, res) => {
  const gelenVeri = req.body;

  if (!gelenVeri || Object.keys(gelenVeri).length === 0) {
    return res.status(400).json({ hata: 'Silinecek veri sağlanmadı.' });
  }

  fs.readFile(TALEP_DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ hata: 'Veriler alınamadı.' });

    let gorevListesi;
    try {
      gorevListesi = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ hata: 'Veri formatı hatalı.' });
    }

    let silindiMi = false;
    const yeniListe = gorevListesi.filter(item => {
      const tamEslesen = Object.keys(gelenVeri).every(key => item[key] === gelenVeri[key]);
      if (tamEslesen && !silindiMi) {
        silindiMi = true;
        return false;
      }
      return true;
    });

    if (!silindiMi) {
      return res.status(404).json({ hata: 'Silinecek görev bulunamadı.' });
    }

    fs.writeFile(TALEP_DATA_PATH, JSON.stringify(yeniListe, null, 2), (err) => {
      if (err) return res.status(500).json({ hata: 'Görev silinemedi.' });

      res.json({ mesaj: 'Görev başarıyla silindi.' });
    });
  });
});


// DÜZENLEME İŞLEMLERİ
app.post('/musteriTalepDuzenle', (req, res) => {
  const { e_musteri_numarasi, e_durum, e_musteri_adi, e_firma_adi, e_onaylayan_kullanici, e_talep } = req.body;

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
        item.e_durum                = e_durum;
        item.e_talep                = e_talep;
        item.e_musteri_adi          = e_musteri_adi;
        item.e_musteri_numarasi     = e_musteri_numarasi;
        item.e_onaylayan_kullanici  = e_onaylayan_kullanici;
        item.e_firma_adi            = e_firma_adi;
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

app.post('/kullaniciDuzenle', (req, res) => {
  const { e_id, e_onaylayan_kullanici, e_durum, e_ad, e_soyad } = req.body;

  if (!e_id) {
    return res.status(400).json({ hata: 'e_id gerekli.' });
  }

  fs.readFile(USER_DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ hata: 'Dosya okunamadı.' });

    let veriListesi;
    try {
      veriListesi = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ hata: 'JSON formatı hatalı.' });
    }

    let bulundu = false;
    // const idToUpdate = Number(e_id);

    const guncellenmisListe = veriListesi.map(item => {
      if (String(item.e_id) === String(e_id)) {
        item.e_onaylayan_kullanici = e_onaylayan_kullanici ?? item.e_onaylayan_kullanici;
        item.e_durum               = e_durum ?? item.e_durum;
        item.e_ad                  = e_ad ?? item.e_ad;
        item.e_soyad               = e_soyad ?? item.e_soyad;
        bulundu = true;
      }
      return item;
    });


    if (!bulundu) {
      return res.status(404).json({ hata: 'Kullanıcı bulunamadı' });
    }

    fs.writeFile(USER_DATA_PATH, JSON.stringify(guncellenmisListe, null, 2), err => {
      if (err) return res.status(500).json({ hata: 'Dosyaya yazılamadı' });

      res.json({ mesaj: 'Kullanıcı başarıyla güncellendi' });
    });
  });
});


app.post('/gorevDuzenle', (req, res) => {
  const { e_gorev, e_durum, e_gorevli_kullanici, e_onaylayan_kullanici } = req.body;

  fs.readFile(TALEP_DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ hata: 'Dosya okunamadı.' });

    let veriListesi;
    try {
      veriListesi = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ hata: 'JSON formatı hatalı.' });
    }

    let bulundu = false;

    const guncellenmisListe = veriListesi.map(item => {
      if (item.e_gorevli_kullanici === e_gorevli_kullanici) {
        item.e_durum                = e_durum;
        item.e_gorevli_kullanici    = e_gorevli_kullanici;
        item.e_gorev                = e_gorev;
        item.e_onaylayan_kullanici  = e_onaylayan_kullanici;
        bulundu = true;
      }
      return item;
    });

    if (!bulundu) {
      return res.status(404).json({ hata: 'Müşteri numarası bulunamadı' });
    }

    fs.writeFile(TALEP_DATA_PATH, JSON.stringify(guncellenmisListe, null, 2), err => {
      if (err) return res.status(500).json({ hata: 'Dosyaya yazılamadı' });

      res.json({ mesaj: 'Görev Güncellendi' });
    });
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
 