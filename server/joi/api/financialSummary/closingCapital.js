import Joi from "joi";

export default Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
    title: Joi.string().required().min(3),
    titleFee: Joi.object(),
    attorneyFee: Joi.object(),
    brokerfee: Joi.object(),
    bankFee: Joi.object(),
    rateCap: Joi.object(),
    total: Joi.object(),
    isStepCompleted: Joi.boolean()
})