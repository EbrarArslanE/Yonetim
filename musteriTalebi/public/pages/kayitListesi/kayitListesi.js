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
                          <td>
                              <button
                                onclick="sil(this)"
                                class="bin-button"
                                data-numara="${item.e_musteri_numarasi}"
                              >
                                <svg
                                  class="bin-top"
                                  viewBox="0 0 39 7"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
                                  <line
                                    x1="12"
                                    y1="1.5"
                                    x2="26.0357"
                                    y2="1.5"
                                    stroke="white"
                                    stroke-width="3"
                                  ></line>
                                </svg>
                                <svg
                                  class="bin-bottom"
                                  viewBox="0 0 33 39"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <mask id="path-1-inside-1_8_19" fill="white">
                                    <path
                                      d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                                    ></path>
                                  </mask>
                                  <path
                                    d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                                    fill="white"
                                    mask="url(#path-1-inside-1_8_19)"
                                  ></path>
                                  <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
                                  <path d="M21 6V29" stroke="white" stroke-width="4"></path>
                                </svg>
                              </button>
                            </td>
                            <td>   
                            <button class="Btn" onclick="acModal()">
                             <span>Düzenle</span>
                             <svg class="svg" viewBox="0 0 512 512">
                               <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                               </button>
                            </td>
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
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("duzenleModal");
  const buttons = document.querySelectorAll(".Btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      modal.style.display = "flex";
    });
  });
});

function kapatModal() {
  document.getElementById("duzenleModal").style.display = "none";
}


// function kayitDuzenle() {
//   const e_talep_basligi = document.getElementById("e_talep_basligi").value;
//   const e_musteri_adi = document.getElementById("e_musteri_adi").value;
//   const e_musteri_numarasi = document.getElementById("e_musteri_numarasi").value;
//   const e_talep = document.getElementById("e_talep").value;

//   fetch('http://localhost:1312/duzenle', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       e_talep_basligi,
//       e_musteri_adi,
//       e_musteri_numarasi,
//       e_talep
//     })
//   })
//   .then(response => response.json())
//   .then(data => {
//     if (data.mesaj) {
//       alert(data.mesaj); // Başarı mesajını alert olarak gösteriyoruz
//     }
//   })
//   .catch(error => {
//     console.error('Düzenleme işlemi hatası:', error);
//     alert('Düzenleme işlemi sırasında bir hata oluştu.');
//   });
// }
function acModal() {
  const modal = document.getElementById("duzenleModal");
  modal.style.display = "flex"; // veya "block" da olabilir tasarıma göre
}
function kapatModal() {
  document.getElementById("duzenleModal").style.display = "none";
}
window.addEventListener("click", function(event) {
  const modal = document.getElementById("duzenleModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
