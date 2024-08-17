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
router.post('/create/:db', async function (req, res, next) {//modify
  try {
    // if (req.header == null || req.header.key == null || req.header.key != 123) {
    //   res.status(403);
    //   res.send("wrong token");
    // }
    let db = stringModel(req.params.db);
    let arr = req.body;
    console.log(arr)
    new db(arr).save();
    res.json("success");
  } catch (err) {
    return next(err);
  }
});
router.post('/update/:db/:id', async function (req, res, next) {//modify
  try {
    let db = stringModel(req.params.db);
    let id = req.params.id;
    let arr = req.body;
    await db.findByIdAndUpdate(id, arr);
    res.json("success");
  } catch (err) {
    return next(err);
  }
});
router.post('/updateone/:db/:id', async function (req, res, next) {//modify
  try {
    let db = stringModel(req.params.db);
    let id = JSON.parse(decodeURIComponent(req.params.id));
    let arr = req.body;
    await db.findOneAndUpdate(id, arr);
    res.json("success");
  } catch (err) {
    return next(err);
  }
});
router.post('/delete/:db/:id', async function (req, res, next) {//modify
  try {
    let db = stringModel(req.params.db);
    let id = req.params.id;
    await db.findByIdAndDelete(id);
    res.json("success");
  } catch (err) {
    return next(err);
  }
});

module.exports = router;