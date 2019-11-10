import React from 'react';
import { observer } from 'mobx-react';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import formStore from '../../stores/FormStore/FormStore';
import transactionStore from '../../stores/TransactionStore/transactionStore';
import notifierStore from '../../stores/NotifierStore/NotifierStore';
import axios from 'axios';

const TransactionForm = observer(() => {
  const handleFormDateChange = (event) => {
    formStore.setDate(event.target.value);
  }

  const handleFormDescriptionChange = (event) => {
    formStore.setDescription(event.target.value);
  }

  const handleFormCostChange = (event) => {
    formStore.setCost(event.target.value);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const transactionData = {
      transaction: {
        description: formStore.description,
        date: formStore.date,
        cost: formStore.cost
      }
    };
    if (formStore.editMode) {
      updateTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }
  }

  const updateTransaction = (transactionData) => {
    axios.patch(`/transactions/${formStore.selectedTransactionId}`, transactionData)
    .then(_ => {
      transactionStore.updateTransaction(formStore.selectedTransactionId, transactionData.transaction);
      notifierStore.setActive(true);
      notifierStore.setType('success');
      notifierStore.setMessage(`Updated transaction ${formStore.selectedTransactionId}!`)
      clearForm();
    });
  }

  const addTransaction = (transactionData) => {
    axios.post('/transactions', transactionData)
    .then(response => {
      const newTransaction = response.data;
      transactionStore.addTransaction(newTransaction);
      notifierStore.setActive(true);
      notifierStore.setType('success');
      notifierStore.setMessage('Created new transaction!');
      formStore.clear();
      toggleForm();
    });
  }

  const clearForm = () => {
    formStore.toggleShow();
    if (formStore.editMode) { formStore.toggleEdit(); }
    formStore.clear();
  }

  const toggleForm = () => {
    formStore.toggleShow();
  }

  return (
    <div>
      <Row style={{marginBottom: 10, textAlign: 'right'}}>
        <Col xs={{span: 12}} md={{span: 10, offset: 1}}>
          <Button variant="success" onClick={toggleForm}>New</Button>
        </Col>
      </Row>
      <Modal
        show={formStore.showForm}
        onHide={clearForm}
        dialogClassName="modal-90w"
        aria-labelledby="new-transaction-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="new-transaction-title">
            {formStore.editMode ? 'Edit' : 'New'} Transaction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="formDescription"
                type="text"
                placeholder="Groceries etc.."
                onChange={handleFormDescriptionChange}
                value={formStore.description}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCost">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                name="formCost"
                type="number"
                placeholder="4.04"
                step="0.01"
                onChange={handleFormCostChange}
                value={formStore.cost}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                name="formDate"
                type="date"
                onChange={handleFormDateChange}
                value={formStore.date}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
});

export default TransactionForm;
