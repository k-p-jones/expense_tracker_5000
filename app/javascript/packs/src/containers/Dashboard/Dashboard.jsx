import React from 'react';
import { Container, Row, Col, Table, Button, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';

class Dashboard extends React.Component {
  state = {
    transactions: []
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
        <tr key={transaction.id}>
          <td>{transaction.description}</td>
          <td>{transaction.date}</td>
          <td>£{transaction.cost}</td>
          <td className="text-center">
            <ButtonGroup aria-label="Basic example">
              <Button variant="warning">Edit</Button>
              <Button variant="danger" onClick={ () => this.removeTransaction(transaction.id) }>Delete</Button>
            </ButtonGroup>
          </td>
        </tr>
      );
    });
    return(
      <div>
        <Container>
          <Row>
            <Col xs={{span: 12}} md={{span: 10, offset: 1}}>
              <div className="dashboard-table">
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
              </div>
            </Col>
          </Row>
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
      console.log(error.message);
    })
  }
}

export default Dashboard;
