document.addEventListener("polymer-ready", function() {
	var menu = document.querySelector("cf-main-menu");
	var drawer = document.querySelector("core-drawer-panel");

	menu.addEventListener("switch-drawer", function() {
		drawer.togglePanel();
	});
});
