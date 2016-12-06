import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import StatusBarComponent from '../src/components/editor/statusBar';
import TranslationStore from '../src/stores/translation';

import '../src/assets/style/main.less';

storiesOf('StatusBar', module)
  .add('Nederlands', () => {
    TranslationStore.setLanguage('nl');
    return(
      <StatusBarComponent />
    )
  })
  .add('Engels', () => {
    TranslationStore.setLanguage('en');
    return(
      <StatusBarComponent />
    )
  })
  .add('Duits', () => {
    TranslationStore.setLanguage('de');
    return(
      <StatusBarComponent />
    )
  });
