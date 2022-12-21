import mongoose from "mongoose";
const locationSummarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    locationSummary: [{
        subTitle: {
            type: String,
        },
        subTitleText: {
            type: String,
        },
        images: [{
            type: String,
        }]
    }],
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('locationSummary', locationSummarySchema)