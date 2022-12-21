import mongoose from "mongoose";
const closingCapitalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    titleFee: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean, default: true }
    },
    attorneyFee: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean, default: true }
    },
    brokerfee: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean, default: true }
    },
    bankFee: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean, default: true }
    },
    rateCap: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean }
    },
    total: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean }
    },
    others: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean }
    },
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('closingCapital', closingCapitalSchema)