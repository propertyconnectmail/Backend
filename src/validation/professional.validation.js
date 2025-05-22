//VALIDATING REGISTRATION
const Joi = require('@hapi/joi');

// Professional Registration Validation
const registerProfessionalValidation = data => {
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
        type: Joi.string()
            .valid('lawyer', 'surveyor', 'valuer'),
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
            .valid('pending', 'verified', 'blocked', 'rejected'),
        consultationFee: Joi.string(),
        totalRating: Joi.string().allow(''),
        totalCount: Joi.string().allow(''),
        averageRating: Joi.string().allow(''),
        about: Joi.string(),
        consults: Joi.string().allow(''),
        experience: Joi.string(),
        certifications: Joi.array()
            .items(Joi.string()
                .min(10)
                .max(1024)),
        rating: Joi.array()
    });

    return schema.validate(data);
};


const bankAccountValidation = data => {
    const schema = Joi.object({
        accountHolderName: Joi.string()
            .min(3)
            .max(100)
            .required(),
        accountNumber: Joi.string()
            .pattern(/^\d+$/)
            .min(6)
            .max(20)
            .required(),
        bankName: Joi.string()
            .min(3)
            .max(100)
            .required(),
        branchName: Joi.string()
            .min(3)
            .max(100)
            .required()
    });

    return schema.validate(data);
};


const ratingValidation = data => {
    const schema = Joi.object({
        clientEmail: Joi.string()
            .email()
            .required(),
        clientName: Joi.string()
            .min(2)
            .max(50)
            .required(),
        rating: Joi.number()
            .min(1)
            .max(5)
            .required(),
        message: Joi.string()
            .max(500)
            .optional()
            .allow(''),
        date: Joi.string()
            .required()
    });

    return schema.validate(data);
};
  
  


module.exports.registerProfessionalValidation = registerProfessionalValidation;
module.exports.bankAccountValidation = bankAccountValidation;
module.exports.ratingValidation = ratingValidation;
