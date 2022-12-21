import Joi from "joi";

export default Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
    about: Joi.string().required().min(3),
    contacts: Joi.array().required().min(1),
    isStepCompleted: Joi.boolean()
})