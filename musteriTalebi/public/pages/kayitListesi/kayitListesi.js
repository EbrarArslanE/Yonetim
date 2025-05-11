      // Sayfa yüklendiğinde verileri çekip tabloya ekle
      window.onload = function() {
    // Tabloyu ve tbody'yi seçiyoruz
    const tabloBody = document.querySelector('#veriTablosu tbody');
    const filterInput = document.querySelector('#filterInput');  // Filtre input'u

    // Veriyi alıyoruz
    fetch('/kayitlar')
        .then(response => response.json())  // JSON formatında veriyi al
        .then(data => {
            // İlk başta tüm verileri tabloya ekliyoruz
            const addDataToTable = (filteredData) => {
                tabloBody.innerHTML = '';  // Önceki verileri temizle
                filteredData.forEach(item => {
                    const row = document.createElement('tr');
                    
                    // Tabloya satır ekliyoruz
                    // Tabloya satır ekliyoruz
                      row.innerHTML = `
                          <td>${item.e_talep_basligi}</td>
                          <td>${item.e_musteri_adi}</td>
                          <td>${item.e_musteri_numarasi}</td>
                          <td>${item.e_talep}</td>
                          <td><button onclick="sil()" class="delete-btn" data-numara="${item.e_musteri_numarasi}">Sil</button></td>

                      `;
                    tabloBody.appendChild(row);
                });
            };

            // Başlangıçta tüm veriyi tabloya ekle
            addDataToTable(data);

            // Filtreleme işlemi
            filterInput.addEventListener('input', function() {
                const searchTerm = filterInput.value.toLowerCase();  // Kullanıcı tarafından girilen arama terimi
                const filteredData = data.filter(item => 
                    item.e_talep_basligi.toLowerCase().includes(searchTerm)
                );
                addDataToTable(filteredData);  // Filtrelenmiş veriyi tabloya ekle
            });
        })
        .catch(error => {
            console.error('Veri çekme hatası:', error);
        });
};
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

function sil(e_musteri_numarasi) {
  fetch('http://localhost:1312/sil', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ e_musteri_numarasi: e_musteri_numarasi }) // JSON olarak gönderiyoruz
  })
  .then(response => response.json())
  .then(data => {
    if (data.mesaj) {
      alert(data.mesaj); // Silme mesajını alert olarak gösteriyoruz
    }
  })
  .catch(error => {
    console.error('Silme işlemi hatası:', error);
    alert('Silme işlemi sırasında bir hata oluştu.');
  });
}

