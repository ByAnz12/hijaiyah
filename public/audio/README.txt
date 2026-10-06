Folder untuk audio pengganti (opsional).

- Musik latar: simpan sebagai public/audio/music.mp3 lalu set MUSIC_URL = '/audio/music.mp3' di src/audio/config.js
- Suara huruf: simpan di public/audio/voice/<id>.mp3 (id ada di src/data/letters.js, mis. alif, ba, ta)
  lalu daftarkan di VOICE_FILES, contoh: { 'letter:alif': '/audio/voice/alif.mp3' }

Tanpa file apa pun, game memakai musik sintetis bawaan dan Web Speech API.
