//VALIDATING REGISTRATION
const Joi = require('@hapi/joi');

// Professional Registration Validation
const registerOfficialValidation = data => {
    const schema = Joi.object({
        id : Joi.string()
            .required(),
        firstName: Joi.string()
            .min(3)
            .max(50)
            .required(),
        lastName: Joi.string()
            .min(3)
            .max(50)
            .required(),
        district: Joi.string()
            .required(),
        province: Joi.string()
            .required(),
        phone: Joi.string()
            .length(10)
            .pattern(/^\d+$/)
            .required(),
        type: Joi.string()
            .valid('PHI officer', 'grama niladhari officer', 'municipal council officer'),
        url: Joi.string()
            .min(10)
            .max(1024),
    });

    return schema.validate(data);
};


module.exports.registerOfficialValidation = registerOfficialValidation;