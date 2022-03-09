const services = (req, res, next) => {
  res.sendSuccess = (msg, data) => {
    res.status(200).json({ success: true, msg, data });
  };
  res.sendPost = (msg, data) => {
    res.status(201).json({ success: true, msg, data });
  };
  res.sendInvalid = (msg) => {
    res.status(400).json({ success: false, msg });
  };
  res.sendError = (msg, err) => {
    res.status(404).json({ success: false, msg, err });
  };
  next();
};

export { services };
