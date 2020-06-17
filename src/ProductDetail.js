import React from 'react';
import './App.css';
import priceData from './prices2All.json';
import data from './metadata_all_with_detail_img_2_empty.json';

import ProductCell from './ProductCell'
import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';

export default class ProductDetail extends React.Component {
  
    constructor(props) {
      super(props);

      let list1 = []
      for(let i=0; i<4; i++){
        list1.push(this.getRandomProduct(data))
      }
      this.state = {
        price: priceData[this.props.product.id][0],
        detailHtml: "",
        list1
      };
  
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
        fetch('./out2/' + this.props.product.id + '.html')
        .then((r) => r.text())
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
  
    render (){
        // let imageSourceUrl = "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Men's+Fashion/Clothing/Jackets+%26+Coats/B07HF4ZQRT.jpg"
        let imageSourceUrl = "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/"
        for (let category of this.props.product.category){
            category = category.replace('é', 'e')
            imageSourceUrl += encodeURIComponent(category) 
            imageSourceUrl += '/'
        }
        imageSourceUrl += this.props.product.id
        imageSourceUrl += '.jpg'
        let title = this.props.product.name
        
        return (
            <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} style={{paddingLeft: "4rem", paddingRight: "4rem"}}>
                    <a href="/">home</a>
                    {
                        this.props.product.category.map((category) => {
                            return <span> > <a key={category}>{category}</a></span>
                        })
                    }
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={4} lg={4} style={{paddingLeft: "4rem", paddingRight: "2rem"}}>
                    <Card style={{padding: "1rem", height: "480px", justifyContent: "center", alignItems: "center", border: "none"}}>
                        <div className="d-flex justify-content-center" style={{maxHeight:"400px", maxWidth:"400px"}}>
                            {/* <Card.Img variant="top" height="300px" src={imageSourceUrl} /> */}
                            <img src={imageSourceUrl} style={{maxWidth: "400px", maxHeight:"400px", width: "auto", height: "auto"}}></img>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={8} lg={8} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                    <Card style={{padding: "1rem", height: "480px", justifyContent: "space-between", alignItems: "center", border: "none"}}>
                        <Card.Body className={"d-block"} style={{justifyContent: "flex-end", flex: "none"}}>
                            {/* <Card.Title style={{height: "5rem"}}>{title}</Card.Title> */}
                            <div dangerouslySetInnerHTML={{ __html: this.state.detailHtml }} ></div>
                            <Card.Title style={{color: "red"}}><strong>{"$" + this.state.price}</strong></Card.Title>
                            <Button variant="info" className="w-100" onClick={()=>{this.props.addProductToCart(this.props.product)}}>Add To Cart</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="ml-4 mt-2">
                <h4>你可能也會喜歡</h4>
            </Row>
            <Row className="ml-4 mt-2" style={{padding: "20px"}}>
                {
                    this.state.list1.map(element => {
                        return <ProductCell key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                    })
                }
            </Row>
            </>
        );
    }
  }