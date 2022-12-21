import mongoose from "mongoose";
const debtAssumptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    loanAmount: {
        subtitle: { type: String, required: true },
        text: { type: Number, required: true },
        isCompleted: { type: Boolean, default: true }
    },
    interest: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean, default: true }
    },
    amortPeriod: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean, default: true }
    },
    constant: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean, default: true }
    },
    annualDebtService: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean }
    },
    loanPeriod: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean }
    },
    dscr: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean }
    },
    ltv: {
        subtitle: { type: String },
        text: { type: Number },
        isCompleted: { type: Boolean }
    },
    refinanceYear: {
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

export default mongoose.model('debtAssumption', debtAssumptionSchema)