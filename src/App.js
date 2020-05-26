import React from 'react';
import logo from './logo.svg';
import './App.css';
import data from './metadata_all_with_detail_img_2_empty.json';
import productIdToCaptchaId from './productIdToCaptchaId.json'
import Home from './Home'
import RCG from 'react-captcha-generator';
import YouCaptchaApp from './YouCaptchaApp'
import Category from './Category'
import Checkout from './Checkout'
import ProductDetail from './ProductDetail'

import {
  BrowserRouter as Router,
  withRouter,
  Route,
  Link
} from 'react-router-dom'
import { withCookies, Cookies } from 'react-cookie';
import { Row, Nav, Navbar, NavDropdown, Form, FormControl, Button, SplitButton, Dropdown, Badge,
  OverlayTrigger, Popover, ListGroup, InputGroup, Modal} from 'react-bootstrap';

class App extends React.Component {

  getInitState() {

  }

  constructor(props) {
    super(props);
    const { cookies } = props;
    console.log(cookies.get('products'))

    let obj_keys = Object.keys(productIdToCaptchaId);
    let targetProductId = obj_keys[Math.floor(Math.random() *obj_keys.length)];
    let captchaIdList = productIdToCaptchaId[targetProductId]
    let captchaId = captchaIdList[Math.floor(Math.random() *captchaIdList.length)];
    // console.log(ran_key)
    this.state = {
      navbarToggle: false,
      showCategoryNav: true,
      showLogin: false,
      captchaVerified: false,
      targetProductId: targetProductId,
      captchaId: captchaId,
      captcha: "",
      username: cookies.get('username')? cookies.get('username') : "",
      userLogin: cookies.get('username')? cookies.get('username') != "" ? true: false: false,
      productsInCart: cookies.get('products')? cookies.get('products') : [],
      showProductDetail: false,
      curProduct: null
    };
    this.addProductToCart = this.addProductToCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
    this.closeDialog = this.closeDialog.bind(this)
    this.userLogin = this.userLogin.bind(this);
    this.userLogout = this.userLogout.bind(this);
    this.result = this.result.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closeProductDetailDialog = this.closeProductDetailDialog.bind(this);
    this.showProduct = this.showProduct.bind(this);
    this.toggleCategoryNav = this.toggleCategoryNav.bind(this);
    console.log(data)
  }

  render (){
    return (
      <Router>
      <div className=''>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/">
            <img
              alt=""
              src="logo512.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Easy Shop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Form inline className="d-flex justify-content-center col-sm-8 mr-sm-2">
              <FormControl type="text" placeholder="Search" className="col-sm-10 mr-sm-2" />
              <Button variant="outline-info">Search</Button>
            </Form>
            {
              this.state.userLogin ? 
              <>
                <Nav.Link href="#home">Welcome, {this.state.username}</Nav.Link>
                <Button variant="outline-primary" size="sm" href="/" onClick={this.userLogout}>Logout</Button>
              </>:
              <Nav.Link href="#home" onClick={() => {this.setState({showLogin: true})}}>Log In</Nav.Link>
            }
            <OverlayTrigger
              trigger="click"
              key={'bottom'}
              placement={'bottom'}
              overlay={
                <Popover id={`popover-positioned-${'bottom'}`}>
                  <ListGroup>
                  {
                    this.state.productsInCart.map(product => {
                        return (<ListGroup.Item>
                          <strong key={product.id}>{product.name}</strong>
                        </ListGroup.Item>)
                      }
                    )
                  }
                  {
                    this.state.productsInCart.length > 0?
                    <>
                      <ListGroup.Item action onClick={this.clearCart}>
                        Clear All
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <a href="Checkout"><strong>Checkout</strong></a>
                      </ListGroup.Item>
                    </>:
                    <ListGroup.Item>
                      Your Cart Is Empty
                    </ListGroup.Item>
                  }
                  </ListGroup>
                </Popover>
              }
            >
              <Button variant="">Cart
                <Badge variant="secondary">{this.state.productsInCart.length}</Badge>
              </Button>
            </OverlayTrigger>
            {/* <Nav.Link href="#link">Cart <Badge variant="secondary">{this.state.productsInCart.length}</Badge>
            </Nav.Link> */}
          </Navbar.Collapse>
        </Navbar>
        { this.state.showCategoryNav &&
        <Navbar bg="light" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <SplitButton tag={Link} href="Men's Fashion"
                variant={''}
                title={`Men's Fashion`}>
                {
                  Object.keys(data["Men's Fashion"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Men's Fashion?subCategory=" + item} onClick={()=>{this.setState({selectedCategory: item})}}>
                      {item}
                    </Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton tag={Link} href="Women's Fashion"
                variant={''}
                title={`Women's Fashion`}>
                {
                  Object.keys(data["Women's Fashion"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Women's Fashion?subCategory=" + item}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton tag={Link} href="Home and Kitchen"
                variant={''}
                title={`Home and Kitchen`}>
                {
                  Object.keys(data["Home and Kitchen"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Home and Kitchen?subCategory=" + item}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton tag={Link} href="Electronics"
                variant={''}
                title={`Electronics`}>
                {
                  Object.keys(data["Electronics"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Electronics?subCategory=" + item}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton tag={Link} href="Beauty and Personal Care"
                variant={''}
                title={`Beauty and Personal Care`}>
                {
                  Object.keys(data["Beauty and Personal Care"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Beauty and Personal Care?subCategory=" + item}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton tag={Link} href="Luggage"
                variant={''}
                title={`Luggage`}>
                {
                  Object.keys(data["Luggage"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Luggage?subCategory=" + item}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton tag={Link} href="Health and Household"
                variant={''}
                title={`Health and Household`}>
                {
                  Object.keys(data["Health and Household"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i} href={"Health and Household?subCategory=" + item}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        }
        <Modal show={this.state.showLogin} onHide={this.closeDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Login Your Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form >
              <label htmlFor="basic-url">Username</label>                
              <InputGroup className="mb-3">
                  <FormControl 
                  placeholder="Enter username..."
                  aria-label="username"
                  aria-describedby="basic-addon"
                  onChange={this.handleUserNameChange.bind(this)}
                  />
              </InputGroup>
              <label htmlFor="basic-url">Password</label>                
              <InputGroup className="mb-3">
                  <FormControl
                  placeholder="Enter password..."
                  aria-label="password"
                  aria-describedby="basic-addon2"
                  />
              </InputGroup>
              
              {/* <RCG
                result={this.result} // Callback function with code
              /> */}
              {/* <form onSubmit={this.handleClick}>
                <input type='text' className={'xxx'} ref={ref => this.captchaEnter = ref} />
                <input type='submit' />
              </form> */}
              <YouCaptchaApp captchaId={this.state.captchaId} onSuccess={() => {this.setState({captchaVerified: true})}}/>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeDialog}>
              Cancel
            </Button>
            <Button variant="primary" style={{display: this.state.captchaVerified? "block": "none"}} onClick={this.userLogin}>
              Login
            </Button>
          </Modal.Footer>
        </Modal>
        {/* <Modal dialogClassName="modal-90w" show={this.state.showProductDetail} onHide={this.closeProductDetailDialog}>
          <Modal.Body style={{ overflowY: 'auto'}}>
            <Row>
              <ProductDetail product={this.state.curProduct} addProductToCart={this.addProductToCart}/>
            </Row>
          </Modal.Body>
        </Modal> */}
        <Route exact path="/" render={() => (
            <Home targetProductId={this.state.targetProductId} addProductToCart={this.addProductToCart} showProduct={this.showProduct}/>
        )}/>
        <Route exact path="/Men's Fashion" render={(location) => (
            <Category name="Men's Fashion" data={data["Men's Fashion"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct} location={location.location}/>
        )}/>
        <Route exact path="/Women's Fashion" render={(location) => (
            <Category name="Women's Fashion" data={data["Women's Fashion"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location}/>
        )}/>
        <Route exact path="/Home and Kitchen" render={(location) => (
            <Category name="Home and Kitchen" data={data["Home and Kitchen"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location}/>
        )}/>
        <Route exact path="/Electronics" render={(location) => (
            <Category name="Electronics" data={data["Electronics"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location}/>
        )}/>
        <Route exact path="/Beauty and Personal Care" render={(location) => (
            <Category name="Beauty and Personal Care" data={data["Beauty and Personal Care"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location}/>
        )}/>
        <Route exact path="/Luggage" render={(location) => (
            <Category name="Luggage" data={data["Luggage"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location}/>
        )}/>
        <Route exact path="/Health and Household" render={(location) => (
            <Category name="Health and Household" data={data["Health and Household"]} addProductToCart={this.addProductToCart} showProduct={this.showProduct}  location={location.location}/>
        )}/>
        <Route exact path="/Checkout" render={(location) => (
            <Checkout captchaId={this.state.captchaId} toggleCategoryNav={this.toggleCategoryNav}  location={location.location}/>
        )}/>
        <Route exact path="/Product" render={(location) => (
            this.state.curProduct?
            <Row>
              <ProductDetail product={this.state.curProduct} addProductToCart={this.addProductToCart}/>
            </Row>
            :<Home targetProductId={this.state.targetProductId} addProductToCart={this.addProductToCart} showProduct={this.showProduct}/>
        )}/>
      </div>
      </Router>
    );
  }

  handleNavbarToggle() {
    this.setState((prevState, props) => ({
        navbarToggle: !prevState.navbarToggle
    }));
  }

  addProductToCart(product) {
    console.log("add to cart:")
    console.log(product)
    const { cookies } = this.props;
    this.state.productsInCart.push(product)
    cookies.set('products', JSON.stringify(this.state.productsInCart))
  }

  clearCart() {
    const { cookies } = this.props;
    this.setState({
      productsInCart: []
    }, ()=>{
      cookies.set('products', JSON.stringify(this.state.productsInCart))
    })
  }

  closeDialog() {
    this.setState({
      showLogin: false
    })
  }

  showProduct(product) {
    this.setState({
      curProduct: product,
      showProductDetail: true
    })

  }

  closeProductDetailDialog() {
    this.setState({
      showProductDetail: false
    })
  }

  userLogin() {
    const { cookies } = this.props;
    if (this.state.username != ""){
      cookies.set('username', this.state.username)
      this.setState({
        showLogin: false,
        userLogin: true
      })
    }
  }

  userLogout() {
    const { cookies } = this.props;
    
    cookies.set('username', "")
    this.setState({
      showLogin: false,
      userLogin: false,
      username: ""
    })
  }

  handleUserNameChange(e) {
    console.log(e);
    const text = e.target.value
    this.setState({username: text});
    // if (text) {
    //     this.setState({inputDanger: false});
    // }
  }

  result(text) {
    this.setState({
      captcha: text
    })
  }

  handleClick(e) {
    e.preventDefault();
    if(this.state.captcha === this.captchaEnter.value){
      console.log("success")
      this.setState({captchaVerified: true})
    }
  }

  toggleCategoryNav() {
    this.setState({
      showCategoryNav: !this.state.showCategoryNav
    })
  }
}

export default withCookies(App)