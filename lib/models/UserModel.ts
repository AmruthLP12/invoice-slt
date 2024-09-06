// lib/models/UserModel.ts
import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  loginId: string;
  password: string;
}

const userSchema = new Schema<User>({
  loginId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;
