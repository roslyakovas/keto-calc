// js/utils.js
const Utils = {
    /**
     * Debounce - ограничивает частоту вызова функции
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Форматирование чисел
     */
    formatNumber(num, decimals = 1) {
        return parseFloat(num).toFixed(decimals);
    },

    /**
     * Генерация уникального ID
     */
    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Очистка строки от лишних пробелов
     */
    cleanString(str) {
        return str ? str.trim().replace(/\s+/g, ' ') : '';
    },

    /**
     * Расчёт КБЖУ для веса продукта
     */
    calculateMacros(product, weight) {
        const multiplier = weight / 100;
        return {
            protein: product.protein * multiplier,
            fat: product.fat * multiplier,
            carbs: product.carbs * multiplier,
            calories: product.calories * multiplier
        };
    },

    /**
     * Расчёт кето-коэффициента
     */
    calculateKetoRatio(fat, protein, carbs) {
        const proteinCarbs = protein + carbs;
        return proteinCarbs > 0 ? (fat / proteinCarbs).toFixed(1) : 0;
    },

    /**
     * Группировка продуктов по категориям
     */
    groupByCategory(products) {
        return products.reduce((acc, product) => {
            const category = product.category || 'Другое';
            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
            return acc;
        }, {});
    },

    /**
     * Сортировка продуктов по названию
     */
    sortByName(products) {
        return [...products].sort((a, b) => 
            a.name.localeCompare(b.name, 'ru')
        );
    },

    /**
     * Поиск продукта по названию
     */
    findProductByName(products, name) {
        const cleanName = this.cleanString(name).toLowerCase();
        return products.find(p => 
            this.cleanString(p.name).toLowerCase().includes(cleanName)
        );
    }
};