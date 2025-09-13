// models/Token.js
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  user_id: { type: Number, required: true },
  nickname: { type: String },
  expires_in: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

tokenSchema.index({ user_id: 1 }, { unique: true });

export default mongoose.models.Token || mongoose.model("Token", tokenSchema);
