import React from 'react';
import ReactDOM from 'react-dom';

// Components
import App from './App';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

const reactRoot = document.getElementById('react-root-new');

if (reactRoot) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    reactRoot
  );
}
