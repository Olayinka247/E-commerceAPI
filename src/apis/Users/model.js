import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// before saving to data base hash the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 11);
  }
  next();
});

// compare password with hashed password
userSchema.static("checkCredentials", async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return user;
    } else {
      return null;
    }
  }
  return null;
});

// exclude password and __v from the response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

export default model("User", userSchema);
