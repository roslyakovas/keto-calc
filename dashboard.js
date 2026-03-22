// js/dashboard.js
const Dashboard = {
    /**
     * Получить все метрики
     */
    getMetrics() {
        const totals = Meals.getDailyTotals();
        const settings = AppState.data.settings;
        const ketoRatio = Utils.calculateKetoRatio(totals.fat, totals.protein, totals.carbs);

        return {
            totals: totals,
            goals: {
                calories: settings.calories,
                protein: settings.protein,
                fat: settings.fat,
                carbs: settings.carbs,
                ketoRatio: settings.ketoRatio
            },
            remaining: {
                calories: settings.calories - totals.calories,
                protein: settings.protein - totals.protein,
                fat: settings.fat - totals.fat,
                carbs: settings.carbs - totals.carbs
            },
            percentages: {
                calories: Math.min(100, (totals.calories / settings.calories) * 100),
                protein: Math.min(100, (totals.protein / settings.protein) * 100),
                fat: Math.min(100, (totals.fat / settings.fat) * 100),
                carbs: Math.min(100, (totals.carbs / settings.carbs) * 100)
            },
            ketoRatio: ketoRatio,
            ketoStatus: this.getKetoStatus(ketoRatio, settings.ketoRatio),
            perMeal: {
                calories: Math.round(settings.calories / settings.meals),
                protein: (settings.protein / settings.meals).toFixed(1),
                fat: (settings.fat / settings.meals).toFixed(1),
                carbs: (settings.carbs / settings.meals).toFixed(1)
            }
        };
    },

    /**
     * Получить статус кетоза
     */
    getKetoStatus(current, goal) {
        if (current == 0) return { text: 'Нет данных', class: 'bg-white/20' };
        if (current >= goal) return { text: '✅ В кетозе', class: 'bg-green-500/80' };
        if (current >= goal * 0.7) return { text: '⚠️ Почти', class: 'bg-yellow-500/80' };
        return { text: '❌ Ниже цели', class: 'bg-red-500/80' };
    },

    /**
     * Обновить отображение дашборда
     */
    update() {
        const metrics = this.getMetrics();

        // Калории
        this.updateElement('caloriesCurrent', Math.round(metrics.totals.calories));
        this.updateElement('caloriesGoal', metrics.goals.calories);
        this.updateElement('caloriesLeft', Math.round(metrics.remaining.calories));
        this.updateElement('caloriesBar', 'style', `width: ${metrics.percentages.calories}%`);

        // Белки
        this.updateElement('proteinCurrent', metrics.totals.protein.toFixed(1));
        this.updateElement('proteinGoal', metrics.goals.protein);
        this.updateElement('proteinLeft', metrics.remaining.protein.toFixed(1));
        this.updateElement('proteinBar', 'style', `width: ${metrics.percentages.protein}%`);

        // Жиры
        this.updateElement('fatCurrent', metrics.totals.fat.toFixed(1));
        this.updateElement('fatGoal', metrics.goals.fat);
        this.updateElement('fatLeft', metrics.remaining.fat.toFixed(1));
        this.updateElement('fatBar', 'style', `width: ${metrics.percentages.fat}%`);

        // Углеводы
        this.updateElement('carbsCurrent', metrics.totals.carbs.toFixed(1));
        this.updateElement('carbsGoal', metrics.goals.carbs);
        this.updateElement('carbsLeft', metrics.remaining.carbs.toFixed(1));
        this.updateElement('carbsBar', 'style', `width: ${metrics.percentages.carbs}%`);

        // Кето-коэффициент
        this.updateElement('ketoRatio', metrics.ketoRatio);
        this.updateElement('ketoGoalDisplay', metrics.goals.ketoRatio);
        
        const statusEl = document.getElementById('ketoStatus');
        if (statusEl) {
            statusEl.textContent = metrics.ketoStatus.text;
            statusEl.className = `mt-2 text-center font-medium rounded-lg py-1 ${metrics.ketoStatus.class}`;
        }

        // Прогресс
        this.updateElement('mealsCountDisplay', AppState.data.settings.meals);
        this.updateElement('calPerMeal', metrics.perMeal.calories);
        this.updateElement('ketoGoalProgress', metrics.goals.ketoRatio);
        this.updateElement('totalLeft', Math.round(metrics.remaining.calories));
    },

    /**
     * Обновить элемент
     */
    updateElement(id, value, type = 'text') {
        const el = document.getElementById(id);
        if (!el) return;

        if (type === 'style') {
            el.style.cssText = value;
        } else {
            el.textContent = value;
        }
    },

    /**
     * Получить сводку для уведомления
     */
    getSummary() {
        const metrics = this.getMetrics();
        return `
📊 Дневная сводка:
🔥 Ккал: ${Math.round(metrics.totals.calories)}/${metrics.goals.calories}
🥩 Белки: ${metrics.totals.protein.toFixed(1)}г
🥑 Жиры: ${metrics.totals.fat.toFixed(1)}г
🍞 Углеводы: ${metrics.totals.carbs.toFixed(1)}г
🥑 Кето: ${metrics.ketoRatio}:1
        `.trim();
    }
};