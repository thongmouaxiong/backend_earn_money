import bcryptjs from "bcryptjs";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";
import UploadImage from "../config/uploadImage.js";
dotenv.config();

const SALT_I = parseInt(process.env.SALT);

export default class User {
  static UserInfo = async (req, res) => {
    const user = await UserModel.findById(req.user._id).select(
      "firstname lastname email image bg_image"
    );
    res.sendSuccess("Selected User info.", user);
  };
  static Register = async (req, res) => {
    try {
      const err_msg = "";
      const { firstname, lastname, email, password } = req.body;

      if (!firstname) err_msg += "firstname, ";
      if (!lastname) err_msg += "lastname, ";
      if (!email) err_msg += "email, ";
      if (!password) err_msg += "password. ";

      if (err_msg) return res.sendInvalid(`please input ${err_msg}`);

      const existUser = await UserModel.findOne({ email });
      if (existUser) return res.sendInvalid(`this email is already in use.`);

      const user = await UserModel.create({
        firstname,
        lastname,
        email,
        password,
      });
      res.sendPost("Register User Account Complete.", user);
    } catch (err) {
      console.log(err);
      res.sendError("Error while register.", err);
    }
  };
  static Login = async (req, res) => {
    try {
      const err_msg = "";
      const { email, password } = req.body;

      if (!email) err_msg += "email, ";
      if (!password) err_msg += "password. ";

      if (err_msg) return res.sendInvalid(`please input ${err_msg}`);
      let user = await UserModel.findOne({ email });

      if (!user) return res.sendInvalid("Invalid email or password.");

      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) return res.sendInvalid("Invalid email or password.");
        user.generateToken((err, user) => {
          if (err) res.sendError("Error while login.", err);
          res.sendSuccess("Login Complete.", { token: user.token });
        });
      });
    } catch (err) {
      console.log(err);
      res.sendError("Error while login.", err);
    }
  };

  static LogOut = async (req, res) => {
    try {
      const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { token: "" },
        { new: true }
      );
      res.sendSuccess("Log out compleate.");
    } catch (err) {
      console.log(err);
      res.sendError("Error while login.", err);
    }
  };

  static UpdateUser = async (req, res) => {
    try {
      const err_msg = "";
      const { firstname, lastname } = req.body;

      if (!firstname) err_msg += "firstname, ";
      if (!lastname) err_msg += "lastname, ";

      //   if (err_msg) return res.sendInvalid(`please input ${err_msg}`);
      //   if (password) {
      //     const salt = await bcryptjs.genSalt(parseInt(SALT_I));
      //     var pwd = await bcryptjs.hash(newPassword, salt);
      //   }

      const data = { firstname, lastname };

      const user = await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        { $set: data },
        { new: true }
      ).select("firstname lastname email");
      res.sendSuccess("Update User Info Complete.", user);
    } catch (err) {
      console.log(err);
      res.sendError("Error while update user info.", err);
    }
  };
  static DeleteUser = async (req, res) => {
    try {
      const user = await UserModel.findByIdAndDelete(req.user._id).select(
        "firstname lastname email"
      );
      if (!user) return res.sendInvalid("Not found user.");
      res.sendSuccess("Delete user accout Complete.", user);
    } catch (err) {
      console.log(err);
      res.sendError("Error while delete user.", err);
    }
  };

  static ChangePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword) {
        return res.sendInvalid("please input oldPassword.");
      }
      if (!newPassword) {
        return res.sendInvalid("please input newPassword.");
      }

      const userExist = await UserModel.findById(req.user._id);

      userExist.comparePassword(oldPassword, async(err, isMatch) => {
        console.log("err pwd", err, isMatch);
        if (!isMatch) return res.sendInvalid("Your old password is not match.");

        const salt = await bcryptjs.genSalt(parseInt(SALT_I));
        var pwd = await bcryptjs.hash(newPassword, salt);

        const user = await UserModel.findByIdAndUpdate(
          req.user._id,
          { password: pwd },
          { new: true }
        );
        res.sendSuccess("Change password complete.", user);
      });
    } catch (err) {
      console.log(err);
      res.sendError("Error while change password.", err);
    }
  };

  static changeImage = async (req, res) => {
    try {
      const { oldImg, newImg } = req.body;
      if (!newImg) {
        return res.sendInvalid("please input newImg.");
      }

      const imgUrl = await UploadImage(newImg, oldImg);

      console.log("image", imgUrl);

      const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { image: imgUrl },
        { new: true }
      ).select("image");

      if (!user) return res.sendInvalid("Not found user.");
      res.sendSuccess("Change image Complete.", user);
    } catch (err) {
      console.log(err);
      res.sendError("Error while delete user.", err);
    }
  };
  static changeBgImage = async (req, res) => {
    try {
      const { oldImg, newImg } = req.body;

      if (!newImg) {
        return res.sendInvalid("please input newImg.");
      }
      const imgUrl = await UploadImage(newImg, oldImg);

      const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { bg_image: imgUrl },
        { new: true }
      ).select("bg_image");

      if (!user) return res.sendInvalid("Not found user.");
      res.sendSuccess("Change backgroud image Complete.", user);
    } catch (err) {
      console.log(err);
      res.sendError("Error while delete user.", err);
    }
  };
}
