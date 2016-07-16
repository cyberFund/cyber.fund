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
  api.use([
	  "underscore",
	  "tracker",
	  // DO NOT REMOVE ECMASCRIPT! or you will get untraceable uglify bundle error
	  // see https://github.com/meteor/meteor/issues/5387
	  "ecmascript",
	  "kadira:blaze-layout",
	  "kadira:flow-router",
	  "arillo:flow-router-helpers",
	  "meteorhacks:subs-manager",
	  "cyberfund:cyberfund-base",
	  "cyberfund:cyberfund-accounts",
	  "cyberfund:cyberfund-chaingear",
	  "cyberfund:cyberfund-currentdata",
	  "cyberfund:cyberfund-marketdata",
	  "cyberfund:cyberfund-es"
  ])

  api.use(["ui", "templating", "coffeescript"], "client")
	// slowchart
	api.addFiles([
		"client/slowchart/slowchart.html",
		"client/slowchart/slowchart.coffee",
		"client/slowchart/slowchart.css"
	], "client")
	// rating table
	api.addFiles([
	// rating table configs
		"client/configs/lib/autostart.js",
		"client/configs/ratingPage.js",
		"client/configs/router.js", // defines CF.Rating.getSorterByKey
	// images
		"client/hitryImage/hitryImage.html",
		"client/hitryImage/hitryImage.js",
		"client/hitryImage/class.hidden.css",
	// system logos
		"client/cgSystemLogo/cgSystemLogo.html",
		"client/cgSystemLogo/cgSystemLogo.js",
	// quickchart
		"client/quickchart/quickchart.html",
		"client/quickchart/quickchart.js",
		"client/quickchart/quickchart.css",
	// cfRating
		"client/cfRating/cfRating.html",
		"client/cfRating/cfRating.js",
		"client/cfRating/cfRating.css",
	// sorter
		"client/sorter/th_sortables/th_sortable.html",
		"client/sorter/th_sortables/th_sortable.js",
		"client/sorter/th_sortables/class.sorter.css",
	// tooltips
		"client/tooltips/tooltip-container/tooltipTemplates.html",
		"client/tooltips/tooltip-container/tooltipTemplates.js",
		"client/tooltips/tooltip-container/class.tooltip-.css",
	// rating table
		"client/ratingTable/ratingTable.html",
		"client/ratingTable/ratingTableRow.html",
		"client/ratingTable/ratingTableHead.html",
		"client/ratingTable/ratingTableMonthly.html",
		"client/ratingTable/tooltips.html",
		"client/ratingTable/ratingTable.js",
		"client/ratingTable/ratingTableHead.js",
		"client/ratingTable/ratingTableMonthly.js",
		"client/ratingTable/ratingTableRow.js",
		"client/ratingTable/fixed-thead.css",
	// various css files
		"client/systemLogo.css"
	], "client")
})
