
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

      console.log('Giriş başarılı! Kullanıcı ID:', data.u_id);
      localStorage.setItem('u_id', data.u_id);

      // Örneğin anasayfaya yönlendir
      // window.location.href = '/anasayfa.html';

    } catch (error) {
      hataMesaji.textContent = 'Sunucuya bağlanılamadı.';
    }
  });
