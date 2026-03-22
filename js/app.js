// js/app.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Кето Планировщик v4.0 запускается...');
  try {
    console.log('📦 Инициализация состояния...');
    if (typeof AppState !== 'undefined') AppState.init();

    console.log('🔧 Инициализация модулей...');
    if (typeof Products !== 'undefined') Products.init();
    if (typeof Recipes !== 'undefined') Recipes.init();
    if (typeof Meals !== 'undefined') Meals.init();

    console.log('🎨 Инициализация UI...');
    if (typeof UI !== 'undefined') UI.init();

    console.log('⚡ Настройка событий...');
    if (typeof Events !== 'undefined') Events.init();

    console.log('📡 Настройка подписок...');
    if (typeof AppState !== 'undefined' && typeof AppState.subscribe === 'function') {
      AppState.subscribe(() => {
        if (typeof Dashboard !== 'undefined') Dashboard.update();
        if (typeof UI !== 'undefined' && typeof UI.renderAll === 'function') UI.renderAll();
      });
    }

    console.log('📊 Первый рендер...');
    if (typeof Dashboard !== 'undefined' && typeof Dashboard.update === 'function') Dashboard.update();

    console.log('✅ Кето Планировщик успешно запущен!');
    if (typeof AppState !== 'undefined' && AppState.data) {
      console.log('📊 Продуктов:', AppState.data.products?.length || 0);
      console.log('📖 Рецептов:', AppState.data.recipes?.length || 0);
      console.log('🍽️ Приёмов пищи:', AppState.data.meals?.length || 0);
    }

  } catch (error) {
    console.error('❌ Ошибка запуска приложения:', error);
    if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') {
      UI.showToast('❌ Ошибка запуска приложения');
    }
  }
});

// ✅ Глобальные функции для inline-обработчиков (исправлен синтаксис =>)
window.toggleTheme = () => { if (typeof UI !== 'undefined' && typeof UI.toggleTheme === 'function') UI.toggleTheme(); };
window.switchTab = (tabId) => { if (typeof UI !== 'undefined' && typeof UI.switchTab === 'function') UI.switchTab(tabId); };
window.closeModal = (modalId) => { if (typeof UI !== 'undefined' && typeof UI.closeModal === 'function') UI.closeModal(modalId); };
window.exportData = () => { if (typeof Data !== 'undefined' && typeof Data.export === 'function') Data.export(); };
window.importData = (file) => { if (typeof Data !== 'undefined' && typeof Data.import === 'function') Data.import(file); };

window.resetAllData = () => {
  if (confirm('Сбросить все данные?')) {
    if (typeof Storage !== 'undefined' && typeof Storage.clear === 'function') Storage.clear();
    location.reload();
  }
};

window.saveData = () => {
  if (typeof AppState !== 'undefined' && typeof AppState.save === 'function') AppState.save();
  if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') UI.showToast('💾 Данные сохранены');
};

window.resetSettings = () => {
  if (typeof AppState !== 'undefined' && AppState.data) {
    AppState.data.settings = {
      calories: 900, protein: 12, fat: 77.1, carbs: 39.4, ketoRatio: 1.5, meals: 4
    };
    if (typeof AppState.save === 'function') AppState.save();
    if (typeof UI !== 'undefined' && typeof UI.renderSettings === 'function') UI.renderSettings();
    if (typeof Dashboard !== 'undefined' && typeof Dashboard.update === 'function') Dashboard.update();
  }
};

window.resetProductDatabase = () => { if (typeof Products !== 'undefined' && typeof Products.resetToDefaults === 'function') Products.resetToDefaults(); };
window.resetRecipeDatabase = () => { if (typeof Recipes !== 'undefined' && typeof Recipes.resetToDefaults === 'function') Recipes.resetToDefaults(); };

window.deleteAllData = () => {
  if (confirm('Удалить все данные?')) {
    if (typeof Storage !== 'undefined' && typeof Storage.clear === 'function') Storage.clear();
    location.reload();
  }
};

window.showAddProductModal = () => { if (typeof UI !== 'undefined' && typeof UI.openModal === 'function') UI.openModal('addProductModal'); };

window.handleAddProduct = (e) => {
  e.preventDefault();
  const form = e.target;
  if (typeof Products !== 'undefined' && typeof Products.add === 'function') {
    Products.add({
      name: form.name?.value,
      category: form.category?.value,
      protein: parseFloat(form.protein?.value) || 0,
      fat: parseFloat(form.fat?.value) || 0,
      carbs: parseFloat(form.carbs?.value) || 0,
      calories: parseFloat(form.calories?.value) || 0
    });
  }
  if (typeof UI !== 'undefined' && typeof UI.closeModal === 'function') UI.closeModal('addProductModal');
  if (form) form.reset();
  if (typeof UI !== 'undefined' && typeof UI.renderProducts === 'function') UI.renderProducts();
  if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') UI.showToast('✅ Продукт добавлен');
};

window.addMeal = () => {
  if (typeof Meals !== 'undefined' && typeof Meals.add === 'function') {
    Meals.add({});
    if (typeof UI !== 'undefined' && typeof UI.renderMeals === 'function') UI.renderMeals();
    if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') UI.showToast('🍽️ Приём пищи добавлен');
  }
};

window.showRecipeModal = () => { if (typeof UI !== 'undefined' && typeof UI.openModal === 'function') UI.openModal('recipeModal'); };

window.addRecipeIngredientRow = () => {
  const container = document.getElementById('recipeIngredients');
  if (container) {
    const row = document.createElement('div');
    row.className = 'flex gap-2 items-center';
    row.innerHTML = `<input type="text" placeholder="Продукт" class="ingredient-name flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" oninput="updateRecipeTotals()"> <input type="number" placeholder="Вес (г)" class="ingredient-weight w-24 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" value="100" oninput="updateRecipeTotals()"> <button type="button" onclick="this.parentElement.remove(); updateRecipeTotals()" class="text-red-500">&times;</button>`;
    container.appendChild(row);
  }
};

window.updateRecipeTotals = () => {
  let totals = { protein: 0, fat: 0, carbs: 0, calories: 0 };
  document.querySelectorAll('#recipeIngredients > div').forEach(row => {
    const name = row.querySelector('.ingredient-name')?.value;
    const weight = parseFloat(row.querySelector('.ingredient-weight')?.value) || 0;
    if (name && weight > 0 && typeof Products !== 'undefined' && typeof Products.search === 'function') {
      const product = Products.search(name, 1)[0];
      if (product && typeof Utils !== 'undefined' && typeof Utils.calculateMacros === 'function') {
        const macros = Utils.calculateMacros(product, weight);
        totals.protein += macros.protein;
        totals.fat += macros.fat;
        totals.carbs += macros.carbs;
        totals.calories += macros.calories;
      }
    }
  });
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('recipeTotalCalories', Math.round(totals.calories));
  setEl('recipeTotalProtein', totals.protein.toFixed(1));
  setEl('recipeTotalFat', totals.fat.toFixed(1));
  setEl('recipeTotalCarbs', totals.carbs.toFixed(1));
  if (typeof Utils !== 'undefined' && typeof Utils.calculateKetoRatio === 'function') {
    const ratio = Utils.calculateKetoRatio(totals.fat, totals.protein, totals.carbs);
    setEl('recipeKetoRatio', ratio);
  }
};

window.handleSaveRecipe = (e) => {
  e.preventDefault();
  const ingredients = [];
  document.querySelectorAll('#recipeIngredients > div').forEach(row => {
    const name = row.querySelector('.ingredient-name')?.value;
    const weight = parseFloat(row.querySelector('.ingredient-weight')?.value) || 0;
    if (name && weight > 0) ingredients.push({ name, amount: weight });
  });
  if (typeof Recipes !== 'undefined' && typeof Recipes.add === 'function') {
    Recipes.add({
      name: document.getElementById('recipeName')?.value,
      category: document.getElementById('recipeCategory')?.value, 
      instructions: document.getElementById('recipeInstructions')?.value,
      ingredients: ingredients
    });
  }
  if (typeof UI !== 'undefined' && typeof UI.closeModal === 'function') UI.closeModal('recipeModal');
  if (typeof UI !== 'undefined' && typeof UI.renderRecipes === 'function') UI.renderRecipes();
  if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') UI.showToast('📖 Рецепт сохранён');
};

// ✅ НОВАЯ ФУНКЦИЯ: исправляет ошибку "UI.selectProductForMeal is not a function"
window.UI = window.UI || {};
window.UI.selectProductForMeal = function(productId, mealId = null) {
  console.log('🛒 Выбор продукта:', { productId, mealId });
  if (typeof AppState === 'undefined' || !AppState.data?.products) {
    console.warn('⚠️ AppState или продукты не инициализированы');
    return;
  }
  const product = AppState.data.products.find(p => p.id == productId || p.name === productId);
  if (!product) {
    if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') UI.showToast('⚠️ Продукт не найден');
    return;
  }
  const targetMealId = mealId || AppState.data.activeMealId || AppState.data.meals?.[0]?.id;
  if (!targetMealId) {
    if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') UI.showToast('⚠️ Нет доступных приёмов пищи');
    return;
  }
  if (typeof Meals !== 'undefined' && typeof Meals.addProduct === 'function') {
    Meals.addProduct(targetMealId, {
      productId: product.id,
      name: product.name,
      amount: 100,
      protein: product.protein, fat: product.fat, carbs: product.carbs, calories: product.calories
    });
  }
  if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') UI.showToast(`✅ ${product.name} добавлен в план`);
  if (typeof Dashboard !== 'undefined' && typeof Dashboard.update === 'function') Dashboard.update();
  if (typeof UI !== 'undefined' && typeof UI.renderAll === 'function') UI.renderAll();
};

// ✅ НОВАЯ ФУНКЦИЯ: исправляет ошибку "confirmAddToMeal is not defined"
window.confirmAddToMeal = function(productId, mealId) {
  console.log('✅ Подтверждение добавления:', { productId, mealId });
  if (typeof UI !== 'undefined' && typeof UI.selectProductForMeal === 'function') {
    UI.selectProductForMeal(productId, mealId);
  }
  if (typeof UI !== 'undefined' && typeof UI.closeModal === 'function') UI.closeModal('confirmMealModal');
};
  UI.closeModal('recipeModal');
  UI.renderRecipes();
  UI.showToast('📖 Рецепт сохранён');
};
