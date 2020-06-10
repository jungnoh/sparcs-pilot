import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import App from '@components/App';

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
