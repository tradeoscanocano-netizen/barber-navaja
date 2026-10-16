
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const navItems = navLinks.querySelectorAll("a");

function closeMenu() {
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Cerrar menú" : "Abrir menú"
  );

  document.body.classList.toggle("menu-open", isOpen);
});

navItems.forEach(function (link) {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", function () {
  if (window.innerWidth > 700) {
    closeMenu();
  }
});

const bookingForm = document.getElementById("bookingForm");
const clientName = document.getElementById("clientName");
const clientPhone = document.getElementById("clientPhone");
const serviceChoice = document.getElementById("serviceChoice");
const appointmentDate = document.getElementById("appointmentDate");
const appointmentTime = document.getElementById("appointmentTime");
const clientNotes = document.getElementById("clientNotes");
const bookingFeedback = document.getElementById("bookingFeedback");
const bookingSummary = document.getElementById("bookingSummary");
const summaryContent = document.getElementById("summaryContent");
const whatsappButton = document.getElementById("whatsappButton");
const copyButton = document.getElementById("copyButton");

// Escribe aquí el WhatsApp del negocio cuando lo tengas.
// Usa el código del país y los números, sin +, espacios ni guiones.
// Ejemplo de formato mexicano: 521XXXXXXXXXX
const WHATSAPP_NUMBER = "";

let bookingMessage = "";

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

appointmentDate.min = getLocalDateString();

document.querySelectorAll(".service-select").forEach(function (button) {
  button.addEventListener("click", function () {
    serviceChoice.value = button.dataset.service;
    document.getElementById("contacto").scrollIntoView({
      behavior: "smooth"
    });
  });
});

document.querySelectorAll("[data-service]").forEach(function (button) {
  button.addEventListener("click", function () {
    serviceChoice.value = button.dataset.service;
    bookingFeedback.textContent = `Seleccionaste: ${button.dataset.service}`;
    bookingSummary.hidden = true;

    document.getElementById("contacto").scrollIntoView({
      behavior: "smooth"
    });
  });
});

serviceChoice.addEventListener("change", function () {
  bookingSummary.hidden = true;
  bookingFeedback.textContent = "";
});

bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  bookingFeedback.textContent = "";
  bookingSummary.hidden = true;

  if (!bookingForm.reportValidity()) {
    return;
  }

  if (appointmentDate.value < getLocalDateString()) {
    bookingFeedback.textContent = "Elige hoy o una fecha futura.";
    return;
  }

  const phoneDigits = clientPhone.value.replace(/\D/g, "");

  if (phoneDigits.length < 7) {
    bookingFeedback.textContent =
      "Revisa tu teléfono. Escribe un número de contacto válido.";
    clientPhone.focus();
    return;
  }

  const selectedOption = serviceChoice.options[serviceChoice.selectedIndex];
  const price = selectedOption.dataset.price;
  const name = clientName.value.trim();
  const phone = clientPhone.value.trim();
  const service = serviceChoice.value;
  const date = appointmentDate.value;
  const time = appointmentTime.value;
  const notes = clientNotes.value.trim();

  if (!name) {
    bookingFeedback.textContent = "Escribe tu nombre para continuar.";
    clientName.focus();
    return;
  }

  bookingMessage =
    "Hola, quiero solicitar una cita en NAVAJA Barber Studio.\n\n" +
    "Nombre: " + name + "\n" +
    "Teléfono: " + phone + "\n" +
    "Servicio: " + service + "\n" +
    "Precio mostrado: $" + price + " MXN\n" +
    "Fecha preferida: " + date + "\n" +
    "Hora preferida: " + time + "\n" +
    "Detalles adicionales: " + (notes || "Ninguno") + "\n\n" +
    "Entiendo que la cita queda pendiente de confirmación.";

  summaryContent.replaceChildren();

  const details = [
    ["Nombre", name],
    ["Teléfono", phone],
    ["Servicio", service],
    ["Precio", "$" + price + " MXN"],
    ["Fecha preferida", date],
    ["Hora preferida", time],
    ["Detalles", notes || "Ninguno"]
  ];

  details.forEach(function (detail) {
    const row = document.createElement("p");
    const label = document.createElement("strong");

    label.textContent = detail[0] + ": ";
    row.append(label, document.createTextNode(detail[1]));
    summaryContent.appendChild(row);
  });

  bookingSummary.hidden = false;
  bookingFeedback.textContent =
    "Revisa los datos. Tu solicitud todavía no está confirmada.";

  bookingSummary.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});

whatsappButton.addEventListener("click", function () {
  if (!bookingMessage) {
    bookingFeedback.textContent = "Primero completa y revisa el formulario.";
    return;
  }

  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    bookingFeedback.textContent =
      "La solicitud está preparada. Falta configurar el número de WhatsApp de la barbería. Mientras tanto, usa «Copiar mensaje».";
    return;
  }

  const whatsappUrl =
    "https://wa.me/" + WHATSAPP_NUMBER +
    "?text=" + encodeURIComponent(bookingMessage);

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

copyButton.addEventListener("click", async function () {
  if (!bookingMessage) {
    bookingFeedback.textContent = "Primero completa el formulario.";
    return;
  }

  try {
    await navigator.clipboard.writeText(bookingMessage);
    bookingFeedback.textContent =
      "Mensaje copiado. Puedes pegarlo en WhatsApp.";
  } catch {
    const temporaryTextArea = document.createElement("textarea");
    temporaryTextArea.value = bookingMessage;
    temporaryTextArea.style.position = "fixed";
    temporaryTextArea.style.opacity = "0";
    document.body.appendChild(temporaryTextArea);
    temporaryTextArea.select();

    const copied = document.execCommand("copy");
    temporaryTextArea.remove();

    bookingFeedback.textContent = copied
      ? "Mensaje copiado. Puedes pegarlo en WhatsApp."
      : "No se pudo copiar automáticamente. Selecciona el resumen y cópialo.";
  }
});
