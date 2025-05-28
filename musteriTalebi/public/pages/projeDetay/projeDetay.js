window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("e_id");
  console.log("Seçilen ID:", id);

  if (id) {
    fetch("/projeListesi") // JSON dosyanın yolu doğru mu kontrol et
      .then(res => res.json())
      .then(data => {
        // ID'ye göre proje bul
        const proje = data.find(item => item.e_id === id);
        if (!proje) {
          console.error("Proje bulunamadı.");
          return;
        }

        document.getElementById('e_proje_adi').textContent = proje.e_proje_adi;
        document.getElementById('e_proje_yetkilisi').textContent = proje.e_proje_yetkilisi;
        document.getElementById('e_firma_adi').textContent = proje.e_firma_adi;
        document.getElementById('e_durum').textContent = proje.e_durum;
        document.getElementById('e_proje_alim_tarihi').textContent = proje.e_proje_alim_tarihi;
        document.getElementById('e_proje_teslim_tarihi').textContent = proje.e_proje_teslim_tarihi;
        document.getElementById('e_mail_bilgisi').textContent = proje.e_mail_bilgisi;
        document.getElementById('e_telefon_bilgisi').textContent = proje.e_telefon_bilgisi;
        document.getElementById('e_ekip_uyeleri').textContent = proje.e_ekip_uyeleri;
        document.getElementById('e_proje_tipi').textContent = proje.e_proje_tipi;
        document.getElementById('e_git_repo_linki').href = proje.e_git_repo_linki;
        document.getElementById('e_oncelik').textContent = proje.e_oncelik;
        document.getElementById('e_fiyat').textContent = proje.e_fiyat;
      })
      .catch(err => console.error("Detay getirme hatası:", err));
  }
};
