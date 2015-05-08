document.addEventListener("DOMContentLoaded", function() {
	var menu = document.querySelector("cf-main-menu");
	var pages = document.querySelector("core-pages");

	menu.addEventListener("core-select", function() {
		console.log("page selected:", pages.selected);
		pages.selected = menu.selected;
	});
	pages.selected = menu.selected = 0;
});
