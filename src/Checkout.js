import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import './App.css';
import YouCaptchaApp from './YouCaptcha/YouCaptchaApp'

import queryString from 'query-string';
import { ListGroup, Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';
import ProductCell from './ProductCell'
import ProductRow from './ProductRow'
import { translate } from './utils/translate';

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
        captchaVerified: true
      }
    }

    componentDidMount() {
        this.props.toggleCategoryNav();
    }
  
    render (){
        console.log(this.state.productsInCart)
        return (
            <Container>
                <Row>
                <h2 className="my-4">
                    {translate("Checkout")}
                </h2>
                </Row>
            {
                this.state.productsInCart.map(product => {
                    return (<Row key={product.id} className="my-3 checkoutItem shadow-sm">
                        <Col md={3} className={"d-flex justify-content-center"} style={{maxHeight: "90%"}}>
                            <img style={{maxWidth:"90%", maxHeight: "90%"}} src={product.imageSourceUrl}></img>
                        </Col>
                        <Col md={6} style={{maxHeight: "90%"}}>
                            <strong key={product.id}>{product.name}</strong>
                        </Col>
                        <Col md={3} style={{maxHeight: "90%"}}>
                            <strong className="text-success" key={product.id}>{"$" + product.price}</strong>
                        </Col>
                    </Row>)
                    }
                )
                }
                <hr className="my-4" style={{width: "100%", height: "1px", border: "none", backgroundColor: "gray"}}/>
                <Row className="my-2">
                    <Col className={"d-flex"} md={3}>
                        <h5><strong>
                            {translate("Total")}
                        </strong></h5>
                    </Col>
                    <Col md={6}></Col>
                    <Col md={3}>
                        <h5><strong className="text-success">{"$" + this.state.totalPrice}</strong></h5>
                    </Col>
                </Row>
                {/* <Row className="d-flex justify-content-center">
                    <YouCaptchaApp captchaId={this.props.captchaId} onSuccess={() => {this.setState({captchaVerified: true})}}/>
                </Row> */}
                <Row className={"mt-4 mb-2 d-flex justify-content-center"}>
                    <Button variant="secondary" size="lg" href="/" className={"mx-1"}>
                        {translate("Cancel")}
                    </Button>
                    {
                        this.state.captchaVerified && 
                        <Button onClick={this.props.showSurvey} variant="primary" size="lg" className={"mx-1"}>
                            {translate("Proceed")}
                        </Button>
                    }
                </Row>
                <div className="footer1 my-4"></div>
            </Container>
        )
    }
}

export default withCookies(Checkout);