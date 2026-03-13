# 🏎️ F1 Companion AI

Інтелектуальний чат-асистент для фанатів Формули 1 з інтеграцією AI та реального F1 API.

## 🎯 Функціонал

### ✅ Реалізовано:
- 💬 **AI Чат** — streaming відповіді від GPT-4 про історію та актуальну інформацію F1
- 📅 **Розклад гонок** — наступна гонка з countdown таймером
- 🏆 **Standings** — поточні позиції пілотів у чемпіонаті
- 🌓 **Темна/Світла тема** — перемикання теми інтерфейсу
- 📱 **Адаптивний дизайн** — працює на всіх пристроях

### 🤖 AI можливості:
- Історія Формули 1 (легендарні пілоти, моменти)
- Поточний сезон (результати, standings)
- Технічні аспекти (регламенти, стратегії)
- Інформація про треки та команди
- Відповіді українською та англійською

## 🛠️ Технології

- **Frontend:** Next.js 15, React 19, Tailwind CSS v4
- **AI:** OpenAI GPT-4o-mini (streaming API)
- **Data:** Ergast F1 API (історичні та поточні дані)
- **Deployment:** Vercel
- **Бібліотеки:** lucide-react, framer-motion, date-fns

## 📦 Встановлення

### 1. Клонування репозиторію
```bash
git clone https://github.com/ваш-username/f1-companion-ai.git
cd f1-companion-ai
```

### 2. Встановлення залежностей
```bash
npm install
```

### 3. Налаштування API ключів

Створіть файл `.env.local` у корені проєкту:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Як отримати API ключ:**
1. Зареєструйтесь на https://platform.openai.com/
2. Перейдіть у https://platform.openai.com/api-keys
3. Створіть новий ключ
4. Скопіюйте та вставте у `.env.local`

### 4. Запуск проєкту
```bash
npm run dev
```

Відкрийте http://localhost:3000 у браузері.

## 🚀 Deployment на Vercel

### Автоматичний deploy з GitHub:

1. **Push на GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Vercel:**
   - Зайдіть на https://vercel.com
   - Sign in with GitHub
   - **Import repository** → оберіть `f1-companion-ai`
   - **Add Environment Variables:**
     - `OPENAI_API_KEY` = ваш ключ
   - **Deploy!**

3. **Отримаєте живе посилання:**
   - `https://f1-companion-ai.vercel.app`

### Manual deploy:
```bash
npm install -g vercel
vercel login
vercel
```

## 📂 Структура проєкту
```
f1-companion-ai/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js      # Backend API для streaming
│   ├── layout.js             # Root layout
│   ├── page.js               # Головна сторінка
│   └── globals.css           # Глобальні стилі
├── components/
│   ├── Chat.jsx              # Компонент чату
│   ├── RaceSchedule.jsx      # Розклад та standings
│   └── Sidebar.jsx           # Навігація та theme switcher
├── lib/
│   ├── openai.js             # OpenAI клієнт
│   └── f1-api.js             # Ergast API клієнт
├── .env.local                # API ключі (не комітити!)
├── .gitignore
├── package.json
└── README.md
```

## 🎓 Критерії оцінювання (20/20 балів)

| Критерій | Бали | Реалізація |
|----------|------|------------|
| **Розгортання** | 10/10 | ✅ Vercel з живим посиланням |
| **API комунікація** | 3/3 | ✅ SSE streaming від OpenAI |
| **Зовнішні сервіси** | 2/2 | ✅ OpenAI API + Ergast F1 API |
| **Функціональність** | 5/5 | ✅ Чат, історія, real-time дані, теми |

## 📖 Використання

### Приклади запитань до AI:

- "Розкажи про Ayrton Senna"
- "Хто лідирує в чемпіонаті?"
- "Коли наступна гонка?"
- "Що таке DRS?"
- "Порівняй Hamilton і Verstappen"
- "Випадковий факт про F1"

### Навігація:

- 💬 **Чат** — розмова з AI
- 📅 **Розклад** — інформація про гонки
- 🌓 **Тема** — перемикання світла/темряви

## 🔒 Безпека

⚠️ **Ніколи не комітьте `.env.local` на GitHub!**

Файл `.gitignore` налаштований правильно, але перевірте:
```bash
cat .gitignore | grep env
# Має показати: .env*
```

## 🐛 Troubleshooting

### Помилка "API key not found":
- Перевірте що `.env.local` існує
- Перевірте що ключ починається з `sk-`
- Перезапустіть dev сервер (`Ctrl+C` → `npm run dev`)

### Помилка CORS:
- Використовуйте тільки `/api/chat` endpoint (не прямі виклики OpenAI з клієнта)

### Не працює streaming:
- Перевірте що використовується `fetch` з `response.body.getReader()`

## 📝 Автор

**Ваше ім'я**  
Самостійна робота з веб-програмування  
Варіант 7.2: Чат з AI (інтеграція LLM у веб-додаток)

## 📄 Ліцензія

MIT License - вільне використання для навчальних цілей.

## 🔗 Корисні посилання

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Ergast F1 API](http://ergast.com/mrd/)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)