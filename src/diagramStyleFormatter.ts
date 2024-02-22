function diagramStyleFormatter(customStyle: string, diagramId: string) {
  return `
	#${diagramId} .badge, #${diagramId} .label {
		text-shadow: none;
		line-height: unset;
		font-size: 0.75rem;
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
