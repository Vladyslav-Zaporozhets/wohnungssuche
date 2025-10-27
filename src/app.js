// src/app.js

/**
 * Ця функція завантажує та вставляє дані з config.json
 * у всі елементи HTML, які мають відповідні ID або класи.
 */
async function loadAndInjectData() {
  try {
    // 1. Завантажуємо конфігурацію
    const response = await fetch("/config.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();

    /**
     * ДОПОМІЖНА ФУНКЦІЯ
     * Безпечно знаходить елемент за ID і встановлює його textContent.
     */
    const setText = (id, text) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = text;
      } else {
        // Якщо ви бачите це в консолі, це означає, що ID в HTML
        // не збігається з ID в app.js або config.json
        console.warn(`Елемент з ID "${id}" не знайдено.`);
      }
    };

    /**
     * ДОПОМІЖНА ФУНКЦІЯ
     * Знаходить всі елементи за класом і встановлює їх textContent.
     */
    const setTextByClass = (className, text) => {
      const elements = document.querySelectorAll(`.${className}`);
      elements.forEach((el) => {
        el.textContent = text;
      });
    };

    // 2. Встановлюємо рік у футері
    setText("data-year", new Date().getFullYear());

    // 3. Обробляємо всі ключі з config.json
    for (const key in config) {
      const value = config[key];
      setText(key, value);
      setTextByClass(key, value); // Також шукаємо за класом
    }

    // 4. Окрема логіка для прізвища (воно в кількох місцях)
    const lastname = config["data-lastname"] || "Mustermann";
    setText("data-lastname-title", lastname);
    setText("data-lastname-nav", lastname);
    setText("data-lastname-footer", lastname);

    // 5. Окрема логіка для повного імені
    const name1 = config["data-name1"] || "";
    const name2 = config["data-name2"] || "";
    const fullname = `${name1} & ${name2} ${lastname}`.trim();
    setText("data-fullname", fullname);

    // 6. Окрема логіка для назви міста в Jobcenter
    const city = config["data-city"] || "Stadt";
    setText("data-city-jobcenter", city);
  } catch (error) {
    console.error("Could not load or inject config data:", error);
    // Показати помилку користувачу
    document.body.innerHTML = `
      <div class="error-message">
        <h1>Fehler beim Laden der Seite</h1>
        <p>Під час завантаження даних сталася помилка.</p>
        <p>Будь ласка, перевірте, чи файл <code>public/config.json</code> існує та не містить помилок.</p>
        <i>Details: ${error.message}</i>
      </div>
    `;
  }
}

/**
 * Функція для ініціалізації мобільного меню
 */
function initializeMobileMenu() {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (!menuToggle || !mainNav) {
    return; // Немає кнопки або меню
  }

  // 1. Обробник кліку на "бургер"
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active");
    menuToggle.setAttribute("aria-expanded", isOpen);

    // Блокуємо скрол сторінки, коли меню відкрите
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // 2. Обробник кліку на посилання в меню (щоб закрити меню)
  const navLinks = mainNav.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.classList.remove("is-active");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

/**
 * Головна функція ініціалізації, яку ми експортуємо.
 * Вона буде викликана з main.js
 */
export function initApp() {
  loadAndInjectData();
  initializeMobileMenu();
}
