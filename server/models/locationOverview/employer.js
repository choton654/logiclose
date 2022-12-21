import mongoose from "mongoose";
const employerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    employers: [{
        label: {
            type: String,
        },
        labelText: {
            type: String,
        },
        departmentLabel: {
            type: String,
        },
        departmentText: {
            type: String,
        }
    }],
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('employer', employerSchema)