import mongoose, { Schema } from "mongoose";

const purchaseCourseSchema = new Schema({
  amount: { type: Number, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "failed", "success"],
  },
  paymentId: { type: String, required: true },
  purchasedAt: {type: String}
});

export const purchaseCourseModel = mongoose.model(
  "purchaseCourse",
  purchaseCourseSchema
);
