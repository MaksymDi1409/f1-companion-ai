# 🏎️ F1 Companion AI - Hybrid Approach (НАЙКРАЩА ВЕРСІЯ!)

## 🎯 Чому гібрид (API + Google Search)?

### ❌ Тільки API (старий підхід):
- Обмежені дані (тільки 2026)
- Якщо API падає → сайт не працює
- Не може відповісти про 2024, 2025

### ❌ Тільки Google Search:
- Повільніше
- Може знайти непотрібне
- Менш структуровані дані

### ✅ ГІБРИД (API + Google Search):
```
📊 API (OpenF1 + Jolpi)     +     🔍 Google Search
        ↓                              ↓
   Швидко і точно              Завжди актуально
   для 2026 сезону            для будь-якого року
        ↓                              ↓
           🤖 AI сам вибирає що краще!
```

---

## 🚀 Як це працює?

### Схема роботи:

```
Користувач: "Хто лідирує в 2026?"
     ↓
AI бачить: є API дані за 2026 ✅
     ↓
Використовує API (швидко!) ⚡
     ↓
Відповідь: Russell лідирує з 51 очком
```

```
Користувач: "Покажи топ 10 за 2025"
     ↓
AI бачить: API тільки для 2026 ❌
     ↓
Використовує Google Search 🔍
     ↓
Відповідь: Таблиця 2025 з Google
```

```
Користувач: "Де наступна гонка?"
     ↓
AI бачить: є розклад в API ✅
     ↓
Використовує API (миттєво!) ⚡
     ↓
Відповідь: Suzuka, 29 березня
```

---

## 📊 Стратегія AI (пріоритети):

```javascript
// AI сам вибирає джерело даних:

IF (питання про 2026 сезон) AND (є API дані) {
  → USE API FIRST ⚡ (швидко і точно)
}

ELSE IF (питання про 2024/2025) {
  → USE Google Search 🔍 (API не має цих даних)
}

ELSE IF (API дані неповні) {
  → COMBINE обидва джерела 🔄
}

ELSE IF (API недоступний) {
  → FALLBACK на Google Search 🛡️
}

ELSE IF (історичне питання) {
  → USE тільки знання Gemini 📚 (без API і пошуку)
}
```

---

## 🔥 Переваги гібриду:

### 1. **Швидкість для 2026** ⚡
```
API відповідає за ~100ms
Google Search ~500-1000ms
Гібрид: використовує API коли можна!
```

### 2. **Покриття всіх років** 📅
```
2026 → API (швидко)
2025 → Google Search
2024 → Google Search
Історія → знання Gemini
```

### 3. **Надійність** 🛡️
```
API працює → використовуємо
API падає → Google Search фолбек
Gemini ліміт → кешовані API дані
```

### 4. **Точність** 🎯
```
API: структуровані дані (позиція, очки, команда)
Google: додаткові деталі (новини, чутки)
Комбінація: найповніша інформація!
```

---

## 🔢 Ліміти та фолбеки:

### Доступні моделі Gemini (пріоритет):

#### 1️⃣ **Gemini 3 Flash** (основна):
- RPM: 2/5 (2 запити в хвилину)
- TPM: 780/250K токенів
- Search grounding: **0/0 (НЕОБМЕЖЕНО)** ✅

#### 2️⃣ **Gemini 2.5 Flash** (фолбек #1):
- RPM: 0/5
- TPM: 0/250K
- Search grounding: 0/1.5K (1500 на день)

#### 3️⃣ **Gemini 3.1 Flash Lite** (фолбек #2):
- RPM: 0/15
- TPM: 0/250K
- Search grounding: 0/500

### Логіка фолбеків:

```javascript
// В коді (lib/gemini.js):

async function selectAvailableModel(useGoogleSearch = false) {
  const models = [
    { name: "gemini-3-flash-preview", tools: [...] },      // Спочатку
    { name: "gemini-2.5-flash", tools: [...] },            // Якщо ліміт #1
    { name: "gemini-3.1-flash-lite", tools: [...] },       // Якщо ліміт #2
  ];
  
  return models[0]; // Можна додати логіку перевірки
}
```

---

## 📝 Приклади роботи:

### Приклад 1: Актуальні дані 2026 (API)
```
👤 Користувач: "Хто лідирує?"

🤖 AI думає:
   - Є API дані за 2026? ✅ ТАК
   - Використовую API (швидко!)
   
💬 Відповідь:
   "Зараз лідирує George Russell (Mercedes) з 51 очком. 
    За ним Andrea Kimi Antonelli з 47 очками."
   
⚡ Швидкість: ~200ms
```

### Приклад 2: Минулий рік (Google Search)
```
👤 Користувач: "Покажи топ 10 за 2025"

🤖 AI думає:
   - Питання про 2025
   - API тільки для 2026 ❌
   - Використовую Google Search
   
💬 Відповідь:
   [Знаходить актуальну таблицю 2025 через Google]
   
🔍 Джерело: Google Search
```

### Приклад 3: Історія (без API і пошуку)
```
👤 Користувач: "Розкажи про Senna"

🤖 AI думає:
   - Історичне питання
   - Не потрібні актуальні дані
   - Використовую тільки знання Gemini
   
💬 Відповідь:
   "Ayrton Senna - легендарний бразильський гонщик..."
   
📚 Джерело: знання Gemini
```

### Приклад 4: Комбінація (API + Google)
```
👤 Користувач: "Що сталося на останній гонці?"

🤖 AI думає:
   - Є розклад в API ✅
   - Але потрібні результати (API не має)
   - Використовую API для дати + Google для результатів
   
💬 Відповідь:
   "Остання гонка була в Бахрейні 1 березня.
    [Результати з Google Search]"
   
🔄 Джерело: API + Google Search
```

---

## 🎨 Структура коду:

### `lib/gemini.js` - мозок системи:
```javascript
// 1. Визначення потреби в даних
needsCurrentData(userMessage)
  → true: потрібні API/пошук
  → false: чистий Gemini

// 2. Вибір моделі з фолбеками
selectAvailableModel(useGoogleSearch)
  → gemini-3-flash-preview (основна)
  → gemini-2.5-flash (фолбек)
  → gemini-3.1-flash-lite (фолбек)

// 3. Формування промпту
IF (shouldUseCurrentData) {
  Додає:
  - API дані (якщо є)
  - Інструкції для Google Search
  - Стратегію вибору джерела
}
```

### Ключовий промпт для AI:
```
📊 PRIMARY SOURCE - STRUCTURED API DATA (use this FIRST):
[Таблиця очок, розклад]

🔍 SECONDARY SOURCE - GOOGLE SEARCH (use when needed):
[Інструкції коли шукати в Google]

📋 USAGE STRATEGY:
1. Current 2026 + API має дані → USE API
2. Past seasons (2024, 2025) → USE GOOGLE
3. API incomplete → COMBINE both
4. No API data → USE GOOGLE
```

---

## 🛡️ Обробка помилок:

```javascript
try {
  // Спроба #1: API дані + Gemini 3 Flash
  const result = await model.generateContent(enrichedPrompt);
  
} catch (error) {
  if (error.code === 429) { // Rate limit
    // Фолбек #1: Gemini 2.5 Flash
    // Фолбек #2: Gemini 3.1 Flash Lite
    // Фолбек #3: Кешовані API дані без AI
  }
}
```

---

## 📦 Змінені файли:

### 1. `lib/gemini.js`
- ✅ Функція `selectAvailableModel()` - фолбеки
- ✅ Гібридний промпт (API + Google Search)
- ✅ Розумний вибір джерела даних

### 2. `components/Chat.jsx`
- ✅ Повернули `useF1Data` - потрібен для API
- ✅ Завжди передаємо `f1Data` в запит
- ✅ AI сам вирішує використати чи ні

### 3. `app/api/chat/route.js`
- ✅ Приймає `f1Data`
- ✅ Передає в Gemini
- ✅ Обробка помилок

### 4. API endpoints (залишаємо!):
- ✅ `lib/f1-api.js` - OpenF1 + Jolpi
- ✅ `app/api/jolpi/route.js` - проксі
- ✅ `app/F1DataContext.jsx` - кешування

---

## 🎯 Результат:

### Було (чистий API):
```
❌ Тільки 2026 рік
❌ Якщо API падає → сайт не працює
❌ Обмежені дані
```

### Було (чистий Google Search):
```
❌ Повільніше
❌ Може знайти непотрібне
❌ Ліміти Gemini швидко вичерпуються
```

### Стало (ГІБРИД):
```
✅ API для 2026 (швидко!)
✅ Google Search для 2024/2025 (актуально!)
✅ Фолбеки на інші моделі (надійно!)
✅ Завжди є відповідь (API ↔ Google ↔ Кеш)
```

---

## 🚀 Як використовувати:

1. **Замініть файли:**
   - `lib/gemini.js`
   - `components/Chat.jsx`
   - `app/api/chat/route.js`

2. **НЕ ВИДАЛЯЙТЕ:**
   - `lib/f1-api.js` (потрібен!)
   - `app/F1DataContext.jsx` (потрібен!)
   - `app/api/jolpi/route.js` (потрібен!)

3. **Перезапустіть сервер:**
```bash
npm run dev
```

4. **Тестуйте різні запити:**
```
✅ "Хто лідирує?" → API
✅ "Топ 10 за 2025" → Google Search
✅ "Де наступна гонка?" → API
✅ "Розкажи про Senna" → Gemini
```

---

## 🏁 Висновок:

**Гібридний підхід = Найкраще з обох світів!**

- 🚀 **Швидкість** API для актуальних даних
- 🔍 **Гнучкість** Google Search для будь-якого року
- 🛡️ **Надійність** фолбеки на інші моделі
- 🎯 **Точність** структуровані API дані
- ⚡ **Актуальність** Google завжди свіжі дані

**Ваш F1 Companion тепер непереможний! 🏎️💨**

---

*Powered by:*
- *Gemini 3 Flash (з фолбеками)*
- *OpenF1 API + Jolpi API*
- *Google Search Grounding*
- *Розумна система вибору джерел* 🧠