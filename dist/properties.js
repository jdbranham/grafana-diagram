'use strict';

System.register([], function (_export, _context) {
	"use strict";

	var pluginName, diagramEditor, displayEditor;
	return {
		setters: [],
		execute: function () {
			_export('pluginName', pluginName = 'jdbranham-diagram-panel');

			_export('diagramEditor', diagramEditor = 'public/plugins/' + pluginName + '/diagramEditor.html');

			_export('displayEditor', displayEditor = 'public/plugins/' + pluginName + '/displayEditor.html');

			_export('pluginName', pluginName);

			_export('diagramEditor', diagramEditor);

			_export('displayEditor', displayEditor);
		}
	};
});
//# sourceMappingURL=properties.js.map
