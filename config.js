// config.js
const APP_CONFIG = {
    name: 'Кето Планировщик',
    version: '4.0.0',
    debug: true,
    
    defaults: {
        settings: {
            calories: 900,
            protein: 12,
            fat: 77.1,
            carbs: 39.4,
            ketoRatio: 1.5,
            meals: 4
        }
    },
    
    storage: {
        prefix: 'keto_',
        keys: {
            SETTINGS: 'keto_settings',
            PRODUCTS: 'keto_products',
            MEALS: 'keto_meals',
            RECIPES: 'keto_recipes',
            THEME: 'keto_theme'
        }
    }
};

// Глобальный объект Data для экспорта/импорта
const Data = {
    export() {
        const data = {
            version: APP_CONFIG.version,
            exportDate: new Date().toISOString(),
            settings: AppState.data.settings,
            products: AppState.data.products,
            meals: AppState.data.meals,
            recipes: AppState.data.recipes
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `keto-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        UI.showToast('📤 Данные экспортированы');
    },
    
    import(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.settings) AppState.data.settings = data.settings;
                if (data.products) AppState.data.products = data.products;
                if (data.meals) AppState.data.meals = data.meals;
                if (data.recipes) AppState.data.recipes = data.recipes;
                
                AppState.save();
                UI.renderAll();
                UI.renderSettings();
                UI.showToast('📥 Данные импортированы');
            } catch (error) {
                console.error('Import error:', error);
                UI.showToast('❌ Ошибка импорта: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
};
