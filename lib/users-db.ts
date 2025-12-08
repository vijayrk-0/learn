import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app', 'data', 'users.json');

// Helper to read users from the file
export const getUsers = () => {
    try {
        if (!fs.existsSync(dataFilePath)) {
            return [];
        }
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        // Handle case where file might be empty or just "module.exports = ..."
        try {
            return JSON.parse(fileContent);
        } catch (e) {
            // If it fails, maybe it's empty or invalid
            return [];
        }
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};

// Helper to write users to the file
export const saveUsers = (users: any[]) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users file:', error);
        throw new Error('Failed to save user data');
    }
};

// find user by email
export const findUserByEmail = (email: string) => {
    const users = getUsers();
    return users.find((user: any) => user.email === email.toLowerCase());
};

// create user
export const createUser = (user: any) => {
    const users = getUsers();
    // Check if user already exists
    if (users.find((u: any) => u.email === user.email.toLowerCase())) {
        throw new Error('User already exists');
    }
    users.push({ ...user, email: user.email.toLowerCase(), createdAt: new Date() });
    saveUsers(users);
    return user;
};

// update user
export const updateUser = (email: string, updates: any) => {
    const users = getUsers();
    const index = users.findIndex((user: any) => user.email === email.toLowerCase());
    if (index === -1) {
        return null; 
    }

    // Apply updates
    let updatedUser = { ...users[index] };

    if (updates.$set) {
        updatedUser = { ...updatedUser, ...updates.$set };
    }
    if (updates.$unset) {
        for (const key in updates.$unset) {
            delete updatedUser[key];
        }
    }

    // If no mongo-style operators, assume direct update
    if (!updates.$set && !updates.$unset) {
        updatedUser = { ...updatedUser, ...updates };
    }

    users[index] = updatedUser;
    saveUsers(users);
    return updatedUser;
};
