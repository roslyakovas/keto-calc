// js/recipes.js
const Recipes = {
    /**
     * Инициализация базы рецептов
     */
    init() {
        if (AppState.data.recipes.length === 0) {
            this.loadDefaults();
        }
        return this;
    },

    /**
     * Загрузка рецептов по умолчанию из внешнего файла
     */
    loadDefaults() {
        if (typeof DEFAULT_RECIPES !== 'undefined') {
            AppState.data.recipes = JSON.parse(JSON.stringify(DEFAULT_RECIPES))
                .map(recipe => ({
                    ...recipe,
                    id: recipe.id || Utils.generateId(),
                    name: Utils.cleanString(recipe.name),
                    category: Utils.cleanString(recipe.category),
                    dateAdded: recipe.dateAdded || new Date().toISOString()
                }));
            AppState.save();
            console.log('✅ Загружено рецептов по умолчанию:', AppState.data.recipes.length);
        }
        return this;
    },

    /**
     * Добавить новый рецепт
     */
    add(recipe) {
        const ingredients = (recipe.ingredients || []).map(ing => {
            const product = Products.findByName(ing.name);
            const weight = parseFloat(ing.amount) || parseFloat(ing.weight) || 100;
            
            if (product) {
                const macros = Utils.calculateMacros(product, weight);
                return {
                    name: product.name,
                    weight: weight,
                    ...macros
                };
            }
            
            return {
                name: Utils.cleanString(ing.name),
                weight: weight,
                protein: 0,
                fat: 0,
                carbs: 0,
                calories: 0
            };
        });

        const totals = this.calculateTotals(ingredients);
        const ketoRatio = Utils.calculateKetoRatio(totals.fat, totals.protein, totals.carbs);

        const newRecipe = {
            id: Utils.generateId(),
            name: Utils.cleanString(recipe.name),
            category: Utils.cleanString(recipe.category || 'Мои рецепты'),
            ingredients: ingredients,
            instructions: recipe.instructions || '',
            totals: totals,
            ketoRatio: parseFloat(ketoRatio),
            servings: parseInt(recipe.servings) || 1,
            prepTime: parseInt(recipe.prepTime) || 30,
            dateAdded: new Date().toISOString()
        };

        AppState.data.recipes.push(newRecipe);
        AppState.save();
        return newRecipe;
    },

    /**
     * Обновить рецепт
     */
    update(id, updates) {
        const index = AppState.data.recipes.findIndex(r => r.id === id);
        if (index !== -1) {
            const recipe = AppState.data.recipes[index];
            AppState.data.recipes[index] = {
                ...recipe,
                ...updates,
                name: updates.name ? Utils.cleanString(updates.name) : recipe.name
            };
            AppState.save();
            return AppState.data.recipes[index];
        }
        return null;
    },

    /**
     * Удалить рецепт
     */
    delete(id) {
        const before = AppState.data.recipes.length;
        AppState.data.recipes = AppState.data.recipes.filter(r => r.id !== id);
        if (AppState.data.recipes.length < before) {
            AppState.save();
            return true;
        }
        return false;
    },

    /**
     * Получить рецепт по ID
     */
    getById(id) {
        return AppState.data.recipes.find(r => r.id === id);
    },

    /**
     * Поиск рецептов
     */
    search(query) {
        if (!query || query.length < 2) return [];
        
        const cleanQuery = Utils.cleanString(query).toLowerCase();
        return AppState.data.recipes.filter(r => 
            Utils.cleanString(r.name).toLowerCase().includes(cleanQuery) ||
            Utils.cleanString(r.category).toLowerCase().includes(cleanQuery)
        );
    },

    /**
     * Расчёт_totals рецепта
     */
    calculateTotals(ingredients) {
        return (ingredients || []).reduce((acc, ing) => ({
            protein: acc.protein + (ing.protein || 0),
            fat: acc.fat + (ing.fat || 0),
            carbs: acc.carbs + (ing.carbs || 0),
            calories: acc.calories + (ing.calories || 0)
        }), { protein: 0, fat: 0, carbs: 0, calories: 0 });
    },

    /**
     * Расчёт КБЖУ на порцию
     */
    calculatePerServing(recipeId) {
        const recipe = this.getById(recipeId);
        if (!recipe) return null;
        
        const servings = recipe.servings || 1;
        return {
            protein: recipe.totals.protein / servings,
            fat: recipe.totals.fat / servings,
            carbs: recipe.totals.carbs / servings,
            calories: recipe.totals.calories / servings
        };
    },

    /**
     * Добавить рецепт в план питания
     */
    addToMeal(recipeId, mealId = null) {
        const recipe = this.getById(recipeId);
        if (!recipe) return null;

        const items = recipe.ingredients.map((ing, index) => ({
            id: Utils.generateId() + index,
            productId: Utils.generateId(),
            productName: ing.name,
            weight: ing.weight,
            protein: ing.protein,
            fat: ing.fat,
            carbs: ing.carbs,
            calories: ing.calories,
            fromRecipe: recipe.name
        }));

        const meal = {
            id: mealId || Utils.generateId(),
            name: recipe.name,
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            items: items,
            date: new Date().toISOString().split('T')[0]
        };

        if (mealId) {
            const existingMeal = AppState.data.meals.find(m => m.id === mealId);
            if (existingMeal) {
                existingMeal.items.push(...items);
            }
        } else {
            AppState.data.meals.push(meal);
        }

        AppState.save();
        return meal;
    },

    /**
     * Сброс к рецептам по умолчанию
     */
    resetToDefaults() {
        if (confirm('Сбросить базу рецептов к значениям по умолчанию? Ваши рецепты будут удалены!')) {
            this.loadDefaults();
            return true;
        }
        return false;
    },

    /**
     * Получить категории рецептов
     */
    getCategories() {
        const categories = [...new Set(AppState.data.recipes.map(r => r.category))];
        return categories.filter(c => c).sort();
    }
};