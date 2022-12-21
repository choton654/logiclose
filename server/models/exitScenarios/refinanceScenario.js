import mongoose from "mongoose"
const refinanceScenarioSchema = new mongoose.Schema({
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
    interestRate: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean, default: true }
    },
    constant: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean, default: true }
    },
    annualDebtService: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    amortPeriod: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    dscr: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    loanAmount: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    debtRepayment: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    refiFees: {
        subtitle: { type: String },
        text: { type: String },
        isCompleted: { type: Boolean }
    },
    refiProceeds: {
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

export default mongoose.model('refinanceScenario', refinanceScenarioSchema)