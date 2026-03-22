// js/products.js
const Products = {
    /**
     * Инициализация базы продуктов
     */
    init() {
        if (AppState.data.products.length === 0) {
            this.loadDefaults();
        }
        return this;
    },

    /**
     * Загрузка продуктов по умолчанию из внешнего файла
     */
    loadDefaults() {
        if (typeof DEFAULT_PRODUCTS !== 'undefined') {
            AppState.data.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS))
                .map(p => ({
                    ...p,
                    name: Utils.cleanString(p.name),
                    category: Utils.cleanString(p.category)
                }));
            AppState.save();
            console.log('✅ Загружено продуктов по умолчанию:', AppState.data.products.length);
        }
        return this;
    },

    /**
     * Добавить новый продукт
     */
    add(product) {
        const newProduct = {
            id: Utils.generateId(),
            name: Utils.cleanString(product.name),
            category: Utils.cleanString(product.category),
            protein: parseFloat(product.protein) || 0,
            fat: parseFloat(product.fat) || 0,
            carbs: parseFloat(product.carbs) || 0,
            calories: parseFloat(product.calories) || 0,
            dateAdded: new Date().toISOString()
        };
        
        AppState.data.products.push(newProduct);
        AppState.save();
        return newProduct;
    },

    /**
     * Обновить продукт
     */
    update(id, updates) {
        const index = AppState.data.products.findIndex(p => p.id === id);
        if (index !== -1) {
            AppState.data.products[index] = {
                ...AppState.data.products[index],
                ...updates,
                name: updates.name ? Utils.cleanString(updates.name) : AppState.data.products[index].name,
                category: updates.category ? Utils.cleanString(updates.category) : AppState.data.products[index].category
            };
            AppState.save();
            return AppState.data.products[index];
        }
        return null;
    },

    /**
     * Удалить продукт
     */
    delete(id) {
        const before = AppState.data.products.length;
        AppState.data.products = AppState.data.products.filter(p => p.id !== id);
        if (AppState.data.products.length < before) {
            AppState.save();
            return true;
        }
        return false;
    },

    /**
     * Поиск продуктов
     */
    search(query, limit = 10) {
        if (!query || query.length < 2) return [];
        
        const cleanQuery = Utils.cleanString(query).toLowerCase();
        return AppState.data.products
            .filter(p => Utils.cleanString(p.name).toLowerCase().includes(cleanQuery))
            .slice(0, limit);
    },

    /**
     * Получить продукт по ID
     */
    getById(id) {
        return AppState.data.products.find(p => p.id === id);
    },

    /**
     * Получить все категории
     */
    getCategories() {
        const categories = [...new Set(AppState.data.products.map(p => p.category))];
        return categories.filter(c => c).sort();
    },

    /**
     * Фильтрация по категории
     */
    filterByCategory(category) {
        if (!category) return AppState.data.products;
        return AppState.data.products.filter(p => p.category === category);
    },

    /**
     * Сброс к продуктам по умолчанию
     */
    resetToDefaults() {
        if (confirm('Сбросить базу продуктов к значениям по умолчанию? Ваши продукты будут удалены!')) {
            this.loadDefaults();
            return true;
        }
        return false;
    },

    /**
     * Экспорт продуктов
     */
    export() {
        return JSON.stringify(AppState.data.products, null, 2);
    },

    /**
     * Импорт продуктов
     */
    import(jsonString) {
        try {
            const products = JSON.parse(jsonString);
            if (Array.isArray(products)) {
                AppState.data.products = products;
                AppState.save();
                return true;
            }
        } catch (error) {
            console.error('Products.import error:', error);
        }
        return false;
    }
};