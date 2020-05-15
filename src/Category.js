import React from 'react';
import './App.css';

import queryString from 'query-string';
import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';
import ProductCell from './ProductCell'
import ProductRow from './ProductRow'

class Category extends React.Component {

    getRandomProduct(data) {
        let obj_keys = Object.keys(data);
        let ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
        let selected_object = data[ran_key];
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

    getAllSubCategoryData(data) {
        let obj_keys = Object.keys(data);
        let allSubCategoryData = []
        for(let key of obj_keys){
            let selected_data = data[key];
            if (typeof selected_data == "undefined"){
            }
            else if(!selected_data.hasOwnProperty('name')){
                allSubCategoryData.push({
                    displayName: key,
                    name: this.props.name + '/' +key,
                    data: selected_data
                })
            }
        }
        return allSubCategoryData
    }

    getInitState() {
        let subCategoryList = this.getAllSubCategoryData(this.props.data);
        return {
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
                <Row>
                    <h2 className="ml-4 mt-4">{this.props.name}</h2>
                    <hr/>
                </Row>
                {
                    this.state.subCategoryList.map(subCategoryData => {
                        return <ProductRow key={subCategoryData.name} name={subCategoryData.name} data={subCategoryData.data} addProductToCart={this.props.addProductToCart}/>
                    })
                }
                </Container>
            );
        }else{
            for(let subCategoryData of this.state.subCategoryList){
                // console.log(subCategoryData.name)
                // console.log(this.props.name + '/' + this.state.subCategory)
                if(subCategoryData.name.includes(this.props.name + '/' + this.state.subCategory)){
                    return(
                        <Container>
                            <Row>
                                <h2 className="ml-4 mt-4">{this.props.name}</h2>
                                <hr/>
                            </Row>
                            <ProductRow key={subCategoryData.name} name={subCategoryData.name} data={subCategoryData.data} addProductToCart={this.props.addProductToCart}/>
                        </Container>
                    )
                }
            }
        }
    }
}

export default Category;