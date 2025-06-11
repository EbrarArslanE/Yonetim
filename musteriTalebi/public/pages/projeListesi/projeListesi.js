  let secilenKayit = null; // Global değişken
  let users = [];

// Sayfa yüklendiğinde kullanıcıları çek
window.onload = () => {
  const tbody = document.querySelector('#projeTablo tbody');
  const search = document.getElementById('filterUser');

  // Dropdown listesi için kullanıcıları çek
  // fetch('/kullaniciListesi')
  //   .then(r => r.json())
  //   .then(list => {
  //     users = list;
  //     draw(users);

  //     const sel = document.getElementById('e_kullanici_adi');
  //     list.forEach(u => {
  //       const opt = document.createElement('option');
  //       opt.value = u.e_kullanici_adi;
  //       opt.textContent = `${u.e_ad} ${u.e_soyad} (${u.e_kullanici_adi})`;
  //       sel.appendChild(opt);
  //     });
  //   })
  //   .catch(err => console.error('Kullanıcı çekme hatası:', err));

    fetch('/projeListesi')
    .then(r => r.json())
    .then(data => {
      users = data;
      draw(users);
    })
    .catch(err => console.error('Projeleri çekme hatası', err));

  function draw(arr) {
    tbody.innerHTML = '';
       arr.forEach(u => {
    const durumDegeri = String(u.e_durum || '').toLowerCase();
    let badgeDegeri;

    // Duruma göre rozet rengi ata
    switch (durumDegeri) {
      case 'pasif':
        badgeDegeri = 'bg-danger'; // sarımsı
        break;
      case 'aktif':
        badgeDegeri = 'bg-success'; // yeşil
        break;
      default:
        badgeDegeri = 'bg-secondary'; // bilinmeyen durumlar için gri
    }

    const badgeSinifi = durumDegeri.charAt(0).toUpperCase() + durumDegeri.slice(1);


      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${u.e_proje_adi}</td>
        <td class="text-center w-10">${u.e_proje_yetkilisi}</td>
        <td class="text-center w-5">${u.e_firma_adi}</td>
        <td class="text-center w-5">${u.e_proje_tipi}</td>
        <td class="text-center w-5">${u.e_oncelik}</td>
        <td class="text-center w-5"><span class="w-100 badge ${badgeDegeri}">${badgeSinifi}</span></td>
        <td class="text-center flex w-100 justify-content-center gap-2">
          <button class="detay-button w-50" onclick="detayaGit(${u.e_id})">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
            </svg>
            <div class="detay-text">
              Detay
            </div>  
          </button>
          <button class="bin-button w-50 h-30px" onclick="kullaniciSil('${u.e_id}')">
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

    const modal = document.getElementById('kullaniciEklemeModal');
  const modalClose = document.getElementById('modalKapat');
  const modalOpen = document.getElementById('e_ekip_uyeleri');
  const kullanici_tbody = document.querySelector('#kullaniciTablo tbody');
  const kullanici_search = document.getElementById('filterUser');

  // Modal açma
  modalOpen.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  // Modal kapama
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Kullanıcıları çek
  fetch('/kullaniciListesi')
    .then(r => r.json())
    .then(list => {
      users = list;
      drawKullaniciListesi(users);
    })
    .catch(err => console.error('Kullanıcı çekme hatası:', err));

  // Filtreleme
  // search.addEventListener('input', e => {
  //   const filtreli = users.filter(u =>
  //     u.e_kullanici_adi.toLowerCase().includes(e.target.value.toLowerCase()) ||
  //     u.e_ad.toLowerCase().includes(e.target.value.toLowerCase()) ||
  //     u.e_soyad.toLowerCase().includes(e.target.value.toLowerCase())
  //   );
  //   draw(filtreli);
  // });

  // Kullanıcıları tabloya çiz
  function drawKullaniciListesi(arr) {
    kullanici_tbody.innerHTML = '';
    arr.forEach(u => {
      const durumDegeri = String(u.e_durum || '').toLowerCase();
      let badgeDegeri;

      switch (durumDegeri) {
        case 'pasif':
          badgeDegeri = 'bg-danger';
          break;
        case 'aktif':
          badgeDegeri = 'bg-success';
          break;
        default:
          badgeDegeri = 'bg-secondary';
      }

      const badgeSinifi = durumDegeri.charAt(0).toUpperCase() + durumDegeri.slice(1);

      const kullanici_tr = document.createElement('tr');
      kullanici_tr.innerHTML = `
        <td class="flex w-100 h-50px justify-center items-center gap-2">
          <input type="checkbox" value="${u.e_kullanici_adi}" class="ekip-checkbox">
        </td>
        <td>${u.e_kullanici_adi}</td>
        <td class="text-center w-10">${u.e_ad}</td>
        <td class="text-center w-10">${u.e_soyad}</td>
        <td class="text-center"><span class="w-100 badge ${badgeDegeri}">${badgeSinifi}</span></td>
      `;
      kullanici_tbody.appendChild(kullanici_tr);
    });

    // Checkbox seçimlerini yakala
    const checkboxes = document.querySelectorAll('.ekip-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const secilenler = Array.from(checkboxes)
          .filter(c => c.checked)
          .map(c => c.value);
        document.getElementById('e_ekip_uyeleri').value = secilenler.join(', ');
      });
    });
  }

  // Düzenle butonu için modalı açar ve inputları doldurur
  window.projeDuzenlemeModunaGec = (e_id) => {
    secilenKayit = users.find(u => String(u.e_id) === String(e_id));
    const modal = document.getElementById("projeTanimlariModal");
    modal.dataset.musteriNumarasi = e_id;

    if (secilenKayit) {
      document.getElementById('e_proje_teslim_tarihi').value = secilenKayit.e_proje_teslim_tarihi || '';
      document.getElementById('e_proje_alim_tarihi').value = secilenKayit.e_proje_alim_tarihi     || '';
      document.getElementById('e_mail_bilgisi').value = secilenKayit.e_mail_bilgisi               || '';
      document.getElementById('e_telefon_bilgisi').value = secilenKayit.e_telefon_bilgisi         || '';
      document.getElementById('e_proje_yetkilisi').value = secilenKayit.e_proje_yetkilisi         || '';
      document.getElementById('e_git_repo_linki').value = secilenKayit.e_git_repo_linki           || '';
      document.getElementById('e_proje_tipi').value = secilenKayit.e_proje_tipi                   || '';
      document.getElementById('e_firma_adi').value = secilenKayit.e_firma_adi                     || '';
      document.getElementById('e_proje_adi').value = secilenKayit.e_proje_adi                     || '';
      document.getElementById('e_oncelik').value = secilenKayit.e_oncelik                         || '';
      document.getElementById('e_durum').value = secilenKayit.e_durum                             || '';
      document.getElementById('e_fiyat').value = secilenKayit.e_fiyat                             || '';
    }

    modal.style.display = "flex";
  };

  // Yeni kullanıcı ekleme modalını açar
  window.projeEkleModal = () => {
    secilenKayit = null;
    const modal = document.getElementById("projeTanimlariModal");
    modal.dataset.musteriNumarasi = '';
    document.getElementById('e_proje_teslim_tarihi').value  = '';
    document.getElementById('e_proje_alim_tarihi').value    = '';
    document.getElementById('e_telefon_bilgisi').value      = '';
    document.getElementById('e_mail_bilgisi').value         = '';
    document.getElementById('e_proje_yetkilisi').value      = '';
    document.getElementById('e_git_repo_linki').value       = '';
    document.getElementById('e_ekip_uyeleri').value         = '';
    document.getElementById('e_proje_tipi').value           = '';
    document.getElementById('e_firma_adi').value            = '';
    document.getElementById('e_proje_adi').value            = '';
    document.getElementById('e_oncelik').value              = '';
    document.getElementById('e_durum').value                = '';
    document.getElementById('e_fiyat').value                = '';
    modal.style.display = "flex";
  };

  // Modal kapatma fonksiyonu
  window.kapatModal = () => {
    document.getElementById('projeTanimlariModal').style.display = 'none';
    secilenKayit = null;
    document.getElementById('e_proje_teslim_tarihi').value  = '';
    document.getElementById('e_proje_alim_tarihi').value    = '';
    document.getElementById('e_telefon_bilgisi').value      = '';
    document.getElementById('e_mail_bilgisi').value         = '';
    document.getElementById('e_proje_yetkilisi').value      = '';
    document.getElementById('e_git_repo_linki').value       = '';
    document.getElementById('e_ekip_uyeleri').value         = '';
    document.getElementById('e_proje_tipi').value           = '';
    document.getElementById('e_firma_adi').value            = '';
    document.getElementById('e_proje_adi').value            = '';
    document.getElementById('e_oncelik').value              = '';
    document.getElementById('e_durum').value                = '';
    document.getElementById('e_fiyat').value                = '';
  };
};
window.islemiKaydet = () => {
  const e_proje_adi = document.getElementById('e_proje_adi').value;
  const e_proje_yetkilisi = document.getElementById('e_proje_yetkilisi').value;
  const e_firma_adi = document.getElementById('e_firma_adi').value;
  const e_durum = document.getElementById('e_durum').value;
  const e_proje_alim_tarihi = document.getElementById('e_proje_alim_tarihi').value;
  const e_proje_teslim_tarihi = document.getElementById('e_proje_teslim_tarihi').value;
  const e_mail_bilgisi = document.getElementById('e_mail_bilgisi').value;
  const e_telefon_bilgisi = document.getElementById('e_telefon_bilgisi').value;
  const e_ekip_uyeleri = document.getElementById('e_ekip_uyeleri').value;
  const e_proje_tipi = document.getElementById('e_proje_tipi').value;
  const e_git_repo_linki = document.getElementById('e_git_repo_linki').value;
  const e_oncelik = document.getElementById('e_oncelik').value;
  const e_fiyat = document.getElementById('e_fiyat').value;


  const veri = {
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

  let url = '';
  let method = '';

  // Eğer secilenKayit varsa, güncelleme yapıyoruz
  if (secilenKayit && secilenKayit.e_id) {
    veri.e_id = secilenKayit.e_id;
    url = `/projeDuzenle`;
    method = 'POST';
  } else {
    // Yeni kayıt oluşturuyoruz
    url = '/projeEkle';
    method = 'POST';
  }

  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(veri)
  })
    .then(res => {
      if (!res.ok) throw new Error("Sunucudan hata döndü.");
      return res.json();
    })
    .then(data => {
      alert("İşlem başarıyla kaydedildi.");
      location.reload(); // Sayfayı yenileyerek listeyi güncelle
    })
    .catch(err => {
      console.error('Kayıt sırasında hata:', err);
      alert("Bir hata oluştu.");
    });
};
function kullaniciSil(id) {
  fetch('/projeSil', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ e_id: id })
  })
  .then(res => {
    if (!res.ok) return res.text().then(text => { throw new Error(text); });
    return res.json();
  })
  .then(data => {
    alert(data.mesaj);
  location.reload();
})
.catch(err => {
  console.error('Silme sırasında hata:', err);
  alert('Silme sırasında hata oluştu: ' + err.message);
});
}

function detayaGit(e_id) {
  localStorage.setItem('secilenProjeId', e_id);
  const url = `/pages/projeDetay/projeDetay.html?e_id=${e_id}`;
  window.location = url;
}


