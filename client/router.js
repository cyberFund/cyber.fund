document.addEventListener("polymer-ready", function() {
	var menu = document.querySelector("cf-main-menu");
	var pages = document.querySelector("core-animated-pages");

	menu.addEventListener("core-select", function() {
		pages.selected = menu.selected;
	});
});
