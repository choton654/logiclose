import Joi from "joi";

export default Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
    title: Joi.string().required().min(3),
    purchasePrice: Joi.object().required(),
    loanAmount: Joi.object(),
    syndicationFee: Joi.object(),
    equity: Joi.object(),
    capex: Joi.object(),
    closingCosts: Joi.object(),
    total: Joi.object(),
    isStepCompleted: Joi.boolean()
})