import React from 'react';
import './App.css';
import priceData from './prices2All.json';

import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';

export default class ProductDetail extends React.Component {

    getInitState() {
  
    }
  
    constructor(props) {
      super(props);
      this.state = {
        price: priceData[this.props.product.id][0],
        detailHtml: ""
      };
  
    }

    componentWillMount() {
        fetch('./out2/' + this.props.product.id + '.html')
        .then((r) => r.text())
        .then(text  => {
            this.setState({
                detailHtml: text
            })
            console.log(text);
        })  
    }
  
    render (){
        // let imageSourceUrl = "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B07HF4ZQRT.jpg"
        let imageSourceUrl = "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/"
        for (let category of this.props.product.category){
            category = category.replace('é', 'e')
            imageSourceUrl += encodeURIComponent(category) 
            imageSourceUrl += '/'
        }
        imageSourceUrl += this.props.product.id
        imageSourceUrl += '.jpg'
        let title = this.props.product.name
        
        return (
            <Col xs={12} sm={12} md={12} lg={12} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                <Card style={{padding: "1rem", height: "480px", justifyContent: "space-between", alignItems: "center", border: "none"}}>
                    {/* <Card.Img variant="top" height="300px" src="https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B07HF4ZQRT.jpg" /> */}
                    {/* <Card.Img variant="top" height="300px" src={imageSourceUrl} /> */}
                    <div></div>
                    <div className="d-flex justify-content-center" style={{maxHeight:"200px", maxWidth:"200px"}}>
                        {/* <Card.Img variant="top" height="300px" src={imageSourceUrl} /> */}
                        <img src={imageSourceUrl} style={{maxWidth: "200px", maxHeight:"200px", width: "auto", height: "auto"}}></img>
                    </div>
                    <Card.Body className={"d-block"} style={{justifyContent: "flex-end", flex: "none"}}>
                        {/* <Card.Title style={{height: "5rem"}}>{title}</Card.Title> */}
                        <div dangerouslySetInnerHTML={{ __html: this.state.detailHtml }} ></div>
                        <Card.Title style={{color: "red"}}><strong>{"$" + this.state.price}</strong></Card.Title>
                        <Button variant="info" className="w-100" onClick={()=>{this.props.addProductToCart(this.props.product)}}>Add To Cart</Button>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
  }