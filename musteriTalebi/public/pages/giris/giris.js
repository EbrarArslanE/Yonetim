const form = document.getElementById('loginForm');
const hataMesaji = document.getElementById('hataMesaji');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const e_kullanici_adi = form.e_kullanici_adi.value.trim();
  const e_sifre = form.e_sifre.value;

  try {
    const response = await fetch('/giris', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ e_kullanici_adi, e_sifre }),
    });

    const data = await response.json();

    if (!response.ok) {
      hataMesaji.textContent = data.hata || 'Giriş yapılamadı.';
      return;
    }
    
    hataMesaji.textContent = data.hata || 'Giriş Başarılı.';
    console.log('Giriş başarılı! Kullanıcı ID:', data.u_id);
    localStorage.setItem('u_id', data.u_id);
    localStorage.setItem('OturumSuresi', data.sessionExpires);
    localStorage.setItem('e_kullanici_adi', data.e_kullanici_adi);


    // Başarılı giriş sonrası yönlendirme
    window.location.href = '/pages/anasayfa/anasayfa.html';

  } catch (error) {
    hataMesaji.textContent = 'Sunucuya bağlanılamadı.';
  }
});
