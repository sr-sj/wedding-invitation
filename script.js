const calendarDays = document.querySelector("#calendar-days");
const galleryGrid = document.querySelector("#gallery-grid");

if (calendarDays) {
  const blankDays = 5;
  const daysInJanuary = 31;

  for (let index = 0; index < blankDays; index += 1) {
    const blank = document.createElement("span");
    blank.setAttribute("aria-hidden", "true");
    calendarDays.append(blank);
  }

  for (let day = 1; day <= daysInJanuary; day += 1) {
    const date = document.createElement("span");
    date.className = day === 9 ? "calendar-day wedding-day" : "calendar-day";
    date.textContent = String(day);

    if (day === 9) {
      date.setAttribute("aria-label", "2027년 1월 9일, 결혼식");
      date.setAttribute("aria-current", "date");
    }

    calendarDays.append(date);
  }
}

if (galleryGrid) {
  const slots = document.createDocumentFragment();

  for (let index = 1; index <= 30; index += 1) {
    const slot = document.createElement("div");
    const number = String(index).padStart(2, "0");
    slot.className = "gallery-slot";
    slot.setAttribute("role", "img");
    slot.setAttribute("aria-label", `사진 ${number} 자리`);

    const label = document.createElement("span");
    label.setAttribute("aria-hidden", "true");
    label.textContent = `PHOTO ${number}`;

    slot.append(label);
    slots.append(slot);
  }

  galleryGrid.append(slots);
}
