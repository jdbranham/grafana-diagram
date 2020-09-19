import _ from 'lodash';

const styleDefaults = {
	fontSize: "1rem"
}

function diagramStyleFormatter(customStyleValues, diagramId) {
	let values = _.extend({}, styleDefaults, customStyleValues);
	return `
	#${diagramId} .badge, #${diagramId} .label {
		text-shadow: none;
	}
	
	#${diagramId} .edgeLabel, #${diagramId} .edgeLabel rect {
		fill: transparent;
	}
	.diagram g > foreignObject > div {
	  font-size: ${values.fontSize};
	}
	`;
}

export {
	diagramStyleFormatter
}