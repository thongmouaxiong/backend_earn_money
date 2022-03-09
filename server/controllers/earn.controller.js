import mongoose from "mongoose";
import EarnModel from "../models/earn.model.js";

export default class Earn {
  static GetEarnAll = async (req, res) => {
    try {
      const limit = 10;
      let skip = parseInt(req.headers["skip"]);
      if (skip <= 0) {
        skip = 0;
      }
      const earn = await EarnModel.find({ user: req.user._id })
        .limit(limit)
        .skip(skip * limit)
        .sort({ _id: -1 });
      const count = await EarnModel.find({ user: req.user._id }).count();

      const sum = await EarnModel.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: "$user", sum: { $sum: "$money" } } },
      ]);

      console.log(sum);
      res.sendSuccess("Get earn. ", {
        count,
        sum: sum[0] || { sum: 0 },
        earn,
      });
    } catch (err) {
      console.log(err);
      res.sendError("Error while get all earn.", err);
    }
  };

  static AddEarn = async (req, res) => {
    try {
      const { money } = req.body;
      if (!money) {
        return res.sendInvalid("please input money.");
      }
      if (money <= 0 || money % 1000 != 0) {
        return res.sendInvalid("invalid money.");
      }
      const earn = await EarnModel.create({
        user: req.user._id,
        money
      });
      res.sendPost("Add new earn complete.", earn);
    } catch (err) {
      console.log(err);
      res.sendError("Error while add earn.", err);
    }
  };
  static DeleteEarn = async (req, res) => {
    try {
      const earn_id = req.params._id;
      if (!mongoose.isValidObjectId(earn_id)) {
        return res.sendInvalid("invalid earn_id: " + earn_id);
      }
      const earn = await EarnModel.findByIdAndDelete(earn_id);
      if (!earn) return res.sendInvalid("not found earn.");
      res.sendPost("Delete earn complete." );
    } catch (err) {
      console.log(err);
      res.sendError("Error while delete earn.", err);
    }
  };
}
