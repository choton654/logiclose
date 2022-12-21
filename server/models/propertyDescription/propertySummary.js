import mongoose from "mongoose"
const propertySummarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    propertyAddress: {
        subtitle: { type: String, required: true },
        text: { type: String, required: true },
        isCompleted: { type: Boolean, default: true }
    },
    currentOccupancy: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    yearBuilt: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    netwark: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    units: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    avgUnitsize: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    avgRent: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    zoning: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    rentSqrft: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    avgRentpsf: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    parkingSpaces: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    taxParcel: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    others: [{
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean },
        name: { type: String }
    }],
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('propertySummary', propertySummarySchema)

 // siteSize: {
    //     subtitle: { type: String },
    //     text: { type: String },
    //     isCompleted: { type: Boolean }
    // },

       // propertyDiscription: {
    //     subtitle: { type: String },
    //     text: { type: String },
    //     isCompleted: { type: Boolean }
    // },