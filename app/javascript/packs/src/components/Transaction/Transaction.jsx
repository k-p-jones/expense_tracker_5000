import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const Transaction = (props) => {
  const triggerEditForm = () => {
    props.toggleEditMode();
    props.toggleForm();
    props.populateEditForm(props.description, props.cost, props.date, props.id);
  }

  return (
    <tr key={props.id}>
      <td>{props.description}</td>
      <td>{props.date}</td>
      <td>£{props.cost}</td>
      <td className="text-center">
        <ButtonGroup aria-label="Basic example">
          <Button variant="warning" onClick={triggerEditForm}>Edit</Button>
          <Button variant="danger" onClick={ () => props.removeTransaction(props.id) }>Delete</Button>
        </ButtonGroup>
      </td>
    </tr>
  );
}

export default Transaction;
