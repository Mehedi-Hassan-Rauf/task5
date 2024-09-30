import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';

const App = () => {
  const [region, setRegion] = useState('Poland');
  const [errorCount, setErrorCount] = useState(0);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 100000));
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const regions = ['Poland', 'USA', 'Georgia'];

  useEffect(() => {
    fetchData();
  }, [region, errorCount, seed, page]);

  const fetchData = async () => {
    const response = await axios.get(`https://task5-server-i1d5.onrender.com/api/data`, {
      params: { region, errors: errorCount, seed: seed + page }
    });
    if (response.data.length < 20) setHasMore(false);
    setData(prev => [...prev, ...response.data]);
  };

  const handleErrorCountChange = (e) => {
    const value = e.target.value;
    setErrorCount(value);
    setPage(1);
    setData([]);
    setHasMore(true);
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setPage(1);
    setData([]);
    setHasMore(true);
  };

  const handleSeedChange = (e) => {
    setSeed(e.target.value);
    setPage(1);
    setData([]);
    setHasMore(true);
  };

  const loadMoreData = () => {
    setPage(prev => prev + 1);
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">User Data Generator</h1>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="regionSelect">
            <Form.Label>Region</Form.Label>
            <Form.Control as="select" value={region} onChange={handleRegionChange}>
              {regions.map((reg) => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="errorCount">
            <Form.Label>Number of Errors</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="1000"
              value={errorCount}
              onChange={handleErrorCountChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Button onClick={() => setSeed(Math.floor(Math.random() * 100000))}>Random Seed</Button>
          <Form.Group controlId="seedInput" className="mt-2">
            <Form.Label>Seed</Form.Label>
            <Form.Control
              type="number"
              value={seed}
              onChange={handleSeedChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Index</th>
              <th>Identifier</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => (
              <tr key={index}>
                <td>{(page - 1) * 20 + index + 1}</td>
                <td>{record.id}</td>
                <td>{record.name}</td>
                <td>{record.address}</td>
                <td>{record.phone}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </InfiniteScroll>
    </Container>
  );
};

export default App;
