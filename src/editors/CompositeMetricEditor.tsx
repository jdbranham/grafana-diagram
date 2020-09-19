import { StandardEditorProps } from '@grafana/data';
import { Checkbox } from '@grafana/ui';
import { CompositeMetric } from 'config/types';
import { DiagramPanelControllerProps } from 'DiagramController';
import React, { FormEvent, useState } from 'react';

export const CompositeMetricEditor: React.FC<StandardEditorProps<
  CompositeMetric[],
  any,
  DiagramPanelControllerProps
>> = ({ value, onChange, context, item }) => {
  const [state, setState] = useState(value);

  const notify = () => {
    onChange(state);
  };

  if (!state) {
    setState([]);
    notify();
  }

  const removeComposite = (composite: CompositeMetric) => {
    state.splice(state.indexOf(composite));
    notify();
  };

  const addComposite = () => {
    state.push({
      name: 'new-composite',
      members: [],
      valueName: 'last',
      showLowestValue: false,
    });
    notify();
  };
  const removeMemberFromComposite = (composite: CompositeMetric, member: string) => {
    composite.members.splice(composite.members.indexOf(member));
    notify();
  };

  const addMemberToComposite = (composite: CompositeMetric) => {
    composite.members.push('');
    notify();
  };

  const handleShowLowestValueChange = (ev: FormEvent<HTMLInputElement>, composite: CompositeMetric) => {
    composite.showLowestValue = !composite.showLowestValue;
    notify();
  };

  const handleCompositeNameChange = (ev: FormEvent<HTMLInputElement>, composite: CompositeMetric) => {
    composite.name = ev.currentTarget.value;
    notify();
  };

  const handleMemberSelect = (ev: FormEvent<HTMLSelectElement>, index: number, composite: CompositeMetric) => {
    composite.members[index] = ev.currentTarget.value;
    notify();
  };

  const memberOptions = (currentValue: string) =>
    context.data?.map(m => {
      return (
        <option selected={m.name === currentValue} value={m.name}>
          {m.name}
        </option>
      );
    });

  const memberList = (composite: CompositeMetric) => {
    return composite.members.map((m, i) => {
      return (
        <div className="gf-form-inline">
          <div className="gf-form">
            <label className="gf-form-label">
              <i className="fa fa-trash pointer" onClick={() => removeMemberFromComposite(composite, m)}></i>
            </label>
          </div>
          <div className="gf-form">
            <select value={m} onChange={ev => handleMemberSelect(ev, i, composite)}>
              <option></option>
              {memberOptions(m)}
            </select>
          </div>
        </div>
      );
    });
  };

  const editComposite = (composite: CompositeMetric) => {
    return (
      <div>
        <hr />
        <div className="gf-form">
          <label className="gf-form-label">
            <i className="fa fa-trash pointer" onClick={() => removeComposite(composite)}></i>
          </label>
          <div className="gf-form">
            <label className="gf-form-label">Name</label>
          </div>
          <div className="gf-form">
            <input
              value={composite.name}
              onChange={ev => handleCompositeNameChange(ev, composite)}
              type="text"
              className="gf-form-input width-15"
            ></input>
          </div>
        </div>
        <div className="gf-form">
          <Checkbox
            css=""
            value={composite.showLowestValue}
            onChange={ev => handleShowLowestValueChange(ev, composite)}
            label="Show lowest metric"
          ></Checkbox>
        </div>
        <div>{memberList(composite)}</div>
        <div className="gf-form">
          <button className="btn btn-inverse gf-form-input" onClick={() => addMemberToComposite(composite)}>
            <i className="fa fa-plus pointer"></i>&nbsp;Add member to composite
          </button>
        </div>
      </div>
    );
  };

  const editors = state.map(c => {
    return <div>{editComposite(c)}</div>;
  });

  return (
    <div className="gf-form-group">
      <div className="edit-tab-content">
        <div className="gf-form-group">{editors}</div>
        <hr />
      </div>
      <button className="btn btn-inverse gf-form-input" onClick={addComposite}>
        <i className="fa fa-plus pointer"></i>&nbsp;Add Composite
      </button>
    </div>
  );
};
