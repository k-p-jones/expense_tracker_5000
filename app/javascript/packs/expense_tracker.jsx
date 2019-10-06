// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import ExpenseTracker from './src/containers/ExpenseTracker/ExpenseTracker';
import setupCSRF from './src/config/setupCSRF';

document.addEventListener('DOMContentLoaded', () => {
  // Ensure that axios sends csrf token with every request
  setupCSRF();

  ReactDOM.render(
    <ExpenseTracker />,
    document.body.appendChild(document.createElement('div')),
  )
})
