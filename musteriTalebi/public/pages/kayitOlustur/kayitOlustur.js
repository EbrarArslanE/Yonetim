function kaydet() {
  const formData = new FormData(document.querySelector('form')); // Formdan veriyi alıyoruz

  fetch('http://localhost:1312/kaydet', {
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