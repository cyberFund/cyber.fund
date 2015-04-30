var doHTMLScanning = function (compileStep, htmlScanner) {
	// XXX the way we deal with encodings here is sloppy .. should get
	// religion on that
	var contents = compileStep.read().toString('utf8');
	try {
		var results = htmlScanner.scan(contents, compileStep.inputPath);
	} catch (e) {
		if (e instanceof htmlScanner.ParseError) {
			compileStep.error({
				message: e.message,
				sourcePath: compileStep.inputPath,
				line: e.line
			});
			return;
		} else
			throw e;
	}

	if (results.head)
		compileStep.addHtml({ section: 'head', data: results.head });

	if (results.body)
		compileStep.addHtml({ section: 'body', data: results.body });

};

Plugin.registerSourceHandler('html', {
	isTemplate: true,
	archMatching: 'web'
}, function (compileStep) {
	doHTMLScanning(compileStep, html_scanner);
});
