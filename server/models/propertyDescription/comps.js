import mongoose from "mongoose";
const compSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    comps: [{
        label: {
            type: String,
        },
        compText: {
            type: String,
        },
        compData: [{
            bedRoomCount: {
                type: Number
            },
            bathRoomCount: {
                type: Number
            },
            avgRent: {
                type: Number,
            },
            sqrFeet: {
                type: Number,
            }
        }],
        images: [{
            type: String,
        }]
    }],
    isStepCompleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('comp', compSchema)