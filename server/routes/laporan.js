const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController.js');
const adminOnly = require('../middlewares/adminOnly.js');

router.post('/', laporanController.tambahLaporan);

router.get('/', laporanController.ambilSemuaLaporan);

router.get('/:id', laporanController.ambilSatuLaporan);

router.put('/:id', laporanController.updateLaporan);

router.patch('/:id', adminOnly, laporanController.verifikasiLaporan);

router.delete('/:id', laporanController.hapusLaporan);

module.exports = router;
