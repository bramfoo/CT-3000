import Reflux from 'reflux';

var Actions = Reflux.createActions({
  initiate: {},
  create: {},
  parse: {}
});

Actions.initiate = function(languageConfig){
  if(languageConfig && languageConfig.objects)
    this.create(languageConfig.objects);
};


export default Actions;