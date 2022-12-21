import mongoose from "mongoose"
const investmentOpportunitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    descriptionArr: [{
        type: String,
        // required: true
    }],
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('investmentOpportunity', investmentOpportunitySchema)