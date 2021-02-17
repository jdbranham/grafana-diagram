import { StandardEditorProps } from '@grafana/data';
import { DiagramPanelControllerProps } from 'DiagramController';
import React from 'react';

export const SupportEditor: React.FC<StandardEditorProps<boolean, any, DiagramPanelControllerProps>> = ({}) => {
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
      </div>
    </div>
  );
};
