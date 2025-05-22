//VALIDATING REGISTRATION
const Joi = require('@hapi/joi');

// Professional Registration Validation
const registerEmployeeValidation = data => {
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
        phone: Joi.string()
            .length(10)
            .pattern(/^\d+$/)
            .required(),
        type: Joi.string()
            .valid('admin', 'employee'),
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
            .valid('active', 'blocked')
    });

    return schema.validate(data);
};


module.exports.registerEmployeeValidation = registerEmployeeValidation;
