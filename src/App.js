import React from 'react';
import logo from './logo.svg';
import './App.css';
import data from './metadata_all.json';
import Home from './Home'

import { Nav, Navbar, NavDropdown, Form, FormControl, Button, SplitButton, Dropdown, Badge } from 'react-bootstrap';

export default class App extends React.Component {

  getInitState() {

  }

  constructor(props) {
    super(props);
    this.state = {
      navbarToggle: false
    };

    this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
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
            <Nav.Link href="#home">Log In</Nav.Link>
            <Nav.Link href="#link">Cart <Badge variant="secondary">0</Badge>
            </Nav.Link>
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
        <Home/>
      </div>
    );
  }

  handleNavbarToggle() {
    this.setState((prevState, props) => ({
        navbarToggle: !prevState.navbarToggle
    }));
  }
}
