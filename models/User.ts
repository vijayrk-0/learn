import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    verified: boolean;
    resetOTP?: string;
    resetOTPExpires?: Date;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    resetOTP: {
        type: String,
    },
    resetOTPExpires: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
