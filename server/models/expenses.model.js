import mongoose from "mongoose";

const expensesSchema = mongoose.Schema(
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

const expensesModel = mongoose.model("Expenses", expensesSchema);

export default expensesModel;
