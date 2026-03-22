// js/ui.js
const UI = {
    modals: {},

    /**
     * Инициализация UI
     */
    init() {
        this.loadTheme();
        this.renderSettings();
        this.renderAll();
        return this;
    },

    /**
     * Загрузка темы
     */
    loadTheme() {
        const theme = Storage.get(Storage.KEYS.THEME);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    },

    /**
     * Переключение темы
     */
    toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        Storage.set(Storage.KEYS.THEME, isDark ? 'dark' : 'light');
    },

    /**
     * Рендеринг всех компонентов
     */
    renderAll() {
        this.renderMeals();
        this.renderProducts();
        this.renderRecipes();
        Dashboard.update();
    },

    /**
     * Рендеринг настроек
     */
    renderSettings() {
        const settings = AppState.data.settings;
        const fields = ['calories', 'protein', 'fat', 'carbs', 'ketoRatio', 'meals'];
        
        fields.forEach(field => {
            const el = document.getElementById(`setting${field.charAt(0).toUpperCase() + field.slice(1)}`);
            if (el) {
                el.value = settings[field];
            }
        });
    },

    /**
     * Рендеринг приёмов пищи
     */
    renderMeals() {
        const container = document.getElementById('mealsList');
        if (!container) return;

        if (AppState.data.meals.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <p class="text-4xl mb-2">🍽️</p>
                    <p>Нет приёмов пищи. Создайте первый!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = AppState.data.meals.map(meal => {
            const totals = Meals.getMealTotals(meal.id);
            
            return `
                <div class="border dark:border-gray-700 rounded-lg p-4" data-meal-id="${meal.id}">
                    <div class="flex justify-between items-center mb-3">
                        <div>
                            <h3 class="font-bold">${meal.name}</h3>
                            <p class="text-sm text-gray-500">🕐 ${meal.time}</p>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="UI.openAddProductModal('${meal.id}')" 
                                class="px-3 py-1 bg-keto-primary text-white rounded text-sm">➕</button>
                            <button onclick="Meals.delete('${meal.id}')" 
                                class="px-3 py-1 bg-red-500 text-white rounded text-sm">🗑️</button>
                        </div>
                    </div>
                    <div class="grid grid-cols-4 gap-2 text-sm mb-3">
                        <div class="text-center bg-red-100 dark:bg-red-900/30 rounded p-2">
                            <div class="font-bold">${Math.round(totals.calories)}</div>
                            <div class="text-xs">ккал</div>
                        </div>
                        <div class="text-center bg-blue-100 dark:bg-blue-900/30 rounded p-2">
                            <div class="font-bold">${totals.protein.toFixed(1)}</div>
                            <div class="text-xs">Белки</div>
                        </div>
                        <div class="text-center bg-yellow-100 dark:bg-yellow-900/30 rounded p-2">
                            <div class="font-bold">${totals.fat.toFixed(1)}</div>
                            <div class="text-xs">Жиры</div>
                        </div>
                        <div class="text-center bg-green-100 dark:bg-green-900/30 rounded p-2">
                            <div class="font-bold">${totals.carbs.toFixed(1)}</div>
                            <div class="text-xs">Углев.</div>
                        </div>
                    </div>
                    ${meal.items.length > 0 ? `
                        <div class="space-y-1 text-sm">
                            ${meal.items.map(item => `
                                <div class="flex justify-between items-center py-1 border-b dark:border-gray-700 last:border-0">
                                    <span>${item.productName} (${item.weight}г)</span>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-gray-500">${Math.round(item.calories)} ккал</span>
                                        <button onclick="Meals.removeProduct('${meal.id}', '${item.id}')" 
                                            class="text-red-500">&times;</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="text-gray-500 text-sm text-center py-2">Нет продуктов</p>'}
                </div>
            `;
        }).join('');
    },

    /**
     * Рендеринг продуктов
     */
    renderProducts() {
        const container = document.getElementById('productTable');
        const search = document.getElementById('productSearch');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (!container) return;

        let products = AppState.data.products;

        // Фильтрация
        if (search && search.value) {
            products = Products.search(search.value, 100);
        }
        if (categoryFilter && categoryFilter.value) {
            products = Products.filterByCategory(categoryFilter.value);
        }

        // Обновление счётчиков
        const shownEl = document.getElementById('productShown');
        const totalEl = document.getElementById('productTotal');
        const titleEl = document.getElementById('productBaseTitle');
        
        if (shownEl) shownEl.textContent = products.length;
        if (totalEl) totalEl.textContent = AppState.data.products.length;
        if (titleEl) titleEl.textContent = `🥗 База продуктов (${AppState.data.products.length})`;

        // Рендеринг таблицы
        container.innerHTML = products.map(p => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 font-medium">${p.name}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        ${p.category}
                    </span>
                </td>
                <td class="px-4 py-3 text-center">${p.protein}</td>
                <td class="px-4 py-3 text-center">${p.fat}</td>
                <td class="px-4 py-3 text-center">${p.carbs}</td>
                <td class="px-4 py-3 text-center font-bold">${p.calories}</td>
                <td class="px-4 py-3 text-center">
                    <button onclick="UI.editProduct('${p.id}')" class="text-blue-600 hover:text-blue-800 mr-2">✏️</button>
                    <button onclick="Products.delete('${p.id}')" class="text-red-600 hover:text-red-800">🗑️</button>
                </td>
            </tr>
        `).join('');

        // Заполнение категорий
        this.populateCategorySelects();
    },

    /**
     * Рендеринг рецептов
     */
    renderRecipes() {
        const container = document.getElementById('recipesList');
        const titleEl = document.getElementById('recipeBaseTitle');
        
        if (!container) return;
        if (titleEl) titleEl.textContent = `📖 Мои рецепты (${AppState.data.recipes.length})`;

        if (AppState.data.recipes.length === 0) {
            container.innerHTML = `
                <div class="col-span-2 text-center text-gray-500 py-8">
                    <p class="text-4xl mb-2">📚</p>
                    <p>Нет рецептов. Создайте первый или сбросьте базу к стандартным!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = AppState.data.recipes.map(recipe => `
            <div class="border dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg">${recipe.name}</h3>
                    <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        ${recipe.category}
                    </span>
                </div>
                
                <div class="grid grid-cols-4 gap-2 text-sm mb-3">
                    <div class="text-center bg-red-50 dark:bg-red-900/20 rounded p-1">
                        <div class="font-bold">${Math.round(recipe.totals?.calories || 0)}</div>
                        <div class="text-xs">ккал</div>
                    </div>
                    <div class="text-center bg-blue-50 dark:bg-blue-900/20 rounded p-1">
                        <div class="font-bold">${(recipe.totals?.protein || 0).toFixed(1)}</div>
                        <div class="text-xs">Белки</div>
                    </div>
                    <div class="text-center bg-yellow-50 dark:bg-yellow-900/20 rounded p-1">
                        <div class="font-bold">${(recipe.totals?.fat || 0).toFixed(1)}</div>
                        <div class="text-xs">Жиры</div>
                    </div>
                    <div class="text-center bg-green-50 dark:bg-green-900/20 rounded p-1">
                        <div class="font-bold">${(recipe.totals?.carbs || 0).toFixed(1)}</div>
                        <div class="text-xs">Углев.</div>
                    </div>
                </div>
                
                <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>🍽️ ${recipe.servings || 1} порц.</span>
                    <span>⏱️ ${recipe.prepTime || 30} мин.</span>
                    <span>🥑 ${(recipe.ketoRatio || 0)}:1</span>
                </div>
                
                <div class="flex space-x-2">
                    <button onclick="UI.viewRecipe('${recipe.id}')" 
                        class="flex-1 px-3 py-1 bg-keto-primary text-white rounded text-sm hover:bg-green-600">
                        📖 Открыть
                    </button>
                    <button onclick="Recipes.addToMeal('${recipe.id}')" 
                        class="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                        ➕ В план
                    </button>
                    <button onclick="Recipes.delete('${recipe.id}')" 
                        class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    },

    /**
     * Заполнение селектов категориями
     */
    populateCategorySelects() {
        const categories = Products.getCategories();
        const filterSelect = document.getElementById('categoryFilter');
        const addSelect = document.getElementById('productCategorySelect');
        
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">Все категории</option>' +
                categories.map(c => `<option value="${c}">${c}</option>`).join('');
        }
        
        if (addSelect) {
            addSelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
        }
    },

    /**
     * Открытие модального окна
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    },

    /**
     * Закрытие модального окна
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    /**
     * Переключение вкладок
     */
    switchTab(tabId) {
        // Скрыть все вкладки
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Показать выбранную
        const target = document.getElementById(tabId);
        if (target) {
            target.classList.add('active');
        }
        
        // Обновить кнопки
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const isActive = btn.getAttribute('data-tab') === tabId;
            btn.classList.toggle('bg-keto-primary', isActive);
            btn.classList.toggle('text-white', isActive);
            btn.classList.toggle('bg-gray-200', !isActive);
            btn.classList.toggle('dark:bg-gray-700', !isActive);
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Показать уведомление
     */
    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.classList.remove('opacity-0');
        
        setTimeout(() => {
            toast.classList.add('opacity-0');
        }, duration);
    },

    /**
     * Показать подтверждение
     */
    showConfirm(message, onConfirm) {
        if (confirm(message)) {
            onConfirm();
        }
    },

    /**
     * Редактирование продукта
     */
    editProduct(id) {
        const product = Products.getById(id);
        if (!product) return;
        
        const newName = prompt('Название продукта:', product.name);
        if (newName !== null) {
            Products.update(id, { name: newName });
            this.renderProducts();
            this.showToast('✏️ Продукт обновлён');
        }
    },

    /**
     * Просмотр рецепта
     */
    viewRecipe(id) {
        const recipe = Recipes.getById(id);
        if (!recipe) return;
        
        const ingredientsList = recipe.ingredients.map(i => 
            `• ${i.name}: ${i.weight}г`
        ).join('\n');
        
        alert(`${recipe.name}\n\n📝 Ингредиенты:\n${ingredientsList}\n\n👨‍🍳 Приготовление:\n${recipe.instructions}`);
    },

    /**
     * Открытие модального окна добавления продукта
     */
    openAddProductModal(mealId) {
        const modal = document.getElementById('addMealModal');
        if (modal) {
            modal.dataset.mealId = mealId;
            this.openModal('addMealModal');
            document.getElementById('mealProductSearch').value = '';
            document.getElementById('mealProductResults').innerHTML = 
                '<div class="p-4 text-center text-gray-500">Введите название для поиска</div>';
        }
    }
};