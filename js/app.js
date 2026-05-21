document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateBtn");
    const qrContainer = document.getElementById("qrcode");
    const scanText = document.getElementById("scanText");

    generateBtn.addEventListener("click", () => {
        // Bersihkan QR sebelumnya jika ada
        qrContainer.innerHTML = ""; 
        
        // Menentukan URL tujuan. 
        // Saat di-deploy, window.location.origin akan menyesuaikan dengan domain Vercel Anda.
        const targetUrl = `${window.location.origin}/viewer.html?model=rumah`;

        // Membuat QR Code
        new QRCode(qrContainer, {
            text: targetUrl,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        scanText.style.display = "block";
    });
});
