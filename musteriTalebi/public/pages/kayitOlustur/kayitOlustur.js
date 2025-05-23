function kaydet() {
  const formData = new FormData(document.querySelector('form')); // Formdan veriyi alıyoruz

  fetch('http://localhost:1312/kayitIslemiKaydet', {
    method: 'POST',
    body: formData // Form verisini POST olarak gönderiyoruz
  })
  .then(response => response.json()) // JSON olarak yanıt alıyoruz
  .then(data => {
    if (data.mesaj) {
      alert(data.mesaj); // Başarı mesajını alert olarak gösteriyoruz
    }
  })
  .catch(error => {
    console.error('Kayıt ekleme hatası:', error);
    alert('Kayıt eklenirken bir hata oluştu.');
  });
}
fetch('/kullaniciListesi')
  .then(r => r.json())
  .then(list => {
    const sel = document.getElementById('e_kullanici_adi');
    list.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.e_kullanici_adi;
      opt.textContent = `${u.e_ad} ${u.e_soyad} (${u.e_kullanici_adi})`;
      sel.appendChild(opt);
    });
  });


  // Açma ve kapama butonlarına işlevsellik ekleyelim
const sidebar = document.getElementById('sidebar');
const openBtn = document.getElementById('open-btn');
const closeBtn = document.getElementById('close-btn');

// Sidebar'ı açmak için
openBtn.addEventListener('click', () => {
  sidebar.classList.add('open');
});

// Sidebar'ı kapatmak için
closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('open');
});