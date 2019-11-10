import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import Transaction from '../../components/Transaction/Transaction';
import Notifier from '../../components/Notifier/Notifier';
import { observer } from 'mobx-react';
import transactionStore from '../../stores/TransactionStore/transactionStore';
import TransactionForm from '../../components/TransactionForm/TransactionForm';

@observer class Dashboard extends React.Component {
  componentDidMount() {
    transactionStore.setTransactions();
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
          <TransactionForm />
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
}

export default Dashboard;
