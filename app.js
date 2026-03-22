// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Кето Планировщик v4.0 запускается...');

    try {
        // 1. Инициализация состояния
        console.log('📦 Инициализация состояния...');
        AppState.init();

        // 2. Инициализация модулей
        console.log('🔧 Инициализация модулей...');
        Products.init();
        Recipes.init();
        Meals.init();

        // 3. Инициализация UI
        console.log('🎨 Инициализация UI...');
        UI.init();

        // 4. Настройка событий
        console.log('⚡ Настройка событий...');
        Events.init();

        // 5. Подписка на изменения состояния
        console.log('📡 Настройка подписок...');
        AppState.subscribe(() => {
            Dashboard.update();
            UI.renderAll();
        });

        // 6. Первый рендер
        console.log('📊 Первый рендер...');
        Dashboard.update();

        console.log('✅ Кето Планировщик успешно запущен!');
        console.log('📊 Продуктов:', AppState.data.products.length);
        console.log('📖 Рецептов:', AppState.data.recipes.length);
        console.log('🍽️ Приёмов пищи:', AppState.data.meals.length);

    } catch (error) {
        console.error('❌ Ошибка запуска приложения:', error);
        UI.showToast('❌ Ошибка запуска приложения');
    }
});

// Глобальные функции для inline обработчиков
window.toggleTheme = () => UI.toggleTheme();
window.switchTab = (tabId) => UI.switchTab(tabId);
window.closeModal = (modalId) => UI.closeModal(modalId);
window.exportData = () => Data.export();
window.importData = (file) => Data.import(file);
window.resetAllData = () => {
    if (confirm('Сбросить все данные?')) {
        Storage.clear();
        location.reload();
    }
};
window.saveData = () => {
    AppState.save();
    UI.showToast('💾 Данные сохранены');
};
window.resetSettings = () => {
    AppState.data.settings = {
        calories: 900,
        protein: 12,
        fat: 77.1,
        carbs: 39.4,
        ketoRatio: 1.5,
        meals: 4
    };
    AppState.save();
    UI.renderSettings();
    Dashboard.update();
};
window.resetProductDatabase = () => Products.resetToDefaults();
window.resetRecipeDatabase = () => Recipes.resetToDefaults();
window.deleteAllData = () => {
    if (confirm('Удалить все данные?')) {
        Storage.clear();
        location.reload();
    }
};
window.showAddProductModal = () => UI.openModal('addProductModal');
window.handleAddProduct = (e) => {
    e.preventDefault();
    const form = e.target;
    Products.add({
        name: form.name.value,
        category: form.category.value,
        protein: form.protein.value,
        fat: form.fat.value,
        carbs: form.carbs.value,
        calories: form.calories.value
    });
    UI.closeModal('addProductModal');
    form.reset();
    UI.renderProducts();
    UI.showToast('✅ Продукт добавлен');
};
window.addMeal = () => {
    Meals.add({});
    UI.renderMeals();
    UI.showToast('🍽️ Приём пищи добавлен');
};
window.showRecipeModal = () => UI.openModal('recipeModal');
window.addRecipeIngredientRow = () => {
    const container = document.getElementById('recipeIngredients');
    if (container) {
        const row = document.createElement('div');
        row.className = 'flex gap-2 items-center';
        row.innerHTML = `
            <input type="text" placeholder="Продукт" class="ingredient-name flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" oninput="updateRecipeTotals()">
            <input type="number" placeholder="Вес (г)" class="ingredient-weight w-24 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" value="100" oninput="updateRecipeTotals()">
            <button type="button" onclick="this.parentElement.remove(); updateRecipeTotals()" class="text-red-500">&times;</button>
        `;
        container.appendChild(row);
    }
};
window.updateRecipeTotals = () => {
    // Расчёт КБЖУ рецепта
    let totals = { protein: 0, fat: 0, carbs: 0, calories: 0 };
    document.querySelectorAll('#recipeIngredients > div').forEach(row => {
        const name = row.querySelector('.ingredient-name')?.value;
        const weight = parseFloat(row.querySelector('.ingredient-weight')?.value) || 0;
        if (name && weight > 0) {
            const product = Products.search(name, 1)[0];
            if (product) {
                const macros = Utils.calculateMacros(product, weight);
                totals.protein += macros.protein;
                totals.fat += macros.fat;
                totals.carbs += macros.carbs;
                totals.calories += macros.calories;
            }
        }
    });
    document.getElementById('recipeTotalCalories').textContent = Math.round(totals.calories);
    document.getElementById('recipeTotalProtein').textContent = totals.protein.toFixed(1);
    document.getElementById('recipeTotalFat').textContent = totals.fat.toFixed(1);
    document.getElementById('recipeTotalCarbs').textContent = totals.carbs.toFixed(1);
    const ratio = Utils.calculateKetoRatio(totals.fat, totals.protein, totals.carbs);
    document.getElementById('recipeKetoRatio').textContent = ratio;
};
window.handleSaveRecipe = (e) => {
    e.preventDefault();
    const ingredients = [];
    document.querySelectorAll('#recipeIngredients > div').forEach(row => {
        const name = row.querySelector('.ingredient-name')?.value;
        const weight = parseFloat(row.querySelector('.ingredient-weight')?.value) || 0;
        if (name && weight > 0) {
            ingredients.push({ name, amount: weight });
        }
    });
    Recipes.add({
        name: document.getElementById('recipeName').value,
        category: document.getElementById('recipeCategory').value,
        instructions: document.getElementById('recipeInstructions').value,
        ingredients: ingredients
    });
    UI.closeModal('recipeModal');
    UI.renderRecipes();
    UI.showToast('📖 Рецепт сохранён');
};