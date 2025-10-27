// --- Логіка програми ---

/**
 * Функція для заповнення одного елемента за ID
 */
function populateElement(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  } else {
    // Це попередження, а не помилка, оскільки не всі ID можуть бути обов'язковими
    console.warn(`Елемент з ID '${id}' не знайдено.`);
  }
}

/**
 * Функція для заповнення кількох елементів за класом
 */
function populateElementsByClass(className, value) {
  const elements = document.querySelectorAll(`.${className}`);
  if (elements.length > 0) {
    elements.forEach((el) => {
      el.textContent = value;
    });
  } else {
    console.warn(`Елементи з класом '${className}' не знайдено.`);
  }
}

/**
 * Головна функція ініціалізації
 */
export async function initApp() {
  try {
    // 1. Завантажуємо дані з config.json
    // Використовуємо { cache: "no-store" } щоб уникнути кешування під час розробки
    const response = await fetch("/config.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(
        `Не вдалося завантажити config.json. Статус: ${response.status}`
      );
    }
    const data = await response.json();

    // 2. Заповнюємо унікальні елементи (за ID)
    populateElement("data-lastname-title", data.lastname);
    populateElement("data-lastname-nav", data.lastname);
    populateElement("data-city", data.city);
    populateElement("data-city-jobcenter", data.city);
    populateElement("data-name1", data.person1);
    populateElement("data-name2", data.person2);
    populateElement("data-lastname", data.lastname);
    populateElement("data-name1-study", data.person1);
    populateElement("data-study-field", data.studyField);
    populateElement("data-name2-hobby", data.person2);
    populateElement("data-hobby-person2", data.hobbyPerson2);
    populateElement("data-region", data.region);
    populateElement("data-rent-limit", data.rentLimit);
    populateElement("data-fullname", data.fullname);
    populateElement("data-phone", data.phone);
    populateElement("data-email", data.email);
    populateElement("data-lastname-footer", data.lastname);

    // 3. Заповнюємо елементи, що повторюються (за класом)
    populateElementsByClass("data-city-multiple", data.city);

    // 4. Встановлюємо поточний рік у футері
    populateElement("data-year", new Date().getFullYear());

    // 5. Встановлюємо title для сторінки (оскільки він теж динамічний)
    document.title = `Wohnungssuche: Familie ${data.lastname}`;
  } catch (error) {
    // 6. Обробка помилок
    console.error("Помилка під час ініціалізації програми:", error);
    // Відображаємо повідомлення про помилку на сторінці
    const body = document.querySelector("body");
    if (body) {
      // Використовуємо клас .error-message зі стилів main.css
      body.innerHTML = `<div class="error-message">
          <h1>Fehler (Помилка)</h1>
          <p>Die Konfigurationsdatei konnte nicht geladen werden.</p>
          <p>Будь ласка, перевірте, що файл <code>public/config.json</code> існує та не містить помилок.</p>
          <p><i>${error.message}</i></p>
        </div>`;
    }
  }
}
