import React from 'react';
import Reflux from 'reflux';

import ObjectStore from '../../../stores/object';
import ObjectActions from '../../../actions/object';

export let BaseObject = (ComposedComponent, type) => class extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getState();
  }

  componentDidMount() {
    this.unsubscribe = ObjectStore.listen((name) => {
      this.onUpdate(name);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onUpdate(data){
    if(data && data.objects && data.objects[type] &&
      data.objects[type].getValue() !== this.state.state){
        this.setState({
          object: data.objects[type]
        });
      }
  }

  getState(){
    return {
      object: ObjectStore.getObject(type)
    };
  }

  render() {
    const classNames = 'object ' + type;
    return (
      <div className={classNames}>
        <ComposedComponent { ...this.props } data={ this.state } />
      </div>
    );
  }
};
