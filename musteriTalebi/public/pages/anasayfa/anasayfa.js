    fetch('/kayitlar')
  .then(res => res.json())
  .then(data => {
    const basliklar = {};
    data.forEach(item => {
      if (basliklar[item.e_talep_basligi]) {
        basliklar[item.e_talep_basligi]++;
      } else {
        basliklar[item.e_talep_basligi] = 1;
      }
    });

    const labels = Object.keys(basliklar);
    const values = Object.values(basliklar);

    const ctx = document.getElementById('grafik').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Talep Başlığına Göre Kayıt Sayısı',
          data: values,
          backgroundColor: '#58A6FF'
        }]
      }
    });
  });
    fetch('/kayitlar')
      .then(res => res.json())
      .then(data => {
        const toplam = data.length;
        const bugun = data.filter(t => t.tarih === new Date().toISOString().slice(0, 10)).length;
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
