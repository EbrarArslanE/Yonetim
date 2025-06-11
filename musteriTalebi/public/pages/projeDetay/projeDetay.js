let secilenProje = null;

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("e_id");
  console.log("Seçilen ID:", id);

  if (id) {
    fetch("/projeListesi")
      .then(res => res.json())
      .then(data => {
        secilenProje = data.find(item => item.e_id === id);
        if (!secilenProje) {
          console.error("Proje bulunamadı.");
          return;
        }

        // Form alanlarını doldur
        document.getElementById('e_proje_adi').value = secilenProje.e_proje_adi;
        document.getElementById('e_proje_yetkilisi').value = secilenProje.e_proje_yetkilisi;
        document.getElementById('e_firma_adi').value = secilenProje.e_firma_adi;
        document.getElementById('e_durum').value = secilenProje.e_durum;
        document.getElementById('e_proje_alim_tarihi').value = secilenProje.e_proje_alim_tarihi;
        document.getElementById('e_proje_teslim_tarihi').value = secilenProje.e_proje_teslim_tarihi;
        document.getElementById('e_mail_bilgisi').value = secilenProje.e_mail_bilgisi;
        document.getElementById('e_telefon_bilgisi').value = secilenProje.e_telefon_bilgisi;
        document.getElementById('e_ekip_uyeleri').value = secilenProje.e_ekip_uyeleri;
        document.getElementById('e_proje_tipi').value = secilenProje.e_proje_tipi;
        document.getElementById('e_git_repo_linki').textContent = secilenProje.e_git_repo_linki;
        document.getElementById('e_oncelik').value = secilenProje.e_oncelik;
        document.getElementById('e_fiyat').value = secilenProje.e_fiyat;
      })
      .catch(err => console.error("Detay getirme hatası:", err));
  }

  const modal = document.getElementById('kullaniciEklemeModal');
  const modalClose = document.getElementById('modalKapat');
  const modalOpen = document.getElementById('e_ekip_uyeleri');
  const tbody = document.querySelector('#kullaniciTablo tbody');
  const search = document.getElementById('filterUser');
  let users = [];

  // Modal açma
  modalOpen.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  // Modal kapama
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

    // Filtreleme
  // search.addEventListener('input', e => {
  //   const filtreli = users.filter(u =>
  //     u.e_kullanici_adi.toLowerCase().includes(e.target.value.toLowerCase()) ||
  //     u.e_ad.toLowerCase().includes(e.target.value.toLowerCase()) ||
  //     u.e_soyad.toLowerCase().includes(e.target.value.toLowerCase())
  //   );
  //   draw(filtreli);
  // });

  // Kullanıcıları çek
  fetch('/kullaniciListesi')
    .then(r => r.json())
    .then(list => {
      users = list;
      draw(users);
    })
    .catch(err => console.error('Kullanıcı çekme hatası:', err));

  // Kullanıcıları tabloya çiz
  function draw(arr) {
    tbody.innerHTML = '';
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

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="flex w-100 h-50px justify-center items-center gap-2">
          <input type="checkbox" value="${u.e_kullanici_adi}" class="ekip-checkbox">
        </td>
        <td>${u.e_kullanici_adi}</td>
        <td class="text-center w-10">${u.e_ad}</td>
        <td class="text-center w-10">${u.e_soyad}</td>
        <td class="text-center"><span class="w-100 badge ${badgeDegeri}">${badgeSinifi}</span></td>
      `;
      tbody.appendChild(tr);
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

    const kategoriModal = document.getElementById('kategoriEklemeModal');
    const kategoriModalAc = document.getElementById('e_proje_tipi');
    const kategoriModalKapat = document.getElementById('modalKapat')
    const Kategoritbody = document.querySelector('#kullaniciTablo tbody');
    const kategoriSearch = document.getElementById('filterUser');
    let kategori = [];

      // Modal açma
    kategoriModalAc.addEventListener('click', () => {
      kategoriModal.style.display = 'flex';
    });

    // Modal kapama
    kategoriModalKapat.addEventListener('click', () => {
      kategoriModal.style.display = 'none';
    });

    // Kategorileri çek
  fetch('/kategoriListesi')
    .then(r => r.json())
    .then(list => {
      kategori = list;
      drawKategori(kategori);
    })
    .catch(err => console.error('Kullanıcı çekme hatası:', err));

  // Kullanıcıları tabloya çiz
  function drawKategori(arr) {
    Kategoritbody.innerHTML = '';
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

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="flex w-100 h-50px justify-center items-center gap-2">
          <input type="checkbox" value="${u.e_kategori_adi}" class="ekip-checkbox">
        </td>
        <td>${u.e_kategori_adi}</td>
        <td class="text-center w-10">${u.e_durum}</td>
        <td class="text-center"><span class="w-100 badge ${badgeDegeri}">${badgeSinifi}</span></td>
      `;
      Kategoritbody.appendChild(tr);
    });

    // Checkbox seçimlerini yakala
    const checkboxes = document.querySelectorAll('.ekip-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const secilenler = Array.from(checkboxes)
          .filter(c => c.checked)
          .map(c => c.value);
        document.getElementById('e_proje_tipi').value = secilenler.join(', ');
      });
    });
  }
};

// Kayıt işlemi
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
  const e_git_repo_linki = document.getElementById('e_git_repo_linki').textContent;
  const e_oncelik = document.getElementById('e_oncelik').value;
  const e_fiyat = document.getElementById('e_fiyat').value;

  const veri = {
    e_proje_adi,
    e_proje_yetkilisi,
    e_firma_adi,
    e_durum,
    e_proje_alim_tarihi,
    e_proje_teslim_tarihi,
    e_mail_bilgisi,
    e_telefon_bilgisi,
    e_ekip_uyeleri,
    e_proje_tipi,
    e_git_repo_linki,
    e_oncelik,
    e_fiyat
  };

  let url = '';
  let method = '';

  if (secilenProje && secilenProje.e_id) {
    veri.e_id = secilenProje.e_id;
    url = `/projeDuzenle`;
    method = 'POST';
  } else {
    alert("Güncelleme yapılacak proje bulunamadı.");
    return;
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
      location.reload();
    })
    .catch(err => {
      console.error('Kayıt sırasında hata:', err);
      alert("Bir hata oluştu.");
    });
};


