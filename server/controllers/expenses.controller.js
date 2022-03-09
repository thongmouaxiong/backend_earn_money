import mongoose from "mongoose";
import ExpensesModel from "../models/expenses.model.js";

export default class Expenses {
  static GetExpensesAll = async (req, res) => {
    try {
      const limit = 10;
      let skip = parseInt(req.headers["skip"]);
      if (skip <= 0) {
        skip = 0;
      }
      const expenses = await ExpensesModel.find({ user: req.user._id })
        .limit(limit)
        .skip(skip * limit)
        .sort({ _id: -1 });
      const count = await ExpensesModel.find({ user: req.user._id }).count();

      const sum = await ExpensesModel.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: "$user", sum: { $sum: "$money" } } },
      ]);

      console.log(sum);
      res.sendSuccess("Get expenses. ", {
        count,
        sum: sum[0] || { sum: 0 },
        expenses,
      });
    } catch (err) {
      console.log(err);
      res.sendError("Error while get all expenses.", err);
    }
  };
  static GetExpensesByDate = async (req, res) => {
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

      const count = await ExpensesModel.find({
        user: req.user._id,
        $expr: {
          $and: [
            { $eq: [{ $month: "$createdAt" }, month] },
            { $eq: [{ $year: "$createdAt" }, year] },
          ],
        },
      }).count();
      const sum = await ExpensesModel.aggregate([
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
      const expenses = await ExpensesModel.find({
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

      res.sendSuccess("Get expenses. ", {
        count,
        total_money: sum[0] || { sum: 0 },
        expenses,
      });
    } catch (err) {
      console.log(err);
      res.sendError("Error while get expenses.", err);
    }
  };

  static AddExpenses = async (req, res) => {
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
      const expenses = await ExpensesModel.create({
        user: req.user._id,
        money,
        description,
      });
      res.sendPost("Add new expenses complete.", expenses);
    } catch (err) {
      console.log(err);
      res.sendError("Error while add expenses.", err);
    }
  };
  static DeleteExpenses = async (req, res) => {
    try {
      const expenses_id = req.params._id;
      if (!mongoose.isValidObjectId(expenses_id)) {
        return res.sendInvalid("invalid expenses_id: " + expenses_id);
      }
      const expenses = await ExpensesModel.findByIdAndDelete(expenses_id);
      if (!expenses) return res.sendInvalid("not found expenses.");
      res.sendPost("Delete expenses complete." );
    } catch (err) {
      console.log(err);
      res.sendError("Error while delete expenses.", err);
    }
  };
}
