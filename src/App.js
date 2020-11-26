import React from 'react';
import './App.css';
import data from './data/metadata_all_with_detail_img_3_empty.json';
import productIdToCaptchaId from './data/productIdToCaptchaId.json'
import flatData from './data/flat_products_list_zh.json';
import accountsData from './data/accounts.json';

import LoginModal from './LoginModal'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import { withCookies, Cookies } from 'react-cookie';
import { Col, Alert, Container, Row, Nav, Navbar, Button, SplitButton, Dropdown, Badge,
   Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faShoppingCart, faCheck } from '@fortawesome/free-solid-svg-icons'

class App extends React.Component {

  constructor(props) {
    super(props);
    const { cookies } = props;

    document.title = 'KocoShop';

    let testId = cookies.get('testId')? cookies.get('testId') : "1";
    let curSetting = cookies.get('username')? cookies.get('username') : "";
    
    let targetCategory = "Luggage"
    let targetProductId = "B06ZYHM4JY"
    let controlProductId = "B00BMJSJG0"
    let captchaType = "YouCaptcha"
    if(testId == "1"){
      targetCategory = "Luggage"
      targetProductId = "B06ZYHM4JY"
      controlProductId = "B00BMJSJG0"
      captchaType = "YouCaptcha"
    }
    if(testId == "2"){
      targetCategory = "Electronics"
      targetProductId = "B015CH1PJU"
      controlProductId = "B079GXWSWG"
      captchaType = "ReCaptcha"
    }
    if(testId == "3"){
      targetCategory = "Men's Fashion"
      targetProductId = "B07M9QXCP7"
      controlProductId = "B07HXZH7WD"
      captchaType = "textCaptcha"
    }

    let captchaIdList = productIdToCaptchaId[targetProductId]
    let captchaId = captchaIdList[Math.floor(Math.random() *captchaIdList.length)];

    this.state = {
      navbarToggle: false,
      showCategoryNav: true,
      showLogin: false,
      captchaVerified: false,
      targetCategory,
      targetProductId,
      controlProductId,
      captchaId,
      captchaIdList,
      captcha: "",
      username: cookies.get('username')? cookies.get('username') : "",
      password: "",
      usernameValid: true,
      passwordValid: true,
      userLogin: cookies.get('username')? cookies.get('username') != "" ? true: false: false,
      productsInCart: cookies.get('products')? cookies.get('products') : [],
      showProductDetail: false,
      curProduct: null,
      showSuccessDialog: -1,
      captchaType,
      redirect: cookies.get('username')? cookies.get('username') != "" ? false: true: true,
      showAd: false,
      wrongPassword: false,
      testId
    };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
    this.closeDialog = this.closeDialog.bind(this)
    this.userLogin = this.userLogin.bind(this);
    this.userLogout = this.userLogout.bind(this);
    this.result = this.result.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closeProductDetailDialog = this.closeProductDetailDialog.bind(this);
    this.showProduct = this.showProduct.bind(this);
    this.toggleCategoryNav = this.toggleCategoryNav.bind(this);
    this.addBrowsedProducts = this.addBrowsedProducts.bind(this);
    this.nextTest = this.nextTest.bind(this);
    this.captchaSuccess = this.captchaSuccess.bind(this);
    this.updateCart = this.updateCart.bind(this);
    this.showAd = this.showAd.bind(this);
    this.closeAd = this.closeAd.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.validateAccount = this.validateAccount.bind(this);
  }

  componentDidMount() {
    if(!this.state.userLogin){
      this.setState({
        showLogin: true
      })
    }
  }

  render (){
    const targetProductData = flatData[this.state.targetProductId]
    return (
      <div>
        <Alert variant="success" className="shadow-sm fadeOut" style={{position: "fixed", width: "40%", left: "30%", zIndex: "1200", textAlign: "center", display: this.state.showSuccessDialog > 0? "block" : "none"}}>
          <FontAwesomeIcon className="mx-2" icon={faCheck}/>
          已將<span className="mx-1">{this.state.showSuccessDialog}</span>件商品加入購物車
        </Alert>
        <LoginModal showLogin={this.state.showLogin} closeDialog={this.closeDialog} showDialog={this.showDialog} 
          captchaVerified={this.state.captchaVerified} username={this.state.username} password={this.state.password}
          handleUserNameChange={this.handleUserNameChange} handlePasswordChange={this.handlePasswordChange}
          usernameValid={this.state.usernameValid} passwordValid={this.state.passwordValid}
          captchaType={this.state.captchaType} result={this.result} handleClick={this.handleClick}
          captcha={this.state.captcha} captchaId={this.state.captchaId} captchaSuccess={this.captchaSuccess}
          captchaIdList={this.state.captchaIdList} userLogin={this.userLogin} wrongPassword={this.state.wrongPassword}
          />
          <Modal dialogClassName="" show={this.state.showAd} onHide={this.closeAd} centered>
            <Modal.Header closeButton>
            <Modal.Title>
              
            </Modal.Title>
          </Modal.Header>
            <Modal.Body className="d-flex flex-column" style={{ overflowY: 'auto', height: "400px"}}>
              <div className="d-flex justify-content-center align-items-center my-2" style={{height: "240px"}}>
                <div className="d-flex justify-content-center" style={{maxHeight:"240px", maxWidth:"240px", overflow: "hidden"}}>
                  <img src={targetProductData.url} style={{maxWidth: "240px", maxHeight:"240px", width: "auto", height: "auto"}} />
                </div>
              </div>
              <div>
                <h4>{targetProductData.name}</h4>
                <div className="d-flex flex-row justify-content-center mt-3 mb-1">
                  <Button size="lg" className="mx-2 w-25" href={"http://localhost:3000/Product?p=" + decodeURIComponent(targetProductData.url).split("/").pop().substr(0,10)}>去看看</Button>
                  <Button size="lg" className="mx-2 w-25" variant="secondary" onClick={this.closeAd}>略過</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
    );
  }

  handleNavbarToggle() {
    this.setState((prevState, props) => ({
        navbarToggle: !prevState.navbarToggle
    }));
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
      this.setState({
        productsInCart
      }, ()=>{
        cookies.set('products', JSON.stringify(this.state.productsInCart))
      })
    }
  }

  updateCart() {
    const { cookies } = this.props;
    let productsInCart = cookies.get('products')? cookies.get('products') : [];
    this.setState({
      productsInCart
    });
  }

  showDialog() {
    this.setState({
      showLogin: true
    })
  }

  closeDialog() {
    this.setState({
      showLogin: false,
      captchaVerified: false,
      usernameValid: true,
      passwordValid: true,
      username: "",
      password: ""
    },()=>{
      // if(this.state.userLogin){
      //   window.location.href = this.state.targetCategory;
      // }
    })
  }

  showProduct(product) {
    console.log(product)
    if(!product){
      product = {
        "id": ""
      }
    }
    this.setState({
      curProduct: product,
      showProductDetail: true
    })

  }

  addBrowsedProducts() {

  }

  nextTest() {
    const { cookies } = this.props;
    this.userLogout()
    let testId = cookies.get('testId')? cookies.get('testId') : "1";
    if(testId == "1"){
        testId = "2"
    }
    else if(testId == "2"){
        testId = "3"
    }
    else if(testId == "3"){
        testId = "1"
    }
    cookies.set('testId', testId)
    cookies.set('browsed', [])
    cookies.set('products', [])
    
    let targetCategory = "Luggage"
    let targetProductId = "B06ZYHM4JY"
    let controlProductId = "B00BMJSJG0"
    let captchaType = "YouCaptcha"
    if(testId == "1"){
      targetCategory = "Luggage"
      targetProductId = "B06ZYHM4JY"
      controlProductId = "B00BMJSJG0"
      captchaType = "YouCaptcha"
    }
    if(testId == "2"){
      targetCategory = "Electronics"
      targetProductId = "B015CH1PJU"
      controlProductId = "B079GXWSWG"
      captchaType = "ReCaptcha"
    }
    if(testId == "3"){
      targetCategory = "Men's Fashion"
      targetProductId = "B07M9QXCP7"
      controlProductId = "B07HXZH7WD"
      captchaType = "textCaptcha"
    }

    let captchaIdList = productIdToCaptchaId[targetProductId]
    let captchaId = captchaIdList[Math.floor(Math.random() *captchaIdList.length)];

    this.setState({
      testId,
      targetCategory,
      targetProductId,
      controlProductId,
      captchaType,
      captchaId,
      captchaIdList,
      navbarToggle: false,
      redirect: true,
      wrongPassword: false,
      showLogin: true
    })
  }

  closeProductDetailDialog() {
    this.setState({
      showProductDetail: false
    })
  }

  captchaSuccess(captchaPass = false) {
    if(this.state.username == "" || this.state.password == ""){
      this.setState({
        usernameValid: this.state.username == ""? false: true,
        passwordValid: this.state.password == ""? false: true
      })
      return false
    }
    else {
      this.setState({
        usernameValid: true,
        passwordValid: true,
      })
    }
    if(captchaPass){
      if(this.state.captchaType == "YouCaptcha"){
        if(this.userLogin()){
          this.setState({
            captchaVerified: true
          })
        }
      }
      else{
        this.setState({
          captchaVerified: true
        })
      }
    }
    return true
  }

  userLogin() {
    const { cookies } = this.props;
    if(!this.validateAccount(this.state.username, this.state.password)){
      console.log("not valid account")
      this.closeDialog()
      this.setState({
        wrongPassword: true
      })
      setTimeout(this.showDialog, 500)
      return false
    }

    if (this.state.username != ""){
      cookies.set('username', this.state.username)
      this.setState({
        showLogin: this.state.captchaType == "YouCaptcha"? true: false,
        userLogin: true,
        redirect: false
      })
      return true
    }
  }

  userLogout() {
    const { cookies } = this.props;

    cookies.set('browsed', [])
    cookies.set('username', "")

    this.setState({
      showLogin: false,
      userLogin: false,
      username: "",
      redirect: true
    })
  }

  handleUserNameChange(e) {
    console.log(e);
    const text = e.target.value
    this.setState({
      username: text,
      wrongPassword: false
    });
  }

  handlePasswordChange(e) {
    console.log(e);
    const text = e.target.value
    this.setState({
      password: text,
      wrongPassword: false
    });
  }

  result(text) {
    this.setState({
      captcha: text
    })
  }

  handleClick(e) {
    e.preventDefault();
    this.captchaSuccess(true)
  }

  toggleCategoryNav() {
    this.setState({
      showCategoryNav: !this.state.showCategoryNav
    })
  }

  showAd() {
    this.setState({
      showAd: true
    })
  }

  closeAd(){
    this.setState({
      showAd: false
    })
  }

  validateAccount(username, password) {
    if(accountsData[username]){
      if(accountsData[username] == password){
        return true
      }
    }
    return false
  }
}

export default withCookies(App)