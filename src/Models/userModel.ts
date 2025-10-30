import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'admin' | 'accountant' | 'manager' | 'developer';

export interface IUser extends Document {
  fullName: string;
  email: string;
  contactNumber: string;
  password: string;
  role: UserRole;
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'accountant', 'manager', 'developer']  },
}, {
  timestamps: true
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
