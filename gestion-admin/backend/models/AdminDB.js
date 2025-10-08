import mongoose from "mongoose";

const ResponsableSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true,unique: true },
    password: { type: String, required: true }
});

const Responsable = mongoose.model("Responsable", ResponsableSchema);
export default Responsable;