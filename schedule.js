// schedule.js

// URL вашего веб-приложения (получен на шаге 2)
const API_URL = 'https://script.google.com/macros/s/AKfycbyaLSMJ1Fw1zAMpHdydXO4832d0oo-rIZs3HnA3Q8r2oNq46d9T_J3nRnWaGFtbjFl-6w/exec';

async function loadSchedule() {
    const status = document.getElementById('schedule-status');
    if (status) status.textContent = 'Загрузка...';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const data = await response.json();
        console.log('Данные из таблицы:', data);
        renderSchedule(data);
        if (status) status.textContent = '';
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        if (status) status.textContent = 'Не удалось загрузить расписание. Попробуйте позже.';
    }
}

function renderSchedule(data) {
    const tbody = document.querySelector('#dynamic-schedule tbody');
    if (!tbody) {
        console.error('Таблица не найдена');
        return;
    }
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 8;
        cell.textContent = 'Нет данных о занятиях';
        return;
    }

    // Карта для быстрого доступа: ключ = Day|Time
    const lessonMap = {};
    data.forEach(item => {
        const key = `${item.Day}|${item.Time}`;
        lessonMap[key] = {
            lesson: item.Lesson || '',
            teacher: item.Teacher || '',
            booked: item.Booked || 0,
            total: item.Total || 10
        };
    });

    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const times = [];
    for (let hour = 9; hour <= 22; hour++) {
        const h = String(hour).padStart(2, '0');
        times.push(`${h}:00`);
    }

    times.forEach(time => {
        const row = tbody.insertRow();
        const timeCell = row.insertCell();
        timeCell.className = 'time-col';
        const nextHour = String(Number(time.split(':')[0]) + 1).padStart(2, '0');
        timeCell.textContent = `${time} – ${nextHour}:00`;

        daysOfWeek.forEach(day => {
            const cell = row.insertCell();
            const key = `${day}|${time}`;
            const lesson = lessonMap[key];

            if (lesson) {
                cell.className = 'lesson-cell';
                cell.innerHTML = `
                    ${lesson.lesson}
                    <span class="teacher">${lesson.teacher}</span>
                    <span class="count">${lesson.booked}/${lesson.total}</span>
                `;
            } else {
                cell.className = 'empty-cell';
                cell.textContent = '—';
            }
        });
    });
}

// Функция для бронирования (если нужно обновлять Booked)
async function bookLesson(day, time) {
    // Здесь можно реализовать отправку POST/UPDATE в скрипт,
    // но пока оставим заглушку
    alert('Функция бронирования временно отключена');
}

document.addEventListener('DOMContentLoaded', loadSchedule);
