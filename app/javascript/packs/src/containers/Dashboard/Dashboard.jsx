import React from 'react';
import { Container, Row, Col, Table, Button, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';

class Dashboard extends React.Component {
  state = {
    transactions: []
  }

  componentDidMount() {
    axios.get('/transactions')
    .then(res => {
      const transactions = res.data;
      this.setState({ transactions: transactions })
    });
  }

  render() {
    const transactions = this.state.transactions.map(t => {
      return(
        <tr key={t.id}>
          <td>{t.description}</td>
          <td>{t.date}</td>
          <td>£{t.cost}</td>
          <td className="text-center">
            <ButtonGroup aria-label="Basic example">
              <Button variant="warning">Edit</Button>
              <Button variant="danger">Delete</Button>
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
}

export default Dashboard;
