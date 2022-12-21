import mongoose from "mongoose";
const communitySummarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    featureData: [{
        subTitle: {
            type: String,
            required: true
        },
        description: {
            type: String,
            // required: true
        }
    }],
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('communitySummary', communitySummarySchema)