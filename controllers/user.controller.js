const bcrypt = require("bcrypt");

const User = require("../model/user.model");

const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({
      code: 400,
      message: "All fields are required",
    });
  }

  const exitingUser = await User.findOne({ username });
  if (exitingUser) {
    return res.json({
      code: 400,
      message: "Username already exists",
    });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.json({
      code: 400,
      message: "Email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashPassword,
  });

  await user.save();
  return res.json({
    code: 201,
    message: "User created successfully",
    // user: user.isSelected("-password"),
    user: user,
  });

};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      code: 400,
      message: "All fields are required",
    });
  }

  const exitingUser = await User.findOne({ username });
  if (!exitingUser) {
    return res.json({
      code: 400,
      message: "incorrect username or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, exitingUser.password);
  if (!isPasswordValid) {
    return res.json({
      code: 400,
      message: "incorrect username or password",
    });
  }

  return res.json({
    code: 200,
    message: "User created successfully",
    // user: exitingUser.isSelected("-password"),
    user: exitingUser,
  });

};

const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
    
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({_id: {$ne: req.params.id}}).select("-password");
    
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
    
};
module.exports = { register, login, setAvatar, getAllUsers };