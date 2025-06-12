import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema({
    title: {type: String, required: true},
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: "course"},
    video: {type: String, required: true},
    createdAt: {type: String}
})

export const lectureModel = mongoose.model("course", lectureSchema)