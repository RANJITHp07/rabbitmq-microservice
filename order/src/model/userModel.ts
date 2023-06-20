import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  }
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export {IUser,UserModel};
