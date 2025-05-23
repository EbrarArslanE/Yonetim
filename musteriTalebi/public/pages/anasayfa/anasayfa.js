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
      backgroundColor: '#FFC107',
      borderColor: '#DDDDDD',
      borderWidth: 1
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: {
          color: '#C9D1D9', // Yazı rengi
          font: {
            size: 14,
            weight: 'bold',
            family: 'Arial'
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#C9D1D9', // X ekseni yazı rengi
          font: {
            size: 12
          }
        }
      },
      y: {
        ticks: {
          color: '#C9D1D9', // Y ekseni yazı rengi
          font: {
            size: 12
          }
        },
        beginAtZero: true
      }
    }
  }
});


    // 2. Grafik: Duruma Göre Pie Chart
    const durumlar = {};
    data.forEach(item => {
      const durum = item.e_durum?.trim();
      if (!durum) return;

      if (durumlar[durum]) {
        durumlar[durum]++;
      } else {
        durumlar[durum] = 1;
      }
    });

    const durumLabels = Object.keys(durumlar);
    const durumValues = Object.values(durumlar);

    // Renk eşlemesi
    const renkler = {
      "Bekliyor": "#FFD66B",       // sarı
      "İptal Edildi": "#FF6B6B",   // kırmızı
      "Tamamlandı": "#4CAF50"      // yeşil
    };

    const durumBackgroundColors = durumLabels.map(label => renkler[label] || '#ccc');

    const ctx2 = document.getElementById('grafik2').getContext('2d');
    if (grafikChart2) {
      grafikChart2.destroy();
    }
    grafikChart2 = new Chart(ctx2, {
      // type: 'pie', isteğe göre aktif ederim bi ara
      type: 'doughnut',
      data: {
        labels: durumLabels,
        datasets: [{
          label: 'Duruma Göre Kayıt Sayısı',
          data: durumValues,
          backgroundColor: durumBackgroundColors
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              font: {
                size: 14,
                family: 'Arial'
              },
              color: '#C9D1D9',
              generateLabels: function(chart) {
                const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                const labelsOriginal = original(chart);

                labelsOriginal.forEach(label => {
                  const text = label.text;
                  if (renkler[text]) {
                    label.fillStyle = renkler[text];
                  }
                });

                return labelsOriginal;
              }
            }
          }
        }
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

  // Dışarı tıklayınca dropdown'ı kapat
  window.addEventListener('click', (e) => {
    if (!e.target.matches('.dropdown-btn')) {
      content.style.display = 'none';
    }
  });

const sessionExpires = localStorage.getItem('sessionExpires');
if (sessionExpires && Date.now() > parseInt(sessionExpires)) {
  alert('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
  localStorage.removeItem('u_id');
  localStorage.removeItem('sessionExpires');
  window.location.href = '/pages/giris/giris.html';
}
const girisYapanKullanici = localStorage.getItem('e_kullanici_adi');
document.getElementById('girisYapanKullanici').textContent = girisYapanKullanici ? `Hoş geldin, ${girisYapanKullanici}` : 'Giriş yapmadınız.';