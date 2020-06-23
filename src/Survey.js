import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import './App.css';
import YouCaptchaApp from './YouCaptcha/YouCaptchaApp'

import queryString from 'query-string';
import { Form, Container, Row, Button, Col} from 'react-bootstrap';
import ProductCell from './ProductCell'
import ProductRow from './ProductRow'
import data from './metadata_all_with_detail_img_2_empty.json';

class Survey extends React.Component {

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
  
    constructor(props) {
        super(props);
        const { cookies } = props;
        let settings = cookies.get('settings')? cookies.get('settings') : [];

        let list1 = []
        let list2 = []
        for(let i=0; i<4; i++){
            list1.push(this.getRandomProduct(data))
        }
        for(let i=0; i<4; i++){
            list2.push(this.getRandomProduct(data))
        }

        this.state = {
            questionId: 1,
            list1,
            list2,
            list3: this.getRandomProduct(data),
            list4: this.getRandomProduct(data)
        }

        this.nextQuestion = this.nextQuestion.bind(this);
        this.prevQuestion = this.prevQuestion.bind(this);
        this.finish = this.finish.bind(this);
    }

    componentDidMount() {
        // this.props.toggleCategoryNav();
    }
  
    render (){
        return (
            <Container>
                <Row className="mb-4">
                    <Col xs={8} className="d-flex flex-row justify-content-between align-items-center   ">
                        <h2 className="mt-4">Survey</h2>
                    </Col>
                </Row>
                <hr style={{width: "90%", height: "1px", border: "none", backgroundColor: "gray"}}/>
                <Row style={{display: this.state.questionId == 1? "block": "none"}}>
                    <h4>請問您對以下的哪些商品有印象？</h4>
                    <Row>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input type="checkbox" className=""></input>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input type="checkbox" className=""></input>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input type="checkbox" className=""></input>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input type="checkbox" className=""></input>
                        </Col>
                    </Row>
                    <Row>
                    {
                        this.state.list1.map(element => {
                            return (
                                <ProductCell hideOption key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                            )
                        })
                    }
                    </Row>
                </Row>
                <Row style={{display: this.state.questionId == 2? "block": "none"}}>
                    <h4>請問您對以下的哪些商品有印象？</h4>
                    <Row>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input type="checkbox" className=""></input>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input type="checkbox" className=""></input>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input type="checkbox" className=""></input>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input type="checkbox" className=""></input>
                        </Col>
                    </Row>
                    <Row>
                    {
                        this.state.list2.map(element => {
                            return <ProductCell hideOption key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                        })
                    }
                    </Row>
                </Row>
                <Row style={{display: this.state.questionId == 3? "block": "none"}}>
                    <h4>請問下列商品會讓您想購買的程度？</h4>
                    <Row>
                        <ProductCell hideOption key={this.state.list3.id} product={this.state.list3} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                    </Row>
                    <Col sm={10}>
                        <div key={`inline-radio`} className="mb-3">
                            <Form.Check inline label="1" type={'radio'} id={`inline-radio-1`} />
                            <Form.Check inline label="2" type={'radio'} id={`inline-radio-2`} />
                            <Form.Check inline label="3" type={'radio'} id={`inline-radio-3`} />
                            <Form.Check inline label="4" type={'radio'} id={`inline-radio-4`} />
                            <Form.Check inline label="5" type={'radio'} id={`inline-radio-5`} />
                        </div>
                    </Col>
                </Row>
                <Row style={{display: this.state.questionId == 4? "block": "none"}}>
                    <h4>請問下列商品會讓您想購買的程度？</h4>
                    <Row>
                        <ProductCell hideOption key={this.state.list4.id} product={this.state.list4} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                    </Row>
                    <Col sm={10}>
                        <div key={`inline-radio`} className="mb-3">
                            <Form.Check inline label="1" type={'radio'} id={`inline-radio-1`} />
                            <Form.Check inline label="2" type={'radio'} id={`inline-radio-2`} />
                            <Form.Check inline label="3" type={'radio'} id={`inline-radio-3`} />
                            <Form.Check inline label="4" type={'radio'} id={`inline-radio-4`} />
                            <Form.Check inline label="5" type={'radio'} id={`inline-radio-5`} />
                        </div>
                    </Col>
                </Row>
                <Row style={{display: this.state.questionId == 5? "block": "none"}}>
                    <h4>在本次購買的過程中，您覺得影響您最後決定的主要因素是？</h4>
                    <Col sm={10}>
                        <div key={`inline-radio`} className="mb-3">
                            <Form.Check inline label="外觀" type={'radio'} id={`inline-radio-1`} />
                            <Form.Check inline label="敘述" type={'radio'} id={`inline-radio-2`} />
                            <Form.Check inline label="價格" type={'radio'} id={`inline-radio-3`} />
                        </div>
                    </Col>
                </Row>
                <Row className="my-2">
                    <Button className="mx-1" style={{display: this.state.questionId == 1? "none": "block"}} onClick={() => this.prevQuestion()}>上一題</Button>
                    <Button className="mx-1" style={{display: this.state.questionId == 5? "none": "block"}} onClick={() => this.nextQuestion()}>下一題</Button>
                    <Button className="mx-1" style={{display: this.state.questionId == 5? "block": "none"}} onClick={() => this.finish()}>完成</Button>
                </Row>
            </Container>
        )
    }

    nextQuestion() {
        console.log("nextQuestion")
        let nextQuestionId = Math.min(this.state.questionId + 1, 5)
        this.setState({
            questionId: nextQuestionId
        })
    }

    prevQuestion() {
        let nextQuestionId = Math.max(this.state.questionId - 1, 1)
        this.setState({
            questionId: nextQuestionId
        })
    }

    finish() {

    }
}

export default withCookies(Survey);