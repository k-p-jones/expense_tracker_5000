import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import Transaction from '../../components/Transaction/Transaction';

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
}

export default Dashboard;
