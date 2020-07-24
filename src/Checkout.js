import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import './App.css';
import YouCaptchaApp from './YouCaptcha/YouCaptchaApp'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import queryString from 'query-string';
import { ListGroup, Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl, Breadcrumb } from 'react-bootstrap';
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
        totalPrice = totalPrice + parseFloat(product.displayPrice) * 1//product.count
        totalCount = totalCount + 1//product.count
      }
      this.state = {
        productsInCart: productsInCart,
        totalPrice: totalPrice,
        totalCount: totalCount,
        captchaVerified: true,
        allChecked: true
      }
      this.clearCart = this.clearCart.bind(this)
      this.toggleCheck = this.toggleCheck.bind(this)
      this.toggleAllChecks = this.toggleAllChecks.bind(this)
      this.showSurvey = this.showSurvey.bind(this)
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
          let productsInCart = this.state.productsInCart
          productsInCart.splice(index, 1)

          cookies.set('products', JSON.stringify(productsInCart))

          let totalPrice = 0.0;
          let totalCount = 0;
          for(let product of productsInCart){
            totalPrice = totalPrice + parseFloat(product.displayPrice) * 1//product.count
            totalCount = totalCount + 1//product.count
          }
          this.setState({
            productsInCart: productsInCart.slice(),
            totalPrice,
            totalCount
          })

          this.props.updateCart()
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
            totalCount += 1//productsInCart[id].count
            totalPrice = totalPrice + (productsInCart[id].displayPrice * productsInCart[id].count)
        }
        else{
            totalCount -= 1//productsInCart[id].count
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
        // console.log(this.state.productsInCart)
        let formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        let totalPrice = formatter.format(this.state.totalPrice).split('.')[0];
        return (
            <Container>
                <Row style={{height:"1.5rem"}}></Row>
                <Row>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">{translate("home")}</Breadcrumb.Item>
                    <Breadcrumb.Item href={""}>{"購物車"}</Breadcrumb.Item>
                </Breadcrumb>
                </Row>
                <Row>
                <h2 className="my-2">
                    {/* {translate("Checkout")} */}
                    購物車 (請選3~10件商品)
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
                            <img style={{maxWidth:"75px", maxHeight: "75px", display: "block"}} src={product.imageSourceUrl}></img>
                        </Col>
                        <Col md={3} className="align-items-center" style={{maxHeight: "90%", overflowY: "scroll"}}>
                            <strong key={product.id}>{product.name}</strong>
                        </Col>
                        <Col md={2} className={"d-flex justify-content-center align-items-center"} style={{maxHeight: "90%"}}>
                            <h4><strong className="text-success" key={product.id}>{formatter.format(product.displayPrice).split('.')[0]}</strong></h4>
                        </Col>
                        <Col md={2} className={"d-flex justify-content-center align-items-center"} style={{maxHeight: "90%"}}>
                            <h6>x {product.count}</h6>
                        </Col>
                        <Col md={2} className="d-flex align-items-center" style={{maxHeight: "90%", justifyContent: "space-between"}}>
                            <h4><strong className="text-success" key={product.id}>{formatter.format(product.displayPrice * product.count).split('.')[0]}</strong></h4>
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
                        <Col className={"d-flex justify-content-center mb--2"} md={4}>
                            <div>您已經選擇了{this.state.totalCount}件商品</div>
                        </Col>
                        <Col className={"d-flex justify-content-center mb--2"} md={4}>
                            {
                                (!this.props.userLogin) &&
                                <div className="captcha-error">
                                    <span className="text-danger">請先登入以完成結帳</span>
                                </div>
                            }
                            {
                                (this.state.totalCount < 3 || this.state.totalCount > 10) &&
                                <div className="captcha-error">
                                    <span className="text-danger">請選擇3~10件商品</span>
                                </div>
                            }
                        </Col>
                        {/* <Col md={3}></Col> */}
                        <Col md={2} className="text-right">
                            <div className="d-inline"><strong>
                                {translate("Total")}
                            </strong></div>
                        </Col>
                        <Col className="" md={2}>
                            <h3 className="d-inline"><strong className="text-success">{totalPrice}</strong></h3>
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
                        <Button onClick={this.showSurvey} variant="primary" size="lg" className={"mx-1 px-4"}>
                            {/* {translate("Proceed")} */}
                            確認結帳
                        </Button>
                    }
                </Row>
                <div className="footer1 my-4"></div>
            </Container>
        )
    }

    showSurvey() {
        if(this.props.userLogin && this.state.totalCount > 2 && this.state.totalCount <= 10){
            this.props.showSurvey()
        }
    }
}

export default withCookies(Checkout);