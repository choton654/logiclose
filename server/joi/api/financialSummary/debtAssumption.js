import Joi from "joi";

export default Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
    title: Joi.string().required().min(3),
    loanAmount: Joi.object().required(),
    interest: Joi.object(),
    amortPeriod: Joi.object(),
    constant: Joi.object(),
    annualDebtService: Joi.object(),
    dscr: Joi.object(),
    ltv: Joi.object(),
    refinanceYear: Joi.object(),
    isStepCompleted: Joi.boolean()
})