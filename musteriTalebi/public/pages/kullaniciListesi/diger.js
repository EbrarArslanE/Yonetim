let secilenKayit = null; // Global değişken

// Sayfa yüklendiğinde kullanıcıları çek
window.onload = () => {
  const tbody = document.querySelector('#kullaniciTablo tbody');
  const search = document.getElementById('filterUser');
  let users = [];

  // Dropdown listesi için kullanıcıları çek
  fetch('/kullaniciListesi')
    .then(r => r.json())
    .then(list => {
      users = list;
      draw(users);

      const sel = document.getElementById('e_onaylayan_kullanici');
      list.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.e_onaylayan_kullanici;
        opt.textContent = `${u.e_ad} ${u.e_soyad} (${u.e_onaylayan_kullanici})`;
        sel.appendChild(opt);
      });
    })
    .catch(err => console.error('Kullanıcı çekme hatası:', err));

  // Kullanıcıları tabloya çiz
  function draw(arr) {
    tbody.innerHTML = '';
    arr.forEach(u => {
      const durumDegeri = String(u.e_durum || '').toLowerCase();
      const badgeDegeri = durumDegeri === 'aktif' ? 'bg-success' : 'bg-danger';
      const badgeSinifi = durumDegeri.charAt(0).toUpperCase() + durumDegeri.slice(1);

      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${u.e_onaylayan_kullanici}</td>
        <td class="text-center w-10">${u.e_ad}</td>
        <td class="text-center w-10">${u.e_soyad}</td>
        <td class="text-center"><span class="w-100 badge ${badgeDegeri}">${badgeSinifi}</span></td>
        <td class="text-center flex w-100 justify-content-center gap-2">

          <button class="Btn w-50" onclick="kullaniciDuzenlemeModunaGec('${u.e_id}')">
            <span style="font-size : 12px;">Düzenle</span>
            <svg class="svg" viewBox="0 0 512 512">
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
            </svg>
          </button>

          <button class="bin-button w-50" onclick="sil('${u.e_id}', '${u.e_onaylayan_kullanici}', '${u.e_ad}', '${u.e_soyad}', '${u.e_durum}')">
            <!-- SVG sil ikonu -->
            <svg class="bin-top" viewBox="0 0 39 7" fill="none">
              <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
              <line x1="12" y1="1.5" x2="26.0357" y2="1.5" stroke="white" stroke-width="3"></line>
            </svg>
            <svg class="bin-bottom" viewBox="0 0 33 39" fill="none">
              <mask id="path-1-inside-1_8_19" fill="white">
                <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
              </mask>
              <path d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" fill="white" mask="url(#path-1-inside-1_8_19)"></path>
              <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
              <path d="M21 6V29" stroke="white" stroke-width="4"></path>
            </svg>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Arama filtresi (isteğe bağlı aktif edilebilir)
  // search.addEventListener('input', () => {
  //   const q = search.value.toLowerCase();
  //   const filt = users.filter(u =>
  //     u.e_onaylayan_kullanici.toLowerCase().includes(q) ||
  //     u.e_ad.toLowerCase().includes(q) ||
  //     u.e_soyad.toLowerCase().includes(q)
  //   );
  //   draw(filt);
  // });

  // Düzenle butonu için modalı açar ve inputları doldurur
  window.kullaniciDuzenlemeModunaGec = (e_id) => {
    secilenKayit = users.find(u => String(u.e_id) === String(e_id));
    const modal = document.getElementById("kullaniciTanimlariModal");
    modal.dataset.musteriNumarasi = e_id;

    if (secilenKayit) {
      document.getElementById('e_durum').value = secilenKayit.e_durum || '';
      document.getElementById('e_ad').value = secilenKayit.e_ad || '';
      document.getElementById('e_soyad').value = secilenKayit.e_soyad || '';
      document.getElementById('e_onaylayan_kullanici').value = secilenKayit.e_onaylayan_kullanici || '';
    }

    modal.style.display = "flex";
  };

  // Yeni kullanıcı ekleme modalını açar
  window.kullaniciOlusturModal = () => {
    secilenKayit = null;
    const modal = document.getElementById("kullaniciTanimlariModal");
    modal.dataset.musteriNumarasi = '';
    document.getElementById('e_durum').value = '';
    document.getElementById('e_ad').value = '';
    document.getElementById('e_soyad').value = '';
    document.getElementById('e_onaylayan_kullanici').value = '';
    modal.style.display = "flex";
  };

  // Modal kapatma fonksiyonu
  window.kapatModal = () => {
    document.getElementById('kullaniciTanimlariModal').style.display = 'none';
    secilenKayit = null;
    document.getElementById('e_durum').value = '';
    document.getElementById('e_ad').value = '';
    document.getElementById('e_soyad').value = '';
    document.getElementById('e_onaylayan_kullanici').value = '';
  };
};





let secilenKayit = null; // Global değişken
fetch('/kullaniciListesi')
  .then(r => r.json())
  .then(list => {
    const sel = document.getElementById('e_onaylayan_kullanici');
    list.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.e_onaylayan_kullanici;
      opt.textContent = `${u.e_ad} ${u.e_soyad} (${u.e_onaylayan_kullanici})`;
      sel.appendChild(opt);
    });
  });

window.onload = () => {
  const tbody  = document.querySelector('#kullaniciTablo tbody');
  const search = document.getElementById('filterUser');
  let users = [];

  fetch('/kullaniciListesi')
    .then(r => r.json())
    .then(data => {
      users = data;
      draw(users);
    })
    .catch(err => console.error('kullanıcı çekme hatası', err));

  function draw(arr) {
    tbody.innerHTML = '';
    arr.forEach(u => {
      const durumDegeri = String(u.e_durum || '').toLowerCase();
      const badgeDegeri = durumDegeri === 'aktif' ? 'bg-success' : 'bg-danger';
      const badgeSinifi = durumDegeri.charAt(0).toUpperCase() + durumDegeri.slice(1);

      const tr = document.createElement('tr');
      tr.innerHTML = `
      <td>${u.e_onaylayan_kullanici}</td>
        <td class="text-center w-10">${u.e_ad}</td>
        <td class="text-center w-10">${u.e_soyad}</td>
        <td class="text-center"><span class="w-100 badge ${badgeDegeri}">${badgeSinifi}</span></td>
        <td class="text-center flex w-100 justify-content-center gap-2">

          <button class="Btn w-50" onclick="kullaniciDuzenlemeModunaGec('${u.e_id}')">
            <span style="font-size : 12px;">Düzenle</span>
            <svg class="svg" viewBox="0 0 512 512">
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
            </svg>
          </button>

          <button class="bin-button w-50" onclick="sil('${u.e_id}', '${u.e_onaylayan_kullanici}', '${u.e_ad}', '${u.e_soyad}', '${u.e_durum}')">
            <!-- SVG sil ikonu -->
            <svg class="bin-top" viewBox="0 0 39 7" fill="none">
              <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
              <line x1="12" y1="1.5" x2="26.0357" y2="1.5" stroke="white" stroke-width="3"></line>
            </svg>
            <svg class="bin-bottom" viewBox="0 0 33 39" fill="none">
              <mask id="path-1-inside-1_8_19" fill="white">
                <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
              </mask>
              <path d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" fill="white" mask="url(#path-1-inside-1_8_19)"></path>
              <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
              <path d="M21 6V29" stroke="white" stroke-width="4"></path>
            </svg>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // search.addEventListener('input', () => {
  //   const q = search.value.toLowerCase();
  //   const filt = users.filter(u =>
  //     u.e_onaylayan_kullanici.toLowerCase().includes(q) ||
  //     u.e_ad.toLowerCase().includes(q) ||
  //     u.e_soyad.toLowerCase().includes(q)
  //   );
  //   draw(filt);
  // });

  window.kullaniciTanimlariModal = (e_id) => {
    // Seçilen kullanıcıyı bul
    secilenKayit = users.find(u => String(u.e_id) === String(e_id));
    const modal = document.getElementById("kullaniciTanimlariModal");
    modal.dataset.musteriNumarasi = e_id;

    if (secilenKayit) {
      // Modal inputlarını doldur
      document.getElementById('e_durum').value = secilenKayit.e_durum || '';
      document.getElementById('e_ad').value = secilenKayit.e_ad || '';
      document.getElementById('e_soyad').value = secilenKayit.e_soyad || '';
      document.getElementById('e_onaylayan_kullanici').value = secilenKayit.e_onaylayan_kullanici || '';
    } else {
      // Boşsa ekleme moduna hazırla
      document.getElementById('e_durum').value = '';
      document.getElementById('e_ad').value = '';
      document.getElementById('e_soyad').value = '';
      document.getElementById('e_onaylayan_kullanici').value = '';
    }

    modal.style.display = "flex";
  };

  window.kullaniciOlusturModal = () => {
    secilenKayit = null;
    const modal = document.getElementById("kullaniciTanimlariModal");
    modal.dataset.musteriNumarasi = '';
    document.getElementById('e_durum').value = '';
    document.getElementById('e_ad').value = '';
    document.getElementById('e_soyad').value = '';
    document.getElementById('e_onaylayan_kullanici').value = '';
    modal.style.display = "flex";
  };

function kapatModal() {
  document.getElementById('kullaniciTanimlariModal').style.display = 'none';
  secilenKayit = null;
  
  // Formu sıfırla
  document.getElementById('e_durum').value = '';
  document.getElementById('e_ad').value = '';
  document.getElementById('e_soyad').value = '';
  document.getElementById('e_onaylayan_kullanici').value = '';
}



  function kullaniciDuzenlemeModunaGec(kayit) {
    secilenKayit = kayit; 
    
    document.getElementById('e_durum').value = kayit.e_durum;
    document.getElementById('e_ad').value = kayit.e_ad;
    document.getElementById('e_soyad').value = kayit.e_soyad;
    document.getElementById('e_onaylayan_kullanici').value = kayit.e_onaylayan_kullanici;

    document.getElementById("kullaniciTanimlariModal").style.display = "block";
  }

  function kullaniciEklemeModunaGec() {
  secilenKayit = null; // Yeni kayıt eklenecek, düzenleme değil
  document.getElementById('kullaniciTanimlariModal').style.display = 'block';

  // Formu temizle
  document.getElementById('e_durum').value = '';
  document.getElementById('e_ad').value = '';
  document.getElementById('e_soyad').value = '';
  document.getElementById('e_onaylayan_kullanici').value = '';
}


  function kullaniciKaydet(params) {
    const e_durum = document.getElementById('e_durum').value;
    const e_ad = document.getElementById('e_ad').value;
    const e_soyad = document.getElementById('e_soyad').value;
    const e_kullanici_adi = document.getElementById('e_onaylayan_kullanici').value;

    if (!e_durum || !e_ad || !e_soyad || !e_kullanici_adi) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    if (secilenKayit) {
      fetch('/kullaniciDuzenle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          e_id: secilenKayit.e_id,
          e_durum,
          e_ad,
          e_soyad,
          e_onaylayan_kullanici: e_kullanici_adi
        })
      }) 
      .then(r => r.json())
      .then(() => {
        alert('Güncelleme başarılı!');
        const idx = users.findIndex(u => u.e_id == secilenKayit.e_id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], e_durum, e_ad, e_soyad, e_onaylayan_kullanici: e_kullanici_adi };
        }
        draw(users);
        kapatModal();
        secilenKayit = null; // temizle
      })
      .catch(err => alert('Güncelleme başarısız: ' + err));
    } else {
      fetch('/kullaniciEkle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          e_durum,
          e_ad,
          e_soyad,
          e_onaylayan_kullanici: e_kullanici_adi
        })
      })
      .then(r => r.json())
      .then(newUser => {
        alert('Yeni kullanıcı eklendi!');
        users.push(newUser);
        draw(users);
        kapatModal();
      })
      .catch(err => alert('Ekleme başarısız: ' + err));
    }
  }

  function kapatModal(params) {
    kapatdocument.getElementById('kullaniciTanimlariModal').style.display = 'none';
    secilenKayit = null;

    document.getElementById('e_durum').value = '';
    document.getElementById('e_ad').value = '';
    document.getElementById('e_soyad').value = '';
    document.getElementById('e_onaylayan_kullanici').value = '';
  }

  window.sil = (e_id, e_onaylayan_kullanici, e_ad, e_soyad, e_durum) => {
    if(confirm(`"${e_ad} ${e_soyad}" isimli kullanıcıyı silmek istediğinize emin misiniz?`)) {
      fetch('/kullaniciSil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ e_id })
      })
      .then(r => r.json())
      .then(res => {
        alert('Silme başarılı!');
        users = users.filter(u => u.e_id !== e_id);
        draw(users);
      })
      .catch(err => alert('Silme başarısız: ' + err));
    }
  };
};


  // window.kullaniciDurumGuncelle = () => {
  //   const modal = document.getElementById("kullaniciTanimlariModal");
  //   const e_id = modal.dataset.musteriNumarasi;
  //   const e_durum = document.getElementById('e_durum').value;
  //   const e_ad = document.getElementById('e_ad').value;
  //   const e_soyad = document.getElementById('e_soyad').value;
  //   const e_kullanici_adi = document.getElementById('e_onaylayan_kullanici').value;

  //   // Ekleme veya güncelleme
  //   if (secilenKayit) {
  //     // Güncelle
  //     fetch('/kullaniciDuzenle', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         e_id: secilenKayit.e_id,
  //         e_durum: e_durum,
  //         e_ad: e_ad,
  //         e_soyad: e_soyad,
  //         e_onaylayan_kullanici: e_kullanici_adi
  //       })
  //     })
  //     .then(r => r.json())
  //     .then(res => {
  //       alert('Güncelleme başarılı!');
  //       // users içindeki veriyi güncelle
  //       let idx = users.findIndex(u => u.e_id == secilenKayit.e_id);
  //       if(idx !== -1) {
  //         users[idx].e_durum = e_durum;
  //         users[idx].e_ad = e_ad;
  //         users[idx].e_soyad = e_soyad;
  //         users[idx].e_onaylayan_kullanici = e_kullanici_adi;
  //       }
  //       draw(users);
  //       kapatModal();
  //     })
  //     .catch(err => alert('Güncelleme başarısız: ' + err));
  //   } else {
  //     // Yeni kayıt ekle
  //     fetch('/kullaniciEkle', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         e_id: String(e_id),
  //         e_durum,
  //         e_ad,
  //         e_soyad,
  //         e_onaylayan_kullanici: e_kullanici_adi
  //       })
  //     })
  //     .then(r => r.json())
  //     .then(newUser => {
  //       alert('Yeni kullanıcı eklendi!');
  //       users.push(newUser);
  //       draw(users);
  //       kapatModal();
  //     })
  //     .catch(err => alert('Ekleme başarısız: ' + err));
  //   }
  // };
  
  // window.kullaniciDurumGuncelle = () => {
  //   const modal = document.getElementById("kullaniciTanimlariModal");
    
  //   function kullaniciEkle() {
  //   const e_durum = document.getElementById('e_durum').value;
  //   const e_ad = document.getElementById('e_ad').value;
  //   const e_soyad = document.getElementById('e_soyad').value;
  //   const e_kullanici_adi = document.getElementById('e_onaylayan_kullanici').value;
  
  //   fetch('/kullaniciEkle', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       e_durum,
  //       e_ad,
  //       e_soyad,
  //       e_onaylayan_kullanici: e_kullanici_adi
  //     })
  //   })
  //   .then(r => r.json())
  //   .then(newUser => {
  //     alert('Yeni kullanıcı eklendi!');
  //     users.push(newUser);
  //     draw(users);
  //     kapatModal();
  //   })
  //   .catch(err => alert('Ekleme başarısız: ' + err));
   
  // }
  
  //   function kullaniciDuzenle(secilenKayit) {
  //   const e_durum = document.getElementById('e_durum').value;
  //   const e_ad = document.getElementById('e_ad').value;
  //   const e_soyad = document.getElementById('e_soyad').value;
  //   const e_kullanici_adi = document.getElementById('e_onaylayan_kullanici').value;
  
  //   fetch('/kullaniciDuzenle', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       e_id: secilenKayit.e_id,
  //       e_durum,
  //       e_ad,
  //       e_soyad,
  //       e_onaylayan_kullanici: e_kullanici_adi
  //     })
  //   })
  //   .then(r => r.json())
  //   .then(res => {
  //     alert('Güncelleme başarılı!');
  //     let idx = users.findIndex(u => u.e_id == secilenKayit.e_id);
  //     if (idx !== -1) {
  //       users[idx].e_durum = e_durum;
  //       users[idx].e_ad = e_ad;
  //       users[idx].e_soyad = e_soyad;
  //       users[idx].e_onaylayan_kullanici = e_kullanici_adi;
  //     }
  //     draw(users);
  //     kapatModal();
  //   })
  //   .catch(err => alert('Güncelleme başarısız: ' + err));
  //   }
  // }






  <!DOCTYPE html>
<html lang="tr">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="/style/table.css">
    <link rel="stylesheet" href="/style/settings.css">
    <link rel="stylesheet" href="/style/top-bar.css">
    <link rel="stylesheet" href="/style/template.css">
    <link rel="stylesheet" href="/style/dropdown.css">
    <link rel="stylesheet" href="/style/custom-modal.css">
    <title>
      Kullanıcı Kayıtları
    </title>
  </head>
  
  <body>
    <div class="container-body">
      <div class="body-top">
        <div class="top-bar">
          <div class="panel-wrapper">
            <div class="logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 4H21V6H8V4ZM3 3.5H6V6.5H3V3.5ZM3 10.5H6V13.5H3V10.5ZM3 17.5H6V20.5H3V17.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z">
                </path>
              </svg>
              <h1>
                Kullanıcı Listesi
              </h1>
            </div>
            <div class="dropdown-container">
              <div class="dropdown-container">
                <a class="a" href="/pages/anasayfa/anasayfa.html">Anasayfa</a>
                <a class="a" href="/pages/kullaniciListesi/kullaniciListesi.html">Kullanıcı Listesi</a>
                <a class="a" href="/pages/gorevListesi/gorevListesi.html">Görev Listesi</a>  
                <a class="a" href="/pages/kayitListesi/kayitListesi.html">Kayıt Listesi</a> 
              </div>
            </div>
          </div>
        </div>
       
      </div>
      <div class="body-bottom">
        <div class="right">
          
          <div class="table-top">
              <div class="table-header">
                <div class="group">
                  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
                  <input placeholder="Kullanıcı Adına Göre Ara" id="filterUser" type="search" class="input">
                </div>
              </div>        
            </div>

            <div class="table-bottom">
              <div class="table-container">
                <div class="table-body">
                  <table id="kullaniciTablo">
                    <thead>
                      <tr>
                        <th class="w-10">Kullanıcı Adı</th>
                        <th class="w-5">Ad</th>
                        <th class="w-5">Soyad</th>
                        <th class="w-10">Durum</th>
                        <th class="w-10">
                          <button class="add-button w-100" onclick="kullaniciOlusturModal()">
                            <a class="text">
                              Kullanıcı Oluştur
                            </a>
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- Veriler burada dinamik olarak eklenecek -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    <script src="kullaniciListesi.js">
    </script>
    <!-- MODAL -->
    <div class="modal-container" id="kullaniciTanimlariModal" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h2> Kullanıcı Ekleme Formu</h2>
        </div>
        <hr>
        <div class="modal-body">
          <form>
            <div class="column-flat">
              <label for="durumSec" style="display:block; margin-bottom:8px;">Kullanıcı Durumu:</label>
              <select class="custom-select w-100" name="e_durum" id="e_durum" required>
                <option value="">---- Seçiniz ----</option>
                <option value="Aktif">Aktif</option>
                <option value="Pasif">Pasif</option>
              </select>
            </div>
            <div class="column-flat">
              <label for="">Kullanıcı Adı *</label>
              <input id="e_onaylayan_kullanici" name="e_onaylayan_kullanici" required="" placeholder="" type="text" class="input">
            </div>
            <div class="column-flat">
              <label for="">Ad *</label>
              <input id="e_ad" name="e_ad" required="" placeholder="" type="text" class="input" required>
            </div>
            <div class="column-flat">
              <label for="">Soyad *</label>
              <input id="e_soyad" name="e_soyad" required="1" placeholder="" type="text" class="input" required>
            </div>
          </form>
        </div>
        <div class="modal-footer gap-12">
          <button type="button" class="button" onclick="kullaniciDurumGuncelle()">
            <span>Kaydet</span>
          </button>
          <button class="button" onclick="kapatModal()">
            <span>Kapat</span>
          </button>
        </div>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  </body>

</html>