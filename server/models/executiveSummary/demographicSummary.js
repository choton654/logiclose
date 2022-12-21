import mongoose from "mongoose"
const demographicSummarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    descriptionArr: [{
        type: String,
        // required: true
    }],
    images: [{
        type: String,
    }],
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('demographicSummary', demographicSummarySchema)