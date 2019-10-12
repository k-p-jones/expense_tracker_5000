import React from 'react';
import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Transaction from '../../components/Transaction/Transaction';

class Dashboard extends React.Component {
  state = {
    transactions: [],
    showForm: false,
    formDescription: '',
    formDate: '',
    formCost: ''
  }

  componentDidMount() {
    axios.get('/transactions')
    .then(response => {
      const transactions = response.data;
      this.setState({ transactions: transactions });
    });
  }

  render() {
    const transactions = this.state.transactions.map(transaction => {
      return(
        <Transaction
          key={transaction.id}
          id={transaction.id}
          description={transaction.description}
          date={transaction.date}
          cost={transaction.cost}
          removeTransaction={this.removeTransaction}
        />
      );
    });
    return(
      <div>
        <Container>
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
            onHide={() => this.toggleForm()}
            dialogClassName="modal-90w"
            aria-labelledby="new-transaction-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="new-transaction-title">
                New Transaction
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
      const updatedTransactions = this.state.transactions.filter(transaction => transaction.id !== id);
      this.setState({ transactions: updatedTransactions });
    })
    .catch(error => {
      // Trigger a dissmissable alert here.
      console.log(error.message);
    })
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
    axios.post('/transactions', transactionData)
    .then(response => {
      // Refactor: Logic for sorting transactions by date could sit in its
      // own function.
      const newTransaction = response.data;
      const updatedTransactions = this.state.transactions.concat(newTransaction);
      const sortedTransactions = updatedTransactions.sort((a, b) => {
        // I do not think this is very performant at scale, but it will do for now.
        return new Date(b.date) - new Date(a.date);
      });
      this.setState(
        {
          transactions: sortedTransactions,
          formDescription: '',
          formDate: '',
          formCost: ''
        }
      );
      // Trigger a dissmissable alert here?
      this.toggleForm();
    })
  }

  toggleForm = () => {
    this.setState({showForm: !this.state.showForm});
  }
}

export default Dashboard;
