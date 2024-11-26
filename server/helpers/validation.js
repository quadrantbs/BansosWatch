const Joi = require("joi");

const validateReport = (data) => {
  const schema = Joi.object({
    program_name: Joi.string().required().messages({
      "any.required": "Program Name is required",
    }),

    recipients_count: Joi.number().integer().min(1).required().messages({
      "any.required": "Number of Recipients is required",
      "number.base": "Number of Recipients must be a number",
      "number.min": "Number of Recipients must be at least 1",
    }),

    region: Joi.object({
      province: Joi.string()
        .required()
        .messages({ "any.required": "Province is required" }),
      city_or_district: Joi.string()
        .required()
        .messages({ "any.required": "City/District is required" }),
      subdistrict: Joi.string()
        .required()
        .messages({ "any.required": "Sub-district is required" }),
    })
      .required()
      .messages({
        "any.required":
          "Region must include province, city/district, and sub-district",
      }),

    distribution_date: Joi.date().required().messages({
      "any.required": "Distribution Date is required",
      "date.base": "Distribution Date must be a valid date",
    }),

    proof_of_distribution: Joi.string()
      .required()
      .messages({
        "any.required": "Proof of Distribution is required",
      }),

    additional_notes: Joi.string().optional().allow(""),
    status: Joi.string().valid("pending", "verified", "rejected").messages({
      "any.required": "Status is required",
      "any.only": "Status must be either 'pending', 'verified', or 'rejected'",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateUserRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.email": "Email must be in a valid format",
    }),

    username: Joi.string().alphanum().min(3).max(30).required().messages({
      "any.required": "Username is required",
      "string.alphanum": "Username can only contain letters and numbers",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must not exceed 30 characters",
    }),

    password: Joi.string().min(6).required().messages({
      "any.required": "Password is required",
      "string.min": "Password must be at least 6 characters long",
    }),

    role: Joi.string().valid("admin", "user").messages({
      "any.required": "Role is required",
      "any.only": "Role must be either 'admin' or 'user'",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateUserLogin = (data) => {
  const schema = Joi.object({
    emailOrUsername: Joi.string().required().messages({
      "any.required": "Email or Username is required",
    }),

    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = {
  validateReport,
  validateUserRegister,
  validateUserLogin
};
