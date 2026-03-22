// js/app.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Кето Планировщик v4.0 запускается...');
  try {
    console.log('📦 Инициализация состояния...');
    AppState.init();

    console.log('🔧 Инициализация модулей...');
    Products.init();
    Recipes.init();
    Meals.init();

    console.log('🎨 Инициализация UI...');
    UI.init();

    console.log('⚡ Настройка событий...');
    Events.init();

    console.log('📡 Настройка подписок...');
    AppState.subscribe(() => {
      Dashboard.update();
      UI.renderAll();
    });

    console.log('📊 Первый рендер...');
    Dashboard.update();

    console.log('✅ Кето Планировщик успешно запущен!');
    console.log('📊 Продуктов:', AppState.data.products.length);
    console.log('📖 Рецептов:', AppState.data.recipes.length);
    console.log('🍽️ Приёмов пищи:', AppState.data.meals.length);

  } catch (error) {
    console.error('❌ Ошибка запуска приложения:', error);
    if (typeof UI !== 'undefined' && UI.showToast) UI.showToast('❌ Ошибка запуска');
  }
});

// ✅ Глобальные функции (исправлен синтаксис =>)
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
window.resetProductDatabase = () => Products.resetToDefaults(); // ✅ Исправлено имя
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
    carbs: form.carbs.value, // ✅ Исправлено: был пробел в "ca rbs"
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
    // ✅ Исправлен template string (убраны пробелы в кавычках)
    row.innerHTML = `<input type="text" placeholder="Продукт" class="ingredient-name flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" oninput="updateRecipeTotals()"> <input type="number" placeholder="Вес (г)" class="ingredient-weight w-24 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" value="100" oninput="updateRecipeTotals()"> <button type="button" onclick="this.parentElement.remove(); updateRecipeTotals()" class="text-red-500">&times;</button>`;
    container.appendChild(row);
  }
};
window.updateRecipeTotals = () => {
  let totals = { protein: 0, fat: 0, carbs: 0, calories: 0 };
  document.querySelectorAll('#recipeIngredients > div').forEach(row => {
    const name = row.querySelector('.ingredient-name')?.value;
    const weight = parseFloat(row.querySelector('.ingredient-weight')?.value) || 0;
    if (name && weight > 0) { // ✅ Исправлено: был "name  & & weight"
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
  document.getElementById('recipeTotalProtein').textContent = totals.protein.toFixed(1); // ✅ Исправлено: был "getEl ementById"
  document.getElementById('recipeTotalFat').textContent = totals.fat.toFixed(1);
  document.getElementById('recipeTotalCarbs').textContent = totals.carbs.toFixed(1); // ✅ Исправлено: был "rec ipeTotalCarbs"
  const ratio = Utils.calculateKetoRatio(totals.fat, totals.protein, totals.carbs);
  document.getElementById('recipeKetoRatio').textContent = ratio; // ✅ Исправлено: был пробел перед textContent
};
window.handleSaveRecipe = (e) => {
  e.preventDefault();
  const ingredients = [];
  document.querySelectorAll('#recipeIngredients > div').forEach(row => {
    const name = row.querySelector('.ingredient-name')?.value;
    const weight = parseFloat(row.querySelector('.ingredient-weight')?.value) || 0;
    if (name && weight > 0) { // ✅ Исправлено
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

// ✅ Добавлены отсутствующие функции
window.UI = window.UI || {};
window.UI.selectProductForMeal = function(productId, mealId = null) {
  console.log('🛒 Выбор продукта:', { productId, mealId });
  if (!AppState?.data?.products) return;
  const product = AppState.data.products.find(p => p.id == productId || p.name === productId);
  if (!product) { UI.showToast?.('⚠️ Продукт не найден'); return; }
  const targetMealId = mealId || AppState.data.activeMealId || AppState.data.meals?.[0]?.id;
  if (!targetMealId) { UI.showToast?.('⚠️ Нет приёмов пищи'); return; }
  Meals.addProduct?.(targetMealId, {
    productId: product.id, name: product.name, amount: 100,
    protein: product.protein, fat: product.fat, carbs: product.carbs, calories: product.calories
  });
  UI.showToast?.(`✅ ${product.name} добавлен`);
  Dashboard.update?.();
  UI.renderAll?.();
};
window.confirmAddToMeal = function(productId, mealId) {
  console.log('✅ Подтверждение:', { productId, mealId });
  UI.selectProductForMeal?.(productId, mealId);
  UI.closeModal?.('confirmMealModal');
};
  UI.renderRecipes();
  UI.showToast('📖 Рецепт сохранён');
};
