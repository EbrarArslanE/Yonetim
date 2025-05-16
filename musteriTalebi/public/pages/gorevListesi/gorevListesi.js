// Sayfa yüklendiğinde verileri çekip tabloya ekle
window.onload = function () {
  const tabloBody = document.querySelector('#gorevTablosu tbody');
  const filterInput = document.querySelector('#filterInput');

  // Kullanıcı listelerini doldur
  fetch('/kullaniciListesi')
    .then(r => r.json())
    .then(list => {
      const sel1 = document.getElementById('kullaniciListele');
      const sel2 = document.getElementById('kullaniciAtamaListele');
      list.forEach(u => {
        const optionText = `${u.e_ad} ${u.e_soyad} (${u.e_onaylayan_kullanici})`;

        const opt1 = document.createElement('option');
        opt1.value = u.e_onaylayan_kullanici;
        opt1.textContent = optionText;
        sel1.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = u.e_onaylayan_kullanici;
        opt2.textContent = optionText;
        sel2.appendChild(opt2);
      });
    });

  // Görev listesini getir
  fetch('/gorevListesi')
    .then(response => response.json())
    .then(data => {
      const addDataToTable = (filteredData) => {
        tabloBody.innerHTML = '';
        filteredData.forEach(gorev => {
          const durumDegeri = String(gorev.e_durum || '').toLowerCase();
          const badgeDegeri =
            durumDegeri === 'tamamlandı' ? 'bg-success' :
            durumDegeri === 'beklemede' ? 'bg-warning' :
            durumDegeri === 'iptal edildi' ? 'bg-danger' :
            'bg-secondary';

          const badgeSinifi = durumDegeri.charAt(0).toUpperCase() + durumDegeri.slice(1);

          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${gorev.e_gorevli_kullanici}</td>
            <td class="text-left">${gorev.e_onaylayan_kullanici || 'Yok'}</td>
            <td class="text-left">${gorev.e_gorev}</td>
            <td class="text-center"><span class="w-100 badge ${badgeDegeri}">${badgeSinifi}</span></td>
            <td class="text-center w-10">
              <div class="flex flex-row gap-2 w-100">
                <button class="Btn" onclick="acModal('${gorev.e_gorevli_kullanici}')">
                  <span style="font-size : 12px;">Düzenle</span>
                  <svg class="svg" viewBox="0 0 512 512">
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                </svg>
                </button>
                <button class="bin-button" onclick="sil('${gorev.e_gorevli_kullanici}')">
                                <svg class="bin-top" viewBox="0 0 39 7" fill="none"><line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line><line x1="12" y1="1.5" x2="26.0357" y2="1.5" stroke="white" stroke-width="3"></line></svg>
                <svg class="bin-bottom" viewBox="0 0 33 39" fill="none"><mask id="path-1-inside-1_8_19" fill="white"><path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path></mask><path d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" fill="white" mask="url(#path-1-inside-1_8_19)"></path><path d="M12 6L12 29" stroke="white" stroke-width="4"></path><path d="M21 6V29" stroke="white" stroke-width="4"></path></svg>
                </button>
              </div>
            </td>
          `;
          tabloBody.appendChild(row);
        });
      };

      addDataToTable(data);

      filterInput.addEventListener('input', function () {
        const searchTerm = filterInput.value.toLowerCase();
        const filtered = data.filter(item =>
          (item.e_talep_basligi || '').toLowerCase().includes(searchTerm)
        );
        addDataToTable(filtered);
      });
    })
    .catch(error => console.error('Veri çekme hatası:', error));
};

// Sidebar aç/kapat
const sidebar = document.getElementById('sidebar');
const openBtn = document.getElementById('open-btn');
const closeBtn = document.getElementById('close-btn');

if (openBtn && closeBtn && sidebar) {
  openBtn.addEventListener('click', () => sidebar.classList.add('open'));
  closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
}

// Kayıt silme
function sil(e_gorevli_kullanici) {
  fetch('/gorevSil', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ e_gorevli_kullanici })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.mesaj || 'Silme başarılı');
      location.reload();
    })
    .catch(err => console.error('Silme hatası:', err));
}

// Modal işlemleri
function acModal(musteriNumarasi) {
  const modal = document.getElementById("duzenleModal");
  modal.dataset.musteriNumarasi = musteriNumarasi;
  modal.style.display = "flex";
}

function gorevEkle(musteriNumarasi) {
  const modal = document.getElementById("gorevEkleModal");
  modal.dataset.musteriNumarasi = musteriNumarasi;
  modal.style.display = "flex";
}

function kapatModal() {
  document.getElementById("duzenleModal").style.display = "none";
}

function gorevModalKapat() {
  document.getElementById("gorevEkleModal").style.display = "none";
}

// Modal dışına tıklanınca kapat
window.addEventListener("click", function (event) {
  const modal1 = document.getElementById("duzenleModal");
  const modal2 = document.getElementById("gorevEkleModal");
  if (event.target === modal1) modal1.style.display = "none";
  if (event.target === modal2) modal2.style.display = "none";
});

// görev ekleme
function gorevKaydet() {
  const e_gorevli_kullanici   = document.getElementById("kullaniciListele").value;
  const e_onaylayan_kullanici = document.getElementById("kullaniciAtamaListele").value;
  const e_gorev               = document.getElementById("e_gorev").value;
  const e_durum               = document.getElementById("e_durum").value;

  // Eğer e_gorevli_kullanici boşsa, e_onaylayan_kullanıcı'yı kullan (senin istediğin şey bu)
  const gidecek_gorevli = e_gorevli_kullanici || e_onaylayan_kullanici;

  if (!gidecek_gorevli || !e_onaylayan_kullanici || !e_gorev || !e_durum) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  const yeniGorev = {
    e_gorevli_kullanici: gidecek_gorevli,
    e_onaylayan_kullanici,
    e_gorev,
    e_durum
  };

  fetch('/gorevEkle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(yeniGorev)
  })
  .then(response => response.json())
  .then(data => {
    alert("Görev başarıyla eklendi.");
    location.reload()
  })
  .catch(err => {
    console.error('Hata:', err);
    alert("Görev eklenirken hata oluştu.");
  });
}


document.getElementById("filterInput").addEventListener("input", filtrele);
document.getElementById("durumFiltrele").addEventListener("change", filtrele);

function filtrele() {
  const arama = document.getElementById("filterInput").value.toLowerCase();
  const durum = document.getElementById("durumFiltrele").value;

  const satirlar = document.querySelectorAll("#gorevTablosu tbody tr");

  satirlar.forEach(satir => {
    const ad = satir.children[1].textContent.toLowerCase();
    const satirDurum = satir.children[3].textContent;

    const goster = (!arama || ad.includes(arama)) && (!durum || durum === satirDurum);
    satir.style.display = goster ? "" : "none";
  });
}
