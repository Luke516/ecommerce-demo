import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import {withRouter} from 'react-router-dom'
import './App.css';
import YouCaptchaApp from './YouCaptcha/YouCaptchaApp'

import queryString from 'query-string';
import { Form, Container, Row, Button, Col, Modal, Card} from 'react-bootstrap';
import SurveyProductCell from './SurveyProductCell'
import ProductRow from './ProductRow'
import data from './data/metadata_all_with_detail_img_3_empty.json';
import flatData from './data/flat_products_list_zh.json';
import { shuffle } from './utils/utlis';
import { translate } from './utils/translate';

class Survey extends React.Component {

    changeFavicon(src) {
        // var link = document.createElement('link'),
        //     oldLink = document.getElementById('dynamic-favicon');
        // link.id = 'dynamic-favicon';
        // link.rel = 'shortcut icon';
        // link.href = src;
        // if (oldLink) {
        //  document.head.removeChild(oldLink);
        // }
        // document.head.appendChild(link);
        const favicon = document.getElementById('favicon');
        favicon.setAttribute("href", src);
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
  
    constructor(props) {
        super(props);
        const { cookies } = props;
        let settings = cookies.get('settings')? cookies.get('settings') : [];

        let list1 = []
        let list2 = []
        for(let i=0; i<3; i++){
            list1.push(this.getRandomProduct(data))
        }
        let targetProduct = flatData[this.props.targetProductId]
        let category = decodeURIComponent(targetProduct.url).split('/').slice(4,7)
        targetProduct = {
            ...targetProduct,
            category,
            id: this.props.targetProductId
        }
        list1.push(targetProduct)
        list1 = shuffle(list1)
        for(let i=0; i<4; i++){
            list2.push(this.getRandomProduct(data))
        }

        this.state = {
            questionId: 0,
            list1,
            list2,
            list3: targetProduct,
            list4: this.getRandomProduct(data),
            showDialog: false,
            answers: [[], [], -1, -1, -1],
            other: "其他"
        }

        this.changeFavicon = this.changeFavicon.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.prevQuestion = this.prevQuestion.bind(this);
        this.changeAnswer = this.changeAnswer.bind(this);
        this.checkValid = this.checkValid.bind(this);
        this.finish = this.finish.bind(this);
        this.otherFactor = this.otherFactor.bind(this);

        document.title = '問卷！';
        this.changeFavicon("/logo192.png");
    }

    componentWillMount() {
        this.props.handleNavbarToggle()
    }

    componentDidMount() {
        // this.props.toggleCategoryNav();
    }
  
    render (){
        return (
            <div className="vh-100 survey">
                <div className="survey-nav">
                    <img width="60" height="60" src="https://www.nthu.edu.tw//public/images/about10/cis-1-1.jpg"/>
                    <span className="mx-2">國立清華大學datalab實驗室</span>
                </div>
                <Row className={"mb--4"}>
                    {
                        (this.state.questionId > 0 && this.state.questionId < 6) &&
                        <Col xs={12} className="d-flex flex-row justify-content-center align-items-center my-2">
                            {/* <h2 className="mt-4">{translate("Survey") + " (" + (parseInt(this.state.questionId)-1)+ "/5)"}</h2> */}
                            <h2 className="mt--4">{"第" + (parseInt(this.state.questionId))+ "題，共5題"}</h2>
                        </Col>
                    }
                </Row>
                {this.state.questionId == 0 &&
                    // <Col xs={12}>
                    <div className="w-100 d-flex justify-content-center align-items-center flex-column" style={{height: "80%"}}>
                        <h2>恭喜！你已經完成了本階段的任務。</h2>
                        <p className="mt-4">
                            接下來，我們會請您回答五題簡單的問題。請憑您剛剛瀏覽網頁的印象來作答。
                        </p>
                        <button type="button" onClick={this.nextQuestion}>開始</button>
                    </div>
                    // </Col>
                }
                {(this.state.questionId > 0 && this.state.questionId < 6) &&
                    <div className="my-4 d-flex justify-content-center">
                        <span className={this.state.questionId == 1? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 2? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 3? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 4? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 5? "mx-2 black-dot": "mx-2 dot"}></span>
                    </div>
                }
                {/* <hr style={{width: "100%", height: "1px", border: "none", backgroundColor: "rgba(0, 0, 0, 0.125)"}}/> */}
                <Row className="mt-2" style={{display: this.state.questionId == 0? "block": "none"}}>
                    <Modal show={this.state.showDialog} onHide={()=>{this.setState({showDialog: false})}}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                非常感謝您的協助！
                            </Modal.Title>
                        </Modal.Header>
                        {/* <Modal.Body>
                            <span>
                                非常感謝您協助參與我們的研究！
                            </span><br/><br/>
                            <span>
                                接下來，我們會請您回答幾題簡單的問題。問題是匿名的且沒有正確答案，
                                只要憑您剛才操作的印象回答即可。
                            </span>
                        </Modal.Body> */}
                        <Modal.Footer>
                            <Button variant="primary"  onClick={this.finish}>
                                {translate("Proceed")}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Row>
                <Row style={{display: this.state.questionId == 1? "block": "none"}}>
                    {/* <h4>請問您印象中有看過下列哪些商品？請將看過的打勾 (答案可能有任意數目，或是沒有答案)</h4> */}
                    <div className="d-flex flex-column align-items-center">
                        <h5>下面有四件商品的名稱與圖片，請問在剛剛瀏覽的過程中，有哪些商品是您印象中有看過的？請將看過的商品打勾。</h5>
                        <h5>(答案可能有任意數目，如果全部都沒看過，直接按下一題即可)</h5>
                    </div>
                    {/* <Row className="mt-4">
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input id="1-1" onChange={this.changeAnswer} type="checkbox" className=""></input>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input id="1-2" onChange={this.changeAnswer} type="checkbox" className=""></input>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input id="1-3" onChange={this.changeAnswer} type="checkbox" className=""></input>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input id="1-4" onChange={this.changeAnswer} type="checkbox" className=""></input>
                        </Col>
                    </Row> */}
                    <Row>
                    {
                        this.state.list1.map(element => {
                            return (
                                <SurveyProductCell hideOption key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} checkbox/>
                            )
                        })
                    }
                        {/* <Col className="my-1" xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <Card style={{padding: "1rem", height: "480px", justifyContent: "space-between", alignItems: "center"}}>
                                <div></div>
                                <div className="d-flex justify-content-center" style={{maxHeight:"200px", maxWidth:"200px", overflow: "hidden"}}>
                                    
                                </div>
                                <Card.Body className={"d-block"} style={{justifyContent: "flex-end", flex: "none"}}>
                                    <Card.Title style={{height: "5rem", overflowY: "scroll"}}>以上皆非</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col> */}
                    </Row>
                    {/* <Row className="my-2">
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input type="checkbox" className=""></input>
                            <span className="mx-2">以上皆非</span>
                        </Col>
                    </Row> */}
                </Row>
                <Row style={{display: this.state.questionId == 2? "block": "none"}}>
                {/* <h4>請問您印象中有看過下列哪些商品？請將看過的打勾 (答案可能有任意數目，或是沒有答案)</h4> */}
                    <div className="d-flex flex-column align-items-center">
                        <h5>下面有四件商品的名稱與圖片，請問在剛剛瀏覽的過程中，有哪些商品是您印象中有看過的？請將看過的商品打勾。</h5>
                        <h5>(答案可能有任意數目，如果全部都沒看過，直接按下一題即可)</h5>
                    </div>
                    {/* <Row>
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
                    </Row> */}
                    <Row>
                    {
                        this.state.list2.map(element => {
                            return <SurveyProductCell hideOption key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} checkbox/>
                        })
                    }
                        {/* <Col className="my-1" xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <Card style={{padding: "1rem", height: "480px", justifyContent: "space-between", alignItems: "center"}}>
                                <div></div>
                                <div className="d-flex justify-content-center" style={{maxHeight:"200px", maxWidth:"200px", overflow: "hidden"}}>
                                    
                                </div>
                                <Card.Body className={"d-block"} style={{justifyContent: "flex-end", flex: "none"}}>
                                    <Card.Title style={{height: "5rem", overflowY: "scroll"}}>以上皆非</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col> */}
                    </Row>
                    {/* <Row className="my-2">
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <input type="checkbox" className=""></input>
                            <span className="mx-2">以上皆非</span>
                        </Col>
                    </Row> */}
                </Row>
                <Row style={{display: this.state.questionId == 3? "block": "none"}}>
                    {/* <h4>請看以下商品的圖片和名稱，如果以第一印象而言，您對它感興趣的程度？</h4> */}
                    <div className="d-flex flex-column align-items-center">
                        <h5>請看以下商品的圖片和名稱，如果只看第一印象，不論價錢的話，您對它感興趣的程度？</h5>
                        {/* <h5>(如果您在其他地方看到這款商品)</h5> */}
                    </div>
                    <Row className="my--2">
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}></Col>
                        <SurveyProductCell hideOption key={this.state.list3.id} product={this.state.list3} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <div key={`inline-radio`} className="mb-3">
                                <Form className="d-flex flex-column justify-content-center">
                                    {/* <div className="my-2"></div> */}
                                    <br/>
                                    <Form.Check className="my-2" inline label="非常感興趣" name="survey3" type={'radio'} id={`inline-radio-1`} /><br/>
                                    <Form.Check inline label="有點感興趣" name="survey3" type={'radio'} id={`inline-radio-2`} /><br/>
                                    <Form.Check inline label="普通" name="survey3" type={'radio'} id={`inline-radio-3`} /><br/>
                                    <Form.Check inline label="不太感興趣" name="survey3" type={'radio'} id={`inline-radio-4`} /><br/>
                                    <Form.Check inline label="非常不感興趣" name="survey3" type={'radio'} id={`inline-radio-5`} /><br/>
                                </Form>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}></Col>
                    </Row>
                </Row>
                <Row style={{display: this.state.questionId == 4? "block": "none"}}>
                    {/* <h4>請看以下商品的圖片和名稱，如果以第一印象而言，您對它感興趣的程度？</h4> */}
                    <div className="d-flex flex-column align-items-center">
                        <h5>請看以下商品的圖片和名稱，如果只看第一印象，不論價錢的話，您對它感興趣的程度？</h5>
                        {/* <h5>(如果您在其他地方看到這款商品)</h5> */}
                    </div>
                    <Row className="my--2">
                    <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}></Col>
                        <SurveyProductCell hideOption key={this.state.list4.id} product={this.state.list4} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct}/>
                        <Col xs={12} sm={6} md={4} lg={3} >
                            <div key={`inline-radio`} className="mb-3">
                                <Form>
                                    {/* <div className="my-2"></div> */}
                                    <br/>
                                    <Form.Check className="my-2" inline label="非常感興趣" name="survey4" type={'radio'} id={`inline-radio-1`} /><br/><br/>
                                    <Form.Check inline label="有點感興趣" name="survey4" type={'radio'} id={`inline-radio-2`} /><br/><br/>
                                    <Form.Check inline label="普通" name="survey4" type={'radio'} id={`inline-radio-3`} /><br/><br/>
                                    <Form.Check inline label="不太感興趣" name="survey4" type={'radio'} id={`inline-radio-4`} /><br/><br/>
                                    <Form.Check inline label="非常不感興趣" name="survey4" type={'radio'} id={`inline-radio-5`} /><br/>
                                </Form>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}></Col>
                    </Row>
                </Row>
                <Row style={{display: this.state.questionId == 5? "block": "none"}}>
                    {/* <h4>在本次購買的過程中，您覺得影響您最後決定的主要因素是？</h4> */}
                    <div className="d-flex flex-column align-items-center">
                        <h5>在本階段實驗的過程中，您覺得在所有影響您最後選擇商品的因素中，最主要因素為何？</h5>
                        {/* <h5>(如果您在其他地方看到這款商品)</h5> */}
                    </div>
                    <Col className="my-4 d-flex justify-content-center" sm={12}>
                        <div key={`inline-radio`} className="mb-3">
                            <Form.Check inline label="外觀" type={'radio'} name="question4" id={`inline-radio-1`} />
                            <Form.Check inline label="敘述" type={'radio'} name="question4" id={`inline-radio-2`} />
                            <Form.Check inline label="價格" type={'radio'} name="question4" id={`inline-radio-3`} />
                            <Form.Check onClick={this.otherFactor} inline label={this.state.other} type={'radio'} name="question4" id={`inline-radio-3`} />
                        </div>
                    </Col>
                </Row>
                <div className="w-100 justify-content-center align-items-center flex-column" style={{height: "80%", display: this.state.questionId == 6? "flex": "none"}}>
                    <h2>感謝您的回答！接下來將進行下一階段的實驗</h2>
                    <button type="button"  size="lg" className="mx-1 my-2" style={{display: "block"}} onClick={() => {this.finish()}}>繼續</button> 
                </div>
                {
                    (this.state.questionId > 0 && this.state.questionId < 6) &&
                    <Row className="my-2 d-flex justify-content-center">
                        <button type="button" size="lg" className="mx-1" style={{display: this.state.questionId == 1? "none": "block"}} onClick={() => this.prevQuestion()}>上一題</button>
                        <button type="button"  size="lg" className="mx-1" style={{display: this.state.questionId == 5? "none": "block"}} onClick={() => this.nextQuestion()}>下一題</button>
                        <button type="button"  size="lg" className="mx-1" style={{display: this.state.questionId == 5? "block": "none"}} onClick={() => {this.nextQuestion()}}>完成</button> 
                        {/* <button type="button"  size="lg" className="mx-1" style={{display: this.state.questionId == 5? "block": "none"}} onClick={() => {this.setState({showDialog: true})}}>完成</button> */}
                    </Row>
                }
            </div>
        )
    }

    otherFactor() {
        let factor = prompt("請填寫原因：")
        this.setState({
            other: factor
        })
        console.log(factor)
    }

    changeAnswer(e) {
        console.log(e.target)
    }

    checkValid() {
        if(this.state.questionId == 1){
        }
    }

    nextQuestion() {
        console.log("nextQuestion")
        let nextQuestionId = Math.min(this.state.questionId + 1, 6)
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
        this.setState({
            showDialog: false
        })
        // alert("感謝您的回答！接下來將進行下一階段的實驗")
        this.props.nextTest()
        this.props.clearCart()
        setTimeout(()=>{
            this.props.history.push('') 
        }, 100)
    }
}

export default withRouter(withCookies(Survey));