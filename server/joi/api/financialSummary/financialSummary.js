import Joi from "joi";

export default Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
    title: Joi.string().required().min(3),
    featureData: Joi.array().required().min(1),
    isStepCompleted: Joi.boolean(),
    type: Joi.string().valid('sourceFund', 'closingCapital', 'debtAssumptions', 'annualRent', 'performa')
})