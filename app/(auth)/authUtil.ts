import { User } from './authSchema';

// Load Auth localStorage
export const loadAuthFromStorage = () => {
    if (typeof window === 'undefined') return { token: null, user: null };

    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    return {
        token,
        user: userJson ? JSON.parse(userJson) : null,
    };
};


// Save Auth localStorage
export const saveAuthToStorage = (token: string, user: User) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};


// Clear Auth localStorage
export const clearAuthStorage = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
