const Joi = require("joi");

const validateLaporan = (data) => {
  const schema = Joi.object({
    nama_program: Joi.string()
      .required()
      .messages({
        "any.required": "Nama Program wajib diisi",
        "any.only": "Nama Program harus salah satu dari PKH, BLT, Bansos",
      }),

    jumlah_penerima: Joi.number().integer().min(1).required().messages({
      "any.required": "Jumlah Penerima Bantuan wajib diisi",
      "number.base": "Jumlah Penerima Bantuan harus berupa angka",
      "number.min":
        "Jumlah Penerima Bantuan harus lebih dari atau sama dengan 1",
    }),

    wilayah: Joi.object({
      provinsi: Joi.string()
        .required()
        .messages({ "any.required": "Provinsi wajib diisi" }),
      kabupaten: Joi.string()
        .required()
        .messages({ "any.required": "Kabupaten wajib diisi" }),
      kecamatan: Joi.string()
        .required()
        .messages({ "any.required": "Kecamatan wajib diisi" }),
    })
      .required()
      .messages({
        "any.required":
          "Wilayah harus lengkap dengan provinsi, kabupaten, dan kecamatan",
      }),

    tanggal_penyaluran: Joi.date().required().messages({
      "any.required": "Tanggal Penyaluran wajib diisi",
      "date.base": "Tanggal Penyaluran harus berupa tanggal yang valid",
    }),

    bukti_penyaluran: Joi.object({
      file: Joi.any()
        .required()
        .custom((value, helper) => {
          const validFileTypes = ["image/jpeg", "image/png", "application/pdf"];
          const maxFileSize = 2 * 1024 * 1024;
          if (!validFileTypes.includes(value.mimetype)) {
            return helper.message("File harus berupa JPG, PNG, atau PDF");
          }
          if (value.size > maxFileSize) {
            return helper.message("File maksimal 2MB");
          }
          return value;
        }, "File validation"),
    })
      .required()
      .messages({
        "any.required": "Bukti Penyaluran wajib diisi",
      }),

    catatan_tambahan: Joi.string().optional().allow(""),
  });

  return schema.validate(data);
};

const validateUser = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "any.required": "Email wajib diisi",
      "string.email": "Email harus memiliki format yang valid",
    }),

    username: Joi.string().alphanum().min(3).max(30).required().messages({
      "any.required": "Username wajib diisi",
      "string.alphanum": "Username hanya boleh mengandung huruf dan angka",
      "string.min": "Username harus memiliki minimal 3 karakter",
      "string.max": "Username tidak boleh lebih dari 30 karakter",
    }),

    password: Joi.string().min(6).required().messages({
      "any.required": "Password wajib diisi",
      "string.min": "Password harus memiliki minimal 6 karakter",
    }),

    role: Joi.string().valid("admin", "user").required().messages({
      "any.required": "Role wajib diisi",
      "any.only": "Role harus salah satu dari admin atau user",
    }),
  });

  return schema.validate(data);
};

module.exports = {
  validateLaporan,
  validateUser,
};
