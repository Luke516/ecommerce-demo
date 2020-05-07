import React from 'react';
import './App.css';
import data from './metadata_all.json';

import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';

export default class Home extends React.Component {

    getInitState() {
  
    }
  
    constructor(props) {
      super(props);
      this.state = {
        
      };
  
    }
  
    render (){
      return (
        <>
        <Row className="my-4">
            <Col >
                <Carousel>
                    <Carousel.Item>
                        <Row className="mt-2 justify-content-center">
                            <Col sm={3}>
                                <img
                                className="d-block"
                                src="https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B0007P21QY.jpg"
                                alt="First slide"
                                height="320px"
                                />
                            </Col>
                            <Col sm={5} className="d-flex flex-column text-center justify-content-center">
                                <h3>Marmot PreCip Men's Lightweight Waterproof Rain Jacket</h3>
                                <div className="d-flex flex-row justify-content-center">
                                    <Button variant="info" size="lg" className="w-50">Check It Out</Button>
                                </div>
                            </Col>
                        </Row>
                    </Carousel.Item>
                </Carousel>
            </Col>
        </Row>
        <Row>
            <h3 className="ml-4 mt-4">Best Sellers</h3>
            <hr/>
        </Row>
        <Row className="ml-4 mt-2">
            <CardDeck>
                <Card style={{ width: '18rem', padding: '1rem' }}>
                    <Card.Img fluid variant="top" height="300px" src="https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B07HF4ZQRT.jpg" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        {/* <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                        </Card.Text> */}
                        <Button variant="warning" className="my-1">Product Detail</Button>
                        <br />
                        <Button variant="info">Add To Cart</Button>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem', padding: '1rem' }}>
                    <Card.Img variant="top" height="300px" src="https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B014JOPIUY.jpg" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        {/* <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                        </Card.Text> */}
                        <Button variant="warning" className="my-1">Product Detail</Button>
                        <br />
                        <Button variant="info">Add To Cart</Button>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem', padding: '1rem' }}>
                    <Card.Img variant="top" height="300px" src="https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B07539S9G3.jpg" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        {/* <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                        </Card.Text> */}
                        <Button variant="warning" className="my-1">Product Detail</Button>
                        <br />
                        <Button variant="info">Add To Cart</Button>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem', padding: '1rem' }}>
                    <Card.Img variant="top" height="300px" src="https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B07FKDHBRX.jpg" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        {/* <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                        </Card.Text> */}
                        <Button variant="warning" className="my-1">Product Detail</Button>
                        <br />
                        <Button variant="info">Add To Cart</Button>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem', padding: '1rem' }}>
                    <Card.Img variant="top" height="300px" src="https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B07G4W6GS6.jpg" />
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        {/* <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                        </Card.Text> */}
                        <Button variant="warning" className="my-1">Product Detail</Button>
                        <br />
                        <Button variant="info">Add To Cart</Button>
                    </Card.Body>
                </Card>
            </CardDeck>
        </Row>
        <div>
            <Form>
                <label htmlFor="basic-url">Username</label>                
                <InputGroup className="mb-3">
                    <FormControl
                    placeholder="Enter username..."
                    aria-label="username"
                    aria-describedby="basic-addon"
                    />
                </InputGroup>
                <label htmlFor="basic-url">Password</label>                
                <InputGroup className="mb-3">
                    <FormControl
                    placeholder="Enter password..."
                    aria-label="password"
                    aria-describedby="basic-addon2"
                    />
                </InputGroup>
                <img
                className="d-block"
                src="captcha.png"
                alt="First slide"
                width="440px"
                />
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>  
        </>
      );
    }
  }