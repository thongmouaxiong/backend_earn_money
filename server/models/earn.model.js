import mongoose from "mongoose";

const earnSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    money: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const earnModel = mongoose.model("Earn", earnSchema);

export default earnModel;
