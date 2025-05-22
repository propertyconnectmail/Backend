//VALIDATING REGISTRATION
const Joi = require('@hapi/joi');

// Professional Registration Validation
const registerRegistryLocationValidation = data => {
    const schema = Joi.object({
        id : Joi.string()
            .required(),
        locationName: Joi.string()
            .required(),
        address: Joi.string()
            .min(8)
            .max(255)
            .required(),
        phone: Joi.string()
            .length(10)
            .pattern(/^\d+$/)
            .required(),
        url: Joi.string()
            .min(10)
            .max(1024),
        status: Joi.string()
            .valid('active', 'inactive', 'blocked')
    });

    return schema.validate(data);
};


module.exports.registerRegistryLocationValidation = registerRegistryLocationValidation;