// --- Головний файл (Точка входу) ---

// 1. Імпортуємо всі наші CSS файли
import "./css/main.css";
import "./css/layout.css";
import "./css/sections.css";

// 2. Імпортуємо нашу логіку програми
import { initApp } from "./app.js";

// 3. Запускаємо логіку після завантаження DOM
document.addEventListener("DOMContentLoaded", initApp);
