// /api/gemini.js

export default async function handler(req, res) {
    // Memastikan metode request adalah GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Metode tidak diizinkan. Gunakan GET.' });
    }

    // Mengambil parameter 'model' dari URL query (misal: /api/gemini?model=rumah)
    const { model } = req.query;

    if (!model) {
        return res.status(400).json({ error: 'Parameter objek/model pembelajaran tidak ditemukan.' });
    }

    // Mengambil API Key dari environment variable Vercel secara aman
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API Key Gemini belum dikonfigurasi di server.' });
    }

    // Menyusun prompt edukasi yang spesifik agar AI memberikan jawaban terstruktur
    const prompt = `Anda adalah seorang guru atau edukator interaktif. Berikan penjelasan singkat, menarik, dan edukatif tentang objek "${model}" dalam konteks pembelajaran sekolah. Berikan 3 poin penting tentang objek ini dalam bentuk paragraf yang rapi dan ramah anak.`;

    try {
        // Melakukan request langsung ke Endpoint Google Gemini API (Menggunakan model Gemini 2.5 Flash yang cepat)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: 'Gagal menghubungi Gemini API', details: errorData });
        }

        const data = await response.json();
        
        // Mengekstrak teks jawaban dari struktur JSON Gemini
        const aiExplanation = data.candidates[0].content.parts[0].text;

        // Mengembalikan jawaban ke frontend
        return res.status(200).json({ 
            object: model,
            explanation: aiExplanation 
        });

    } catch (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan pada internal server.', details: error.message });
    }
}
