var express = require('express');
var router = express.Router();

let akun = require('../models/akun.js');
let buku = require('../models/buku.js');
let komentar = require('../models/komentar.js');
let pinjam = require('../models/pinjam.js');

let crypto = require('crypto');

function stringModel(string) {
  switch (string) {
    case "akun":
      return akun;
    case "buku":
      return buku;
    case "komentar":
      return komentar;
    case "pinjam":
      return pinjam;
  }
}
/* GET data */
router.get('/find/:db', async function (req, res, next) {//read
  try {
    let db = stringModel(req.params.db);
    let arr = req.query;
    res.json(await db.find(arr));
  } catch (err) {
    return next(err);
  }
});
router.get('/enc/:dt', async function (req, res, next) {//read
  // res.json({ encdata: crypto.createHash('sha256').update(req.params.dt).digest('hex') });
  res.json(crypto.createHash('sha256').update(req.params.dt).digest('hex'));
});
router.get('/statistics/:dt', async function (req, res, next) {//read
  if (req.params.dt == "genre") {
    res.json(await buku.aggregate([
      { $unwind: "$genre" },
      { $group: { _id: "$genre", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]));
  } else if (req.params.dt == "borrow") {
    let borrow = await pinjam.aggregate([
      { $group: { _id: "$buku_id", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);
    borrow = await buku.find({ _id: borrow[0]._id });
    res.json(borrow);
  } else if (req.params.dt == "ulasan") {
    let ulasan = await komentar.aggregate([
      { $group: { _id: "$buku_id", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);
    ulasan = await buku.find({ _id: ulasan[0]._id });
    res.json(ulasan);
  } else if (req.params.dt == "pinjamdata") {
    res.json(await pinjam.aggregate([
      {
        $match:
        {
          user_id: req.query.user_id
        }
      },
      {
        $addFields: {
          buku_id: { $toObjectId: "$buku_id" }
        }
      },
      {
        $lookup:
        {
          from: "bukus",
          localField: "buku_id",
          foreignField: "_id",
          as: "buku"
        }
      }
    ]));
  } else if (req.params.dt == "notifulasan") {
    res.json(await komentar.aggregate([
      { $sort: { date: -1 } },
      { $limit: 5 }
    ]));
  } else if (req.params.dt == "notifbuku") {
    res.json(await buku.aggregate([
      { $sort: { date: -1 } },
      { $limit: 5 }
    ]));
  } else if (req.params.dt == "pinjaman") {
    res.json(await pinjam.aggregate([
      {
        $addFields: {
          buku_id: { $toObjectId: "$buku_id" },
          user_id: { $toObjectId: "$user_id" }
        }
      },
      {
        $lookup:
        {
          from: 'bukus',
          localField: 'buku_id',
          foreignField: '_id',
          as: 'buku'
        }
      },
      {
        $lookup:
        {
          from: 'akuns',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]));
  }
});
router.get('/src/:field/:search', async function (req, res, next) {//read
  const { field, search } = req.params;
  try {
    let result;
    switch (field) {
      case "judul":
        result = await buku.find({ 'judul': { $regex: search }, "del": null });
        break;
      case "penulis":
        result = await buku.find({ 'penulis': { $regex: search }, "del": null });
        break;
      case "penerbit":
        result = await buku.find({ 'penerbit': { $regex: search }, "del": null });
        break;
      case "tahunterbit":
        const tahunTerbit = parseInt(search);
        result = await buku.find({ 'tahun_terbit': tahunTerbit, "del": null });
        break;
      case "genre":
        result = await buku.find({ 'genre': { $regex: search }, "del": null });
        break;
      default:
        return res.status(400).json({ error: "Invalid field" });
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;