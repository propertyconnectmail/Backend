//VALIDATING REGISTRATION
const Joi = require('@hapi/joi');

// Professional Registration Validation
const auditLogValidation = data => {
    const schema = Joi.object({
        id : Joi.string()
            .required(),
        actionType: Joi.string()
            .valid('create','update', 'delete', 'view'),
        performedBy: Joi.string()
            .email()
            .min(6)
            .max(255)
            .required(),
        description: Joi.string()
            .min(5)
            .max(500)
            .required(),
        date: Joi.string()
            .required(),
    });

    return schema.validate(data);
};


module.exports.auditLogValidation = auditLogValidation;