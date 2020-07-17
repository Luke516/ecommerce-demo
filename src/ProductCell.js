import React from 'react';
import './App.css';
import priceData from './data/prices2All.json';
import flatData from './data/flat_products_list_zh.json';

import handleViewport from 'react-in-viewport';
import {withRouter} from 'react-router-dom'
import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { translate } from './utils/translate';

class ProductCell extends React.Component {
  
    constructor(props) {
        super(props);

        this.detailButtonClick = this.detailButtonClick.bind(this);
        this.logPosition = this.logPosition.bind(this);
        this.isInViewport = this.isInViewport.bind(this);
        this.addProductToCart = this.addProductToCart.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this)
        this.mouseLeave = this.mouseLeave.bind(this)
        this.logEvent = this.logEvent.bind(this)

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

        let logPositionTimer = null
        // if(this.props.target){
        //     logPositionTimer = setInterval(this.logPosition, 100)
        // }
        this.state = {
            price: priceData[this.props.product.id][0],
            imageSourceUrl: imageSourceUrl,
            title,
            logPositionTimer,
            hover: false
        };
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

        let price = parseInt(this.state.price * 31)
        if(price % 100 < 20){
            price = price - (price%100) - 1;
        }
        else if(price % 100 > 90){
            price = price - (price%100) + 99;
        }
        else{
            price = price - price % 10
        }
        return (
            <Col className="my-3 mx-" xs={12} sm={6} md={4} lg={3} style={{cursor: "pointer"}} ref={(el) => this.domElement = el} >
                <Card className="card-shadow" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}
                    style={{border: "0", padding: "0rem", height: this.props.hideOption?"400px":"480px", justifyContent: "space-between", alignItems: "center"}}>
                    <div className="w-100"  onClick={this.detailButtonClick}>
                    {this.props.checkbox &&
                        <input id="1-2" onChange={this.changeAnswer} type="checkbox" className=""></input>
                    }
                    </div>
                    <div onClick={this.detailButtonClick} className="d-flex justify-content-center" style={{maxHeight:"200px", maxWidth:"200px", overflow: "hidden"}}>
                        <img src={this.state.imageSourceUrl} style={{maxWidth: "200px", maxHeight:"200px", width: "auto", height: "auto"}}></img>
                    </div>
                    <Card.Body className={"d-block w-100"} style={{justifyContent: "flex-end", flex: "none", padding: 0}}>
                        <div onClick={this.detailButtonClick} style={{padding: "1rem"}}>
                            <Card.Title style={{lineHeight: "1.5rem", height: "4.5rem", overflowY: "scroll", paddingLeft: this.state.hover? "3px": "0",  paddingRight: this.state.hover? "3px": "0"}}>{title}</Card.Title>
                            {
                                !this.props.hideOption &&
                                <h4 className="text-success text-right"><strong>{"$" + price}</strong></h4>
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
                            <Button size="lg" variant="primary" className="w-100" style={{borderTopLeftRadius: "0", borderTopRightRadius: "0"}}
                                onClick={(e)=>{this.addProductToCart({...this.props.product, ...this.state})}}>
                                <span className="text-md"><FontAwesomeIcon className="mx-2" icon={faShoppingCart} />{translate("Add To Cart")}</span>
                            </Button>
                        }
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    addProductToCart(product) {
        // let price = parseInt(product.price * 31)
        // if(price % 100 < 20){
        //     price = price - (price%100) - 1;
        // }
        // else if(price % 100 > 90){
        //     price = price - (price%100) + 99;
        // }
        // else{
        //     price = price - price % 10
        // }
        // product.price = price
        this.props.addProductToCart(product)
    }

    detailButtonClick() {
        let { history } = this.props
        // this.props.history.push('/Product?p=' + this.props.product.id) 
        // console.log("Detail Click !!!")

        const timestamp = Date.now();
        this.logEvent({
            timestamp,
            product: this.props.product.id,
            type: "detailClick"
        })

        window.location.href = ('/Product?p=' + this.props.product.id) 
        // this.props.showProduct({...this.props.product, ...this.state});
    }

    isInViewport(element, offset = 0) {
        if (!element) return false;
        const top = element.getBoundingClientRect().top;
        return (top + offset) >= 0 && (top - offset) <= window.innerHeight;
    }
    
    logPosition() {
        const { isVisible, inViewport  } = this.props;
        console.log( this.isInViewport(this.domElement) )
        if(isVisible){
            console.log("position QWQ!")
        }
    }

    mouseEnter() {
        const timestamp = Date.now();
        // console.log(this.props.product.id)
        // console.log("mouseEnter")
        this.logEvent({
            timestamp,
            product: this.props.product.id,
            type: "mouseEnter"
        })
    }

    mouseLeave(){
        const timestamp = Date.now();
        // console.log(this.props.product.id)
        // console.log("mouseLeave")
        this.logEvent({
            timestamp,
            product: this.props.product.id,
            type: "mouseLeave"
        })
    }

    logEvent(event){
        let data={
            username: this.props.username,
            event: event
        }
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const httpHeaders = { 'Content-Type' : 'application/json', 'X-Requested-With': 'XMLHttpRequest'}
        const myHeaders = new Headers(httpHeaders)
        const url = "http://localhost:5000/event/";
        const req = new Request(url, {method: 'POST', headers: myHeaders})

        fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>{})
    }
}

export default handleViewport(withRouter(ProductCell), { rootMargin: '-1.0px' })