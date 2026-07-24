import { updateDiagramStyle } from './updateDiagramStyle';
import { DiagramOptions, DiagramSeriesModel } from '../config/types';

const makeModel = (label: string, value: number, color?: string): DiagramSeriesModel =>
  ({
    label,
    data: [[0, value]],
    isVisible: true,
    seriesIndex: 0,
    timeStep: 1,
    timeField: {} as any,
    valueField: { config: { custom: { valueName: 'last' } } } as any,
    info: [{ title: 'last', numeric: value, text: String(value), color } as any],
  } as DiagramSeriesModel);

const baseOptions = (overrides: Partial<DiagramOptions> = {}): DiagramOptions =>
  ({
    useBackground: false,
    nodeSize: { minWidth: 30, minHeight: 30 },
    composites: [],
    style: '',
    maxWidth: true,
    ...overrides,
  } as unknown as DiagramOptions);

const container = (svgInner: string): HTMLElement => {
  const el = document.createElement('div');
  el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${svgInner}</svg>`;
  return el;
};

describe('updateDiagramStyle', () => {
  describe('flowchart binding (regression guard)', () => {
    it('injects a .diagram-value onto a node matched by data-id', () => {
      const el = container('<g data-id="Orders"><foreignObject><div>Orders</div></foreignObject></g>');
      updateDiagramStyle(el, [makeModel('Orders', 120)], baseOptions(), 'd1');
      expect(el.querySelector('.diagram-value')).not.toBeNull();
      expect(el.innerHTML).toContain('120');
    });

    it('colors the whole flowchart edge label (label + value), not just the value', () => {
      const el = container(
        '<g class="edgeLabels"><g class="edgeLabel"><foreignObject><div class="labelBkg"><span class="edgeLabel">charge</span></div></foreignObject></g></g>'
      );
      updateDiagramStyle(el, [makeModel('charge', 42, 'rgb(1, 2, 3)')], baseOptions(), 'dA');
      const label = el.querySelector('span.edgeLabel');
      const value = el.querySelector('.diagram-value');
      expect(value?.getAttribute('style') || '').toContain('color: rgb(1, 2, 3)');
      expect(label?.getAttribute('style') || '').toContain('color: rgb(1, 2, 3)');
    });

    it('colors the edge label background too in background mode', () => {
      const el = container(
        '<g class="edgeLabels"><g class="edgeLabel"><foreignObject><div class="labelBkg"><span class="edgeLabel">charge</span></div></foreignObject></g></g>'
      );
      updateDiagramStyle(el, [makeModel('charge', 42, 'rgb(9, 8, 7)')], baseOptions({ useBackground: true }), 'dB');
      const label = el.querySelector('span.edgeLabel');
      const value = el.querySelector('.diagram-value');
      expect(value?.getAttribute('style') || '').toContain('background-color: rgb(9, 8, 7)');
      expect(label?.getAttribute('style') || '').toContain('background-color: rgb(9, 8, 7)');
    });
  });

  describe('sequence binding (exact match)', () => {
    it('binds the value onto an actor on its own line, without throwing', () => {
      const el = container('<text class="actor"><tspan x="10">Orders</tspan></text>');
      expect(() => updateDiagramStyle(el, [makeModel('Orders', 120)], baseOptions(), 'd2')).not.toThrow();
      const value = el.querySelector('tspan.diagram-value');
      expect(value?.textContent).toBe('120');
      expect(value?.getAttribute('dy')).toBe('1.2em');
    });

    it('colors the whole actor label (name + value) like a graph node', () => {
      const el = container('<text class="actor"><tspan x="10">Orders</tspan></text>');
      updateDiagramStyle(el, [makeModel('Orders', 120, 'rgb(255, 0, 0)')], baseOptions(), 'd3');
      expect(el.querySelector('text.actor')?.getAttribute('style')).toContain('rgb(255, 0, 0)');
    });

    it('colors the whole message label (name + value) like a graph node', () => {
      const el = container('<text class="messageText">charge</text>');
      updateDiagramStyle(el, [makeModel('charge', 42, 'rgb(0, 0, 255)')], baseOptions(), 'd4');
      const value = el.querySelector('tspan.diagram-value');
      expect(value?.textContent).toBe('42');
      expect(value?.getAttribute('style')).toContain('rgb(0, 0, 255)');
      expect(el.querySelector('text.messageText')?.getAttribute('style') || '').toContain('rgb(0, 0, 255)');
    });

    it('does not bind when the name matches no element', () => {
      const el = container('<text>Other</text>');
      updateDiagramStyle(el, [makeModel('Orders', 120)], baseOptions(), 'd5');
      expect(el.querySelector('.diagram-value')).toBeNull();
    });

    it('does NOT bind on a partial/substring match (exact only)', () => {
      const el = container('<text>Orders total</text>');
      updateDiagramStyle(el, [makeModel('Orders', 120)], baseOptions(), 'd6');
      expect(el.querySelector('.diagram-value')).toBeNull();
    });
  });
});
