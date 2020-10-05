function diagramStyleFormatter(customStyle: string, diagramId: string) {
  return `
	#${diagramId} .badge, #${diagramId} .label {
		text-shadow: none;
	}

	#${diagramId} foreignObject {
		overflow: visible;
	}
	
	#${diagramId} .edgeLabel, #${diagramId} .edgeLabel rect {
		background-color: transparent;
		fill: transparent;
	}

	${customStyle}
	`;
}

export { diagramStyleFormatter };
