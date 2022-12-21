import mongoose from "mongoose"
const saleScenarioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    year: {
        subtitle: { type: String, required: true },
        text: { type: String, required: true },
        isCompleted: { type: Boolean, default: true }
    },
    noi: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean, default: true }
    },
    exitCapRate: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean, default: true }
    },
    salePrice: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean, default: true }
    },
    sellingCosts: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    transferTax: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    saleProceeds: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    debtRepayment: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    other: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('saleScenario', saleScenarioSchema)