import React from 'react';
import './App.css';
import data from './metadata_all.json';

import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';

export default class ProductCell extends React.Component {

    getInitState() {
  
    }
  
    constructor(props) {
      super(props);
      this.state = {
        
      };
  
    }
  
    render (){
        // let imageSourceUrl = "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B07HF4ZQRT.jpg"
        let imageSourceUrl = "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/"
        for (let category of this.props.product.category){
            imageSourceUrl += encodeURIComponent(category) 
            imageSourceUrl += '/'
        }
        imageSourceUrl += this.props.product.id
        imageSourceUrl += '.jpg'
        let title = this.props.product.name
        if(title.length > 50)
            title = this.props.product.name.slice(0,50) + "..."
        return (
            <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                <Card style={{ padding: '1rem' }}>
                    {/* <Card.Img variant="top" height="300px" src="https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B07HF4ZQRT.jpg" /> */}
                    {/* <Card.Img variant="top" height="300px" src={imageSourceUrl} /> */}
                    <div className="d-flex justify-content-center" style={{height:"200px", width:"200px", overflow: "hidden"}}>
                        {/* <Card.Img variant="top" height="300px" src={imageSourceUrl} /> */}
                        <img src={imageSourceUrl} className="img-fluid"></img>
                    </div>
                    <Card.Body>
                        <Card.Title style={{height: "5rem"}}>{title}</Card.Title>
                        {/* <Card.  Title> */}
                        <Button variant="warning" className="my-1 w-100">Product Detail</Button>
                        <br />
                        <Button variant="info" className="w-100" onClick={()=>{this.props.addProductToCart(this.props.product)}}>Add To Cart</Button>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
  }