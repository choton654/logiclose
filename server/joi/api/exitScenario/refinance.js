import Joi from "joi";

export default Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
    title: Joi.string().required().min(3),
    year: Joi.object().required(),
    noi: Joi.object(),
    interestRate: Joi.object(),
    constant: Joi.object(),
    annualDebtService: Joi.object(),
    amortPeriod: Joi.object(),
    dscr: Joi.object(),
    loanAmount: Joi.object(),
    debtRepayment: Joi.object(),
    refiFees: Joi.object(),
    refiProceeds: Joi.object(),
    other: Joi.object(),
    isStepCompleted: Joi.boolean()
})