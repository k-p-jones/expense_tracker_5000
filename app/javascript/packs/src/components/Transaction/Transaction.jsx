import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import notifierStore from '../../stores/NotifierStore/NotifierStore'
import transactionStore from '../../stores/TransactionStore/transactionStore';
import formStore from '../../stores/FormStore/FormStore';

const Transaction = (props) => {
  const triggerEditForm = () => {
    formStore.toggleEdit();
    formStore.toggleShow();
    formStore.populateEditForm(props.description, props.cost, props.date, props.id);
  }

  const removeTransaction = () => {
    transactionStore.removeTransaction(props.id)
    .then(_ => {
      notifierStore.setActive(true);
      notifierStore.setType('success');
      notifierStore.setMessage(`Deleted transaction ${props.id}!`)
    })
    .catch(error => console.log(error.message));
  }

  return (
    <tr key={props.id}>
      <td>{props.description}</td>
      <td>{props.date}</td>
      <td>£{props.cost}</td>
      <td className="text-center">
        <ButtonGroup aria-label="Basic example">
          <Button variant="warning" onClick={triggerEditForm}>Edit</Button>
          <Button variant="danger" onClick={removeTransaction}>Delete</Button>
        </ButtonGroup>
      </td>
    </tr>
  );
}

export default Transaction;
