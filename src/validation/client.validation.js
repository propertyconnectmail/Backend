//VALIDATING REGISTRATION
const Joi = require('@hapi/joi');

// Professional Registration Validation
const registerClientValidation = data => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(3)
            .max(50)
            .required(),
        lastName: Joi.string()
            .min(3)
            .max(50)
            .required(),
        email: Joi.string()
            .email()
            .min(6)
            .max(255)
            .required(),
        nic: Joi.string()
            .pattern(/^([0-9]{9}[vVxX]|[0-9]{12})$/)
            .required(),
        password: Joi.string()
            .min(6)
            .max(1024)
            .required(),
        googleId: Joi.string()
            .optional()
            .allow(''),
        phone: Joi.string()
            .length(10)
            .pattern(/^\d+$/)
            .required(),
        address: Joi.string()
            .min(8)
            .max(255)
            .required(),
        dob: Joi.string()
            .required(),
        url: Joi.string()
            .min(10)
            .max(1024),
        status: Joi.string()
            .valid('active', 'blocked'),
        favorites: Joi.array()
            .optional(),
        cards: Joi.array().items(cardSchema).optional()
    });

    return schema.validate(data);
};

const cardSchema = Joi.object({
    cardNumber: Joi.string().creditCard().required(),
    expiryMonth: Joi.string().required(),
    expiryYear: Joi.string().required(),
    cardHolderName: Joi.string().required()
});


module.exports.registerClientValidation = registerClientValidation;