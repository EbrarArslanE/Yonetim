const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 1312;
const { v4: uuidv4 } = require('uuid');
app.use(express.json());
const MUSTERI_ID_OLUSTUR    = path.join(__dirname, '/DATA/ID_DATA/musteriID.txt');
const GOREV_ID_OLUSTUR      = path.join(__dirname, '/DATA/ID_DATA/gorevID.txt');
const KULLANICI_ID_OLUSTUR  = path.join(__dirname, '/DATA/ID_DATA/kullaniciID.txt');
const PROJE_ID_OLUSTUR      = path.join(__dirname, '/DATA/ID_DATA/projeID.txt');

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

function YENI_PROJE_ID(PROJE_ID_OLUSTUR, callback) {
  fs.readFile(PROJE_ID_OLUSTUR, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Dosya yoksa oluştur ve 1 ile başlat
        fs.writeFile(PROJE_ID_OLUSTUR, '1', (err) => {
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
      fs.writeFile(PROJE_ID_OLUSTUR, newId.toString(), (err) => {
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
const PROJE_DATA_PATH = path.join(__dirname, '/DATA/projeData.json');

// Ana sayfaya yönlendirme
app.get('/', (req, res) => {
  res.redirect('/pages/giris/giris.html');
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

app.get('/projeListesi', (req, res) => {
  fs.readFile(PROJE_DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('Proje verisi okunamadı:', err);
      return res.status(500).json({ hata: 'Proje Listesi alınamadı.' });
    }

    try {
      const projeListesi = JSON.parse(data);
      res.json(projeListesi);
    } catch (e) {
      return res.status(500).json({ hata: 'Proje Listesi formatı hatalı.' });
    }
  });
});

// EKLEME İŞLEMLERİ
app.post('/kullaniciEkle', (req, res) => {
  const { e_kullanici_adi, e_ad, e_soyad, e_durum, e_sifre } = req.body;

  if (!e_kullanici_adi || !e_ad || !e_soyad || !e_durum || !e_sifre) {
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
    e_kullanici_adi,
    e_ad,
    e_soyad,
    e_durum,
    e_sifre,
    u_id: uuidv4(), // ← Her kullanıcıya bir UUID atanıyor
    sessionExpires: Date.now() + (15 * 60 * 1000), // Oturum süresi: 15 dakika
    lastLogin: Date.now() // Oturum başlama zamanı
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
  const { e_gorevli_kullanici, e_kullanici_adi, e_gorev, e_durum } = req.body;

  if (!e_gorevli_kullanici || !e_kullanici_adi || !e_gorev || !e_durum) {
    return res.status(400).json({ hata: 'Eksik görev bilgisi' });
  }

  // ID üretimini burada yap
  YENI_GOREV_ID(GOREV_ID_OLUSTUR, (err, newId) => {
    if (err) {
      console.error('ID üretme hatası:', err);
      return res.status(500).json({ hata: 'ID üretilemedi.' });
    }

    const yeniGorev = {
      e_id: String(newId),
      e_gorevli_kullanici,
      e_kullanici_adi,
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
  const { e_musteri_adi, e_durum, e_musteri_numarasi, e_firma_adi, e_kullanici_adi, e_talep } = req.body;

  if (!e_musteri_adi || !e_durum || !e_musteri_numarasi || !e_firma_adi || !e_kullanici_adi || !e_talep) {
    return res.status(400).json({ hata: 'Eksik müşteri talep bilgisi' });
  }

  YENI_MUSTERI_ID(MUSTERI_ID_OLUSTUR, (err, newId) => {
    if (err) {
      console.error('ID üretme hatası:', err);
      return res.status(500).json({ hata: 'ID üretilemedi.' });
    }

    const yeniVeri = {
      e_id: String(newId),
      e_musteri_adi,
      e_musteri_numarasi,
      e_firma_adi,
      e_durum,
      e_kullanici_adi,
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

app.post('/projeEkle', (req, res) => {
  const { e_proje_adi, e_durum, e_proje_yetkilisi, e_firma_adi, e_proje_alim_tarihi, e_proje_teslim_tarihi, e_fiyat, e_telefon_bilgisi, e_mail_bilgisi, e_ekip_uyeleri, e_proje_tipi, e_git_repo_linki, e_oncelik } = req.body;

  if (!e_proje_adi || !e_durum || !e_proje_yetkilisi || !e_firma_adi || !e_proje_alim_tarihi || !e_proje_teslim_tarihi || !e_fiyat) {
    return res.status(400).json({ hata: 'Eksik müşteri talep bilgisi' });
  }

  YENI_PROJE_ID(PROJE_ID_OLUSTUR, (err, newId) => {
    if (err) {
      console.error('ID üretme hatası:', err);
      return res.status(500).json({ hata: 'ID üretilemedi.' });
    }

    const yeniProje = {
      e_id: String(newId),
      e_proje_adi,
      e_proje_yetkilisi,
      e_firma_adi,
      e_durum,
      e_proje_alim_tarihi,
      e_proje_teslim_tarihi,
      e_telefon_bilgisi,
      e_mail_bilgisi,
      e_ekip_uyeleri,
      e_proje_tipi,
      e_git_repo_linki,
      e_oncelik,
      e_fiyat
    };

    fs.readFile(PROJE_DATA_PATH, 'utf8', (err, data) => {
      let projeListesi = [];

      if (!err && data) {
        try {
          projeListesi = JSON.parse(data);
        } catch (e) {
          console.error('JSON parse hatası:', e);
        }
      }

      projeListesi.push(yeniProje);

      fs.writeFile(PROJE_DATA_PATH, JSON.stringify(projeListesi, null, 2), (err) => {
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

app.post('/projeSil', (req, res) => {
  const gelenVeri = req.body;

  if (!gelenVeri || Object.keys(gelenVeri).length === 0) {
    return res.status(400).json({ hata: 'Silinecek veri sağlanmadı.' });
  }

  fs.readFile(PROJE_DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ hata: 'Veriler alınamadı.' });

    let projeListesi;
    try {
      projeListesi = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ hata: 'Veri formatı hatalı.' });
    }

    let silindiMi = false;
    const yeniListe = projeListesi.filter(item => {
      const tamEslesen = Object.keys(gelenVeri).every(key => item[key] === gelenVeri[key]);
      if (tamEslesen && !silindiMi) {
        silindiMi = true;
        return false;
      }
      return true;
    });

    if (!silindiMi) {
      return res.status(404).json({ hata: 'Silinecek proje bulunamadı.' });
    }

    fs.writeFile(PROJE_DATA_PATH, JSON.stringify(yeniListe, null, 2), (err) => {
      if (err) return res.status(500).json({ hata: 'Görev silinemedi.' });

      res.json({ mesaj: 'Görev başarıyla silindi.' });
    });
  });
});

// DÜZENLEME İŞLEMLERİ
app.post('/musteriTalepDuzenle', (req, res) => {
  const { e_musteri_numarasi, e_durum, e_musteri_adi, e_firma_adi, e_kullanici_adi, e_talep } = req.body;

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
        item.e_kullanici_adi        = e_kullanici_adi;
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
  const { e_id, e_kullanici_adi, e_durum, e_ad, e_soyad, e_sifre } = req.body;

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
        item.e_kullanici_adi = e_kullanici_adi  ?? item.e_kullanici_adi;
        item.e_durum               = e_durum    ?? item.e_durum;
        item.e_sifre               = e_sifre    ?? item.e_sifre;
        item.e_ad                  = e_ad       ?? item.e_ad;
        item.e_soyad               = e_soyad    ?? item.e_soyad;
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
  const { e_id, e_gorev, e_durum, e_gorevli_kullanici, e_kullanici_adi } = req.body;

  if (!e_id) {
    return res.status(400).json({ hata: 'e_id gerekli.' });
  }

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
      if (String(item.e_id) === String(e_id)) {
        item.e_durum                = e_durum;
        item.e_gorevli_kullanici    = e_gorevli_kullanici;
        item.e_gorev                = e_gorev;
        item.e_kullanici_adi  = e_kullanici_adi;
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

app.post('/projeDuzenle', (req, res) => {
  const { e_id, e_proje_adi, e_durum, e_proje_yetkilisi, e_firma_adi, e_proje_alim_tarihi, e_proje_teslim_tarihi, e_fiyat, e_telefon_bilgisi, e_mail_bilgisi, e_ekip_uyeleri, e_proje_tipi, e_git_repo_linki, e_oncelik } = req.body;

  if (!e_id) {
    return res.status(400).json({ hata: 'e_id gerekli.' });
  }

  fs.readFile(PROJE_DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ hata: 'Dosya okunamadı.' });

    let projeListesi;
    try {
      projeListesi = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ hata: 'JSON formatı hatalı.' });
    }

    let bulundu = false;

    const guncellenmisListe = projeListesi.map(item => {
      if (String(item.e_id) === String(e_id)) {
        item.e_proje_teslim_tarihi  = e_proje_teslim_tarihi;
        item.e_proje_alim_tarihi    = e_proje_alim_tarihi;
        item.e_telefon_bilgisi      = e_telefon_bilgisi;
        item.e_mail_bilgisi         = e_mail_bilgisi;
        item.e_proje_yetkilisi      = e_proje_yetkilisi;
        item.e_git_repo_linki       = e_git_repo_linki;
        item.e_ekip_uyeleri         = e_ekip_uyeleri;
        item.e_proje_tipi           = e_proje_tipi;
        item.e_proje_adi            = e_proje_adi;
        item.e_firma_adi            = e_firma_adi;
        item.e_oncelik              = e_oncelik;
        item.e_durum                = e_durum;
        item.e_fiyat                = e_fiyat;
        bulundu = true;
      }
      return item;
    });

    if (!bulundu) {
      return res.status(404).json({ hata: 'Müşteri numarası bulunamadı' });
    }

    fs.writeFile(PROJE_DATA_PATH, JSON.stringify(guncellenmisListe, null, 2), err => {
      if (err) return res.status(500).json({ hata: 'Dosyaya yazılamadı' });

      res.json({ mesaj: 'Görev Güncellendi' });
    });
  });
});

// KULLANICI GİRİŞ EKRANI İŞLEMLERİ
app.post('/giris', (req, res) => {
  const { e_kullanici_adi, e_sifre } = req.body;

  fs.readFile(USER_DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ hata: 'Dosya okunamadı' });

    const kullanicilar = JSON.parse(data);
    const kullanici = kullanicilar.find(u => u.e_kullanici_adi === e_kullanici_adi && u.e_sifre === e_sifre);

    if (!kullanici) return res.status(401).json({ hata: 'Bilgiler yanlış' });

    // Oturum başlangıç zamanı ve geçerlilik süresi
    kullanici.lastLogin = Date.now(); // zaman damgası
    kullanici.sessionExpires = Date.now() + (5 * 60 * 1000); // 5 dakika (test için)

    fs.writeFile(USER_DATA_PATH, JSON.stringify(kullanicilar, null, 2), err => {
      if (err) return res.status(500).json({ hata: 'Oturum bilgisi kaydedilemedi' });

      // 🔽 sessionExpires frontend'e gönderiliyor
      res.json({ basarili: true, u_id: kullanici.u_id, sessionExpires: kullanici.sessionExpires, e_kullanici_adi: kullanici.e_kullanici_adi });
    });
  });
});



// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
 