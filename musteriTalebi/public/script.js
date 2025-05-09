const form = document.getElementById('form');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Oluşturulan form verilerini alıyorum burada
    const e_musteri_adi = document.getElementById('e_musteri_adi').value;
    const e_musteri_numarasi = document.getElementById('e_musteri_numarasi').value;
    const e_talep = document.getElementById('e_talep').value;

    const formData = {
        e_musteri_adi: e_musteri_adi,
        e_musteri_numarasi: e_musteri_numarasi,
        e_talep: e_talep
    };

    let getData = JSON.parse(localStorage.getItem('formData')) || [];
    getData.push(formData);
    localStorage.setItem('formData', JSON.stringify(getData));
    // Formu sıfırlıyorum 
    alert('Kayıt başarıyla oluşturuldu!');

});