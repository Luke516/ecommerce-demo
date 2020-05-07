import React from 'react';
import './App.css';

import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';
import ProductCell from './ProductCell'

export default class Category extends React.Component {

    getRandomProduct(data) {
        let obj_keys = Object.keys(data);
        let ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
        let selected_object = data[ran_key];
        if (typeof selected_object == "undefined"){
            return {
                id: '',
                name: 'unknown',
                category: []
            }
        }
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
        for(let i=0; i<12; i++){
            let product = this.getRandomProduct(this.props.data)
            product['category'].unshift(this.props.name)
            list1.push(product)
        }
        for(let i=0; i<12; i++){
            let product = this.getRandomProduct(this.props.data)
            product['category'].unshift(this.props.name)
            list2.push(product)
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
        <Row>
            <h3 className="ml-4 mt-4">{this.props.name}</h3>
            <hr/>
        </Row>
        <Row className="ml-4 mt-2">
            {
                this.state.list1.map(element => {
                    return <ProductCell key={element.id} product={element} addProductToCart={this.props.addProductToCart}/>
                })
            }
        </Row>
        <Row className="ml-4 mt-2">
            {
                this.state.list2.map(element => {
                    return <ProductCell key={element.id} product={element} addProductToCart={this.props.addProductToCart}/>
                })
            }
        </Row>
        </Container>
      );
    }
  }