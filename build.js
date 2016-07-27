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

  header = '(function(window) {' + EOL;
  footer = [
    '  ',
    '  if (typeof define !== "undefined" && define.amd) {  ',
    '    // AMD. Register as an anonymous module.  ',
    '    define(function() {  ',
    '      return OfflineModel;  ',
    '    });  ',
    '  } else if (typeof module !== "undefined" && module.exports) {  ',
    '    module.exports = OfflineModel;  ',
    '  } else {  ',
    '    window.OfflineModel = OfflineModel;  ',
    '  }  ',
    '})(global || window);'
  ].join(EOL);

	fs.writeFileSync(distPath, header + out.join(EOL) + footer, FILE_ENCODING);
	console.log(' '+ distPath +' built.');
}

concat({
	src : ['lib/offline-storage.js', 'lib/offline-model.js'],
	dest : 'index.js'
})
