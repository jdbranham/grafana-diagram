import { StandardEditorProps } from '@grafana/data';
import { MetricCharacterReplacement } from 'config/types';
import { DiagramPanelControllerProps } from 'DiagramController';
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
    metricCharacterReplacement: MetricCharacterReplacement
  ) => {
    metricCharacterReplacement.replacementPattern = ev.currentTarget.value;
    notify();
  };

  const handleReplacementTextChange = (
    ev: FormEvent<HTMLInputElement>,
    metricCharacterReplacement: MetricCharacterReplacement
  ) => {
    metricCharacterReplacement.replaceWithText = ev.currentTarget.value;
    notify();
  };

  const editMetricCharacterReplacement = (metricCharacterReplacement: MetricCharacterReplacement) => {
    return (
      <div>
        <hr />
        <div className="gf-form">
          <label className="gf-form-label">
            <i
              className="fa fa-trash pointer"
              onClick={() => removeMetricCharacterReplacement(metricCharacterReplacement)}
            ></i>
          </label>
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
              onChange={(ev) => handlePatternChange(ev, metricCharacterReplacement)}
              type="text"
              className="gf-form-input width-15"
            ></input>
          </div>
        </div>
        <div className="gf-form">
          <label className="gf-form-label">
            <i
              className="fa fa-trash pointer"
              onClick={() => removeMetricCharacterReplacement(metricCharacterReplacement)}
            ></i>
          </label>
          <div className="gf-form">
            <label className="gf-form-label">Replacement expression/text</label>
          </div>
          <div className="gf-form">
            <input
              value={
                metricCharacterReplacement.replaceWithText ? metricCharacterReplacement.replaceWithText.toString() : ''
              }
              onChange={(ev) => handleReplacementTextChange(ev, metricCharacterReplacement)}
              type="text"
              className="gf-form-input width-15"
            ></input>
          </div>
        </div>
      </div>
    );
  };

  const editors = state.map((c, i) => {
    return <div key={`${c.replaceWithText}-${i}`}>{editMetricCharacterReplacement(c)}</div>;
  });

  return (
    <div className="gf-form-group">
      <div className="edit-tab-content">
        <div className="gf-form-group">{editors}</div>
        <hr />
      </div>
      <button className="btn btn-inverse gf-form-input" onClick={addMetricCharacterReplacement}>
        <i className="fa fa-plus pointer"></i>&nbsp;Add Metric Character Replacement
      </button>
    </div>
  );
};
