import React from 'react';
import { Alert } from 'react-bootstrap';

const Notifier = (props) => {
  if (props.show) {
    return (
      <Alert variant={props.type} onClose={() => props.handleNotifierDismiss()} dismissible>
        <p>{props.message}</p>
      </Alert>
    );
  } else {
    return (<div></div>)
  }
}

export default Notifier;
