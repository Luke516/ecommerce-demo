import React from 'react';
import './App.css';
import data from './data/metadata_all_with_detail_img_3_empty.json';
// import data from './selectedProductsFromFile.json';
import productIdToPath from './data/productIdToPath.json'

import {withRouter} from 'react-router-dom'
import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';
import ProductCell from './ProductCell'
import ProductRow from './ProductRow'
import { translate } from './utils/translate';

class Home extends React.Component {

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
        let list1 = []
        let list2 = []
        for(let i=0; i<12; i++){
            list1.push(this.getRandomProduct(data))
        }
        for(let i=0; i<12; i++){
            list2.push(this.getRandomProduct(data))
        }
        
        let targetPath = productIdToPath[this.props.targetProductId];
        console.log(targetPath)
        return {
            targetPath,
            list1,
            list2
        }
    }
  
    constructor(props) {
      super(props);
      this.getInitState = this.getInitState.bind(this);
      this.getRandomProduct = this.getRandomProduct.bind(this)
      this.detailButtonClick = this.detailButtonClick.bind(this)
      this.state = this.getInitState()
    }
  
    render (){
      return (
        <Container>
        <Row className="my-4">
            {/* <Carousel> */}
                {/* <Carousel.Item> */}
                    <Row className="mt-2 justify-content-center" style={{minHeight: "320px"}}>
                        <Col sm={4} className={"d-flex justify-content-center flex-column"} 
                        style={{maxHeight: "320px", maxWidth: "320px", padding: "1rem"}}>
                            <div className="d-flex"></div>
                            <img
                            src={"https://youcaptcha.s3-us-west-2.amazonaws.com/seed/" + this.state.targetPath}
                            alt="First slide"
                            style={{maxWidth: "320px", maxHeight:"320px", width: "auto", height: "auto"}}
                            />
                            <div className="d-flex" ></div>
                        </Col>
                        <Col sm={5} className="d-flex flex-column text-center justify-content-center">
                            <h3>{this.props.targetProductData.name}</h3>
                            <div className="d-flex flex-row justify-content-center">
                                <Button variant="primary" size="lg" className="w-50" onClick={this.detailButtonClick}>
                                    {translate("Check It Out")}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                {/* </Carousel.Item> */}
            {/* </Carousel> */}
        </Row>
        <Row>
            <h3 className="ml--4 mt-4">{translate("All Products")}</h3>
            <hr/>
        </Row>
        {/* <Row className="ml-4 mt-2">
            {
                this.state.list1.map(element => {
                    return <ProductCell key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                })
            }
        </Row>
        <Row className="ml-4 mt-2">
            {
                this.state.list2.map(element => {
                    return <ProductCell key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                })
            }
        </Row> */}
        <ProductRow name={""} data={data} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
        <div className="footer1 my-4"></div>
        <Row className="context-dark">
            
        </Row>
        </Container>
      );
    }

    detailButtonClick() {
        this.props.history.push('/Product?p=' + this.props.targetProductId) 
        console.log("Detail Click !!!")
    }
}

export default withRouter(Home)