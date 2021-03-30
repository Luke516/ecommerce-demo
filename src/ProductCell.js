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
import { logEvent, logPosition, logEvents, logPositions } from './utils/utlis'

class ProductCell extends React.Component {
  
    constructor(props) {
        super(props);

        this.detailButtonClick = this.detailButtonClick.bind(this);
        this.logPosition = this.logPosition.bind(this);
        this.isInViewport = this.isInViewport.bind(this);
        this.addProductToCart = this.addProductToCart.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this)
        this.mouseLeave = this.mouseLeave.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.imgError = this.imgError.bind(this)
        this.reloadImg = this.reloadImg.bind(this)

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
        
        if(this.props.product.urlhaha && this.props.product.urlhaha.length > 0){
            imageSourceUrl = this.props.product.urlhaha;
        }
        this.state = {
            price: priceData[this.props.product.id][0],
            imageSourceUrl: imageSourceUrl,
            title,
            logPositionTimer,
            hover: false
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, { passive: true })
        this.handleScroll()
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }
    
    handleScroll(event) {
        if(this.props.target){
            this.logPosition()
        }
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
        let formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        price = formatter.format(price).split('.')[0];
        return (
            <Col id={(this.props.product.urlhaha && this.props.product.urlhaha.length > 0) && "target"} className="my-3 mx-" xs={12} sm={6} md={4} lg={3} style={{cursor: "pointer"}} ref={(el) => this.domElement = el} >
                <Card className="card-shadow" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.detailButtonClick}
                    style={{border: "0", padding: "0rem", height: this.props.hideOption?"400px":"480px", justifyContent: "space-between", alignItems: "center"}}>
                    <div className="w-100">
                    {this.props.checkbox &&
                        <input id="1-2" onChange={this.changeAnswer} type="checkbox" className=""></input>
                    }
                    </div>
                    <div className="d-flex justify-content-center" style={{maxHeight:"200px", maxWidth:"200px", overflow: "hidden"}}>
                        <img id={(this.props.product.urlhaha && this.props.product.urlhaha.length > 0) && "target-img"} src={this.state.imageSourceUrl} style={{maxWidth: "200px", maxHeight:"200px", width: "auto", height: "auto"}} onError={this.imgError} ref={(this.props.product.urlhaha && this.props.product.urlhaha.length > 0) ? this.props.setTargetRef : ()=>{}}></img>
                    </div>
                    <Card.Body className={"d-block w-100"} style={{justifyContent: "flex-end", flex: "none", padding: 0}}>
                        <div style={{padding: "1rem"}}>
                            <a href={"http://localhost:3000/Product?p=" + this.props.product.id}> 
                                <Card.Title style={{ color: "#212529", lineHeight: "1.5rem", height: "4.5rem", overflowY: "scroll", paddingLeft: this.state.hover? "3px": "0",  paddingRight: this.state.hover? "3px": "0"}}>{title}</Card.Title>
                            </a>
                            {
                                !this.props.hideOption &&
                                <h4 className="text-success text-right"><strong>{price}</strong></h4>
                            }
                        </div>
                        {
                            !this.props.hideOption &&
                            <Button size="lg" variant="primary" className="w-100" style={{borderTopLeftRadius: "0", borderTopRightRadius: "0"}}
                                onClick={(e)=>{e.stopPropagation(); this.addProductToCart({...this.props.product, ...this.state});}}>
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

        logEvent(this.props.username, {
            product: this.props.product.id,
            type: "detailClick"
        })
        logEvents()
        logPositions()
        window.location.href = ('/Product?p=' + this.props.product.id) 
    }

    isInViewport(element, offset = 0) {
        if (!element) return false;
        const top = element.getBoundingClientRect().top;
        const bottom = element.getBoundingClientRect().bottom;

        const isVisible = element.offsetWidth || element.offsetHeight || element.getClientRects().length
        const topInViewport = (top + offset) >= 0 && (top - offset) <= window.innerHeight
        const bottomInViewport = (bottom + offset) >= 0 && (bottom - offset) <= window.innerHeight
        return isVisible && (topInViewport || bottomInViewport)
    }
    
    logPosition() {
        // const { isVisible, inViewport  } = this.props;
        // console.log( this.isInViewport(this.domElement) )
        const yOffset = 72 //browser nav
        if(this.isInViewport(this.domElement)){

            let productPosition = this.domElement.getClientRects()[0]
            productPosition.y += yOffset

            const timestamp = Date.now();
            logPosition(this.props.username, timestamp, {
                product: this.props.product.id,
                x: productPosition.x,
                y: productPosition.y,
                width: productPosition.width,
                height: productPosition.height
            })
        }
    }

    mouseEnter() {
        logEvent(this.props.username, {
            product: this.props.product.id,
            type: "mouseEnter"
        })
    }

    mouseLeave(){
        logEvent(this.props.username, {
            product: this.props.product.id,
            type: "mouseLeave"
        })
    }

    imgError(e){
        console.log("imgError")
        console.log(e)
        let source = e.src;
        e.src = "QWQ" + e.src;
        setTimeout(this.reloadImg, 100, e);
    }

    reloadImg(e)
    {
        console.log("reload Img")
        console.log(e)
        let source = e.src;
        e.src = source.slice(5);
    }
}

export default handleViewport(withRouter(ProductCell), { rootMargin: '-1.0px' })