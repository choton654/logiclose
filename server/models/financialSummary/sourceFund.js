import mongoose from "mongoose";
const sourceFundSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    purchasePrice: {
        subtitle: { type: String, required: true },
        text: { type: Number, required: true },
        isCompleted: { type: Boolean, default: true }
    },
    loanAmount: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean, default: true }
    },
    equity: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean, default: true }
    },
    syndicationFee: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean, default: true }
    },
    capex: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean }
    },
    closingCosts: {
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

export default mongoose.model('sourcefund', sourceFundSchema)