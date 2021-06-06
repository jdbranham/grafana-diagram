import { StandardEditorProps } from '@grafana/data';
import { MetricCharacterReplacement } from 'config/types';
import { DiagramPanelControllerProps } from 'DiagramController';
import _ from 'lodash';
import React, { FormEvent, useState } from 'react';

export const MetricCharacterReplacementEditor: React.FC<
  StandardEditorProps<MetricCharacterReplacement[], any, DiagramPanelControllerProps>
> = ({ value, onChange, context, item }) => {
  const [state, setState] = useState(value ?? []);

  const notify = () => {
    onChange(state);
  };

  if (!state) {
    setState([]);
    notify();
  }

  const removeMetricCharacterReplacement = (metricCharacterReplacement: MetricCharacterReplacement) => {
    state.splice(state.indexOf(metricCharacterReplacement));
    notify();
  };

  const addMetricCharacterReplacement = () => {
    state.push({
      replacementPattern: '/(.+)/',
      replaceWithText: '$1',
    });
    notify();
  };

  const handlePatternChange = (
    ev: FormEvent<HTMLInputElement>,
    index: number
  ) => {
    const _state = _.cloneDeep(state);
    _state[index].replacementPattern = ev.currentTarget.value;
    setState(_state);
  };

  const handleReplacementTextChange = (
    ev: FormEvent<HTMLInputElement>,
    index: number
  ) => {
    const _state = _.cloneDeep(state);
    _state[index].replaceWithText = ev.currentTarget.value;
    setState(_state);
  };

  const editMetricCharacterReplacement = (metricCharacterReplacement: MetricCharacterReplacement, index: number) => {
    return (
      <div>
        <div className="gf-form">
          <div className="col">
            <label className="gf-form-label">
              <i
                className="fa fa-trash pointer"
                onClick={() => removeMetricCharacterReplacement(metricCharacterReplacement)}
              ></i>
            </label>
          </div>
          <div className="col">
            <div className="gf-form">
              <label className="gf-form-label">String or Regex to match against metric name</label>
            </div>
            <div className="gf-form">
              <input
                value={
                  metricCharacterReplacement.replacementPattern
                    ? metricCharacterReplacement.replacementPattern.toString()
                    : ''
                }
                onChange={(ev) => handlePatternChange(ev, index)}
                onBlur={() => notify()}
                type="text"
                className="gf-form-input width-15"
              ></input>
            </div>

            <div className="gf-form">
              <label className="gf-form-label">Replacement expression/text</label>
            </div>
            <div className="gf-form">
              <input
                value={
                  metricCharacterReplacement.replaceWithText
                    ? metricCharacterReplacement.replaceWithText.toString()
                    : ''
                }
                onChange={(ev) => handleReplacementTextChange(ev, index)}
                onBlur={() => notify()}
                type="text"
                className="gf-form-input width-15"
              ></input>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const editors = state.map((c, i) => {
    return <div key={`metric-char-replacement-${i}`}>{editMetricCharacterReplacement(c, i)}</div>;
  });

  return (
    <div className="gf-form-group">
      <button className="btn btn-inverse gf-form-input" onClick={addMetricCharacterReplacement}>
        <i className="fa fa-plus pointer"></i>&nbsp;Add Metric Character Replacement
      </button>
      <hr />
      <div className="edit-tab-content">
        <div className="gf-form-group">{editors}</div>
      </div>
    </div>
  );
};
