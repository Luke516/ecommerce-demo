import React from 'react';
import './App.css';
import priceData from './data/prices2All.json';
import flatData from './data/flat_products_list_zh.json';

import {withRouter} from 'react-router-dom'
import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { translate } from './utils/translate';

class SurveyProductCell extends React.Component {
  
    constructor(props) {
        super(props);
        let imageSourceUrl = "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/"
        for (let category of this.props.product.category){
            category = category.replace('é', 'e')
            category = category.trim()
            imageSourceUrl += encodeURIComponent(category) 
            imageSourceUrl += '/'
        }
        imageSourceUrl += this.props.product.id
        imageSourceUrl += '.jpg'
        let title =this.props.product.name
        if(flatData[this.props.product.id]){
            title = flatData[this.props.product.id].name
            imageSourceUrl = flatData[this.props.product.id].url
        }
        this.state = {
            price: priceData[this.props.product.id][0],
            imageSourceUrl: imageSourceUrl,
            title,
            check: false
        };
        this.detailButtonClick = this.detailButtonClick.bind(this);
    }
  
    render (){
        // let title = this.props.product.name
        let title = this.state.title
        if(!title){
            title = "error"
        }
        // console.log(title)
        // if(title.length > 42)
        //     title = this.props.product.name.slice(0,42) + "..."
        return (
            <Col className="my-3 mx-" xs={12} sm={6} md={4} lg={3} style={{cursor: "pointer"}} onClick={this.detailButtonClick}>
                <div className="d-flex flex-column align-items-center" style={{backgroundColor:"white", border: "1px solid black", padding: "1rem", height: this.props.hideOption?"400px":"480px"}}>
                    <div className="w-100" onClick={this.detailButtonClick}>
                    {this.props.checkbox &&
                        <input id="1-2" checked={this.state.check} type="checkbox" className=""></input>
                    }
                    </div>
                    <div onClick={this.detailButtonClick} className="d-flex justify-content-center" style={{maxHeight:"200px", maxWidth:"200px", overflow: "hidden"}}>
                        <img src={this.state.imageSourceUrl} style={{maxWidth: "200px", maxHeight:"200px", width: "auto", height: "auto"}}></img>
                    </div>
                    <div className={"d-block w-100"} style={{justifyContent: "flex-end", flex: "none", padding: 0}}>
                        <div onClick={this.detailButtonClick} style={{padding: "1rem"}}>
                            <div style={{lineHeight: "1.5rem", height: "4.5rem", overflowY: "scroll"}}><h5>{title}</h5></div>
                            {
                                !this.props.hideOption &&
                                <h4 className="text-success text-right"><strong>{"$" + this.state.price}</strong></h4>
                            }
                            {/* {
                                !this.props.hideOption &&
                                <Button className="btn-light2 my-1 w-100" onClick={this.detailButtonClick}>
                                    <FontAwesomeIcon className="mx-2" icon={faInfo} />{translate("Product Detail")}
                                </Button>
                            } */}
                        </div>
                        {
                            !this.props.hideOption &&
                            <Button variant="primary" className="w-100" style={{borderTopLeftRadius: "0", borderTopRightRadius: "0"}}
                                onClick={(e)=>{this.props.addProductToCart({...this.props.product, ...this.state})}}>
                                <FontAwesomeIcon className="mx-2" icon={faShoppingCart} />{translate("Add To Cart")}
                            </Button>
                        }
                    </div>
                </div>
            </Col>
        );
    }

    detailButtonClick() {
        let { history } = this.props
        this.setState({
            check: !this.state.check
        }, ()=>{
            this.props.handleClick( this.props.product.id ,this.state.check )
        })
        // this.props.history.push('/Product?p=' + this.props.product.id) 
        // console.log("Detail Click !!!")
        // this.props.showProduct({...this.props.product, ...this.state});
    }
}

export default withRouter(SurveyProductCell)