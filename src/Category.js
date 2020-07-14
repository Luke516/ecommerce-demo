import React from 'react';
import './App.css';
import flatData from './data/flat_products_list_zh.json';

import TrackVisibility from 'react-on-screen';
import queryString from 'query-string';
import { Container, Row, Tabs, Tab, Nav, Dropdown, Col } from 'react-bootstrap';
import ProductCell from './ProductCell'
import ProductRow from './ProductRow'
import {translate} from './utils/translate'

class Category extends React.Component {

    getRandomProduct(data) {
        let obj_keys = Object.keys(data);
        let ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
        let selected_object = data[ran_key];
        for(let i=0; i<100; i++){
            if(typeof selected_object == "undefined"){
                ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
                selected_object = data[ran_key];
            }
            else if (Object.keys(selected_object).length < 1){
                ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
                selected_object = data[ran_key];
            }
            else{
                break;
            }
        }
        if (typeof selected_object == "undefined"){
            return {
                id: '',
                name: 'unknown',
                category: []
            }
        }
        if(selected_object.hasOwnProperty('name')){
            selected_object['id'] = ran_key
            selected_object['category'] = []
            return selected_object
        }
        else {
            let return_object = this.getRandomProduct(selected_object)
            return_object['category'].unshift(ran_key)
            return return_object
        }
    }

    getAllSubCategoryData(data, targetSubCategory) {
        let obj_keys = Object.keys(data);
        let allSubCategoryData = []

        for(let key of obj_keys){
            let selected_data = data[key];
            if (typeof selected_data == "undefined"){
            }
            else if(!selected_data.hasOwnProperty('name')){
                console.log(key)
                console.log(targetSubCategory)
                if (key == targetSubCategory){
                    continue
                }
                allSubCategoryData.push({
                    displayName: key,
                    name: this.props.name + '/' + key,
                    data: selected_data
                })
            }
        }
        return allSubCategoryData
    }

    getInitState() {
        let targetProductData = flatData[this.props.targetProductId]
        let targetCategory = decodeURIComponent(targetProductData.url).split('/')[4];
        let targetSubCategory = decodeURIComponent(targetProductData.url).split('/')[5];
        let subCategoryList = this.getAllSubCategoryData(this.props.data, targetSubCategory);
        console.log(targetSubCategory)
        let targetSubCategoryData = this.props.data[targetSubCategory]
        targetSubCategoryData = {
            displayName: targetSubCategory,
            name: this.props.name + '/' + targetSubCategory,
            data: targetSubCategoryData
        }
        if(targetCategory != this.props.name){
            targetSubCategoryData = null
        }else{
            subCategoryList.unshift(targetSubCategoryData)
        }

        subCategoryList.unshift({
            displayName: "all",
            name: this.props.name + '/' + "all",
            data: this.props.data
        })
        
        for(let c of subCategoryList){
            console.log(c.name)
        }
        return {
            targetSubCategoryData,
            subCategoryList
        }
    }
  
    constructor(props) {
      super(props);
      let params = queryString.parse(this.props.location.search)
      console.log(params)
      this.getInitState = this.getInitState.bind(this);
      this.getRandomProduct = this.getRandomProduct.bind(this)
      this.getAllSubCategoryData = this.getAllSubCategoryData.bind(this)
      this.state = {
        ...this.getInitState(),
        subCategory: params.subCategory
      }
    }
  
    render (){
        if(!this.state.subCategory){
            return (
                <Container>
                <div className="d-flex align-items-center">
                    <div className="w-50">
                        <h2 className="mb-4 mt-4">{translate(this.props.name)}</h2>
                    </div>
                    {/* <hr/> */}
                </div>
                <Tab.Container defaultActiveKey={this.state.subCategoryList[0].name} id="uncontrolled-tab-example">
                <Nav variant="tabs" className="flex--column">
                    <Col md={10} style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                {
                    this.state.subCategoryList.map(subCategoryData => {
                        return (
                        <Nav.Item key={subCategoryData.name} title={translate(subCategoryData.name.split('/')[1])} >
                            <Nav.Link className={" btnq btnq-outline-primary"} eventKey={subCategoryData.name}>{translate(subCategoryData.name.split('/')[1])}</Nav.Link>
                        </Nav.Item>
                        )
                    })
                }
                </Col>
                    <Dropdown style={{}/*{display: "flex", flexGrow: "1", justifyContent: "flex-end"}*/}>
                        <Dropdown.Toggle variant="" id="dropdown-basic" style={{color: "#495057"}}>
                            <span className="mr-2">排序依據：推薦</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item style={{color: "#495057"}}>
                                <span className="text--secondary">推薦</span>
                            </Dropdown.Item>
                            <Dropdown.Item style={{color: "#495057"}}>
                                <span className="text--secondary">人氣（高到低）</span>
                            </Dropdown.Item>
                            <Dropdown.Item style={{color: "#495057"}}>
                                <span className="text--secondary">人氣（低到高）</span>
                            </Dropdown.Item>
                            <Dropdown.Item style={{color: "#495057"}}>
                                <span className="text--secondary">價格（高到低）</span>
                            </Dropdown.Item>
                            <Dropdown.Item style={{color: "#495057"}}>
                                <span className="text--secondary">價格（低到高）</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>

                <Row className="mt-4 d-flex align-items-center">
                    <Col md={12}>
                        
                        {/* <Dropdown>
                            <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                                Dropdown Button
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown> */}
                        {/* <Nav className="align-items-center" variant="pills" defaultActiveKey="/home">
                            排序依據
                            <Nav.Item>
                                <Nav.Link href="/home">Active</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="link-1">Option 2</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="disabled" disabled>
                                Disabled
                                </Nav.Link>
                            </Nav.Item>
                        </Nav> */}
                    </Col>
                </Row>

                <Tab.Content>
                {
                    this.state.subCategoryList.map((subCategoryData) => {
                        return (
                            this.state.targetSubCategoryData && subCategoryData.name == this.state.targetSubCategoryData.name?
                            <Tab.Pane key={this.state.targetSubCategoryData.name} eventKey={this.state.targetSubCategoryData.name} title={translate(this.state.targetSubCategoryData.name.split('/')[1])} >
                                <TrackVisibility partialVisibility>
                                    <ProductRow name={this.state.targetSubCategoryData.name} data={this.state.targetSubCategoryData.data} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} target targetProductId={this.props.targetProductId}/>
                                </TrackVisibility>
                            </Tab.Pane>:
                            this.state.targetSubCategoryData && subCategoryData.displayName == "all"?
                            <Tab.Pane key={subCategoryData.name} eventKey={subCategoryData.name} title={translate(subCategoryData.name.split('/')[1])} >
                                <ProductRow name={subCategoryData.name} data={subCategoryData.data} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} target targetProductId={this.props.targetProductId} controlProductId={this.props.controlProductId}/>
                            </Tab.Pane>:
                            <Tab.Pane key={subCategoryData.name} eventKey={subCategoryData.name} title={translate(subCategoryData.name.split('/')[1])} >
                                <ProductRow name={subCategoryData.name} data={subCategoryData.data} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                            </Tab.Pane>
                        )
                    })
                }
                </Tab.Content>
                </Tab.Container>
                <div className="footer1 my-4"></div>
                </Container>
            );
        }else{
            for(let subCategoryData of this.state.subCategoryList){
                if(subCategoryData.name.includes(this.props.name + '/' + this.state.subCategory)){
                    return(
                        <Container>
                            <div>
                                <h2 className="mb-4 mt-4">{translate(subCategoryData.name.split('/')[0])} / {translate(subCategoryData.name.split('/')[1])}</h2>
                                <hr/>
                            </div>
                            <ProductRow key={subCategoryData.name} name={subCategoryData.name} data={subCategoryData.data} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                            <div className="footer1 my-4"></div>
                        </Container>
                    )
                }
            }
        }
    }
}

export default Category;