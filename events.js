// js/events.js
const Events = {
    /**
     * Инициализация всех обработчиков
     */
    init() {
        this.setupHeaderActions();
        this.setupTabNavigation();
        this.setupModalHandlers();
        this.setupFormHandlers();
        this.setupSearchHandlers();
        this.setupSettingsHandlers();
        return this;
    },

    /**
     * Обработчики действий в хедере
     */
    setupHeaderActions() {
        // Тема
        document.querySelector('[data-action="theme"]')?.addEventListener('click', () => {
            UI.toggleTheme();
        });

        // Экспорт
        document.querySelector('[data-action="export"]')?.addEventListener('click', () => {
            Data.export();
        });

        // Импорт
        document.querySelector('[data-action="import"]')?.addEventListener('click', () => {
            document.getElementById('importFile')?.click();
        });

        document.getElementById('importFile')?.addEventListener('change', (e) => {
            Data.import(e.target.files[0]);
            e.target.value = '';
        });

        // Сброс
        document.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
            UI.showConfirm('Сбросить все данные? Это действие нельзя отменить!', () => {
                Storage.clear();
                location.reload();
            });
        });

        // Сохранение
        document.querySelector('[data-action="save"]')?.addEventListener('click', () => {
            AppState.save();
            UI.showToast('💾 Данные сохранены');
        });
    },

    /**
     * Навигация по вкладкам
     */
    setupTabNavigation() {
        document.querySelectorAll('.tab-btn, .tab-btn-mobile').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.currentTarget.getAttribute('data-tab');
                if (tabId) {
                    UI.switchTab(tabId);
                }
            });
        });
    },

    /**
     * Обработчики модальных окон
     */
    setupModalHandlers() {
        // Закрытие по крестику
        document.querySelectorAll('[onclick*="closeModal"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.currentTarget.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
                if (modalId) {
                    UI.closeModal(modalId);
                }
            });
        });

        // Закрытие по клику вне модального окна
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    },

    /**
     * Обработчики форм
     */
    setupFormHandlers() {
        // Добавление продукта
        const addProductForm = document.querySelector('form[onsubmit*="handleAddProduct"]');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                Products.add({
                    name: formData.get('name'),
                    category: formData.get('category'),
                    protein: formData.get('protein'),
                    fat: formData.get('fat'),
                    carbs: formData.get('carbs'),
                    calories: formData.get('calories')
                });
                UI.closeModal('addProductModal');
                e.target.reset();
                UI.renderProducts();
                UI.showToast('✅ Продукт добавлен');
            });
        }

        // Добавление рецепта
        const addRecipeForm = document.querySelector('form[onsubmit*="handleSaveRecipe"]');
        if (addRecipeForm) {
            addRecipeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Логика сохранения рецепта
            });
        }
    },

    /**
     * Обработчики поиска
     */
    setupSearchHandlers() {
        // Поиск продуктов
        const productSearch = document.getElementById('productSearch');
        if (productSearch) {
            productSearch.addEventListener('input', Utils.debounce(() => {
                UI.renderProducts();
            }, 300));
        }

        // Фильтр по категории
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                UI.renderProducts();
            });
        }

        // Поиск для добавления в приём пищи
        const mealProductSearch = document.getElementById('mealProductSearch');
        if (mealProductSearch) {
            mealProductSearch.addEventListener('input', Utils.debounce((e) => {
                this.renderProductSearchResults(e.target.value);
            }, 300));
        }
    },

    /**
     * Обработчики настроек
     */
    setupSettingsHandlers() {
        const settingsFields = ['Calories', 'Protein', 'Fat', 'Carbs', 'KetoRatio', 'Meals'];
        
        settingsFields.forEach(field => {
            const el = document.getElementById(`setting${field}`);
            if (el) {
                el.addEventListener('change', (e) => {
                    const key = field === 'KetoRatio' ? 'ketoRatio' : field.toLowerCase();
                    AppState.data.settings[key] = parseFloat(e.target.value);
                    AppState.save();
                    Dashboard.update();
                    UI.showToast('⚙️ Настройка сохранена');
                });
            }
        });

        // Сброс настроек
        document.querySelector('[onclick*="resetSettings"]')?.addEventListener('click', () => {
            UI.showConfirm('Сбросить настройки к значениям по умолчанию?', () => {
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
                UI.showToast('⚙️ Настройки сброшены');
            });
        });
    },

    /**
     * Рендеринг результатов поиска продуктов
     */
    renderProductSearchResults(query) {
        const results = document.getElementById('mealProductResults');
        if (!results) return;

        if (!query || query.length < 2) {
            results.innerHTML = '<div class="p-4 text-center text-gray-500">Введите минимум 2 символа</div>';
            return;
        }

        const products = Products.search(query, 10);
        
        if (products.length === 0) {
            results.innerHTML = '<div class="p-4 text-center text-gray-500">Ничего не найдено</div>';
            return;
        }

        results.innerHTML = products.map(p => `
            <div class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-600"
                 onclick="UI.selectProductForMeal('${p.id}')">
                <div class="font-medium">${p.name}</div>
                <div class="text-sm text-gray-500">
                    ${p.calories} ккал | Б: ${p.protein}г | Ж: ${p.fat}г | У: ${p.carbs}г
                </div>
            </div>
        `).join('');
    },

    /**
     * Выбор продукта для приёма пищи
     */
    selectProductForMeal(productId) {
        const product = Products.getById(productId);
        if (!product) return;

        const infoDiv = document.getElementById('selectedProductInfo');
        if (infoDiv) {
            infoDiv.classList.remove('hidden');
            document.getElementById('selectedProductName').textContent = product.name;
            document.getElementById('selectedProtein').textContent = product.protein;
            document.getElementById('selectedFat').textContent = product.fat;
            document.getElementById('selectedCarbs').textContent = product.carbs;
            document.getElementById('selectedCalories').textContent = product.calories;
            document.getElementById('productWeight').value = 100;
        }
    }
};