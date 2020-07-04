import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import './App.css';
import YouCaptchaApp from './YouCaptcha/YouCaptchaApp'
import data from './data/metadata_all_with_detail_img_3_empty.json';

import queryString from 'query-string';
import { Dropdown, Container, Row, Button, Col} from 'react-bootstrap';
import ProductCell from './ProductCell'
import ProductRow from './ProductRow'

class Admin extends React.Component {
  
    constructor(props) {
        super(props);
        const { cookies } = props;
        let settings = cookies.get('settings')? cookies.get('settings') : [];
        let userCount = settings.length > 0 ? settings.length : 0;
        this.state = {
            curUserId: userCount == 0? -1: 0,
            settings,
            userCount,
            selectedCategory: null,
            editing: false
        }

        this.addNewUser = this.addNewUser.bind(this);
        this.nextUser = this.nextUser.bind(this);
        this.prevUser = this.prevUser.bind(this);
        this.updateUserSetting = this.updateUserSetting.bind(this);
    }

    componentDidMount() {
        // this.props.toggleCategoryNav();
    }
  
    render (){
        let curUserData = null;
        if(this.state.curUserId >= 0){
            curUserData = this.state.settings[this.state.curUserId];
        }
        let categoryDropdown = (
            <Dropdown className="mx-1">
                <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                    {this.state.selectedCategory || "Select Category"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Man’s Fashion</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Women’s Fashion</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Home and Kitchen</Dropdown.Item>
                    <Dropdown.Item href="#/action-4">Luggage</Dropdown.Item>
                    <Dropdown.Item href="#/action-5">Electronic</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
        let subCategorys = {}
        for(let category of ["Man’s Fashion", "Women’s Fashion", "Home and Kitchen", "Luggage", "Electronic"]){
            // subCategorys[category] = Object.keys(data[category]);
            subCategorys[category] = (
                <Dropdown className="mx-1">
                    <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                        {this.state.selectedCategory || "Select Category"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    
                    </Dropdown.Menu>
                </Dropdown>
            );
        }

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
                    curUserData != null?
                    <Row style={{border: "#17A2B8 1px solid", borderRadius: "1rem", padding: "1.2rem"}}>
                        <h4>使用者{this.state.curUserId}</h4>
                        <Button className="mx-3" variant="outline-info" size="sm" onClick={this.updateUserSetting}>
                            Save
                        </Button>
                        {curUserData.map((element) => {
                            return(
                                <Col className="my-1" lg={12}>
                                    <p><strong>實驗</strong>{element.type}</p>
                                    {categoryDropdown}
                                </Col>
                            );
                        })}
                    </Row>:
                    <Row>
                        無使用者資料
                    </Row>
                }
                {/* <Row style={{border: "#17A2B8 1px solid", borderRadius: "1rem", padding: "1.2rem"}}>
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
                </Row> */}
                <Row className="my-2">
                    <Button variant="info" className="mx-1" onClick={this.prevUser}>
                        Prev
                    </Button>
                    <Button variant="warning" className="mx-1" onClick={this.addNewUser}>
                        Add User
                    </Button>
                    <Button variant="info" className="mx-1" onClick={this.nextUser}>
                        Next
                    </Button>
                </Row>
            </Container>
        )
    }

    addNewUser() {
        let newUserData = [
            {
                "type": "YouCaptcha",
                "category" : "All",
                "subCategory": "All",
                "productId": "Random"
            },
            {
                "type": "TextCaptcha",
                "category" : "All",
                "subCategory": "All",
                "productId": "Random"
            },
            {
                "type": "ReCaptcha",
                "category" : "All",
                "subCategory": "All",
                "productId": "Random"
            }
        ]
        let usersData = this.state.settings
        usersData.push(newUserData)
        this.setState({
            curUserId: this.state.settings.length - 1,
            settings: usersData
        })
    }

    nextUser() {
        if(this.state.curUserId >= this.state.settings.length - 1){
            return;
        }
        this.setState({
            curUserId: this.state.curUserId + 1
        })
    }

    prevUser() {
        if(this.state.curUserId <= 0){
            return;
        }
        this.setState({
            curUserId: this.state.curUserId - 1
        })
    }

    updateUserSetting() {
        let {cookies} = this.props
        cookies.set("settings", this.state.settings)
    }

    addNewCategory() {

    }
}

export default withCookies(Admin);