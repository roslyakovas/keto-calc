// js/meals.js
const Meals = {
    /**
     * Инициализация
     */
    init() {
        if (AppState.data.meals.length === 0) {
            this.createDefaultMeals();
        }
        return this;
    },

    /**
     * Создание приёмов пищи по умолчанию
     */
    createDefaultMeals() {
        const today = new Date().toISOString().split('T')[0];
        const mealCount = AppState.data.settings.meals || 4;
        
        for (let i = 1; i <= mealCount; i++) {
            AppState.data.meals.push({
                id: Utils.generateId(),
                name: `Приём ${i}`,
                time: `${8 + (i - 1) * 3}:00`,
                items: [],
                date: today
            });
        }
        
        AppState.save();
        return this;
    },

    /**
     * Добавить приём пищи
     */
    add(meal) {
        const newMeal = {
            id: Utils.generateId(),
            name: Utils.cleanString(meal.name) || `Приём ${AppState.data.meals.length + 1}`,
            time: meal.time || new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            items: [],
            date: meal.date || new Date().toISOString().split('T')[0]
        };

        AppState.data.meals.push(newMeal);
        AppState.save();
        return newMeal;
    },

    /**
     * Обновить приём пищи
     */
    update(id, updates) {
        const meal = AppState.data.meals.find(m => m.id === id);
        if (meal) {
            Object.assign(meal, updates);
            AppState.save();
            return meal;
        }
        return null;
    },

    /**
     * Удалить приём пищи
     */
    delete(id) {
        const before = AppState.data.meals.length;
        AppState.data.meals = AppState.data.meals.filter(m => m.id !== id);
        if (AppState.data.meals.length < before) {
            AppState.save();
            return true;
        }
        return false;
    },

    /**
     * Добавить продукт в приём пищи
     */
    addProduct(mealId, product, weight) {
        const meal = AppState.data.meals.find(m => m.id === mealId);
        if (!meal || !product) return null;

        const weightNum = parseFloat(weight) || 100;
        const macros = Utils.calculateMacros(product, weightNum);

        const item = {
            id: Utils.generateId(),
            productId: product.id,
            productName: product.name,
            weight: weightNum,
            ...macros,
            dateAdded: new Date().toISOString()
        };

        meal.items.push(item);
        AppState.save();
        return item;
    },

    /**
     * Удалить продукт из приёма пищи
     */
    removeProduct(mealId, itemId) {
        const meal = AppState.data.meals.find(m => m.id === mealId);
        if (meal) {
            const before = meal.items.length;
            meal.items = meal.items.filter(item => item.id !== itemId);
            if (meal.items.length < before) {
                AppState.save();
                return true;
            }
        }
        return false;
    },

    /**
     * Получить totals приёма пищи
     */
    getMealTotals(mealId) {
        const meal = AppState.data.meals.find(m => m.id === mealId);
        if (!meal) return null;

        return meal.items.reduce((acc, item) => ({
            calories: acc.calories + (item.calories || 0),
            protein: acc.protein + (item.protein || 0),
            fat: acc.fat + (item.fat || 0),
            carbs: acc.carbs + (item.carbs || 0)
        }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
    },

    /**
     * Получить дневные totals
     */
    getDailyTotals() {
        return AppState.data.meals.reduce((acc, meal) => {
            const mealTotals = this.getMealTotals(meal.id);
            return {
                calories: acc.calories + mealTotals.calories,
                protein: acc.protein + mealTotals.protein,
                fat: acc.fat + mealTotals.fat,
                carbs: acc.carbs + mealTotals.carbs
            };
        }, { calories: 0, protein: 0, fat: 0, carbs: 0 });
    },

    /**
     * Очистить все приёмы пищи
     */
    clearAll() {
        AppState.data.meals.forEach(meal => {
            meal.items = [];
        });
        AppState.save();
        return this;
    },

    /**
     * Получить приёмы пищи за дату
     */
    getByDate(date) {
        const targetDate = date || new Date().toISOString().split('T')[0];
        return AppState.data.meals.filter(m => m.date === targetDate);
    }
};