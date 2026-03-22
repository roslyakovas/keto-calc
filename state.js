// js/state.js
const AppState = {
    data: {
        settings: null,
        products: [],
        meals: [],
        recipes: []
    },

    listeners: [],

    init() {
        this.data.settings = Storage.get(Storage.KEYS.SETTINGS) || this.getDefaultSettings();
        this.data.products = Storage.get(Storage.KEYS.PRODUCTS) || [];
        this.data.meals = Storage.get(Storage.KEYS.MEALS) || [];
        this.data.recipes = Storage.get(Storage.KEYS.RECIPES) || [];
    },

    getDefaultSettings() {
        return {
            calories: 900,
            protein: 12,
            fat: 77.1,
            carbs: 39.4,
            ketoRatio: 1.5,
            meals: 4
        };
    },

    subscribe(callback) {
        this.listeners.push(callback);
    },

    notify() {
        this.listeners.forEach(cb => cb(this.data));
    },

    save() {
        Storage.set(Storage.KEYS.SETTINGS, this.data.settings);
        Storage.set(Storage.KEYS.PRODUCTS, this.data.products);
        Storage.set(Storage.KEYS.MEALS, this.data.meals);
        Storage.set(Storage.KEYS.RECIPES, this.data.recipes);
        this.notify();
    }
};