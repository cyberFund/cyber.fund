Package.describe({
  name: "cyberfund:cyberfund-blaze-components",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.versionsFrom("1.1.0.2");
  api.use(["underscore", "cyberfund:cyberfund-base"])

  api.use(["ui", "templating", "coffeescript"], "client")
	// slowchart
	api.addFiles([
		"client/slowchart/slowchart.html",
		"client/slowchart/slowchart.coffee",
		"client/slowchart/slowchart.css"
	], "client")
	/*// sorter (needed for rating table)
	api.addFiles([
		"client/sorter/th_sortables/th_sortable.html",
		"client/sorter/th_sortables/th_sortable.js",
		"client/sorter/th_sortables/class.sorter.css"
	], "client")
	// rating table
	api.addFiles([
		"client/ratingTable/ratingTable.html",
		"client/ratingTable/ratingTableRow.html",
		"client/ratingTable/ratingTableHead.html",
		"client/ratingTable/ratingTableMonthly.html",
		"client/ratingTable/tooltips.html",
		"client/ratingTable/ratingTable.js",
		"client/ratingTable/ratingTableHead.js",
		"client/ratingTable/ratingTableMonthly.js",
		"client/ratingTable/ratingTableRow.js",
		"client/ratingTable/fixed-thead.css"
	], "client")*/
})
