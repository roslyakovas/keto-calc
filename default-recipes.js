// default-recipes.js
const DEFAULT_RECIPES = [
    {
                id: 'recipe-1', name: 'Миндальные кексы', category: 'Выпечка',
                ingredients: [
                    { name: 'Миндальная мука', amount: 50 },
                    { name: 'Оливковое масло', amount: 50 },
                    { name: 'Яйцо куриное', amount: 55 },
                    { name: 'Разрыхлитель', amount: 2 },
                    { name: 'Корица', amount: 1 },
                    { name: 'Эритритол', amount: 10 }
                ],
                instructions: 'Разделить белок и желток, к желтку вмешать вилкой все ингредиенты кроме белка. Белок взбиваем отдельно до плотной пены, и вмешиваем пену к тесту. Выливаем в форму и запекаем 30-40 минут при 180гр.'
            },
            {
                id: 'recipe-2', name: 'Кето-блины', category: 'Выпечка',
                ingredients: [
                    { name: 'Яйцо куриное', amount: 11 },
                    { name: 'Оливковое масло', amount: 6 },
                    { name: 'Маскарпоне', amount: 9 },
                    { name: 'Вода', amount: 1 },
                    { name: 'Миндальная мука', amount: 2 }
                ],
                instructions: 'Технология: одну порцию теста = 29гр. При приготовлении 6 блинов умножаем все на 6 и ПРИБАВЛЯЕМ 10%.'
            },
            {
                id: 'recipe-3', name: 'Основа для пиццы', category: 'Выпечка',
                ingredients: [
                    { name: 'Моцарелла', amount: 230 },
                    { name: 'Миндальная мука', amount: 175 },
                    { name: 'Порошок из оболочек семян подорожника', amount: 15 },
                    { name: 'Маскарпоне', amount: 45 },
                    { name: 'Яйцо куриное', amount: 55 }
                ],
                instructions: 'Моцареллу растопить в микроволновке. Добавляем маскарпоне и яйцо, все хорошо перемешать.'
            },
            {
                id: 'recipe-4', name: 'Тарталетки', category: 'Выпечка',
                ingredients: [
                    { name: 'Миндальная мука', amount: 60 },
                    { name: 'Кокосовая мука', amount: 50 },
                    { name: 'Порошок из оболочек семян подорожника', amount: 30 },
                    { name: 'Кокосовое масло', amount: 30 },
                    { name: 'Яйцо куриное', amount: 110 }
                ],
                instructions: 'Все смешать, распределить по формочкам и в духовку при 180 градусах.'
            },
            {
                id: 'recipe-5', name: 'Кето-печенье', category: 'Выпечка',
                ingredients: [
                    { name: 'Миндальная мука', amount: 120 },
                    { name: 'Кокосовая мука', amount: 45 },
                    { name: 'Какао-порошок', amount: 30 },
                    { name: 'Разрыхлитель', amount: 3 },
                    { name: 'Эритритол', amount: 50 },
                    { name: 'Кокосовое масло', amount: 60 },
                    { name: 'Яйцо куриное', amount: 110 }
                ],
                instructions: 'Выпекать 15-20 минут при 180гр.'
            },
            {
                id: 'recipe-6', name: 'Лимонно-маковое суфле', category: 'Десерты',
                ingredients: [
                    { name: 'Рикотта', amount: 225 },
                    { name: 'Яйцо куриное', amount: 110 },
                    { name: 'Эритритол', amount: 50 },
                    { name: 'Лимонный сок', amount: 15 },
                    { name: 'Ванильный экстракт', amount: 5 },
                    { name: 'Мак', amount: 5 }
                ],
                instructions: 'Разогреть духовку до 180гр. Разделить белки от желтков. Взбить белки в пену.'
            },
            {
                id: 'recipe-7', name: 'Тыквенное печенье', category: 'Выпечка',
                ingredients: [
                    { name: 'Миндальная мука', amount: 180 },
                    { name: 'Масло сливочное', amount: 100 },
                    { name: 'Тыква сырая', amount: 120 },
                    { name: 'Разрыхлитель', amount: 3 },
                    { name: 'Эритритол', amount: 40 }
                ],
                instructions: 'Все смешать и запекать при 180 градусах 12-13 минут.'
            },
            {
                id: 'recipe-8', name: 'Кето-вафли', category: 'Выпечка',
                ingredients: [
                    { name: 'Яйцо куриное', amount: 19 },
                    { name: 'Сливки 33%', amount: 8 },
                    { name: 'Творог 9%', amount: 3 },
                    { name: 'Масло сливочное', amount: 15 },
                    { name: 'Миндаль', amount: 8 },
                    { name: 'Миндальная мука', amount: 2 }
                ],
                instructions: 'Все ингредиенты смешать и выпекать в вафельнице до золотистой корочки.'
            },
            {
                id: 'recipe-9', name: 'Мороженое Мокко', category: 'Десерты',
                ingredients: [
                    { name: 'Кокосовое молоко', amount: 240 },
                    { name: 'Сливки 35%', amount: 60 },
                    { name: 'Эритритол', amount: 30 },
                    { name: 'Какао-порошок', amount: 15 },
                    { name: 'Протеин', amount: 5 }
                ],
                instructions: 'Смешать все в блендере. Взбить, вылить в форму и в морозилку.'
            },
            {
                id: 'recipe-10', name: 'Кето-шоколад (жировая бомба)', category: 'Десерты',
                ingredients: [
                    { name: 'Кокосовое масло', amount: 28 },
                    { name: 'Масло какао', amount: 72 },
                    { name: 'Какао-порошок', amount: 7 },
                    { name: 'Миндаль', amount: 21 },
                    { name: 'Эритритол', amount: 15 }
                ],
                instructions: 'Все кроме эритритола растопить на водяной бане. Добавить эритритол по вкусу.'
            },
            {
                id: 'recipe-11', name: 'Панакота', category: 'Десерты',
                ingredients: [
                    { name: 'Сливки 35%', amount: 200 },
                    { name: 'Вода', amount: 50 },
                    { name: 'Агар-агар', amount: 1 },
                    { name: 'Эритритол', amount: 20 },
                    { name: 'Ванильный экстракт', amount: 3 },
                    { name: 'Малина', amount: 50 }
                ],
                instructions: 'Сливки+вода+агар-агар на огонь. Как закипит - в блендер с ягодами.'
            },
            {
                id: 'recipe-12', name: 'Крем-Брюле', category: 'Десерты',
                ingredients: [
                    { name: 'Яичный желток', amount: 20 },
                    { name: 'Сливки 35%', amount: 250 },
                    { name: 'Эритритол', amount: 30 },
                    { name: 'Ванильный экстракт', amount: 5 }
                ],
                instructions: 'Желток с эритритолом перемешать. Сливки с ванилью довести до кипения.'
            },
            {
                id: 'recipe-13', name: 'Замена картофельному пюре', category: 'Гарниры',
                ingredients: [
                    { name: 'Цветная капуста', amount: 100 },
                    { name: 'Сметана 30% президент', amount: 10 },
                    { name: 'Масло сливочное', amount: 20 },
                    { name: 'Сливки 33%', amount: 10 }
                ],
                instructions: 'Цветную капусту измельчить до состояния "риса", в микроволновку на 5 минут.'
            },
            {
                id: 'recipe-14', name: 'Широтаки в сливочном соусе', category: 'Гарниры',
                ingredients: [
                    { name: 'Широтаки', amount: 200 },
                    { name: 'Сливки 35%', amount: 100 },
                    { name: 'Пармезан, 37%', amount: 30 },
                    { name: 'Масло сливочное', amount: 20 }
                ],
                instructions: 'Широтаки промыть. В разогретое масло добавить сливки и пармезан.'
            },
            {
                id: 'recipe-15', name: 'Котлеты из тунца с авокадо', category: 'Мясо',
                ingredients: [
                    { name: 'Тунец в банке', amount: 280 },
                    { name: 'Майонез', amount: 50 },
                    { name: 'Авокадо', amount: 150 },
                    { name: 'Пармезан, 37%', amount: 50 },
                    { name: 'Миндальная мука', amount: 50 },
                    { name: 'Кокосовое масло', amount: 50 }
                ],
                instructions: 'Тунец измельчить, добавить майонез, сыр, специи. Добавить авокадо кубиками.'
            },
            {
                id: 'recipe-16', name: 'Пикантные сосиски', category: 'Мясо',
                ingredients: [
                    { name: 'Охотничьи колбаски', amount: 100 },
                    { name: 'Чеддер 50%', amount: 50 },
                    { name: 'Бекон', amount: 60 }
                ],
                instructions: 'Сосиску надрезать вдоль, вложить сыр. Обернуть беконом и запекать.'
            },
            {
                id: 'recipe-17', name: 'Котлетки в сырной корочке', category: 'Мясо',
                ingredients: [
                    { name: 'Говяжий фарш', amount: 230 },
                    { name: 'Бекон', amount: 40 },
                    { name: 'Моцарелла', amount: 30 },
                    { name: 'Чеддер 50%', amount: 60 },
                    { name: 'Масло сливочное', amount: 15 }
                ],
                instructions: 'Фарш со специями. Внутрь котлеток - моцарелла кубиками. Обжарить.'
            },
            {
                id: 'recipe-18', name: 'Итальянские фрикадельки', category: 'Мясо',
                ingredients: [
                    { name: 'Говяжий фарш', amount: 700 },
                    { name: 'Яйцо куриное', amount: 110 },
                    { name: 'Томатная паста', amount: 45 },
                    { name: 'Моцарелла', amount: 75 },
                    { name: 'Миндальная мука', amount: 30 }
                ],
                instructions: 'Сыр натереть. Вмешать в фарш все компоненты, скатать шарики и запекать.'
            },
            {
                id: 'recipe-19', name: 'Песочный корж для торта', category: 'Выпечка',
                ingredients: [
                    { name: 'Миндальная мука', amount: 80 },
                    { name: 'Масло сливочное', amount: 115 },
                    { name: 'Яйцо куриное', amount: 165 },
                    { name: 'Эритритол', amount: 50 },
                    { name: 'Ванильный экстракт', amount: 5 },
                    { name: 'Порошок из оболочек семян подорожника', amount: 30 },
                    { name: 'Разрыхлитель', amount: 3 }
                ],
                instructions: 'Масло и яйца до комнатной температуры. Смешать масло с эритритолом.'
            },
            {
                id: 'recipe-20', name: 'Основа для рулета', category: 'Выпечка',
                ingredients: [
                    { name: 'Миндальная мука', amount: 120 },
                    { name: 'Масло сливочное', amount: 60 },
                    { name: 'Яйцо куриное', amount: 165 },
                    { name: 'Порошок из оболочек семян подорожника', amount: 30 },
                    { name: 'Какао-порошок', amount: 30 },
                    { name: 'Кокосовое молоко', amount: 60 },
                    { name: 'Сметана 30% президент', amount: 60 },
                    { name: 'Эритритол', amount: 40 }
                ],
                instructions: 'Смешать сухие ингредиенты. Добавить масло, сметану, яйца.'
            },
            // Планы питания из файла
            {
                id: 'recipe-csv-1', name: 'Завтрак 16.03.2026', category: 'Мои рецепты',
                ingredients: [
                    { name: 'овсяные хлопья', amount: 13 },
                    { name: 'Сливки 33%', amount: 41 },
                    { name: 'Миндаль', amount: 3 },
                    { name: 'Банан', amount: 3 },
                    { name: 'Масло сливочное', amount: 4 }
                ],
                instructions: 'Импортировано из файла Excel. Готовый план для завтрака.'
            },
            {
                id: 'recipe-csv-2', name: 'Обед 16.03.2026', category: 'Мои рецепты',
                ingredients: [
                    { name: 'Говяжий фарш', amount: 12 },
                    { name: 'Лук репчатый', amount: 5 },
                    { name: 'Морковь сырая', amount: 20 },
                    { name: 'Картофель сырой, приготовленный', amount: 43 },
                    { name: 'Оливковое масло', amount: 12 },
                    { name: 'майонез', amount: 4 },
                    { name: 'Свекла, вареная', amount: 45 }
                ],
                instructions: 'Импортировано из файла Excel. Готовый план для обеда.'
            },
            {
                id: 'recipe-csv-3', name: 'Полдник 16.03.2026', category: 'Мои рецепты',
                ingredients: [
                    { name: 'Слива', amount: 40 },
                    { name: 'Масло сливочное', amount: 1 },
                    { name: 'Сливки 33%', amount: 52 },
                    { name: 'Яйцо куриное', amount: 12 }
                ],
                instructions: 'Импортировано из файла Excel. Готовый план для полдника.'
            },
            {
                id: 'recipe-csv-4', name: 'Ужин 16.03.2026', category: 'Мои рецепты',
                ingredients: [
                    { name: 'Лук репчатый', amount: 5 },
                    { name: 'Морковь сырая', amount: 16 },
                    { name: 'гречневые хлопья мистраль', amount: 12 },
                    { name: 'фарш мираторг', amount: 8 },
                    { name: 'Кабачки/Цукини', amount: 38 },
                    { name: 'Оливковое масло', amount: 17 }
                ],
                instructions: 'Импортировано из файла Excel. Готовый план для ужина.'
            }
];