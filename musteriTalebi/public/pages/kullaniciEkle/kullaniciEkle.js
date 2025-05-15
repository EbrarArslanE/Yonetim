  document.querySelector('.form').addEventListener('submit', function (e) {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    const e_ad = document.getElementById('e_ad').value;
    const e_soyad = document.getElementById('e_soyad').value;
    const e_onaylayan_kullanici = document.getElementById('e_onaylayan_kullanici').value;
    const e_durum = document.getElementById('e_durum').value;

    if (!e_ad || !e_soyad || !e_onaylayan_kullanici || !e_durum) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    fetch('/kullaniciEkle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        e_ad,
        e_soyad,
        e_onaylayan_kullanici,
        e_durum
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.mesaj) {
        alert(data.mesaj);
        document.querySelector('.form').reset(); // Formu temizle
      } else if (data.hata) {
        alert("Hata: " + data.hata);
      }
    })
    .catch(err => {
      console.error("İstek hatası:", err);
      alert("Bir hata oluştu.");
    });
  });
