window.onload = () => {
  const tbody = document.querySelector('#gorevTablosu tbody');
  const search = document.getElementById('filterUser');
  let users = [];
  // Kullanıcıları getir ve select'lere ekle
  fetch('/kullaniciListesi')
    .then(r => r.json())
    .then(list => {
      users = list; // 🔥 Bu satır önemli: listeyi 'users' dizisine atıyoruz

      const kullaniciAtamaEkle = document.getElementById('e_kullanici_adi');
      const ustlenenKullanıcıEkle = document.getElementById('e_gorevli_kullanici');
      const gorevliKullanicilar = document.getElementById('gorevliKullaniciFiltrele');

      list.forEach(u => {
        const optionText = `${u.e_ad} ${u.e_soyad} (${u.e_kullanici_adi})`;

        const opt1 = document.createElement('option');
        opt1.value = u.e_kullanici_adi;
        opt1.textContent = optionText;
        kullaniciAtamaEkle.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = u.e_kullanici_adi;
        opt2.textContent = optionText;
        ustlenenKullanıcıEkle.appendChild(opt2);

        const opt3 = document.createElement('option');
        opt3.value = u.e_gorevli_kullanici;
        opt3.textContent = optionText;
        gorevliKullanicilar.appendChild(opt3);
      });

      // Sayfa yüklendiğinde tüm kullanıcıları çiz
      draw(users);
    })
    .catch(err => console.error('Kullanıcı çekme hatası:', err));

  // Kullanıcıları tabloya çiz
    fetch('/gorevListesi')
    .then(r => r.json())
    .then(data => {
      users = data;
      draw(users);
    })
    .catch(err => console.error('Görev çekme hatası', err));

  function draw(arr) {
    tbody.innerHTML = '';
    arr.forEach(u => {
         const durumDegeri = String(u.e_durum || '').toLowerCase();
    let badgeDegeri;

    // Duruma göre rozet rengi ata
    switch (durumDegeri) {
      case 'iptal edildi':
        badgeDegeri = 'bg-danger'; // sarımsı
        break;
      case 'tamamlandı':
        badgeDegeri = 'bg-success'; // yeşil
        break;
      case 'bekliyor':
        badgeDegeri = 'bg-warning'; // bilinmeyen durumlar için gri
      default:
    }

    const badgeSinifi = durumDegeri.charAt(0).toUpperCase() + durumDegeri.slice(1);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.e_gorevli_kullanici}</td>
            <td class="text-left">${u.e_kullanici_adi || 'Yok'}</td>
            <td class="text-left">${u.e_gorev}</td>
            <td class="text-center"><span class="w-100 badge ${badgeDegeri}">${badgeSinifi}</span></td>
            <td class="text-center w-10">
              <div class="flex flex-row gap-2 w-100">
                <button class="Btn" onclick="gorevDuzenlemeModunaGec('${u.e_id}')">
                  <span style="font-size : 12px;">Düzenle</span>
                  <svg class="svg" viewBox="0 0 512 512">
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                </svg>
                </button>
                <button class="bin-button" onclick="gorevSil('${u.e_id}', '${u.e_kullanici_adi}', '${u.e_gorevli_kullanici}', '${u.e_gorev}', '${u.e_durum}')">
                                <svg class="bin-top" viewBox="0 0 39 7" fill="none"><line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line><line x1="12" y1="1.5" x2="26.0357" y2="1.5" stroke="white" stroke-width="3"></line></svg>
                <svg class="bin-bottom" viewBox="0 0 33 39" fill="none"><mask id="path-1-inside-1_8_19" fill="white"><path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path></mask><path d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" fill="white" mask="url(#path-1-inside-1_8_19)"></path><path d="M12 6L12 29" stroke="white" stroke-width="4"></path><path d="M21 6V29" stroke="white" stroke-width="4"></path></svg>
                </button>
              </div>
            </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Arama filtresi (isteğe bağlı aktif edilebilir)
const filterInput = document.getElementById('filterInput');

filterInput.addEventListener('input', () => {
  const q = filterInput.value.toLowerCase();
  const filt = users.filter(u =>
    u.e_kullanici_adi.toLowerCase().includes(q) ||
    u.e_gorev.toLowerCase().includes(q) ||
    u.e_gorevli_kullanici.toLowerCase().includes(q)
  );
  draw(filt);
});

const dropdownInput = document.getElementById('gorevliKullaniciFiltrele');

dropdownInput.addEventListener('select', () => {
  const q = dropdownInput.value.toLowerCase();
  const filt = users.filter(u =>
    u.e_gorevli_kullanici.toLowerCase().includes(q)
  );
  draw(filt);
});


  // Düzenle butonu için modalı açar ve inputları doldurur
  window.gorevDuzenlemeModunaGec = (e_id) => {
    secilenKayit = users.find(u => String(u.e_id) === String(e_id));
    const modal = document.getElementById("gorevTanimlariModal");
    modal.dataset.musteriNumarasi = e_id;

    if (secilenKayit) {
      document.getElementById('e_durum').value = secilenKayit.e_durum || '';
      document.getElementById('e_gorevli_kullanici').value = secilenKayit.e_gorevli_kullanici || '';
      document.getElementById('e_gorev').value = secilenKayit.e_gorev || '';
      document.getElementById('e_kullanici_adi').value = secilenKayit.e_kullanici_adi || '';
    }

    modal.style.display = "flex";
  };

  // Yeni kullanıcı ekleme modalını açar
  window.kullaniciOlusturModal = () => {
    secilenKayit = null;
    const modal = document.getElementById("gorevTanimlariModal");
    modal.dataset.musteriNumarasi                           = '';
    document.getElementById('e_durum').value                = '';
    document.getElementById('e_gorevli_kullanici').value    = '';
    document.getElementById('e_gorev').value                = '';
    document.getElementById('e_kullanici_adi').value  = '';
    modal.style.display = "flex";
  };

  // Modal kapatma fonksiyonu
  window.kapatModal = () => {
    document.getElementById('gorevTanimlariModal').style.display = 'none';
    secilenKayit = null;
    document.getElementById('e_durum').value = '';
    document.getElementById('e_gorevli_kullanici').value = '';
    document.getElementById('e_gorev').value = '';
    document.getElementById('e_kullanici_adi').value = '';
  };
};

window.islemiKaydet = () => {
  const e_durum = document.getElementById('e_durum').value;
  const e_gorev = document.getElementById('e_gorev').value;
  const e_gorevli_kullanici = document.getElementById('e_gorevli_kullanici').value;
  const e_kullanici_adi = document.getElementById('e_kullanici_adi').value;

  const veri = {
    e_durum,
    e_gorev,
    e_gorevli_kullanici,
    e_kullanici_adi
  };

  let url = '';
  let method = '';

  // Eğer secilenKayit varsa, güncelleme yapıyoruz
  if (secilenKayit && secilenKayit.e_id) {
    veri.e_id = secilenKayit.e_id;
    url = `/gorevDuzenle`;
    method = 'POST';
  } else {
    // Yeni kayıt oluşturuyoruz
    url = '/gorevEkle';
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
function gorevSil(id) {
  fetch('/gorevSil', {
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
