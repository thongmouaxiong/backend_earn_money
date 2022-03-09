import mongoose from "mongoose";
import IncomeModel from "../models/income.model.js";

export default class Income {
  static GetIncomeAll = async (req, res) => {
    try {
      const limit = 10;
      let skip = parseInt(req.headers["skip"]);
      if (skip <= 0) {
        skip = 0;
      }
      const income = await IncomeModel.find({ user: req.user._id })
        .limit(limit)
        .skip(skip * limit)
        .sort({ _id: -1 });
      const count = await IncomeModel.find({ user: req.user._id }).count();

      const sum = await IncomeModel.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: "$user", sum: { $sum: "$money" } } },
      ]);

      console.log(sum);
      res.sendSuccess("Get income. ", {
        count,
        sum: sum[0] || { sum: 0 },
        income,
      });
    } catch (err) {
      console.log(err);
      res.sendError("Error while get all income.", err);
    }
  };
  static GetIncomeByDate = async (req, res) => {
    try {
      const limit = 10;

      let skip = parseInt(req.headers["skip"]);
      let month = parseInt(req.headers["month"]);
      let year = parseInt(req.headers["year"]);

      if (!month) {
        month = new Date().getMonth() + 1;
      }
      if (!year) {
        year = new Date().getFullYear();
      }

      if (skip <= 0) {
        skip = 0;
      }

      const count = await IncomeModel.find({
        user: req.user._id,
        $expr: {
          $and: [
            { $eq: [{ $month: "$createdAt" }, month] },
            { $eq: [{ $year: "$createdAt" }, year] },
          ],
        },
      }).count();
      const sum = await IncomeModel.aggregate([
        {
          $project: {
            user: 1,
            money: 1,
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
        },
        { $match: { user: req.user._id, month, year } },
        {
          $group: {
            _id: "$user",
            sum: {
              $sum: "$money",
            },
          },
        },
      ]);
      const income = await IncomeModel.find({
        user: req.user._id,
        $expr: {
          $and: [
            { $eq: [{ $month: "$createdAt" }, month] },
            { $eq: [{ $year: "$createdAt" }, year] },
          ],
        },
      })
        .limit(limit)
        .skip(skip * limit)
        .sort({ _id: -1 });

      res.sendSuccess("Get income.", {
        count,
        total_money: sum[0] || { sum: 0 },
        income,
      });
    } catch (err) {
      console.log(err);
      res.sendError("Error while get income.", err);
    }
  };

  static AddIncome = async (req, res) => {
    try {
      const { money, description } = req.body;
      if (!money) {
        return res.sendInvalid("please input money.");
      }
      if (money <= 0 || money % 1000 != 0) {
        return res.sendInvalid("invalid money.");
      }
      if (!description) {
        return res.sendInvalid("please input description.");
      }
      const income = await IncomeModel.create({
        user: req.user._id,
        money,
        description,
      });
      res.sendPost("Add new income complete.", income);
    } catch (err) {
      console.log(err);
      res.sendError("Error while add income.", err);
    }
  };
  static DeleteIncome = async (req, res) => {
    try {
      const income_id = req.params._id;
      if (!mongoose.isValidObjectId(income_id)) {
        return res.sendInvalid("invalid income_id: " + income_id);
      }
      const income = await IncomeModel.findByIdAndDelete(income_id);
      if (!income) return res.sendInvalid("not found income.");
      res.sendPost("Delete income complete." );
    } catch (err) {
      console.log(err);
      res.sendError("Error while delete income.", err);
    }
  };
}
