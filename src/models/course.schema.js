import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    title: {type: String, required: true},
    category: {type: String, required: true},
    subTitle: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    level: {type: String, enum: ["beginner", "intermediate", "advanced"], required: true},
    instructorId: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    thumbnail: {type: String, required: true},
    language: {type: String, required: true},
    status: { type: String, enum: ["draft", "published"], default: "draft"},
    createdAt: {type: String}
})

export const courseModel = mongoose.model("course", courseSchema)