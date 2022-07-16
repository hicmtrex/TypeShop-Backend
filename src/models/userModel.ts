import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
<<<<<<< HEAD
    email: { type: String, required: true, unique: true },
=======
    email: { type: String, required: true ,unique:true },
>>>>>>> 2bdbec4e49638f0dcfa365d157909592e33f01f9
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

// userSchema.methods.matchPassword = async function (enteredPassword: string) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = model<IUser>('User', userSchema);

export default User;
