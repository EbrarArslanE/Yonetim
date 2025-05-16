let grafikChart1 = null;
let grafikChart2 = null;

fetch('/musteriListesi')
  .then(res => res.json())
  .then(data => {
    // 1. Grafik: Talep Başlığına Göre Bar Chart
    const basliklar = {};
    data.forEach(item => {
      if (basliklar[item.e_talep_basligi]) {
        basliklar[item.e_talep_basligi]++;
      } else {
        basliklar[item.e_talep_basligi] = 1;
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
          backgroundColor: '#58A6FF'
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

    fetch('/musteriListesi')
      .then(res => res.json())
      .then(data => {
        const toplam = data.length;
        const bugun = data.length;
        const hafta = data.filter(t => new Date(t.tarih) >= haftaninIlkGunu()).length;

        document.getElementById('toplamTalep').textContent = toplam;
        document.getElementById('bugunTalep').textContent = bugun;
        document.getElementById('haftalikTalep').textContent = hafta;
        document.getElementById('ortalamaSure').textContent = '3s 20dk'; // örnek
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

