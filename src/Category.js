import React from 'react';
import './App.css';
import flatData from './data/flat_products_list_zh.json';
import priceData from './data/prices2All.json';

import TrackVisibility from 'react-on-screen';
import queryString from 'query-string';
import { Container, Row, Tabs, Tab, Nav, Dropdown, Col } from 'react-bootstrap';
import ProductRow from './ProductRow'
import {translate} from './utils/translate'

class Category extends React.Component {

    sortProducts(data, method = "recommand", order = 1) {
        function compareByRecommand( a, b ) {
            return a.recommand < b.recommand ? order : 
                a.recommand > b.recommand ? -order : 0
        }
        function compareByPrice( a, b ) {
            return a.price < b.price ? order : 
                a.price > b.price ? -order : 0
        }
        function compareByPopular( a, b ) {
            return a.popular < b.popular ? order : 
                a.popular > b.popular ? -order : 0
        }

        if(method === "recommand") data = data.sort(compareByRecommand)
        else if(method === "price") data = data.sort(compareByPrice)
        else if(method === "popular") data = data.sort(compareByPopular)

        return data
    }

    reorderProducts(orderMethod, order) {
        let targetSubCategoryData = this.state.targetSubCategoryData
        let subCategoryList = this.state.subCategoryList

        if(targetSubCategoryData){
            targetSubCategoryData.data = this.sortProducts(targetSubCategoryData.data, orderMethod, order)
        }
        for(let i = 0; i < subCategoryList.length; i++){
            let subCategoryData = subCategoryList[i]
            subCategoryList[i].data = this.sortProducts(subCategoryData.data, orderMethod, order)
        }

        this.setState({
            targetSubCategoryData: Object.assign(targetSubCategoryData),
            subCategoryList: subCategoryList.slice(),
            orderMethod,
            order
        })
    }

    getAllproducts(data) {
        let obj_keys = Object.keys(data);
        let products = []
        for(let i=0; i<obj_keys.length; i++){
            let key = obj_keys[i]
            if(data[key].name){
                let product = data[key]
                product.category = []   
                product.id = key
                product.price = priceData[key][0]
                product.popular = product.name.length % 17
                product.recommand = (product.name.length * product.name.length) % 23
                if(key == this.props.targetProductId || key == this.props.controlProductId){
                    product.recommand = 8787
                    product.popular = 8787
                }
                products.push(data[key])
            }
            else{
                let products2 = this.getAllproducts(data[key])
                for(let p of products2){
                    p.category.unshift(key)
                }
                products = products.concat(products2)
            }
        }
        return products
    }

    getAllSubCategoryData(data, targetSubCategory) {
        let obj_keys = Object.keys(data);
        let allSubCategoryData = []

        for(let key of obj_keys){
            let selected_data = data[key];
            if (typeof selected_data == "undefined") continue
            
            if(!selected_data.hasOwnProperty('name')){
                if (key == targetSubCategory){
                    continue
                }
                allSubCategoryData.push({
                    displayName: key,
                    name: this.props.name + '/' + key,
                    data: this.sortProducts(this.getAllproducts(selected_data))
                })
            }
        }
        if(obj_keys.includes(targetSubCategory)){
            let targetProductData = flatData[this.props.targetProductId]
            let targetCategory = decodeURIComponent(targetProductData.url).split('/')[4];

            let selected_data = data[targetSubCategory];
            if (typeof selected_data !== "undefined" && targetCategory === this.props.name){
                allSubCategoryData.unshift({
                    displayName: targetSubCategory,
                    name: this.props.name + '/' + targetSubCategory,
                    data: this.sortProducts(this.getAllproducts(selected_data))
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
        let targetSubCategoryData = null
        
        if(targetCategory === this.props.name){
            targetSubCategoryData = subCategoryList[0]
        }

        subCategoryList.unshift({
            displayName: "all",
            name: this.props.name + '/' + "all",
            data: this.sortProducts(this.getAllproducts(this.props.data))
        })
        
        return {
            targetSubCategoryData,
            subCategoryList,
            orderMethod: "recommand",
            order: 1
        }
    }
  
    constructor(props) {
      super(props);
      
      this.getInitState = this.getInitState.bind(this)
      this.getAllSubCategoryData = this.getAllSubCategoryData.bind(this)
      this.getAllproducts = this.getAllproducts.bind(this)
      this.sortProducts = this.sortProducts.bind(this)
      this.reorderProducts = this.reorderProducts.bind(this)
      
      let params = queryString.parse(this.props.location.search)
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
                    <Col md={2} className="d-flex justify-content-end">
                    <Dropdown style={{}/*{display: "flex", flexGrow: "1", justifyContent: "flex-end"}*/}>
                        <Dropdown.Toggle variant="" id="dropdown-basic" style={{color: "#495057"}}>
                            <span>排序：</span>
                            {this.state.orderMethod == "recommand" && <span className="mr-2">推薦</span>}
                            {(this.state.orderMethod == "price" && this.state.order == 1) && <span className="mr-2">價格（降序）</span>}
                            {(this.state.orderMethod == "price" && this.state.order == -1) && <span className="mr-2">價格（升序）</span>}
                            {(this.state.orderMethod == "popular" && this.state.order == 1) && <span className="mr-2">人氣（高到低）</span>}
                            {(this.state.orderMethod == "popular" && this.state.order == -1) && <span className="mr-2">人氣（低到高）</span>}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item style={{color: "#495057"}} onClick={()=>{this.reorderProducts("recommand",1)}}>
                                <span className="text--secondary">推薦</span>
                            </Dropdown.Item>
                            {/* <Dropdown.Item style={{color: "#495057"}} onClick={()=>{this.reorderProducts("popular",1)}}>
                                <span className="text--secondary">人氣（高到低）</span>
                            </Dropdown.Item>
                            <Dropdown.Item style={{color: "#495057"}} onClick={()=>{this.reorderProducts("popular",-1)}}>
                                <span className="text--secondary">人氣（低到高）</span>
                            </Dropdown.Item> */}
                            <Dropdown.Item style={{color: "#495057"}} onClick={()=>{/*this.reorderProducts("price",1)*/}}>
                                <span className="text--secondary">價格（降序）</span>
                            </Dropdown.Item>
                            <Dropdown.Item style={{color: "#495057"}} onClick={()=>{/*this.reorderProducts("price",-1)*/}}>
                                <span className="text--secondary">價格（升序）</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </Col>
                </Nav>

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