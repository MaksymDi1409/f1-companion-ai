// components/Chat.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🏎️ Привіт! Я твій F1 асистент. Запитай мене про історію Формули 1, поточний сезон, пілотів, команди або будь-що про F1!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Автоскрол до останнього повідомлення
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Відправка повідомлення
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Додаємо повідомлення користувача
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Викликаємо API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Читаємо streaming відповідь
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      // Додаємо порожнє повідомлення асистента для streaming
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              assistantMessage += content;

              // Оновлюємо останнє повідомлення
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = assistantMessage;
                return newMessages;
              });
            } catch (e) {
              // Ігноруємо помилки парсингу
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Вибачте, сталася помилка. Спробуйте ще раз.',
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Швидкі запитання
  const quickQuestions = [
    '🏁 Коли наступна гонка?',
    '👑 Хто лідирує в чемпіонаті?',
    '🏎️ Розкажи про Ayrton Senna',
    '⚡ Випадковий факт про F1',
  ];

  const handleQuickQuestion = (question) => {
    setInput(question.replace(/^[^\s]+\s/, '')); // Прибираємо емодзі
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Область повідомлень */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Швидкі запитання */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span>Швидкі запитання:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-left text-sm px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Форма вводу */}
      <div className="border-t dark:border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Запитайте про F1..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}