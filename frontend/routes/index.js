var express = require('express');
var router = express.Router();
var fs = require('fs');
var https = require('https');

function promiseFetch(port, path, method, body) {
  return new Promise((resolve, reject) => {
    console.log(path)
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: method,
      key: fs.readFileSync('C:/node-api-mtls/client.key'),
      cert: fs.readFileSync('C:/node-api-mtls/client.crt'),
      ca: fs.readFileSync('C:/node-api-mtls/ca.crt'),
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body ? Buffer.byteLength(JSON.stringify(body)) : 0
      }
    };
    const req = https.request(options, (res) => {
      let data1 = '';
      res.on('data', (chunk) => {
        console.log("chunk " + chunk);
        data1 += chunk;
      });
      res.on('end', () => {
        try {
          console.log("data 1" + data1);
          if (body != null) {
            resolve(JSON.parse(data1));
          } else {
            resolve(data1);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', (e) => {
      console.error(e);
      reject(e);
    });
    if (body != null) {
      console.log("body " + JSON.stringify(body));
      req.write(JSON.stringify(body))
    }
    req.end();
  })
}
async function beFetch(act, db, query, id) {
  let result;
  if (act == "update") {
    result = promiseFetch(3060, `/${act}/${db}/${id}`, 'POST', query);
    // await fetch(`https://localhost:3060/${act}/${db}/${id}`, { 
    //   method: "POST",
    //   key: fs.readFileSync("C:/node-api-mtls/client.key"),
    //   cert: fs.readFileSync("C:/node-api-mtls/client.crt"),
    //   ca: fs.readFileSync("C:/node-api-mtls/ca.crt"),
    //   rejectUnauthorized: false,
    //   body: JSON.stringify(query)
    // })
    // .then((response) => {
    //   if (response.ok) {
    //     return response.json()
    //   } throw (new Error("update failed"))
    // })
    // .then((body) => {
    //   result = body;
    // })
    // .catch((error) => {console.log(result + error.stack)});
  } else if (act == "updateone") {
    result = promiseFetch(3060, `/${act}/${db}/${encodeURIComponent(JSON.stringify(id))}`, 'POST', query);
    // await fetch(`https://localhost:3060/${act}/${db}/${encodeURIComponent(JSON.stringify(id))}`, { 
    //   method: "POST",
    //   key: fs.readFileSync("C:/node-api-mtls/client.key"),
    //   cert: fs.readFileSync("C:/node-api-mtls/client.crt"),
    //   ca: fs.readFileSync("C:/node-api-mtls/ca.crt"),
    //   rejectUnauthorized: false,
    //   body: JSON.stringify(query)
    // })
    // .then((response) => {
    //   if (response.ok) {
    //     return response.json()
    //   } throw (new Error("update failed"))
    // })
    // .then((body) => {
    //   result = body;
    // })
    // .catch((error) => {console.log(result + error.stack)});
  } else if (act == "delete") {
    result = promiseFetch(3060, `/${act}/${db}/${query}`, 'POST', null);
    // await fetch(`https://localhost:3060/${act}/${db}/${query}`, { 
    //   method: "POST",
    //   key: fs.readFileSync("C:/node-api-mtls/client.key"),
    //   cert: fs.readFileSync("C:/node-api-mtls/client.crt"),
    //   ca: fs.readFileSync("C:/node-api-mtls/ca.crt"),
    //   rejectUnauthorized: false
    // })
    // .then((response) => {
    //   if (response.ok) {
    //     return response.json()
    //   } throw (new Error("delete failed"))
    // })
    // .then((body) => {
    //   result = body;
    // })
    // .catch((error) => {console.log(result + error.stack)});
  } else if (act == "create") {
    result = promiseFetch(3060, `/${act}/${db}`, 'POST', query);
  } else if (act == "enc") {
    // result = promiseFetch(3030, `/${act}/${db}`, 'GET', db);
    result = new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 3030,
        path: `/${act}/${db}`,
        method: 'GET',
        key: fs.readFileSync('C:/node-api-mtls/client.key'),
        cert: fs.readFileSync('C:/node-api-mtls/client.crt'),
        ca: fs.readFileSync('C:/node-api-mtls/ca.crt'),
        rejectUnauthorized: false,
        headers: {
          'Content-Type': 'application/txt',
          'Content-Length': db ? Buffer.byteLength(db) : 0
        }
      };
      const req = https.request(options, (res) => {
        let data1 = '';
        res.on('data', (chunk) => {
          data1 += chunk;
        });
        res.on('end', () => {
          try {
            resolve(data1);
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', (e) => {
        console.error(e);
        reject(e);
      });
      req.end();
    })
    // const options = {
    //   hostname: 'localhost',
    //   port: 3030,
    //   path: `/${act}/${db}`,
    //   method: 'GET', // Change to 'POST' or other methods if needed
    //   key: fs.readFileSync("C:/node-api-mtls/client.key"),
    //   cert: fs.readFileSync("C:/node-api-mtls/client.crt"),
    //   ca: fs.readFileSync("C:/node-api-mtls/ca.crt"),
    //   rejectUnauthorized: false,
    //   headers: {
    //     'Content-Type': 'application/json; charset=utf-8',
    //     'Content-Length': db ? Buffer.byteLength(db) : 0
    //   }
    // };

    // return new Promise((resolve, reject) => {
    //   const req = https.request(options, (res) => {
    //     let data = '';

    //     // A chunk of data has been received.
    //     res.on('data', (chunk) => {
    //       data += chunk;
    //     });

    //     // The whole response has been received.
    //     res.on('end', () => {
    //       if (res.statusCode === 200) {
    //         try {
    //           // If the response is a string, resolve it directly
    //           resolve(data);
    //         } catch (e) {
    //           reject(new Error('Error parsing response: ' + e.message));
    //         }
    //       } else {
    //         reject(new Error(`Request failed with status code: ${res.statusCode}`));
    //       }
    //     });
    //   });

    //   req.on('error', (e) => {
    //     reject(new Error(`Problem with request: ${e.message}`));
    //   });

    //   // Write data to request body
    //   req.write(JSON.stringify({ db, query, id }));

    //   // End the request
    //   req.end();
    // });
  } else {
    result = promiseFetch(3030, `/${act}/${db}?${query}`, 'GET', null);
  }
  return result;
}
/* GET home page. */
router.get('/error', async function (req, res, next) {
  res.render('error', { message: req.query.message })
});
router.get('/', async function (req, res, next) {
  if (req.session.Nama != null) {
    let akunfind = await beFetch("find", "akun", `username=${req.session.Nama}`);
    if (akunfind[0].del != null) {
      res.redirect('/logout');
    }
    res.render('index', {
      nama: req.session.Nama, role: req.session.Role,
      buku: await beFetch("find", "buku", `del=`),
      pinjam: await beFetch("statistics", "pinjamdata", `user_id=${akunfind[0]._id.toString()}`),
      genre: await beFetch("statistics", "genre", ""),
      borrow: await beFetch("statistics", "borrow", ""),
      ulasan: await beFetch("statistics", "ulasan", ""),
      notifulasan: await beFetch("statistics", "notifulasan", ""),
      notifbuku: await beFetch("statistics", "notifbuku", ""),
    });
  } else {
    res.render('index', {
      nama: null, role: null, pinjam: null,
      buku: await beFetch("find", "buku", `del=`)
    });
  }
});
router.get('/isi/:id', async function (req, res, next) {
  let bukufind = await beFetch("find", "buku", `_id=${req.params.id}`);
  if (bukufind[0].del == null) {
    if (req.session.Nama != null) {
      let akunfind = await beFetch("find", "akun", `username=${req.session.Nama}`);
      if (akunfind[0].del != null) {
        res.redirect('/logout');
      }
      if (req.query.err != null) {
        res.render('isi', {
          buku: bukufind, role: req.session.Role, err: req.query.err,
          pinjam: await beFetch("find", "pinjam", `user_id=${akunfind[0]._id}&buku_id=${req.params.id}`),
          komentar: await beFetch("find", "komentar", `buku_id=${req.params.id}`)
        });
      } else {
        res.render('isi', {
          buku: bukufind, role: req.session.Role, err: null,
          pinjam: await beFetch("find", "pinjam", `user_id=${akunfind[0]._id}&buku_id=${req.params.id}`),
          komentar: await beFetch("find", "komentar", `buku_id=${req.params.id}`)
        });
      }
    } else {
      res.render('isi', { buku: bukufind, role: null, pinjam: null, komentar: null, err: null });
    }
  } else {
    res.redirect('/');
  }
});
router.get('/register', async function (req, res, next) {
  if (req.session.Role == null) {
    if (req.query.err != null) {
      res.render('register', { err: req.query.err });
    } else {
      res.render('register', { err: null });
    }
  } else {
    res.redirect('/');
  }
});
router.get('/login', async function (req, res, next) {
  if (req.session.Role == null) {
    if (req.query.err != null) {
      res.render('login', { err: req.query.err });
    } else {
      res.render('login', { err: null });
    }
  } else {
    res.redirect('/');
  }
});
router.post('/register', async function (req, res, next) {
  let akunfind = await beFetch("find", "akun", `username=${req.body.name}`);
  if (akunfind.length == 1) {
    res.redirect('/register?err=akun');
  } else {
    let passenc = await beFetch("enc", `${req.body.pass}`);
    console.log("encrypted password " + passenc);
    let create = await beFetch("create", "akun", { username: req.body.name, password: passenc, role: "user" }, null);
    console.log("created account " + create);
    if (create == undefined) {
      res.redirect('/error?message=REGISTER_FAILED');
    } else {
      res.redirect('/login');
    }
  }
});
router.post('/login', async function (req, res, next) {
  let passenc = await beFetch("enc", `${req.body.pass}`);
  console.log(passenc);
  let akunfind = await beFetch("find", "akun", `username=${req.body.name}&password=${passenc.replace(/"/g, '')}`);
  if (akunfind.length == 1 && akunfind[0].del == null) {
    if (akunfind[0].accept != null) {
      req.session.Nama = req.body.name;
      req.session.Role = akunfind[0].role;
      res.redirect('/');
    } else {
      res.redirect('/login?err=accept');
    }
  } else {
    res.redirect('/login?err=akun');
  }
});
router.get('/logout', async function (req, res, next) {
  req.session.Nama = null;
  req.session.Role = null;
  res.redirect('/');
});
router.get('/ganti', async function (req, res, next) {
  if (req.session.Role == null) {
    if (req.query.err != null) {
      res.render('ganti', { err: req.query.err });
    } else {
      res.render('ganti', { err: null });
    }
  } else {
    res.redirect('/');
  }
});
router.post('/ganti', async function (req, res, next) {
  let passenc = await beFetch("enc", `${req.body.pass1}`, "");
  let akunfind = await beFetch("find", "akun", `username=${req.body.name}&password=${passenc}`);
  if (akunfind.length == 1) {
    let passenc = await beFetch("enc", `${req.body.pass2}`, "");
    let update = await beFetch("update", "akun", { password: passenc }, `${akunfind[0]._id}`);
    if (update == undefined) {
      res.redirect('/error?message=GANTIPASS_FAILED');
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/ganti?err=akun');
  }
});
router.post('/edit/:id', async function (req, res, next) {
  let update = await beFetch("update", "buku", { judul: req.body.judul, penulis: req.body.penulis, penerbit: req.body.penerbit, tahun_terbit: req.body.tahun_terbit, edisi: req.body.edisi, sinopsis: req.body.sinopsis, isbn: req.body.isbn, stok: req.body.stok, isi: req.body.isi, genre: req.body.genre.split(','), date: new Date() }, `${req.params.id}`);
  if (update == undefined) {
    res.redirect('/error?message=EDITBUKU_FAILED');
  } else {
    res.redirect('/isi/' + req.params.id);
  }
});
router.post('/pinjam/:id', async function (req, res, next) {
  let akunfind = await beFetch("find", "akun", `username=${req.session.Nama}`);
  let pinjaman = await beFetch("find", "pinjam", `user_id=${akunfind[0]._id}&status=${encodeURIComponent('Sedang Dipinjam')}`);
  if (pinjaman.length <= 4) {
    let stok = await beFetch("find", "buku", `_id=${req.params.id}`);
    if (stok[0].stok - 1 >= 0) {
      let update = await beFetch("update", "buku", { stok: stok[0].stok - 1 }, `${req.params.id}`);
      let create = await beFetch("create", "pinjam", { user_id: akunfind[0]._id, buku_id: req.params.id, date_pinjam: new Date(), lama: req.body.lama, status: "Sedang Dipinjam", date_kembali: null });
      if (create == undefined || update == undefined) {
        res.redirect('/error?message=PINJAM_FAILED');
      } else {
        res.redirect('/isi/' + req.params.id);
      }
    } else {
      let doublewait = await beFetch("find", "pinjam", `user_id=${akunfind[0]._id}&buku_id=${req.params.id}&status=${encodeURIComponent('Waiting List')}`);
      let create = "create";
      if (doublewait.length == 0) {
        create = await beFetch("create", "pinjam", { user_id: akunfind[0]._id, buku_id: req.params.id, date_pinjam: new Date(), lama: req.body.lama, status: "Waiting List", date_kembali: null });
      }
      if (create == undefined) {
        res.redirect('/error?message=PINJAM_FAILED');
      } else {
        res.redirect('/isi/' + req.params.id + '?err=stok');
      }
    }
  } else {
    res.redirect('/isi/' + req.params.id + '?err=pinjam');
  }
});
router.get('/kembali/:id', async function (req, res, next) {
  if (req.session.Role != null) {
    let akunfind = await beFetch("find", "akun", `username=${req.session.Nama}`);
    let pinjamfind = await beFetch("find", "pinjam", `user_id=${akunfind[0]._id}&buku_id=${req.params.id}`);
    let hari = Math.abs((new Date().getTime() - new Date(pinjamfind[pinjamfind.length - 1].date_pinjam).getTime()) / (1000 * 3600 * 24));
    let stok = await beFetch("find", "buku", `_id=${req.params.id}`);
    let update1 = await beFetch("update", "buku", { stok: stok[0].stok + 1 }, `${req.params.id}`);
    let update2 = "update";
    let update3 = "update";
    let update4 = "update";
    if (hari <= pinjamfind[pinjamfind.length - 1].lama) {
      update2 = await beFetch("update", "pinjam", { date_kembali: new Date(), status: encodeURIComponent('Tepat Waktu') }, `${pinjamfind[pinjamfind.length - 1]._id}`);
    } else {
      update2 = await beFetch("update", "pinjam", { date_kembali: new Date(), status: encodeURIComponent('Terlambat') }, `${pinjamfind[pinjamfind.length - 1]._id}`);
    }
    let waitinglist = await beFetch("find", "pinjam", `status=${encodeURIComponent('Waiting List')}&buku_id=${req.params.id}`);
    if (waitinglist.length > 0) {
      update3 = await beFetch("update", "buku", { stok: stok[0].stok }, `${req.params.id}`);
      update4 = await beFetch("update", "pinjam", { date_pinjam: new Date(), status: encodeURIComponent('Sedang Dipinjam') }, `${waitinglist[0]._id}`);
    }
    if (update1 == undefined || update2 == undefined || update3 == undefined || update4 == undefined) {
      res.redirect('/error?message=KEMBALI_FAILED');
    } else {
      res.redirect('/isi/' + req.params.id);
    }
  } else {
    res.redirect('/');
  }
});
router.get('/create', async function (req, res, next) {
  if (req.session.Role == "admin") {
    res.render('createbuku');
  } else {
    res.redirect('/');
  }
});
router.post('/create', async function (req, res, next) {
  let create = await beFetch("create", "buku", { judul: req.body.judul, penulis: req.body.penulis, penerbit: req.body.penerbit, tahun_terbit: req.body.tahun_terbit, edisi: req.body.edisi, sinopsis: req.body.sinopsis, isbn: req.body.isbn, stok: req.body.stok, isi: req.body.isi, genre: req.body.genre.split(','), date: new Date() });
  if (create == undefined) {
    res.redirect('/error?message=CREATEBUKU_FAILED');
  } else {
    res.redirect('/');
  }
});
router.get('/delbuku/:id', async function (req, res, next) {
  let update1 = "update";
  let update2 = "update";
  if (req.session.Role == "admin") {
    update1 = await beFetch("update", "buku", { del: 1 }, `${req.params.id}`);
    let pinjams = await beFetch("find", "pinjam", `buku_id=${req.params.id}&status=${encodeURIComponent('Sedang Dipinjam')}`);
    if (pinjams.length > 0) {
      pinjams.forEach(async function (pinjams) {
        update2 = await beFetch("update", "pinjam", { date_kembali: new Date(), status: encodeURIComponent('Tepat Waktu') }, `${pinjams._id}`);
      });
    }
  }
  if (update1 == undefined || update2 == undefined) {
    res.redirect('/error?message=DELETEBUKU_FAILED');
  } else {
    res.redirect('/');
  }
});
router.get('/akun', async function (req, res, next) {
  if (req.session.Role == "admin") {
    res.render('akun', {
      akun: await beFetch("find", "akun", ""),
      akunacc: await beFetch("find", "akun", `accept=`)
    });
  } else {
    res.redirect('/');
  }
});
router.get('/accakun/:id', async function (req, res, next) {
  if (req.session.Role == "admin") {
    let update = await beFetch("update", "akun", { accept: 1 }, `${req.params.id}`);
    if (update == undefined) {
      res.redirect('/error?message=ACCEPTAKUN_FAILED');
    } else {
      res.redirect('/akun');
    }
  } else {
    res.redirect('/');
  }
});
router.post('/updakun', async function (req, res, next) {
  let update = await beFetch("update", "akun", { username: req.body.username, password: req.body.password, role: req.body.role }, `${req.body.id}`);
  if (update == undefined) {
    res.redirect('/error?message=UPDATEAKUN_FAILED');
  } else {
    res.redirect('/akun');
  }
});
router.get('/delakunhard/:id', async function (req, res, next) {
  if (req.session.Role == "admin") {
    let delet = await beFetch("delete", "akun", `${req.params.id}`);
    if (delet == undefined) {
      res.redirect('/error?message=DELETEAKUN_FAILED');
    } else {
      res.redirect('/akun');
    }
  } else {
    res.redirect('/');
  }
});
router.get('/delakun/:id', async function (req, res, next) {
  if (req.session.Role == "admin") {
    let update1 = await beFetch("update", "akun", { del: 1 }, `${req.params.id}`);
    let update2 = "update";
    let pinjams = await beFetch("find", "pinjam", `user_id=${req.params.id}&status=${encodeURIComponent('Sedang Dipinjam')}`);
    if (pinjams.length > 0) {
      pinjams.forEach(async function (pinjams) {
        update2 = await beFetch("update", "pinjam", { date_kembali: new Date(), status: encodeURIComponent('Tepat Waktu') }, `${pinjams._id}`)
      });
    }
    if (update1 == undefined || update2 == undefined) {
      res.redirect('/error?message=DELETEAKUN_FAILED');
    } else {
      res.redirect('/akun');
    }
  } else {
    res.redirect('/');
  }
});
router.get('/delcomment/:id', async function (req, res, next) {
  if (req.session.Role == "admin") {
    let delet = await beFetch("delete", "komentar", `${req.params.id}`);
    if (delet == undefined) {
      res.redirect('/error?message=DELETECOMMENT_FAILED');
    } else {
      res.redirect('/isi/' + req.query.id);
    }
  } else {
    res.redirect('/');
  }
});
router.post('/addcomment/:id', async function (req, res, next) {
  let komentarfind = await beFetch("find", "komentar", `user_id=${req.session.Nama}&buku_id=${req.params.id}`);
  let crtupd = "crtupd";
  if (komentarfind.length == 0) {
    crtupd = await beFetch("create", "komentar", { user_id: req.session.Nama, buku_id: req.params.id, text: req.body.komentar, date: new Date() });
  } else {
    crtupd = await beFetch("updateone", "komentar", { text: req.body.komentar, date: new Date() }, { "user_id": req.session.Nama, "buku_id": req.params.id });
  }
  if (crtupd == undefined) {
    res.redirect('/error?message=CREATECOMMENT_FAILED');
  } else {
    res.redirect('/isi/' + req.params.id);
  }
});
router.get('/pinjaman', async function (req, res, next) {
  if (req.session.Role == "admin") {
    res.render('pinjaman', { pinjam: await beFetch("statistics", "pinjaman", "") });
  } else {
    res.redirect('/');
  }
});

module.exports = router;