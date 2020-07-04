import React from 'react';
import './App.css';

import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';
import ProductCell from './ProductCell'
import {shuffle} from './utils/utlis'
import {translate} from './utils/translate'

export default class ProductRow extends React.Component {

    orderProducts(data) {
        let obj_keys = Object.keys(data);
        return shuffle(obj_keys);
    }

    getRandomProduct(data) {
        let obj_keys = Object.keys(data);
        let ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
        let selected_object = data[ran_key];
        for(let i=0; i<100; i++){
            if(typeof selected_object == "undefined"){
                ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
                selected_object = data[ran_key];
            }
            else if (Object.keys(selected_object).length < 1){
                ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
                selected_object = data[ran_key];
            }
            else{
                break;
            }
        }
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
        // let productIdsInOrder = this.orderProducts(this.props.data)
        let list1 = []
        let reachEnd = false
        let count = 12
        if (this.props.target){
            while(true){
                let product = this.getRandomProduct(this.props.data)
                if(product.id != this.props.targetProductId){
                    continue
                }
                if(this.props.name.length > 0){
                    product['category'].unshift(this.props.name)
                }
                list1.push(product)
                break
            }
            count = 11
        }
        for(let i=0; i<count; i++){
            for(let j=0; j<100; j++){
                let product = this.getRandomProduct(this.props.data)
                if(this.props.name.length > 0){
                    product['category'].unshift(this.props.name)
                }
                if(!list1.includes(product)){
                    list1.push(product)
                    break
                }
                else if (j == 99){
                    reachEnd = true
                }
            }
        }
        list1 = shuffle(list1)
        return {
            list1,
            reachEnd
        }
    }
  
    constructor(props) {
      super(props);
      this.getInitState = this.getInitState.bind(this);
      this.getRandomProduct = this.getRandomProduct.bind(this)
      this.loadMore = this.loadMore.bind(this)
      this.state = this.getInitState()
    }
  
    render (){
      return (
        <>
        <div>
            {/* <h4 className="ml--4 mt-4">{translate(this.props.name.split('/')[1])}</h4>
            <hr/> */}
        </div>
        <Row className="ml--4 mt-2">
            {
                this.state.list1.map(element => {
                    return <ProductCell key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                })
            }
        </Row>
        {
            !this.state.reachEnd &&
            <Row className="my-4 d-flex justify-content-center">
                <Button onClick={this.loadMore} className="w-25 text-center" variant="light">
                    {translate("Load More")}
                </Button>
            </Row>
        }
        </>
      );
    }

    loadMore(e) {
        let list1 = this.state.list1
        let reachEnd = false
        for(let i=0; i<12; i++){
            for(let j=0; j<100; j++){
                let product = this.getRandomProduct(this.props.data)
                if(this.props.name.length > 0){
                    product['category'].unshift(this.props.name)
                }
                if(!list1.includes(product)){
                    list1.push(product)
                    break
                }
                else if (j == 99){
                    reachEnd = true
                }
            }
        }
        this.setState({
            list1,
            reachEnd
        })
    }
}