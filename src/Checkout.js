import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import './App.css';
import YouCaptchaApp from './YouCaptcha/YouCaptchaApp'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
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
      let totalCount = 0;
      let productChecked = {}
      for(let product of productsInCart){
        let price = parseInt(product.price * 31)
        if(price % 100 < 20){
            price = price - (price%100) - 1;
        }
        else if(price % 100 > 90){
            price = price - (price%100) + 99;
        }
        else{
            price = price - price % 10
        }
        product.price = price
        totalPrice = totalPrice + parseFloat(product.price)
        totalCount = totalCount + product.count
        productChecked[product.id] = true
      }
      this.state = {
        productsInCart: productsInCart,
        totalPrice: totalPrice,
        totalCount: totalCount,
        captchaVerified: true,
        productChecked
      }
      this.clearCart = this.clearCart.bind(this)
      this.toggleAllChecks = this.toggleAllChecks.bind(this)
    }

    componentDidMount() {
        this.props.toggleCategoryNav();
    }

    clearCart(index = null) {
        const { cookies } = this.props;
        console.log(index)
        if (index == null){
          this.setState({
            productsInCart: []
          }, ()=>{
            cookies.set('products', JSON.stringify(this.state.productsInCart))
          })
        }
        else {
          let productsInCart = cookies.get('products')? cookies.get('products') : [];
          productsInCart.splice(index, 1)
          let totalPrice = 0.0;
          let totalCount = 0;
          for(let product of productsInCart){
            let price = parseInt(product.price * 31)
            if(price % 100 < 20){
                price = price - (price%100) - 1;
            }
            else if(price % 100 > 90){
                price = price - (price%100) + 99;
            }
            else{
                price = price - price % 10
            }
            product.price = price
            totalPrice = totalPrice + parseFloat(product.price)
            totalCount = totalCount + product.count
          }
          this.setState({
            productsInCart,
            totalPrice,
            totalCount
          }, ()=>{
            cookies.set('products', JSON.stringify(this.state.productsInCart))
            this.props.updateCart()
          })
        }
    }

    toggleAllChecks() {
        let allChecked = true
        for(let productCheck in this.state.productChecked){
            console.log(productCheck)
            if(!productCheck){
                allChecked = false
                break
            }
        }
        let productChecked = this.state.productChecked
        if(allChecked){

        }else{

        }
    }
  
    render (){
        console.log(this.state.productsInCart)
        return (
            <Container>
                <Row>
                <h2 className="my-4">
                    {/* {translate("Checkout")} */}
                    購物車
                </h2>
                </Row>
            {
                <Row className="my-3 checkoutTitle shadow-sm">
                    <Col md={1} className={"d-flex align-items-center justify-content-center"} style={{maxHeight: "90%"}}>
                        <input type="checkbox" className="normal-checkbox" defaultChecked onChange={this.toggleAllChecks}></input>
                    </Col>
                    <Col md={2} className={"d-flex justify-content-center"} style={{maxHeight: "90%"}}>
                        <span className="text-secondary">商品</span>
                    </Col>
                    <Col md={3} className="align-items-center" style={{maxHeight: "90%"}}>
                        
                    </Col>
                    <Col md={2} className={"d-flex justify-content-center align-items-center"} style={{maxHeight: "90%"}}>
                        <span className="text-secondary">單價</span>
                    </Col>
                    <Col md={2} className={"d-flex justify-content-center align-items-center"} style={{maxHeight: "90%"}}>
                        <span className="text-secondary">數量</span>
                    </Col>
                    <Col md={2} className="d-flex align-items-center" style={{maxHeight: "90%"}}>
                        <span className="text-secondary">總價</span>
                    </Col>
                </Row>
            }
            {
                this.state.productsInCart.map((product, index) => {
                    
                    return (<Row key={product.id} className="my-3 checkoutItem shadow-sm">
                        <Col md={1} className={"d-flex align-items-center justify-content-center"} style={{maxHeight: "90%"}}>
                            <input type="checkbox" className="normal-checkbox" defaultChecked></input>
                        </Col>
                        <Col md={2} className={"d-flex justify-content-center"} style={{maxHeight: "90%"}}>
                            <img style={{maxWidth:"90%", maxHeight: "90%"}} src={product.imageSourceUrl}></img>
                        </Col>
                        <Col md={3} className="align-items-center" style={{maxHeight: "90%"}}>
                            <strong key={product.id}>{product.name}</strong>
                        </Col>
                        <Col md={2} className={"d-flex justify-content-center align-items-center"} style={{maxHeight: "90%"}}>
                            <h5><strong className="text-success" key={product.id}>{"$" + product.price}</strong></h5>
                        </Col>
                        <Col md={2} className={"d-flex justify-content-center align-items-center"} style={{maxHeight: "90%"}}>
                            <h6>x {product.count}</h6>
                        </Col>
                        <Col md={2} className="d-flex align-items-center" style={{maxHeight: "90%", justifyContent: "space-between"}}>
                            <h5><strong className="text-success" key={product.id}>{"$" + product.price}</strong></h5>
                            <Button variant="" className="mb-2" onClick={() => {this.clearCart(index)}}><FontAwesomeIcon icon={faTrash} /></Button>
                        </Col>
                    </Row>)
                    }
                )
                }
                <hr className="my-4" style={{width: "100%", height: "1px", border: "none", backgroundColor: "gray"}}/>
                <Row className="my-2 checkoutItem shadow-sm d-flex align-items-center" style={{height: "100px", paddingTop: "1rem"}}>
                    <Col className={"d-flex justify-content-center mb-2"} md={3}>
                        您已經選擇了{this.state.totalCount}件商品
                    </Col>
                    {/* <Col md={3}></Col> */}
                    <Col md={7} className="text-right">
                        <div className="d-inline"><strong>
                            {translate("Total")}
                        </strong></div>
                    </Col>
                    <Col className="" md={2}>
                        <h5 className="d-inline"><strong className="text-success">{"$" + this.state.totalPrice}</strong></h5>
                        {/* <Button onClick={this.props.showSurvey} variant="primary" size="lg" className={"mx-1 px-4"}>
                            確認結帳
                        </Button> */}
                    </Col>
                </Row>
                {/* <Row className="d-flex justify-content-center">
                    <YouCaptchaApp captchaId={this.props.captchaId} onSuccess={() => {this.setState({captchaVerified: true})}}/>
                </Row> */}
                <Row className={"mt-4 mb-2 d-flex justify-content-center"}>
                    {/* <Button variant="secondary" size="lg" href="/" className={"mx-1 px-4"}>
                        {translate("Cancel")}
                    </Button> */}
                    {
                        this.state.captchaVerified && 
                        <Button onClick={this.props.showSurvey} variant="primary" size="lg" className={"mx-1 px-4"}>
                            {/* {translate("Proceed")} */}
                            確認結帳
                        </Button>
                    }
                </Row>
                <div className="footer1 my-4"></div>
            </Container>
        )
    }
}

export default withCookies(Checkout);