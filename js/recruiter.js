function toggleMenu(event) {
    event.preventDefault();
    document.getElementById("profileMenu").classList.toggle("show");
}

window.addEventListener("click", function(event) {
    const menu = document.getElementById("profileMenu");

    if (!event.target.closest(".dropdown")) {
        menu.classList.remove("show");
    }
});