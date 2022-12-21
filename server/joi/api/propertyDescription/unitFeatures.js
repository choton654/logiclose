import Joi from "joi";

export default Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
    title: Joi.string().required().min(3),
    unitFeatures: Joi.array().required(),
    isStepCompleted: Joi.boolean()
    // subTitle: Joi.string().required().min(3),
    // subTitleText: Joi.string().required().min(3),
    // images: Joi.array().required().min(1)
})