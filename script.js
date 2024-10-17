document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const daysInOctober = 31;
  const firstDayOffset = 2; // Outubro de 2024 começa na terça-feira (índice 2)
  const calendarContainer = document.getElementById("calendar");
  const selectedDateElement = document.getElementById("selected-date");
  const eventDetails = document.getElementById("event-details");
  const eventForm = document.getElementById("event-form");
  const scheduleList = document.getElementById("scheduleList");
  const events = {};

  const emailSection = document.getElementById('email-section');
  const emailForm = document.getElementById('email-form');
  const userEmailInput = document.getElementById('user-email');
  const calendarContainer1 = document.getElementById('calendar-container');
  let userEmail = '';

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  weekDays.forEach(day => {
    const header = document.createElement('div');
    header.classList.add('header');
    header.textContent = day;
    calendarContainer.appendChild(header);
  });

  for (let i = 0; i < firstDayOffset; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day";
    calendarContainer.appendChild(emptyCell);
  }

  function isPast(day) {
    const date = new Date(2024, 9, day);
    return date < today;
  }

  for (let day = 1; day <= daysInOctober; day++) {
    const dayCell = document.createElement("div");
    dayCell.className = "day";
    dayCell.textContent = day;

    if (isPast(day)) {
      dayCell.classList.add("disabled");
    } else {
      dayCell.addEventListener("click", () => {
        selectedDateElement.textContent = `Dia ${day} de Outubro`;
        eventForm.style.display = 'block';
        eventForm.onsubmit = (e) => {
          e.preventDefault();
          const title = document.getElementById("event-title").value;
          const time = document.getElementById("event-time").value;
          if (isEventDuplicate(day, time)) {
            alert("Já existe um evento marcado para este horário.");
            return;
          }
          addEvent(day, title, time);
          displayEvents(day);
          eventForm.reset();
        };
        displayEvents(day);
      });
    }

    calendarContainer.appendChild(dayCell);
  }

  function isEventDuplicate(day, time) {
    return events[day] && events[day].some(event => event.time === time);
  }

  function addEvent(day, title, time) {
    if (!events[day]) {
      events[day] = [];
    }
    events[day].push({ title, time });
    markDayWithEvent(day);
    sendConfirmationEmail(day, title, time);
  }

  function markDayWithEvent(day) {
    const dayCells = document.querySelectorAll(".day");
    dayCells.forEach(cell => {
      if (cell.textContent == day) {
        cell.classList.add("has-event");
      }
    });
  }

  function displayEvents(day) {
    eventDetails.innerHTML = "";
    scheduleList.innerHTML = "";
    if (events[day]) {
      events[day].forEach((event, index) => {
        const eventItem = document.createElement("div");
        eventItem.className = "schedule-item";
        eventItem.textContent = `${event.time} - ${event.title}`;

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancelar";
        cancelButton.className = "cancel-button";
        cancelButton.addEventListener("click", () => {
          if (confirm("Tem certeza que deseja cancelar este evento?")) {
            cancelEvent(day, index);
            displayEvents(day);
          }
        });

        eventItem.appendChild(cancelButton);
        eventDetails.appendChild(eventItem);
      });
    } else {
      eventDetails.innerHTML = "<p>Sem eventos agendados para este dia.</p>";
    }
  }

  function cancelEvent(day, index) {
    events[day].splice(index, 1);
    if (events[day].length === 0) {
      delete events[day];
      unmarkDayWithEvent(day);
    }
  }

  function unmarkDayWithEvent(day) {
    const dayCells = document.querySelectorAll(".day");
    dayCells.forEach(cell => {
      if (cell.textContent == day) {
        cell.classList.remove("has-event");
      }
    });
  }

  const emailJSUserID = 'v_ksZnZ0VGxHIUpNq';
  const emailJSTemplateID = 'template_j44rqf9';
  const emailJSServiceID = 'service_tl9qrw9';
  emailjs.init(emailJSUserID);

  emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userEmail = userEmailInput.value;
    if (userEmail) {
      emailSection.style.display = 'none';
      calendarContainer1.style.display = 'flex';
    }
  });

  function sendConfirmationEmail(day, title, time) {
    const templateParams = {
      to_email: userEmail,
      event_date: `${day} de Outubro , 2024`,
      event_title: title,
      event_time: time,
    };

    emailjs.send(emailJSServiceID, emailJSTemplateID, templateParams)
      .then(() => {
        alert('Confirmação de agendamento enviada para seu e-mail!');
      }, (error) => {
        console.error('Erro ao enviar e-mail:', error);
        alert('Erro ao enviar confirmação de agendamento. Tente novamente.');
      });
  }
});
