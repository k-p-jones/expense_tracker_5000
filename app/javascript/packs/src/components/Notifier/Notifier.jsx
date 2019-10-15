import React from 'react';
import { Alert } from 'react-bootstrap';
import { observer } from 'mobx-react'
import notifierStore from '../../stores/NotifierStore/NotifierStore';

const Notifier = observer((props) => {
  if (notifierStore.active) {
    return (
      <Alert variant={notifierStore.type} onClose={() => notifierStore.clear()} dismissible>
        <p>{notifierStore.message}</p>
      </Alert>
    );
  } else {
    return (<div></div>)
  }
});

export default Notifier;
