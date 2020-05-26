import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import './App.css';
import YouCaptchaApp from './YouCaptchaApp'

import queryString from 'query-string';
import { ListGroup, Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';
import ProductCell from './ProductCell'
import ProductRow from './ProductRow'

class Checkout extends React.Component {
  
    constructor(props) {
      super(props);
      const { cookies } = props;
      let productsInCart = cookies.get('products')? cookies.get('products') : [];
      let totalPrice = 0.0;
      for(let product of productsInCart){
        totalPrice = totalPrice + parseFloat(product.price)
      }
      this.state = {
        productsInCart: productsInCart,
        totalPrice: totalPrice,
        captchaVerified: false
      }
    }

    componentDidMount() {
        this.props.toggleCategoryNav();
    }
  
    render (){
        console.log(this.state.productsInCart)
        return (
            <Container>
                <h2 className="my-4">Checkout</h2>
            {
                this.state.productsInCart.map(product => {
                    return (<Row key={product.id} className="my-2" style={{height: "120px"}}>
                        <Col md={3} className={"d-flex justify-content-center"} style={{maxHeight: "90%"}}>
                            <img style={{maxWidth:"90%", maxHeight: "90%"}} src={product.imageSourceUrl}></img>
                        </Col>
                        <Col md={6} style={{maxHeight: "90%"}}>
                            <strong key={product.id}>{product.name}</strong>
                        </Col>
                        <Col md={3} style={{maxHeight: "90%"}}>
                            <strong style={{color:"red"}} key={product.id}>{"$" + product.price}</strong>
                        </Col>
                    </Row>)
                    }
                )
                }
                <hr style={{width: "90%", height: "1px", border: "none", backgroundColor: "gray"}}/>
                <Row>
                    <Col className={"d-flex justify-content-center"} md={3}>
                        <strong>Total</strong>
                    </Col>
                    <Col md={6}></Col>
                    <Col md={3}>
                        <strong style={{color: "red"}}>{"$" + this.state.totalPrice}</strong>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                    <YouCaptchaApp captchaId={this.props.captchaId} onSuccess={() => {this.setState({captchaVerified: true})}}/>
                </Row>
                <Row className={"my-2 d-flex justify-content-center"}>
                    <Button variant="secondary" size="lg" href="/" className={"mx-1"}>Cancel</Button>
                    {this.state.captchaVerified && <Button variant="info" size="lg" className={"mx-1"}>Proceed</Button>}
                </Row>
                
            </Container>
        )
    }
}

export default withCookies(Checkout);