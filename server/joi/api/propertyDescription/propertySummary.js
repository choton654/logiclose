import Joi from "joi";

export default Joi.object().keys({
    userId: Joi.string().required().min(24).max(24),
    title: Joi.string().required().min(3),
    propertyAddress: Joi.object().required(),
    yearBuilt: Joi.object(),
    netwark: Joi.object(),
    units: Joi.object(),
    avgUnitsize: Joi.object(),
    avgRent: Joi.object(),
    currentOccupancy: Joi.object(),
    zoning: Joi.object(),
    rentSqrft: Joi.object(),
    avgRentpsf: Joi.object(),
    parkingSpaces: Joi.object(),
    taxParcel: Joi.object(),
    others: Joi.array(),
    isStepCompleted: Joi.boolean()
})
