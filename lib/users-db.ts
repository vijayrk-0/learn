// userStore.ts
import { promises as fs } from 'fs';
import { getRespectiveFilePath, readFile, writeFile } from './utils';

// User type definition
export type User = {
    _id?: string;
    email?: string;
    password?: string;
    name?: string;
    verified?: boolean;
    otp?: string;
    otpExpires?: Date | string;
    resetOTP?: string;
    resetOTPExpires?: Date | string;
    createdAt?: string;
};

const dataFilePath = getRespectiveFilePath('users');

// Read all users
export const getUsers = async (): Promise<User[]> => {
    try {
        // Check if file exists using async method
        await fs.access(dataFilePath);
        const data = await readFile(dataFilePath);
        return Array.isArray(data) ? (data as User[]) : [];
    } catch (error) {
        // File doesn't exist or read error
        console.error('Error reading users file:', error);
        return [];
    }
};

// Write all users
export const saveUsers = async (users: User[]): Promise<void> => {
    try {
        // Fix parameter order: writeFile(data, filePath)
        await writeFile(users, dataFilePath);
    } catch (error) {
        console.error('Error writing users file:', error);
        throw new Error('Failed to save user data');
    }
};

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | undefined> => {
    const users = await getUsers();
    const normalizedEmail = email.toLowerCase();
    return users.find((user) => user.email?.toLowerCase() === normalizedEmail);
};

// Create user
export const createUser = async (user: User): Promise<User> => {
    const users = await getUsers();
    const normalizedEmail = user.email?.toLowerCase();

    if (!normalizedEmail) {
        throw new Error('Email is required');
    }

    if (users.find((u) => u.email?.toLowerCase() === normalizedEmail)) {
        throw new Error('User already exists');
    }

    const newUser: User = {
        ...user,
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await saveUsers(users);

    return newUser;
};

// Update user
export const updateUser = async (
    email: string,
    updates: any
): Promise<User | null> => {
    const users = await getUsers();
    const normalizedEmail = email.toLowerCase();

    const index = users.findIndex(
        (user) => user.email?.toLowerCase() === normalizedEmail
    );

    if (index === -1) {
        return null;
    }

    let updatedUser: User = { ...users[index] };

    if (updates.$set) {
        updatedUser = { ...updatedUser, ...updates.$set };
    }

    if (updates.$unset) {
        for (const key in updates.$unset) {
            delete (updatedUser as any)[key];
        }
    }

    if (!updates.$set && !updates.$unset) {
        updatedUser = { ...updatedUser, ...(updates as Partial<User>) };
    }

    users[index] = updatedUser;
    await saveUsers(users);

    return updatedUser;
};
