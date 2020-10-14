import { StandardEditorProps } from '@grafana/data';
import { Checkbox } from '@grafana/ui';
import { DiagramPanelControllerProps } from 'DiagramController';
import React, { FormEvent, useState } from 'react';

export const SupportEditor: React.FC<StandardEditorProps<boolean, any, DiagramPanelControllerProps>> = ({
  value,
  onChange,
  context,
  item,
}) => {
  const [state, setState] = useState(value);

  if (!state) {
    onChange(true);
  }

  const handleInputValueChange = (ev: FormEvent<HTMLInputElement>) => {
    setState(!state);
  };

  const openSupportPage = () => {
    window.open('https://github.com/jdbranham/grafana-diagram/issues', '_github');
  };

  const openSponsorPage = () => {
    window.open('https://github.com/sponsors/jdbranham', '_github');
  };

  const openPatreonPage = () => {
    window.open('https://patreon.com/savantly', '_patreon');
  };

  return (
    <div className="gf-form-group">
      <div className="edit-tab-content">
        <div className="gf-form">
          <button className="btn btn-secondary gf-form-input" onClick={openSupportPage}>
            <i className="fa fa-help pointer"></i>&nbsp;Community Support
          </button>
        </div>
        <div className="gf-form">
          <button className="btn btn-primary gf-form-input" onClick={openSponsorPage}>
            <i className="fa fa-help pointer"></i>&nbsp;Sponsors
          </button>
        </div>
        <div className="gf-form">
          <button className="btn btn-primary gf-form-input" onClick={openPatreonPage}>
            <i className="fa fa-help pointer"></i>&nbsp;Vote for features
          </button>
        </div>
        <div>
          <p>
            This plugin uses anonymous reporting to improve development/features. You may opt-out by disabling this.
          </p>
          <Checkbox css="" value={state} onChange={ev => handleInputValueChange(ev)} label="Enable"></Checkbox>
        </div>
      </div>
    </div>
  );
};
