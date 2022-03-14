import UserModel from "../models/user.model.js";

const auth = (req, res, next) => {
  const token = req.headers["token"];
  if (!token)
    return res.status(404).json({ msg: "Token is required", isAuth: false });
  UserModel.findByToken(token, (err, user) => {
    if (err)
      return res
        .status(404)
        .json({ msg: "Token is expired. Please Login!!!", isAuth: false, err });
    if (!user) return res.status(404).json({ isAuth: false, error: true });
    req.token = token;
    req.user = user;
    next();
  });
};

export { auth };
