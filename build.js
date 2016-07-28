/* You need uglify
// npm install -g uglify-js
// npm link uglify-js
// Run that into node and voila bitch
*/
var FILE_ENCODING = 'utf-8',

EOL = '\n';

var fs = require('fs');
var path = require('path');

function concat(opts) {
	var fileList = opts.src;
	var distPath = opts.dest;
	var out = fileList.map(function(filePath){
		var fileContent = fs.readFileSync(filePath, FILE_ENCODING);

    moduleName = '-' + path.basename(filePath).replace('.js', '');
    moduleName = moduleName.replace(/[-_]([a-z])/g, function (m, w) {
      return w.toUpperCase();
    });

    fileContent = fileContent.split(EOL).filter(function(lineContent) {
      return lineContent.indexOf('require(') === - 1;
    }).join(EOL);
    fileContent = fileContent.replace('module.exports', 'var ' + moduleName);
    return fileContent;
	});

  header = [
		'(function (root, factory) {',
    '  if (typeof define === "function" && define.amd) {',
    '    // AMD. Register as an anonymous module.',
    '    define([], factory);',
    '  } else if (typeof module !== "undefined" && module.exports) {',
    '    // CommonJS/Node module',
    '    module.exports = factory();',
    '  } else {',
    '    // Browser globals',
    '    root.OfflineModel = factory();',
    '  }',
		'}(this, function () {'
	].join(EOL);
  footer = [
    'return OfflineModel;',
		'}));'
  ].join(EOL);

	fs.writeFileSync(distPath, header + out.join(EOL) + footer, FILE_ENCODING);
	console.log(' '+ distPath +' built.');
}

concat({
	src : ['lib/offline-storage.js', 'lib/offline-model.js'],
	dest : 'index.js'
})
