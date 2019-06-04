import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <App
      appId="7365d310ecda312a8f87c73098d546ad80d1c5223812b1eee99ce1f10c830cd1"
      baseUrl="https://api.unsplash.com/search/photos"
    />,
    document.getElementById('mount-point')
  );
  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
