//EVENT HANDLERS

/**
 * When I open the webpage, attach the web handlers
 */
attach_event_listeners();
set_website_button();

function attach_event_listeners() {
  /**
   * Header buttons
   */
  document
    .getElementById("instructions")!
    .addEventListener("click", show_instructions);
  document
    .getElementById("closebtn")!
    .addEventListener("click", close_instructions);
}

function show_instructions() {
  console.log("instructions");
  document.getElementById("instructions_menu")!.style.height = "100%";
}

function close_instructions() {
  document.getElementById("instructions_menu")!.style.height = "0%";
}

function set_website_button(): void {
  document.getElementById("menu_btn")!.style.display = "none";
  document.getElementById("website_btn")!.style.display = "flex";
}
