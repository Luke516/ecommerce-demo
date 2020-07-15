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
        product.displayPrice = price
        product.checked = true
        totalPrice = totalPrice + parseFloat(product.displayPrice) * product.count
        totalCount = totalCount + product.count
      }
      this.state = {
        productsInCart: productsInCart,
        totalPrice: totalPrice,
        totalCount: totalCount,
        captchaVerified: true,
        allChecked: true
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
            productsInCart: [],
            totalPrice: 0.0,
            totalCount: 0
          }, ()=>{
            cookies.set('products', JSON.stringify(this.state.productsInCart))
          })
        }
        else {
          let productsInCart = cookies.get('products')? cookies.get('products') : [];
          productsInCart.splice(index, 1)

          cookies.set('products', JSON.stringify(productsInCart))
          this.props.updateCart()

          let totalPrice = 0.0;
          let totalCount = 0;
          for(let product of productsInCart){
            totalPrice = totalPrice + parseFloat(product.displayPrice) * product.count
            totalCount = totalCount + product.count
          }
          this.setState({
            productsInCart: productsInCart.slice(),
            totalPrice,
            totalCount
          })
        }
    }

    toggleAllChecks() {
        let allChecked = true
        for(let product of this.state.productsInCart){
            if(!product.checked){
                allChecked = false
                break
            }
        }
        let productsInCart = this.state.productsInCart
        let totalCount = 0
        let totalPrice = 0.0
        if(allChecked){
            for(let i=0; i<productsInCart.length; i++){
                productsInCart[i].checked = false
            }
        }else{
            for(let i=0; i<productsInCart.length; i++){
                productsInCart[i].checked = true
                totalCount++
                totalPrice += productsInCart[i].displayPrice * productsInCart[i].count
            }
        }
        this.setState({
            productsInCart: productsInCart.slice(),
            totalCount,
            totalPrice,
            allChecked: !allChecked
        })
    }

    toggleCheck(id){
        let productsInCart = this.state.productsInCart
        productsInCart[id].checked = !productsInCart[id].checked
        let totalCount = this.state.totalCount
        let totalPrice = this.state.totalPrice
        if(productsInCart[id].checked){
            totalCount += productsInCart[id].count
            totalPrice = totalPrice + (productsInCart[id].displayPrice * productsInCart[id].count)
        }
        else{
            totalCount -= productsInCart[id].count
            totalPrice = totalPrice - (productsInCart[id].displayPrice * productsInCart[id].count)
        }

        let allChecked = true
        for(let product of this.state.productsInCart){
            if(!product.checked){
                allChecked = false
                break
            }
        }

        this.setState({
            productsInCart: productsInCart.slice(),
            totalCount,
            totalPrice,
            allChecked
        })
    }
  
    getCountAndPrice(){
        let selectedCount = 0
        let totalPrice = 0.0;
        for(let productId in this.state.productChecked){
            if(this.state.productChecked[productId]){
                selectedCount++
            }
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
                        <input type="checkbox" className="normal-checkbox" checked={this.state.allChecked} onChange={this.toggleAllChecks}></input>
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
            <div className="checkoutDiv shadow-sm">
            {
                this.state.productsInCart.map((product, index) => {
                    
                    return (
                    <>
                    <Row key={product.id} className="my-3 checkoutItem">
                        <Col md={1} className={"d-flex align-items-center justify-content-center"} style={{maxHeight: "90%"}}>
                            <input type="checkbox" className="normal-checkbox" checked={this.state.productsInCart[index].checked} onChange={()=>{this.toggleCheck(index)}}></input>
                        </Col>
                        <Col md={2} className={"d-flex align-items-center  justify-content-center"} style={{maxHeight: "90%"}}>
                            <img style={{maxWidth:"90%", maxHeight: "90%"}} src={product.imageSourceUrl}></img>
                        </Col>
                        <Col md={3} className="align-items-center" style={{maxHeight: "90%"}}>
                            <strong key={product.id}>{product.name}</strong>
                        </Col>
                        <Col md={2} className={"d-flex justify-content-center align-items-center"} style={{maxHeight: "90%"}}>
                            <h5><strong className="text-success" key={product.id}>{"$" + product.displayPrice}</strong></h5>
                        </Col>
                        <Col md={2} className={"d-flex justify-content-center align-items-center"} style={{maxHeight: "90%"}}>
                            <h6>x {product.count}</h6>
                        </Col>
                        <Col md={2} className="d-flex align-items-center" style={{maxHeight: "90%", justifyContent: "space-between"}}>
                            <h5><strong className="text-success" key={product.id}>{"$" + (product.displayPrice * product.count)}</strong></h5>
                            <Button variant="" className="mb-2" onClick={() => {this.clearCart(index)}}><FontAwesomeIcon icon={faTrash} /></Button>
                        </Col>
                    </Row>
                    {index < this.state.productsInCart.length-1 && <hr className="my--4" style={{width: "100%", height: "1px", border: "none", backgroundColor: "rgba(0, 0, 0, 0.125)"}}/>}
                    </>
                    )}
                )
                }
                </div>
                {/* <hr className="my-4" style={{width: "100%", height: "1px", border: "none", backgroundColor: "gray"}}/> */}
                <div className="mt-4 mb-2 checkoutDiv shadow-sm">
                    <Row className="checkoutItem d-flex align-items-center" style={{height: "80px", paddingTop: "0rem"}}>
                        <Col className={"d-flex justify-content-center mb--2"} md={3}>
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
                        </Col>
                    </Row>
                </div>
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