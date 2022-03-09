import mongoose from "mongoose";

const incomeSchema = mongoose.Schema(
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
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const incomeModel = mongoose.model("Income", incomeSchema);

export default incomeModel;
