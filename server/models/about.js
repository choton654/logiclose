import mongoose from "mongoose";
const aboutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    about: {
        type: String,
    },
    contacts: [{
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        contact: {
            type: String,
        },
        images: [{
            type: String,
        }]
    }],
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('about', aboutSchema)