import mongoose from "mongoose";
const floorPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    floorPlans: [{
        bedRoom: {
            type: String,
            required: true
        },
        washRoom: {
            type: String,
            required: true
        },
        sqrFt: {
            type: String,
            required: true
        },
        floorName: {
            type: String,
        },
        avgRent: {
            type: String,
            required: true
        },
        images: [{
            type: String,
        }],
    }],
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('floorPlan', floorPlanSchema)