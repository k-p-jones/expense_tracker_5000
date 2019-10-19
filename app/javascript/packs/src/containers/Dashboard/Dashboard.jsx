import React from 'react';
import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Transaction from '../../components/Transaction/Transaction';
import Notifier from '../../components/Notifier/Notifier';
import { observer } from 'mobx-react';
import transactionStore from '../../stores/TransactionStore/transactionStore';
import notifierStore from '../../stores/NotifierStore/NotifierStore';
import formStore from '../../stores/FormStore/FormStore';

@observer class Dashboard extends React.Component {
  componentDidMount() {
    axios.get('/transactions')
    .then(response => {
      const transactions = response.data;
      transactionStore.setTransactions(transactions);
    });
  }

  render() {
    const transactions = transactionStore.transactions.map(transaction => {
      return(
        <Transaction
          key={transaction.id}
          id={transaction.id}
          description={transaction.description}
          date={transaction.date}
          cost={transaction.cost}
        />
      );
    });
    return(
      <div>
        <Container>
          <Row>
            <Col xs={{span: 12}} md={{span: 10, offset: 1}}>
              <Notifier />
            </Col>
          </Row>
          <Row style={{marginBottom: 10, textAlign: 'right'}}>
            <Col xs={{span: 12}} md={{span: 10, offset: 1}}>
              <Button variant="success" onClick={this.toggleForm}>New</Button>
            </Col>
          </Row>
          <Row>
            <Col xs={{span: 12}} md={{span: 10, offset: 1}}>
              <Table responsive bordered className="dashboard-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Cost</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  { transactions }
                </tbody>
              </Table>
            </Col>
          </Row>
          <Modal
            show={formStore.showForm}
            onHide={() => this.clearForm()}
            dialogClassName="modal-90w"
            aria-labelledby="new-transaction-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="new-transaction-title">
                {formStore.editMode ? 'Edit' : 'New'} Transaction
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.handleFormSubmit}>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="formDescription"
                    type="text"
                    placeholder="Groceries etc.."
                    onChange={this.handleFormDescriptionChange}
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
                    onChange={this.handleFormCostChange}
                    value={formStore.cost}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    name="formDate"
                    type="date"
                    onChange={this.handleFormDateChange}
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
        </Container>
      </div>
    );
  }

  handleFormDateChange = (event) => {
    formStore.setDate(event.target.value);
  }

  handleFormDescriptionChange = (event) => {
    formStore.setDescription(event.target.value);
  }

  handleFormCostChange = (event) => {
    formStore.setCost(event.target.value);
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    const transactionData = {
      transaction: {
        description: formStore.description,
        date: formStore.date,
        cost: formStore.cost
      }
    };
    if (formStore.editMode) {
      this.updateTransaction(transactionData);
    } else {
      this.addTransaction(transactionData);
    }
  }

  updateTransaction = (transactionData) => {
    axios.patch(`/transactions/${formStore.selectedTransactionId}`, transactionData)
    .then(_ => {
      transactionStore.updateTransaction(formStore.selectedTransactionId, transactionData.transaction);
      notifierStore.setActive(true);
      notifierStore.setType('success');
      notifierStore.setMessage(`Updated transaction ${formStore.selectedTransactionId}!`)
      this.clearForm();
    });
  }

  addTransaction = (transactionData) => {
    axios.post('/transactions', transactionData)
    .then(response => {
      const newTransaction = response.data;
      transactionStore.addTransaction(newTransaction);
      notifierStore.setActive(true);
      notifierStore.setType('success');
      notifierStore.setMessage('Created new transaction');
      formStore.clear();
      this.toggleForm();
    });
  }

  populateEditForm = (description, cost, date, id) => {
    formStore.populateEditForm(description, cost, date, id);
  }

  clearForm = () => {
    formStore.toggleShow();
    if (formStore.editMode) { formStore.toggleEdit(); }
    formStore.clear();
  }

  toggleForm = () => {
    formStore.toggleShow();
  }

  toggleEditMode = () => {
    formStore.toggleEdit();
  }
}

export default Dashboard;
