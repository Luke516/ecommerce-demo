import React from 'react';
import './App.css';
import priceData from './data/prices2All.json';
import data from './data/metadata_all_with_detail_img_3_empty.json';
import flatData from './data/flat_products_list_zh.json';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { translate } from './utils/translate';
import { shuffle } from './utils/utlis';
import ProductCell from './ProductCell'
import { Container, Row, Col, Carousel, Button, Card, Breadcrumb } from 'react-bootstrap';

export default class ProductDetail extends React.Component {
  
    constructor(props) {
        super(props);
        console.log(this.props.location)

        let queryString = this.props.location.search
        let productId = "QQ"
        let category = ["QWQ"]
        let productName = "QAQ"
        let subCategoryData = data
        if(queryString.split("p=").length > 1){
            productId = queryString.split("p=")[1].substring(0,10)
            let productData = flatData[productId]
            console.log(productData)
            productName = productData.name
            category = decodeURIComponent(productData.url).split('/').slice(4,7)
            subCategoryData = data[category[0]]
            console.log(category)
        }

        let list1 = []
        let count = 4
        if (this.props.targetProductId != productId){
            while(true){
                if(category[0] != this.props.targetCategory){
                    break
                }
                let selected_product = this.getRandomProduct(subCategoryData)
                if(selected_product.id != this.props.targetProductId){
                    continue
                }
                selected_product.category.unshift(category[0])
                list1.push(selected_product)
                count = 3
                break
            }
        }
        for(let i=0; i<count; i++){
            let recommandedProduct = this.getRandomProduct(subCategoryData)
            recommandedProduct.category.unshift(category[0])
            list1.push(recommandedProduct)
        }
        list1 = shuffle(list1)
        // let product = this.props.product
        let product = null
        let price = 8787
        if(!product){
            product = {
                id: productId,
                category,
                name: productName
            }
            price = priceData[productId][0]
        }
        else {
            price = priceData[product.id][0]
        }

        let imageSourceUrl = "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/"
        for (let category of product.category){
            category = category.replace('é', 'e')
            category = category.trim()
            imageSourceUrl += encodeURIComponent(category) 
            imageSourceUrl += '/'
        }
        imageSourceUrl += product.id
        imageSourceUrl += '.jpg'

        this.state = {
            product,
            price,
            detailHtml: "",
            list1,
            count: 1,
            imageSourceUrl
        };
        this.updateContent = this.updateContent.bind(this)
        this.addCount = this.addCount.bind(this)
        this.minusCount = this.minusCount.bind(this)
    }

    updateContent() {
        let queryString = this.props.location.search
        let productId = "QQ"
        let category = ["QWQ"]
        let productName = "QAQ"
        let subCategoryData = data
        if(queryString.split("p=").length > 1){
            productId = queryString.split("p=")[1].substring(0,10)
            let productData = flatData[productId]
            console.log(productData)
            productName = productData.name
            category = decodeURIComponent(productData.url).split('/').slice(4,7)
            subCategoryData = data[category[0]]
            console.log(category)
        }

        let list1 = []
        let count = 4
        if (this.props.targetProductId != productId){
            while(true){
                if(category[0] != this.props.targetCategory){
                    break
                }
                let selected_product = this.getRandomProduct(subCategoryData)
                if(selected_product.id != this.props.targetProductId){
                    continue
                }
                selected_product.category.unshift(category[0])
                list1.push(selected_product)
                count = 3
                break
            }
        }
        for(let i=0; i<count; i++){
            let recommandedProduct = this.getRandomProduct(subCategoryData)
            recommandedProduct.category.unshift(category[0])
            list1.push(recommandedProduct)
        }
        list1 = shuffle(list1)
        let product = this.props.product
        let price = 8787
        if(!product){
            product = {
                id: productId,
                category,
                name: productName
            }
            price = priceData[productId][0]
        }
        else {
            price = priceData[product.id][0]
        }
        this.setState({
            product,
            price,
            detailHtml: "",
            list1,
            count: 1
        }, ()=>{
            fetch('./out6/' + this.state.product.id + '.html')
            .then((r) => {
                let t = r.text()
                console.log(t)
                return t
            })
            .then(text  => {
                this.setState({
                    detailHtml: text
                })
                console.log(text);
            })  
        });
    }

    componentDidUpdate(prevProps) {
        console.log("update!!!")
        if(!prevProps.product){
            return;
        }
        if(this.props.product.id != prevProps.product.id)
        {
            this.updateContent()
            return;
        }
    } 

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

    componentWillMount() {
        console.log( this.state.product.id )
        fetch('./out6/' + this.state.product.id + '.html')
        .then((r) => {
            let t = r.text()
            console.log(t)
            return t
        })
        .then(text  => {
            this.setState({
                detailHtml: text
            })
            console.log(text);
        })  
    }

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    addCount() {
        this.setState({
            count: this.state.count + 1
        })
    }

    minusCount() {
        if(this.state.count < 2)
            return
        this.setState({
            count: this.state.count - 1
        }) 
    }
  
    render (){
        // let imageSourceUrl = "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B07HF4ZQRT.jpg"
        let imageSourceUrl = "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/"
        for (let category of this.state.product.category){
            category = category.replace('é', 'e')
            category = category.trim()
            imageSourceUrl += encodeURIComponent(category) 
            imageSourceUrl += '/'
        }
        imageSourceUrl += this.state.product.id
        imageSourceUrl += '.jpg'
        let productCategories = this.state.product.category.slice(0, 2)
        let title = this.state.product.name   

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
            <Container style={{/*maxWidth: "1300px"*/}}>
            <Row style={{height:"1.5rem"}}></Row>
            <Row>
                {/* <Col xs={12} sm={12} md={12} lg={12} style={{paddingLeft: "4rem", paddingRight: "4rem"}}>
                    <a href="/">{translate("home")}</a>
                    {
                        productCategories.map((_category) => {
                            return <span> {">"} <a key={_category}>{translate(_category)}</a></span>
                        })
                    }
                </Col> */}
                <Breadcrumb>
                    <Breadcrumb.Item href="/">{translate("home")}</Breadcrumb.Item>
                    <Breadcrumb.Item href={"/" + encodeURIComponent(productCategories[0])}>{translate(productCategories[0])}</Breadcrumb.Item>
                    <Breadcrumb.Item href="/">{translate(productCategories[1])}</Breadcrumb.Item>
                    {/* {
                        productCategories.map((_category) => {
                            return <Breadcrumb.Item><a key={_category}>{translate(_category)}</a></Breadcrumb.Item>
                        })
                    } */}
                </Breadcrumb>
            </Row>
            <Row className="my--4">
                <Col className="d-flex justify-content-center" xs={12} sm={12} md={5} lg={5} style={{paddingLeft: "4rem", paddingRight: "2rem"}}>
                    <Card className="d-flex justify-content-center" style={{padding: "0.1rem", maxWidth:"500px", maxHeight: "500px", overflowY: "scroll", alignItems: "center", border: "none"}}>
                        <div className="d-flex justify-content-center" style={{maxHeight:"400px", maxWidth:"400px"}}>
                            {/* <Card.Img variant="top" height="300px" src={imageSourceUrl} /> */}
                            <img src={imageSourceUrl} style={{maxWidth: "400px", maxHeight:"400px", width: "auto", height: "auto"}}></img>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={7} lg={7}>
                    <Card style={{padding: "1rem", maxHeight: "700px", overflowY: "scroll", justifyContent: "space-between", alignItems: "center", border: "none"}}>
                        <Card.Body className={"d-block w-100"} style={{justifyContent: "flex-end", flex: "none"}}>
                            {/* <Card.Title style={{height: "5rem"}}>{title}</Card.Title> */}
                            <div style={{maxHeight: "500px", overflowY: "scroll"}} dangerouslySetInnerHTML={{ __html: this.state.detailHtml }} ></div>
                            <div style={{height: "2rem"}}></div>
                            <div className="d-flex flex-row justify-content-between align-itemas-center">
                                <div>
                                    <h2 className="display-4 text-success d-inline"><strong>{price}</strong></h2>
                                    <span className="mx-2 text-secondary" style={{fontSize: "10px"}}>不含運費</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <span className="mx-2 d-inline">數量</span>
                                    <Button className="my-2" size="sm" variant="outline-secondary" onClick={this.minusCount}>
                                        <FontAwesomeIcon icon={faMinus}/>
                                    </Button>
                                    <span className="my-2 mx-2">{this.state.count}</span>
                                    <Button className="my-2" size="sm" variant="outline-secondary" onClick={this.addCount}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                    </Button>
                                </div>
                            </div>
                            <Button size="lg" variant="primary" className="w-100" onClick={()=>{this.props.addProductToCart({...this.state.product, imageSourceUrl, price: this.state.price}, this.state.count)}}>
                                <FontAwesomeIcon className="mx-2" icon={faShoppingCart} />{translate("Add To Cart")}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div className="ml-4 mt-2">
                <h4>你可能也會喜歡</h4>
            </div>
            <Row className="ml-2" style={{padding: "20px"}}>
                {
                    this.state.list1.map(element => {
                        return <ProductCell key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}  username={this.props.username}/>
                    })
                }
            </Row>
            </Container>
        );
    }
  }