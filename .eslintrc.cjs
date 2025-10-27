module.exports = {
  env: {
    browser: true, // Дозволяє використовувати глобальні змінні браузера (document, fetch і т.д.)
    es2021: true, // Вмикає підтримку сучасного синтаксису JavaScript
    node: true, // Дозволяє використовувати глобальні змінні Node.js (потрібно для цього файлу .cjs)
  },
  extends: [
    "eslint:recommended", // Базовий набір рекомендованих правил ESLint
    "prettier", // Вимикає правила ESLint, що конфліктують з Prettier
  ],
  parserOptions: {
    ecmaVersion: "latest", // Використовувати найновіший стандарт ECMAScript
    sourceType: "module", // Вказує, що ви використовуєте ES Modules (import/export)
  },
  rules: {
    // Тут можна додати або перевизначити правила ESLint за бажанням
    // Наприклад:
    // 'no-unused-vars': 'warn', // Показувати попередження для невикористаних змінних
    // 'no-console': 'warn',   // Показувати попередження при використанні console.log
  },
  ignorePatterns: ["dist", "node_modules"], // Папки, які ESLint має ігнорувати
};
