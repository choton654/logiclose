import mongoose from "mongoose";
const performaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    performa: {
        images: [{
            type: String,
        }]
    },
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('performa', performaSchema)