// --- Допоміжні функції для роботи з DOM ---

/**
 * Встановлює текст для елемента за його ID.
 * @param {string} id - ID HTML-елемента.
 * @param {string | number} text - Текст для встановлення.
 */
const setText = (id, text) => {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = String(text); // Перетворюємо на рядок для безпеки
  } else {
    console.warn(`Елемент з ID "${id}" не знайдено.`);
  }
};

/**
 * Встановлює текст для всіх елементів з вказаним класом.
 * @param {string} className - Клас HTML-елементів.
 * @param {string | number} text - Текст для встановлення.
 */
const setTextByClass = (className, text) => {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach((el) => {
    el.textContent = String(text); // Перетворюємо на рядок для безпеки
  });
};

// --- Основні функції додатка ---

/**
 * Асинхронно завантажує дані з config.json та вставляє їх у відповідні елементи сторінки.
 */
async function loadAndInjectData() {
  try {
    // 1. Завантажуємо конфігурацію, використовуючи базовий URL Vite
    const response = await fetch(`${import.meta.env.BASE_URL}config.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();

    // 2. Вставляємо основні дані
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
    setText("data-city-jobcenter", city);
    setTextByClass("data-city-dynamic", city);

    // 4. Окрема логіка для Прізвища
    const lastname = config["data-lastname"] || "Mustermann";
    document.title = `Wohnungssuche: Familie ${lastname}`;
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
    // Показуємо користувачу інформативне повідомлення про помилку
    document.body.innerHTML = `
      <div class="error-message">
        <h1>Fehler beim Laden der Seite</h1>
        <p>Під час завантаження даних сталася помилка.</p>
        <p>Будь ласка, перевірте, чи файл <code>${
          import.meta.env.BASE_URL
        }config.json</code> існує, доступний за цим шляхом та не містить помилок у форматі JSON.</p>
        <i>Details: ${error.message}</i>
      </div>
    `;
  }
}

/**
 * Ініціалізує функціонал мобільного меню (бургера).
 */
function initializeMobileMenu() {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (!menuToggle || !mainNav) {
    console.warn("Елементи мобільного меню не знайдені.");
    return;
  }

  // Обробник кліку на "бургер"
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active");
    menuToggle.setAttribute("aria-expanded", String(isOpen)); // Явно перетворюємо на рядок
    // Блокуємо скрол сторінки, коли меню відкрите
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Обробник кліку на посилання в меню (щоб закрити меню після переходу)
  const navLinks = mainNav.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Закриваємо тільки якщо меню було відкрито (is-open клас є)
      if (mainNav.classList.contains("is-open")) {
        mainNav.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = ""; // Дозволяємо скрол
      }
    });
  });
}

/**
 * Ініціалізує підсвічування активного пункту меню при скролі сторінки
 * за допомогою Intersection Observer API.
 */
function initializeScrollSpy() {
  const sections = document.querySelectorAll("main > section[id]");
  const navLinks = document.querySelectorAll("#main-nav a[href^='#']");
  const mainHeader = document.getElementById("main-header");

  // Перевіряємо наявність необхідних елементів
  if (navLinks.length === 0 || sections.length === 0 || !mainHeader) {
    console.warn("Елементи для scroll spy не знайдені.");
    return;
  }

  // Отримуємо висоту хедера, щоб використовувати як відступ зверху
  const headerOffset = mainHeader.offsetHeight;

  const observerOptions = {
    // `rootMargin` визначає "активну зону".
    // `-${headerOffset}px` зверху: секція стає активною тільки коли її верхня межа
    // проходить за хедер (при скролі вниз).
    // `-50%` знизу: секція перестає бути активною, коли її нижня межа
    // піднімається вище середини екрану (при скролі вниз).
    rootMargin: `-${headerOffset}px 0px -50% 0px`,
    // `threshold: 0` означає, що callback спрацює, як тільки хоча б один піксель
    // секції увійде або вийде з `rootMargin`.
    threshold: 0,
  };

  /**
   * Callback-функція для Intersection Observer.
   * @param {IntersectionObserverEntry[]} entries - Масив об'єктів, що описують перетин.
   */
  const observerCallback = (entries) => {
    let latestIntersectingEntry = null;

    entries.forEach((entry) => {
      // Нас цікавить тільки та секція, яка саме зараз *входить* у видиму зону
      if (entry.isIntersecting) {
        latestIntersectingEntry = entry;
      }
    });

    // Якщо є секція, яка увійшла в зону видимості
    if (latestIntersectingEntry) {
      const id = latestIntersectingEntry.target.getAttribute("id");
      const correspondingLink = document.querySelector(
        `#main-nav a[href="#${id}"]`
      );

      // 1. Знімаємо клас 'active' з усіх посилань
      navLinks.forEach((link) => link.classList.remove("active"));

      // 2. Додаємо клас 'active' до потрібного посилання
      if (correspondingLink) {
        correspondingLink.classList.add("active");
      }
    }
    // Якщо жодна секція не перетинає активну зону (наприклад, між секціями або на самому верху/низу),
    // можна опціонально зняти .active з усіх посилань або залишити останнє активне.
    // Поточна логіка залишає останнє активне, що зазвичай виглядає краще.
  };

  // Створюємо спостерігач
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Починаємо спостереження за кожною секцією
  sections.forEach((section) => {
    observer.observe(section);
  });
}

// --- Точка входу додатка ---

/**
 * Головна функція ініціалізації, яка викликається після завантаження DOM.
 * Експортується для використання в main.js.
 */
export function initApp() {
  loadAndInjectData(); // Завантаження та вставка даних
  initializeMobileMenu(); // Ініціалізація мобільного меню
  initializeScrollSpy(); // Ініціалізація підсвічування меню при скролі
}
