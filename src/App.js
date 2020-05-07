import React from 'react';
import logo from './logo.svg';
import './App.css';
import data from './metadata_all.json';
import Home from './Home'

import { withCookies, Cookies } from 'react-cookie';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button, SplitButton, Dropdown, Badge,
  OverlayTrigger, Popover, ListGroup, InputGroup, Modal} from 'react-bootstrap';

class App extends React.Component {

  getInitState() {

  }

  constructor(props) {
    super(props);
    const { cookies } = props;
    console.log(cookies.get('products'))
    this.state = {
      navbarToggle: false,
      showLogin: false,
      productsInCart: cookies.get('products')? cookies.get('products') : []
    };
    this.addProductToCart = this.addProductToCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
    this.closeDialog = this.closeDialog.bind(this)
    console.log(data)
  }

  render (){
    return (
      <div className=''>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">
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
            <Form inline className="d-flex justify-content-center col-sm-10 mr-sm-4">
              <FormControl type="text" placeholder="Search" className="col-sm-10 mr-sm-2" />
              <Button variant="outline-info">Search</Button>
            </Form>
            <Nav.Link href="#home" onClick={() => {this.setState({showLogin: true})}}>Log In</Nav.Link>
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
                  <ListGroup.Item action onClick={this.clearCart}>
                    Clear All
                  </ListGroup.Item>
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
        <Navbar bg="light" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <SplitButton
                variant={''}
                title={`Men's Fashion`}>
                {
                  Object.keys(data["Men's Fashion"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton
                variant={''}
                title={`Women's Fashion`}>
                {
                  Object.keys(data["Women's Fashion"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton
                variant={''}
                title={`Home and Kitchen`}>
                {
                  Object.keys(data["Home and Kitchen"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton
                variant={''}
                title={`Electronics`}>
                {
                  Object.keys(data["Electronics"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton
                variant={''}
                title={`Beauty and Personal Care`}>
                {
                  Object.keys(data["Beauty and Personal Care"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton
                variant={''}
                title={`Luggage`}>
                {
                  Object.keys(data["Luggage"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
              <SplitButton
                variant={''}
                title={`Health and Household`}>
                {
                  Object.keys(data["Health and Household"]).map((item, i) => (
                    <Dropdown.Item key={i} eventKey={i}>{item}</Dropdown.Item>
                  ))
                }
              </SplitButton>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {/* <div className="full-window" style={{display: this.state.showLogin? "block": "none"}}>
            <Form className="login-form">
                <label htmlFor="basic-url">Username</label>                
                <InputGroup className="mb-3">
                    <FormControl
                    placeholder="Enter username..."
                    aria-label="username"
                    aria-describedby="basic-addon"
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
                <img
                className="d-block"
                src="captcha.png"
                alt="First slide"
                width="440px"
                />
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>   */}
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
              <img
              className="d-block"
              src="captcha.png"
              alt="First slide"
              width="440px"
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeDialog}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.closeDialog}>
              Login
            </Button>
          </Modal.Footer>
        </Modal>
        <Home addProductToCart={this.addProductToCart}/>
      </div>
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
}

export default withCookies(App)