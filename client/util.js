// Transforms "There're 12345678 apples" to "There're 12,345,678 apples".
//
// https://www.polymer-project.org/0.5/docs/polymer/expressions.html#writing-global-filters
// http://stackoverflow.com/a/12947816
document.addEventListener("polymer-ready", function() {
	PolymerExpressions.prototype.readableNumbers = function(input) {
		while (/(\d+)(\d{3})/.test(input.toString())) {
			input = input.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
		}
		return input;
	};
});
