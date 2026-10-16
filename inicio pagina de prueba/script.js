
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
  link.addEventListener("click", function () {
    closeMenu();
  });
});

window.addEventListener("resize", function () {
  if (window.innerWidth > 700) {
    closeMenu();
  }
});
