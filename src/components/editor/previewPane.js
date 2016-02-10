import React from 'react';
import * as Objects from './objects/_index';

import ObjectActions from '../../actions/object';
import ObjectStore from '../../stores/object';

export default class PreviewPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowResult: {
        /*
        checks: [
          {
            object: 'Lamp',
            value: 'aan',
            valid: true
          },
          {
            object: 'Lamp',
            value: 'uit',
            valid: false
          }
        ],
        assignments: [
          {
            object: 'Deur',
            value: 'aan',
            valid: false
          },
          {
            object: 'Deur',
            value: 'open',
            valid: true
          }
        ]*/
      }
    };
  }

  componentDidMount() {
    this.unsubscribe = ObjectStore.listen((data) => {
      this.onUpdate(data);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onUpdate(data){
    console.log('onUpdate pp', data.parsedCode);
    this.setState({
      rowResult: data.parsedCode
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    if(!this.state.rowResult || !this.state.rowResult.checks || this.state.rowResult.checks.constructor !== Array ||
      !this.state.rowResult.assignments || this.state.rowResult.assignments.constructor !== Array){
        return false;
    }

    const checks = this.state.rowResult.checks.map((check, i) => {
      const ObjectRef = Objects[this.capitalizeFirstLetter(check.object)];
      if(!ObjectRef) return false;

      const classNames = 'check' + (check.valid ? ' valid' : '');
      return <div className={classNames} key={i}><ObjectRef/> = {check.value}</div>;
    });

    const assignments = this.state.rowResult.assignments.map((assignment, i) => {
      const ObjectRef = Objects[this.capitalizeFirstLetter(assignment.object)];
      if(!ObjectRef) return false;

      const classNames = 'assignment' + (assignment.valid ? ' valid' : '');
      return <div className={classNames} key={i}><ObjectRef/> = {assignment.value}</div>;
    });

    let output = [];

    if(checks.length > 0) {
      output.push(
        <div className="objects checks" key="checks">
          { checks }
        </div>
      );

      if(checks.length > 1) {
        output.push(
          <div className="combinator" key="combinator">
            EN
          </div>
        );
      }

      if(assignments.length > 0) {
        output.push(
          <div className="computer" key="computer">
            // Hier staat een computer //
          </div>
        );
      }
    }

    if(assignments.length > 0) {
      output.push(
        <div className="objects assignments" key="assignments">
          { assignments }
        </div>
      );
    }

    return(
      <div className="pane preview-pane">
        { output }
      </div>
    );
  }
}
