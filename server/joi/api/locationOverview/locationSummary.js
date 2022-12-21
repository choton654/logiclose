import Joi from "joi";

export default Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
    title: Joi.string().required().min(3),
    locationSummary: Joi.array().required(),
    isStepCompleted: Joi.boolean()
})