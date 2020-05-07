import React from 'react';
import './App.css';
import data from './metadata_all.json';

import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';
import ProductCell from './ProductCell'

export default class Home extends React.Component {

    getRandomProduct(data) {
        let obj_keys = Object.keys(data);
        let ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
        let selected_object = data[ran_key];
        if(selected_object.hasOwnProperty('name')){
            selected_object['id'] = ran_key
            selected_object['category'] = []
            return selected_object
        }
        else {
            let return_object = this.getRandomProduct(selected_object)
            return_object['category'].unshift(ran_key)
            return return_object
        }
    }

    getInitState() {
        let list1 = []
        let list2 = []
        for(let i=0; i<10; i++){
            list1.push(this.getRandomProduct(data))
        }
        for(let i=0; i<10; i++){
            list2.push(this.getRandomProduct(data))
        }
        // console.log(this.getRandomProduct(data))
        // console.log(this.getRandomProduct(data))
        return {
            list1,
            list2
        }
    }
  
    constructor(props) {
      super(props);
      this.getInitState = this.getInitState.bind(this);
      this.getRandomProduct = this.getRandomProduct.bind(this)
      this.state = this.getInitState()
    }
  
    render (){
      return (
        <Container>
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
            {/* <CardDeck> */}
                {
                    this.state.list1.map(element => {
                        return <ProductCell key={element.id} product={element} addProductToCart={this.props.addProductToCart}/>
                    })
                }
            {/* </CardDeck> */}
        </Row>
        </Container>
      );
    }
  }