import React from 'react';
import './App.css';
import priceData from './prices2All.json';

import {withRouter} from 'react-router-dom'
import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faShoppingCart } from '@fortawesome/free-solid-svg-icons'

class ProductCell extends React.Component {
  
    constructor(props) {
        super(props);
        let imageSourceUrl = "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/"
        for (let category of this.props.product.category){
            category = category.replace('é', 'e')
            imageSourceUrl += encodeURIComponent(category) 
            imageSourceUrl += '/'
        }
        imageSourceUrl += this.props.product.id
        imageSourceUrl += '.jpg'
        this.state = {
            price: priceData[this.props.product.id][0],
            imageSourceUrl: imageSourceUrl
        };
        this.detailButtonClick = this.detailButtonClick.bind(this);
    }
  
    render (){
        let title = this.props.product.name
        if(title.length > 42)
            title = this.props.product.name.slice(0,42) + "..."
        return (
            <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                <Card style={{padding: "1rem", height: "480px", justifyContent: "space-between", alignItems: "center"}}>
                    <div></div>
                    <div className="d-flex justify-content-center" style={{maxHeight:"200px", maxWidth:"200px", overflow: "hidden"}}>
                        <img src={this.state.imageSourceUrl} style={{maxWidth: "200px", maxHeight:"200px", width: "auto", height: "auto"}}></img>
                    </div>
                    <Card.Body className={"d-block"} style={{justifyContent: "flex-end", flex: "none"}}>
                        <Card.Title style={{height: "5rem"}}>{title}</Card.Title>
                        {
                            !this.props.hideOption &&
                            <Card.Title style={{color: "red"}}><strong>{"$" + this.state.price}</strong></Card.Title>
                        }
                        {
                            !this.props.hideOption &&
                            <Button variant="warning" className="my-1 w-100" onClick={this.detailButtonClick}>
                                <FontAwesomeIcon className="mx-2" icon={faInfo} />Product Detail
                            </Button>
                        }
                        {
                            !this.props.hideOption &&
                            <Button variant="info" className="w-100" onClick={()=>{this.props.addProductToCart({...this.props.product, ...this.state})}}>
                                <FontAwesomeIcon className="mx-2" icon={faShoppingCart} />Add To Cart
                            </Button>
                        }
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    detailButtonClick() {
        let { history } = this.props
        this.props.history.push('/Product?p=' + this.props.product.id) 
        console.log("Detail Click !!!")
        this.props.showProduct({...this.props.product, ...this.state});
    }
}

export default withRouter(ProductCell)