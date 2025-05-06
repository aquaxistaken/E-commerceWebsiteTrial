document.addEventListener('DOMContentLoaded', function() {
    updateSepetGosterge();
    if (window.location.pathname.includes('sepet.html')) {
        sepetSayfasiniOlustur();
        odemeButonuIslevselligiEkle();
        // Sepet sayfasına gelindiğinde bildirim varsa göster
        const urlParams = new URLSearchParams(window.location.search);
        const bildirim = urlParams.get('bildirim');
        if (bildirim === 'eklendi') {
            gosterBildirim('Ürün sepete eklendi!');
            // URL'den bildirimi temizle
            history.replaceState(null, null, window.location.pathname);
        }
    }
});

function addToSepet(urunAdi, urunFiyati, urunGorseli, urunAdeti = 1) {
    let sepet = localStorage.getItem('sepet') ? JSON.parse(localStorage.getItem('sepet')) : [];
    const urunVarMi = sepet.find(urun => urun.ad === urunAdi);
    if (urunVarMi) {
        urunVarMi.adet += urunAdeti;
    } else {
        sepet.push({ ad: urunAdi, fiyat: urunFiyati, gorsel: urunGorseli, adet: urunAdeti });
    }
    localStorage.setItem('sepet', JSON.stringify(sepet));
    updateSepetGosterge();
    gosterBildirim('Ürün sepete eklendi!'); // Standart bildirimi kullan
}

function sepeteEkleUrunDetay() {
    const urunAdi = document.querySelector('.urun-bilgi h2').textContent;
    const urunFiyati = parseFloat(document.querySelector('.urun-bilgi .fiyat').textContent.replace(' TL', ''));
    const urunGorseli = document.querySelector('.urun-gorsel img').src;
    const urunAdetiInput = document.getElementById('adet');
    const urunAdeti = parseInt(urunAdetiInput.value);

    addToSepet(urunAdi, urunFiyati, urunGorseli, urunAdeti);
}

function updateSepetGosterge() {
    const sepetAdetSpan = document.querySelector('header nav a[href="sepet.html"] span');
    const sepet = localStorage.getItem('sepet') ? JSON.parse(localStorage.getItem('sepet')) : [];
    if (sepetAdetSpan) {
        sepetAdetSpan.textContent = sepet.reduce((toplam, urun) => toplam + urun.adet, 0);
    }
}

function sepetSayfasiniOlustur() {
    const sepetUrunleriDiv = document.getElementById('sepet-urunleri');
    const sepetToplamSpan = document.querySelector('#sepet-toplam span');
    const sepet = localStorage.getItem('sepet') ? JSON.parse(localStorage.getItem('sepet')) : [];

    sepetUrunleriDiv.innerHTML = '';
    let toplamFiyat = 0;

    if (sepet.length === 0) {
        sepetUrunleriDiv.innerHTML = '<p>Sepetinizde henüz ürün bulunmamaktadır.</p>';
    } else {
        sepet.forEach(urun => {
            const urunDiv = document.createElement('div');
            urunDiv.classList.add('sepet-urun');

            const gorsel = document.createElement('img');
            gorsel.src = urun.gorsel;
            gorsel.alt = urun.ad;
            gorsel.classList.add('sepet-urun-gorsel');

            const ad = document.createElement('p');
            ad.textContent = urun.ad;
            ad.classList.add('urun-adi');

            const fiyat = document.createElement('p');
            fiyat.textContent = `${urun.fiyat} TL x ${urun.adet} = ${urun.fiyat * urun.adet} TL`;
            fiyat.classList.add('urun-fiyat');

            const adetKontrolDiv = document.createElement('div');
            adetKontrolDiv.classList.add('urun-adet-kontrol');

            const adetEtiketi = document.createElement('label');
            adetEtiketi.textContent = 'Adet:';
            adetEtiketi.htmlFor = `adet-${urun.ad.replace(' ', '-')}`;

            const adetInput = document.createElement('input');
            adetInput.type = 'number';
            adetInput.id = `adet-${urun.ad.replace(' ', '-')}`;
            adetInput.name = `adet-${urun.ad.replace(' ', '-')}`;
            adetInput.value = urun.adet;
            adetInput.min = '1';
            adetInput.classList.add('adet-input');
            adetInput.addEventListener('change', function() {
                adetGuncelle(urun.ad, parseInt(this.value));
            });

            adetKontrolDiv.appendChild(adetEtiketi);
            adetKontrolDiv.appendChild(adetInput);

            const cikarButonu = document.createElement('button');
            cikarButonu.textContent = 'Çıkar';
            cikarButonu.classList.add('cikar-butonu');
            cikarButonu.addEventListener('click', function() {
                sepettenCikar(urun.ad);
            });

            urunDiv.appendChild(gorsel);
            urunDiv.appendChild(ad);
            urunDiv.appendChild(fiyat);
            urunDiv.appendChild(adetKontrolDiv);
            urunDiv.appendChild(cikarButonu);
            sepetUrunleriDiv.appendChild(urunDiv);

            toplamFiyat += urun.fiyat * urun.adet;
        });
    }

    sepetToplamSpan.textContent = `${toplamFiyat} TL`;
}

function sepettenCikar(urunAdi) {
    let sepet = localStorage.getItem('sepet') ? JSON.parse(localStorage.getItem('sepet')) : [];
    const yeniSepet = sepet.filter(urun => urun.ad !== urunAdi);
    localStorage.setItem('sepet', JSON.stringify(yeniSepet));
    sepetSayfasiniOlustur();
    updateSepetGosterge();
}

function adetGuncelle(urunAdi, yeniAdet) {
    let sepet = localStorage.getItem('sepet') ? JSON.parse(localStorage.getItem('sepet')) : [];
    const urun = sepet.find(u => u.ad === urunAdi);
    if (urun) {
        urun.adet = Math.max(1, yeniAdet);
        localStorage.setItem('sepet', JSON.stringify(sepet));
        sepetSayfasiniOlustur();
    }
    updateSepetGosterge();
}

function odemeButonuIslevselligiEkle() {
    const odemeButonu = document.querySelector('#sepet-toplam + button');
    if (odemeButonu) {
        odemeButonu.addEventListener('click', function() {
            window.location.href = 'odeme.html';
        });
    }
}

function gosterBildirim(mesaj) {
    const bildirimDiv = document.getElementById('sepet-bildirimi');
    if (bildirimDiv) {
        bildirimDiv.textContent = mesaj;
        bildirimDiv.classList.remove('gizli');
        bildirimDiv.classList.add('gorunur');
        setTimeout(() => {
            bildirimDiv.classList.remove('gorunur');
            bildirimDiv.classList.add('gizli');
        }, 2000);
    } else {
        // Eğer bildirim alanı yoksa dinamik olarak oluşturabilirsiniz (isteğe bağlı)
        const yeniBildirim = document.createElement('div');
        yeniBildirim.id = 'sepet-bildirimi';
        yeniBildirim.textContent = mesaj;
        yeniBildirim.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; padding: 10px; border-radius: 5px; z-index: 1000;';
        document.body.appendChild(yeniBildirim);
        setTimeout(() => {
            document.body.removeChild(yeniBildirim);
        }, 2000);
    }
}

function anaGorselDegistir(yeniSrc) {
    const anaGorsel = document.getElementById('ana-gorsel');
    anaGorsel.onload = function() {
        const oran = anaGorsel.naturalWidth / anaGorsel.naturalHeight;
        anaGorsel.style.height = 'auto';
        anaGorsel.style.width = '100%';
        if (anaGorsel.offsetHeight > 400) {
            anaGorsel.style.height = '400px';
            anaGorsel.style.width = 'auto';
        }
    };
    anaGorsel.src = yeniSrc;
}