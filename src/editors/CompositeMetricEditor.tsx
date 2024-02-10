import { StandardEditorProps } from '@grafana/data';
import { Checkbox } from '@grafana/ui';
import { CompositeMember, CompositeMetric } from 'config/types';
import { DiagramPanelControllerProps } from 'DiagramController';
import React, { FormEvent, useState } from 'react';

export const CompositeMetricEditor: React.FC<
  StandardEditorProps<CompositeMetric[], any, DiagramPanelControllerProps>
> = ({ value, onChange, context, item }) => {
  const [state, setState] = useState(value ?? []);

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
    composite.members.splice(composite.members.map((m) => m.identifier).indexOf(member));
    notify();
  };

  const addMemberToComposite = (composite: CompositeMetric) => {
    composite.members.push({ identifier: '', displayName: '' });
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
    composite.members[index].identifier = ev.currentTarget.value;
    notify();
  };

  const handleMemberInput = (ev: FormEvent<HTMLInputElement>, index: number, composite: CompositeMetric) => {
    composite.members[index].displayName = ev.currentTarget.value;
    notify();
  };

  const memberOptions = (currentValue: string) => {
    console.log(context.data);
    context.data?.map((m) => {
      const name = m.name || m.refId;
      return (
        <option key={name} selected={name === currentValue} value={name}>
          {name}
        </option>
      );
    });
  };

  const memberList = (composite: CompositeMetric) => {
    return composite.members.map((m: CompositeMember, i) => {
      return (
        <div key={m.identifier}>
          <div className="gf-form">
            <div className="gf-form-inline">
              <div className="gf-form">
                <label className="gf-form-label">
                  <i
                    className="fa fa-trash pointer"
                    onClick={() => removeMemberFromComposite(composite, m.identifier)}
                  ></i>
                </label>
              </div>
              <div className="gf-form">
                <select value={m.identifier} onChange={(ev) => handleMemberSelect(ev, i, composite)}>
                  <option></option>
                  {memberOptions(m.identifier)}
                </select>
              </div>
            </div>
          </div>
          <div className="gf-form">
            <div className="gf-form-inline">
              <div className="gf-form">
                <label className="gf-form-label">DisplayName</label>
              </div>
              <div className="gf-form">
                <input
                  value={m.displayName}
                  type="text"
                  onChange={(ev) => handleMemberInput(ev, i, composite)}
                  className="gf-form-input width-10"
                ></input>
              </div>
            </div>
          </div>
          <hr />
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
              onChange={(ev) => handleCompositeNameChange(ev, composite)}
              type="text"
              className="gf-form-input width-15"
            ></input>
          </div>
        </div>
        <div className="gf-form">
          <Checkbox
            value={composite.showLowestValue}
            onChange={(ev) => handleShowLowestValueChange(ev, composite)}
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

  const editors = state.map((c) => {
    return <div key={c.name}>{editComposite(c)}</div>;
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
