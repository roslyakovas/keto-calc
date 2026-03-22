// js/storage.js
const Storage = {
    KEYS: {
        SETTINGS: 'keto_settings',
        PRODUCTS: 'keto_products',
        MEALS: 'keto_meals',
        RECIPES: 'keto_recipes',
        THEME: 'keto_theme'
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Storage.get error (${key}):`, error);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Storage.set error (${key}):`, error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Storage.remove error (${key}):`, error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage.clear error:', error);
            return false;
        }
    }
};