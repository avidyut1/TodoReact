import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TodoList from './components/todolist';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<TodoList id={0}/>, document.getElementById('root'));
registerServiceWorker();
