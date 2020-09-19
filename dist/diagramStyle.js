"use strict";

System.register(["lodash"], function (_export, _context) {
	"use strict";

	var _, styleDefaults;

	function diagramStyleFormatter(customStyleValues, diagramId) {
		var values = _.extend({}, styleDefaults, customStyleValues);
		return "\n\t#" + diagramId + " .badge, #" + diagramId + " .label {\n\t\ttext-shadow: none;\n\t}\n\t\n\t#" + diagramId + " .edgeLabel, #" + diagramId + " .edgeLabel rect {\n\t\tfill: transparent;\n\t}\n\t.diagram g > foreignObject > div {\n\t  font-size: " + values.fontSize + ";\n\t}\n\t";
	}

	return {
		setters: [function (_lodash) {
			_ = _lodash.default;
		}],
		execute: function () {
			styleDefaults = {
				fontSize: "1rem"
			};

			_export("diagramStyleFormatter", diagramStyleFormatter);
		}
	};
});
//# sourceMappingURL=diagramStyle.js.map
