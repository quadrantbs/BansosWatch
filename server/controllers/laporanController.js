const tambahLaporan = (req, res) => {
    res.status(201).json({
      message: 'Laporan berhasil ditambahkan',
      data: req.body,
    });
  };
  
  const ambilSemuaLaporan = (req, res) => {
    res.status(200).json({
      message: 'Daftar laporan berhasil diambil',
      data: [], 
    });
  };

  const ambilSatuLaporan = (req, res) => {
    const laporanId = req.params.id;
    res.status(200).json({
      message: `Laporan dengan ID ${laporanId} berhasil diambil`,
      data: {},
    });
  }
  
  const updateLaporan = (req, res) => {
    const laporanId = req.params.id;
    res.status(200).json({
      message: `Laporan dengan ID ${laporanId} berhasil diperbarui`,
      data: req.body,
    });
  };
  
  const verifikasiLaporan = (req, res) => {
    const laporanId = req.params.id;
    res.status(200).json({
      message: `Laporan dengan ID ${laporanId} berhasil diverifikasi`,
    });
  };
  
  const hapusLaporan = (req, res) => {
    const laporanId = req.params.id;
    res.status(200).json({
      message: `Laporan dengan ID ${laporanId} berhasil dihapus`,
    });
  };
  
  module.exports = {
    tambahLaporan,
    ambilSemuaLaporan,
    ambilSatuLaporan,
    updateLaporan,
    verifikasiLaporan,
    hapusLaporan,
  };
  