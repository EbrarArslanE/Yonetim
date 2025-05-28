let secilenProje = null;

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("e_id");
  console.log("Seçilen ID:", id);

  if (id) {
    fetch("/projeListesi")
      .then(res => res.json())
      .then(data => {
        secilenProje = data.find(item => item.e_id === id); // BURADA DEĞİŞTİRİLDİ
        if (!secilenProje) {
          console.error("Proje bulunamadı.");
          return;
        }

        // Değerleri doldur
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
