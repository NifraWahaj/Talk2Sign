// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5555/api';
axios.defaults.headers.common['Authorization'] =
  `Bearer ${localStorage.getItem('token')}`;

ReactDOM.render(<App />, document.getElementById('root'));
