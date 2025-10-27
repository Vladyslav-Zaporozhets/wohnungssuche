const setText = (id, text) => {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  } else {
    console.warn(`Елемент з ID "${id}" не знайдено.`);
  }
};

const setTextByClass = (className, text) => {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach((el) => {
    el.textContent = text;
  });
};

async function loadAndInjectData() {
  try {
    // 1. Завантажуємо конфігурацію
    const response = await fetch(`${import.meta.env.BASE_URL}config.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();

    setText("data-name1", config["data-name1"]);
    setText("data-name2", config["data-name2"]);
    setText("data-lastname", config["data-lastname"]);
    setText("data-region", config["data-region"]);
    setText("data-rent-limit", config["data-rent-limit"]);
    setText("data-study-field", config["data-study-field"]);
    setText("data-hobby-person2", config["data-hobby-person2"]);
    setText("data-phone", config["data-phone"]);
    setText("data-email", config["data-email"]);
    setText("data-name1-study", config["data-name1-study"]);
    setText("data-name2-hobby", config["data-name2-hobby"]);

    // 3. Спеціальна логіка для Міста (City)
    const city = config["data-city"] || "Stadt";
    setText("data-city-jobcenter", city); // Заповнюємо <span id="data-city-jobcenter">
    setTextByClass("data-city-dynamic", city); // Заповнюємо ВСІ <span class="data-city-dynamic">

    // 4. Окрема логіка для Прізвища
    const lastname = config["data-lastname"] || "Mustermann";

    // ОНОВЛЕНО: Встановлюємо заголовок сторінки (document.title) напряму
    document.title = `Wohnungssuche: Familie ${lastname}`;

    // Встановлюємо прізвище в навігації та футері
    // (Рядок 'data-lastname-title' видалено, оскільки він більше не потрібен)
    setText("data-lastname-nav", lastname);
    setText("data-lastname-footer", lastname);

    // 5. Спеціальна логіка для Повного імені
    const name1 = config["data-name1"] || "";
    const name2 = config["data-name2"] || "";
    const fullname = `${name1} & ${name2} ${lastname}`.trim();
    setText("data-fullname", fullname);

    // 6. Рік у футері
    setText("data-year", new Date().getFullYear());
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
