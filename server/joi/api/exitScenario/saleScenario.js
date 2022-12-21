import Joi from "joi";

export default Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
    title: Joi.string().required().min(3),
    year: Joi.object().required(),
    noi: Joi.object(),
    exitCapRate: Joi.object(),
    salePrice: Joi.object(),
    sellingCosts: Joi.object(),
    transferTax: Joi.object(),
    saleProceeds: Joi.object(),
    debtRepayment: Joi.object(),
    other: Joi.object(),
    isStepCompleted: Joi.boolean()
})