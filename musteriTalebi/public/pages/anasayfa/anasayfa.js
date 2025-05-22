let grafikChart1 = null;
let grafikChart2 = null;

fetch('/musteriTalepListesi')
  .then(res => res.json())
  .then(data => {
    // 1. Grafik: Talep Başlığına Göre Bar Chart
    const basliklar = {};
    data.forEach(item => {
      if (basliklar[item.e_firma_adi]) {
        basliklar[item.e_firma_adi]++;
      } else {
        basliklar[item.e_firma_adi] = 1;
      }
    });

    const baslikLabels = Object.keys(basliklar);
    const baslikValues = Object.values(basliklar);

    // Eğer grafik varsa önce sil, sonra yenisini çiz
    const ctx1 = document.getElementById('grafik1').getContext('2d');
    if (grafikChart1) {
      grafikChart1.destroy();
    }
    grafikChart1 = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: baslikLabels,
        datasets: [{
          label: 'Talep Başlığına Göre Kayıt Sayısı',
          data: baslikValues,
          backgroundColor: '#58A6FF',
          borderColor: '#fff',
          borderWidth: 1
        }]
      }
    });

    // 2. Grafik: Duruma Göre Pie Chart
    const durumlar = {};
    data.forEach(item => {
      if (durumlar[item.e_durum]) {
        durumlar[item.e_durum]++;
      } else {
        durumlar[item.e_durum] = 1;
      }
    });

    const durumLabels = Object.keys(durumlar);
    const durumValues = Object.values(durumlar);

    const ctx2 = document.getElementById('grafik2').getContext('2d');
    if (grafikChart2) {
      grafikChart2.destroy();
    }
    grafikChart2 = new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: durumLabels,
        datasets: [{
          label: 'Duruma Göre Kayıt Sayısı',
          data: durumValues,
          backgroundColor: [
            '#58A6FF',
            '#D9FF3E',
            '#FF6B6B',
            '#1C1C2E'
          ]
        }]
      }
    });
  });

    fetch('/musteriTalepListesi')
      .then(res => res.json())
      .then(data => {
        const toplam = data.length;
        const bugun = data.length;
        const hafta = data.filter(t => new Date(t.tarih) >= haftaninIlkGunu()).length;

        document.getElementById('toplamTalep').textContent = toplam;
        document.getElementById('haftalikTalep').textContent = hafta;
        document.getElementById('ortalamaSure').textContent = '3s 20dk'; // örnek
      });
   
     fetch('/kullaniciListesi')
  .then(res => res.json())
  .then(data => {
    const toplam = data.length;
    const aktifKullanicilar = data.filter(kullanici => kullanici.e_durum === "Aktif").length;
    const pasifKullanicilar = data.filter(kullanici => kullanici.e_durum === "Pasif").length;

    document.getElementById('toplamTalep').textContent = toplam;
    document.getElementById('aktifKullanici').textContent = aktifKullanicilar;
    document.getElementById('pasifKullanici').textContent = pasifKullanicilar;
  });

    
     fetch('/gorevListesi')
  .then(res => res.json())
  .then(data => {
    const aktifGorevler = data.filter(item => item.e_durum === "Bekliyor");
    const tamamlananGorevler = data.filter(item => item.e_durum === "Tamamlandı");

    const aktifGorevSayilari = {};
    const tamamlananGorevSayilari = {};

    aktifGorevler.forEach(item => {
      const kullanici = item.e_gorevli_kullanici;
      aktifGorevSayilari[kullanici] = (aktifGorevSayilari[kullanici] || 0) + 1;
    });

    tamamlananGorevler.forEach(item => {
      const kullanici = item.e_gorevli_kullanici;
      tamamlananGorevSayilari[kullanici] = (tamamlananGorevSayilari[kullanici] || 0) + 1;
    });

    const container = document.getElementById('gorevKullanicilarContainer');
    const container2 = document.getElementById('tamamlananGorevlerContainer');
    container.innerHTML = '';
    container2.innerHTML = '';

    Object.entries(aktifGorevSayilari).forEach(([kullanici, sayi]) => {
      const kart = document.createElement('div');
      kart.className = 'kart';
      kart.innerHTML = `
        <div class="flex flex-col justify-start items-start">
          <h3 style="font-size: 20px;">${kullanici}</h3> 
          <div style="display: flex; flex-direction: row; gap: 5px;">
            <p>Aktif Görev Sayısı:</p>
            <p>${sayi}</p>
          </div>
        </div>
      `;
      container.appendChild(kart);
    });

    Object.entries(tamamlananGorevSayilari).forEach(([kullanici, sayi]) => {
      const kart = document.createElement('div');
      kart.className = 'kart';
      kart.innerHTML = `
        <div class="flex flex-col justify-start items-start">
          <h3 style="font-size: 20px;">${kullanici}</h3> 
          <div style="display: flex; flex-direction: row; gap: 5px;">
            <p>Tamamlanan Görev Sayısı:</p>
            <p>${sayi}</p>
          </div>
        </div>
      `;
      container2.appendChild(kart);
    });
  });


    function haftaninIlkGunu() {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // pazartesi
      return new Date(now.setDate(diff));
    }
  // const btn = document.querySelector('.dropdown-btn');
  const kullaniciBtn = document.getElementById('kullanici');
  const kayitBtn = document.getElementById('kayit');
  const content = document.querySelector('.dropdown-content');

  kullaniciBtn.addEventListener('click', () => {
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
  });
  kayitBtn.addEventListener('click', () => {
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
  });

  // Dışarı tıklayınca dropdown'ı kapat
  window.addEventListener('click', (e) => {
    if (!e.target.matches('.dropdown-btn')) {
      content.style.display = 'none';
    }
  });

