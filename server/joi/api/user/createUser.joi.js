import Joi from "joi";

export default Joi.object().keys({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(6)
})
