let mongoose = require('mongoose');
let komentar = new mongoose.Schema({
    user_id: String,
    buku_id: String,
    text: String,
    date: Date
});
module.exports = mongoose.model('komentar', komentar);
// Akun: id, username, password, role
// Buku: id, judul, penulis, penerbit, tahun_terbit, edisi, sinopsis, genre, ISBN, stok
// Pinjam: id, user_id, buku_id, date_pinjam, lama, date_kembali, status
// Komentar: id, user_id, buku_id, text, date
// Report: id, user_id, buku_id, reason, date