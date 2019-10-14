import React from 'react';
import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Transaction from '../../components/Transaction/Transaction';
import Notifier from '../../components/Notifier/Notifier';
import { observer } from 'mobx-react';
import transactionStore from '../../stores/Transactions/transactionStore';

@observer class Dashboard extends React.Component {
  state = {
    showForm: false,
    formDescription: '',
    formDate: '',
    formCost: '',
    editMode: false,
    selectedTransactionId: undefined,
    notifierActive: false,
    notifierMessage: '',
    notifierType: ''
  }

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
          removeTransaction={this.removeTransaction}
          toggleEditMode={this.toggleEditMode}
          toggleForm={this.toggleForm}
          populateEditForm={this.populateEditForm}
        />
      );
    });
    return(
      <div>
        <Container>
          <Row>
            <Col xs={{span: 12}} md={{span: 10, offset: 1}}>
              <Notifier
                show={this.state.notifierActive}
                handleNotifierDismiss={this.handleNotifierDismiss}
                message={this.state.notifierMessage}
                type={this.state.notifierType}
              />
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
            show={this.state.showForm}
            onHide={() => this.clearForm()}
            dialogClassName="modal-90w"
            aria-labelledby="new-transaction-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="new-transaction-title">
                {this.state.editMode ? 'Edit' : 'New'} Transaction
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
                    onChange={this.handleFormInputChange}
                    value={this.state.formDescription}
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
                    onChange={this.handleFormInputChange}
                    value={this.state.formCost}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    name="formDate"
                    type="date"
                    onChange={this.handleFormInputChange}
                    value={this.state.formDate}
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

  removeTransaction = (id) => {
    axios.delete(`/transactions/${id}`)
    .then(_ => {
      transactionStore.removeTransaction(id);
      this.setState(
        {
          notifierActive: true,
          notifierType: 'success',
          notifierMessage: `Deleted transaction ${id}!`
        }
      );
    })
    .catch(error => console.log(error.message));
  }

  handleFormInputChange = (event) => {
    const target = event.target;
    const name   = target.name;
    const value  = target.value;
    this.setState({ [name]: value })
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    const transactionData = {
      transaction: {
        description: this.state.formDescription,
        date: this.state.formDate,
        cost: this.state.formCost
      }
    };
    if (this.state.editMode) {
      this.updateTransaction(transactionData);
    } else {
      this.addTransaction(transactionData);
    }
  }

  updateTransaction = (transactionData) => {
    axios.patch(`/transactions/${this.state.selectedTransactionId}`, transactionData)
    .then(_ => {
      transactionStore.updateTransaction(this.state.selectedTransactionId, transactionData.transaction);
      this.setState(
        {
          notifierActive: true,
          notifierType: 'success',
          notifierMessage: `Updated transaction ${this.state.selectedTransactionId}!`
        }
      );
      this.clearForm();
    });
  }

  addTransaction = (transactionData) => {
    axios.post('/transactions', transactionData)
    .then(response => {
      const newTransaction = response.data;
      transactionStore.addTransaction(newTransaction);
      this.setState(
        {
          formDescription: '',
          formDate: '',
          formCost: '',
          notifierActive: true,
          notifierType: 'success',
          notifierMessage: 'Created new transaction!'
        }
      );
      this.toggleForm();
    });
  }

  populateEditForm = (description, cost, date, id) => {
    this.setState(
      {
        formDescription: description,
        formCost: cost,
        formDate: date,
        selectedTransactionId: id
      }
    );
  }

  clearForm = () => {
    this.toggleForm();
    if (this.state.editMode) { this.toggleEditMode(); }
    this.setState(
      {
        formDescription: '',
        formDate: '',
        formCost: '',
        selectedTransactionId: undefined
      }
    );
  }

  toggleForm = () => {
    this.setState({showForm: !this.state.showForm});
  }

  toggleEditMode = () => {
    this.setState({editMode: !this.state.editMode});
  }

  // Sorts transactions in descending date order.
  sortedTransactionsByDate = (transactions) => {
    return transactions.sort((a, b) => {
      // I do not think this is very performant at scale, but it will do for now.
      return new Date(b.date) - new Date(a.date);
    });
  }

  handleNotifierDismiss = () => {
    this.setState(
      {
        notifierActive: false,
        notifierMessage: '',
        notifierType: ''
      }
    )
  }
}

export default Dashboard;
