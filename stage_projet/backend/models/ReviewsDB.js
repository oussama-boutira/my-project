import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review