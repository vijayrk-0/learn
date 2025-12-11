import { User } from './authSchema';

// Load Auth localStorage
export const loadAuthFromStorage = () => {
    if (typeof window === 'undefined') return { token: null, user: null };

    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    // Parse user safely - check if value exists and is not the string "undefined"
    let user = null;
    if (userJson && userJson !== 'undefined' && userJson !== 'null') {
        try {
            user = JSON.parse(userJson);
        } catch (error) {
            console.error('Failed to parse user from localStorage:', error);
            // Clear invalid data
            localStorage.removeItem('user');
        }
    }

    return {
        token: token && token !== 'undefined' && token !== 'null' ? token : null,
        user,
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
