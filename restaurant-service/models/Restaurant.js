import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: { type: String, required: true }, // User ID from auth-service
    isOpen: { type: Boolean, default: true },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
