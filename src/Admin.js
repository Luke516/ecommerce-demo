import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import './App.css';
import YouCaptchaApp from './YouCaptchaApp'

import queryString from 'query-string';
import { Dropdown, Container, Row, Button, Col} from 'react-bootstrap';
import ProductCell from './ProductCell'
import ProductRow from './ProductRow'

class Admin extends React.Component {
  
    constructor(props) {
      super(props);
      const { cookies } = props;
      let settings = cookies.get('settings')? cookies.get('settings') : [];
      this.state = {
        settings,
        selectedCategory: null
      }
    }

    componentDidMount() {
        // this.props.toggleCategoryNav();
    }
  
    render (){
        return (
            <Container>
                <Row>
                    <Col xs={8} className="d-flex flex-row justify-content-between align-items-center   ">
                        <h2 className="mt-4">Admin</h2>
                        <Button variant="outline-info" style={{height: "fit-content"}}>Export</Button>
                    </Col>
                </Row>
                <hr style={{width: "90%", height: "1px", border: "none", backgroundColor: "gray"}}/>
                {
                    this.state.settings.map((element) => {
                        return (
                            <Row style={{border: "#17A2B8 1px solid", borderRadius: "1rem", padding: "1.2rem"}}>

                            </Row>
                        )
                    })
                }
                <Row style={{border: "#17A2B8 1px solid", borderRadius: "1rem", padding: "1.2rem"}}>
                    <Dropdown className="mx-1">
                        <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                            {this.state.selectedCategory || "Select Category"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mx-1">
                        <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                            {this.state.selectedCategory || "Select Category"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button variant="info" className="mx-1">
                        Add
                    </Button>
                </Row>
            </Container>
        )
    }

    addNewUser() {

    }

    addNewCategory() {

    }
}

export default withCookies(Admin);