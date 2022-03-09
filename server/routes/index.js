import express from "express";

import { services } from "../middleware/services.js";
import { auth } from "../middleware/auth.js";

import UserController from "../controllers/user.controller.js";
import IncomeController from "../controllers/income.controller.js";
import ExpensesController from "../controllers/expenses.controller.js";
import EarnController from "../controllers/earn.controller.js";

const router = express.Router();

router.get("/user/info", auth, services, UserController.UserInfo);
router.post("/user/register", services, UserController.Register);
router.post("/user/login", services, UserController.Login);
router.put("/user", auth, services, UserController.UpdateUser);
router.put(
  "/user/change-password",
  auth,
  services,
  UserController.ChangePassword
);
router.delete("/user", auth, services, UserController.DeleteUser);
router.get("/user/logout", auth, services, UserController.LogOut);

router.put("/user/image", auth, services, UserController.changeImage);
router.put("/user/bg-image", auth, services, UserController.changeBgImage);

router.get("/incomes", auth, services, IncomeController.GetIncomeAll);
router.get("/income/by-date", auth, services, IncomeController.GetIncomeByDate);
router.post("/income", auth, services, IncomeController.AddIncome);
router.delete("/income/:_id", auth, services, IncomeController.DeleteIncome);

router.get("/expenses", auth, services, ExpensesController.GetExpensesAll);
router.get(
  "/expenses/by-date",
  auth,
  services,
  ExpensesController.GetExpensesByDate
);
router.post("/expenses", auth, services, ExpensesController.AddExpenses);
router.delete(
  "/expenses/:_id",
  auth,
  services,
  ExpensesController.DeleteExpenses
);

router.get("/earns", auth, services, EarnController.GetEarnAll);
router.post("/earn", auth, services, EarnController.AddEarn);
router.delete("/earn/:_id", auth, services, EarnController.DeleteEarn);

export default router;
