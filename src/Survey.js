import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import {withRouter} from 'react-router-dom'
import './App.css';
import unseenData from './data/unseen.json';

import queryString from 'query-string';
import { Form, Container, Row, Button, Col, Modal, Card, DropdownButton, Dropdown} from 'react-bootstrap';
import SurveyProductCell from './SurveyProductCell'
import ProductRow from './ProductRow'
import data from './data/metadata_all_with_detail_img_3_empty.json';
import flatData from './data/flat_products_list_zh.json';
import { shuffle, logSurvey, logFinish, logEvents } from './utils/utlis';
import { translate } from './utils/translate';

class Survey extends React.Component {

    changeFavicon(src) {
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
        let browsed = cookies.get('browsed')? cookies.get('browsed') : [];
        let testId = cookies.get('testId')? cookies.get('testId') : "1";

        for(let i=0; i<browsed.length; i++){
            if(browsed[i].id == this.props.targetProductId){
                browsed.splice(i ,1)
            }
            if(browsed[i].id == this.props.controlProductId){
                browsed.splice(i ,1)
            }
        }
        browsed = shuffle(browsed)
        console.log(browsed)

        let list1 = []
        let list2 = []
        // for(let i=0; i<3; i++){
        //     list1.push(this.getRandomProduct(data))
        // }
        let unseen = []
        let targetUnseenData = unseenData[this.props.targetCategory]
        let unseenKeys = Object.keys(targetUnseenData);
        let randomId = Math.floor(Math.random() * Object.keys(targetUnseenData).length)
        let unseenProductKey = unseenKeys[randomId]
        // let unseenProduct = targetUnseenData[unseenProductKey]
        let unseenProduct = flatData[unseenProductKey]
        let category = decodeURIComponent(unseenProduct.url).split('/').slice(4,7)
        unseenProduct = {
            ...unseenProduct,
            category,
            id: unseenProductKey
        }
        unseen.push(unseenProductKey)
        list1.push(unseenProduct) 
        list1.push(browsed[0]) 
        list1.push(browsed[1])
        // list1.push(browsed[2])
        let targetProduct = flatData[this.props.targetProductId]
        category = decodeURIComponent(targetProduct.url).split('/').slice(4,7)
        targetProduct = {
            ...targetProduct,
            category,
            id: this.props.targetProductId
        }
        list1.push(targetProduct)
        list1 = shuffle(list1)
        // for(let i=0; i<4; i++){
        //     list2.push(this.getRandomProduct(data))
        // }
        randomId = (randomId + 1) % (Object.keys(targetUnseenData).length)
        unseenProductKey = unseenKeys[randomId]
        // let unseenProduct = targetUnseenData[unseenProductKey]
        unseenProduct = flatData[unseenProductKey]
        category = decodeURIComponent(unseenProduct.url).split('/').slice(4,7)
        unseenProduct = {
            ...unseenProduct,
            category,
            id: unseenProductKey
        }
        unseen.push(unseenProductKey)
        list2.push(unseenProduct) 
        list2.push(browsed[3]) 
        list2.push(browsed[4])
        // list2.push(browsed[5])
        let controlProduct = flatData[this.props.controlProductId]
        category = decodeURIComponent(controlProduct.url).split('/').slice(4,7)
        controlProduct = {
            ...controlProduct,
            category,
            id: this.props.controlProductId
        }
        list2.push(controlProduct)
        list2 = shuffle(list2)

        this.state = {
            questionId: 0,
            list1,
            list2,
            list3: targetProduct,
            list4: controlProduct,
            showDialog: false,
            answer1: [],
            answer2: [],
            answer3: -1,
            answer4: -1,
            answer5: [],
            answer61: ["", "", ""],
            answer62: ["", "", ""],
            answer63: ["", "", ""],
            other: "其他",
            unseen: unseen,
            username: cookies.get('username')? cookies.get('username') : "",
            targetCategory: this.props.targetCategory,
            testId,
            empty: false
        }

        console.log(this.state)

        this.changeFavicon = this.changeFavicon.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.prevQuestion = this.prevQuestion.bind(this);
        this.changeAnswer = this.changeAnswer.bind(this);
        this.checkValid = this.checkValid.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClick2 = this.handleClick2.bind(this);
        this.finish = this.finish.bind(this);
        this.otherFactor = this.otherFactor.bind(this);
        this.logResult = this.logResult.bind(this);

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
                <Container className="vh-100">
                <Row className={"mb--4"}>
                    {
                        ((this.state.questionId > 0 && this.state.questionId < 6) || (this.state.questionId > 6)) &&
                        <Col xs={12} className="d-flex flex-row justify-content-center align-items-center my-2">
                            {/* <h2 className="mt-4">{translate("Survey") + " (" + (parseInt(this.state.questionId)-1)+ "/5)"}</h2> */}
                            <h2 className="mt--4">{"第" + (Math.min(parseInt(this.state.questionId),6))+ "題，共" + (this.state.testId == "3"?"8":"5") + "題"}</h2>
                        </Col>
                    }
                </Row>
                {this.state.questionId == 0 &&
                    // <Col xs={12}>
                    <div className="w-100 d-flex justify-content-center align-items-center flex-column" style={{height: "80%"}}>
                        <h2>恭喜！您已經完成了此任務。</h2>
                        <p className="mt-4">
                            {
                                this.state.testId == "3"?
                                "接下來，我們會請您回答八題簡單的問題。請憑您剛剛瀏覽網頁的印象來作答。" :
                                "接下來，我們會請您回答五題簡單的問題。請憑您剛剛瀏覽網頁的印象來作答。"
                            }
                        </p>
                        <button className="survey-btn" type="button" onClick={this.nextQuestion}>開始</button>
                    </div>
                    // </Col>
                }
                {((this.state.questionId > 0 && this.state.questionId < 6) || (this.state.questionId > 6)) &&
                    <div className="my-4 d-flex justify-content-center">
                        <span className={this.state.questionId == 1? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 2? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 3? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 4? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span className={this.state.questionId == 5? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span style={{display: this.state.testId == "3"? "block": "none"}} className={this.state.questionId == 7? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span style={{display: this.state.testId == "3"? "block": "none"}} className={this.state.questionId == 8? "mx-2 black-dot": "mx-2 dot"}></span>
                        <span style={{display: this.state.testId == "3"? "block": "none"}} className={this.state.questionId == 9? "mx-2 black-dot": "mx-2 dot"}></span>
                    </div>
                }
                <Row style={{display: this.state.questionId == 1? "block": "none"}}>
                    <div className="d-flex flex-column align-items-center">
                        <h5>下面有四件商品的名稱與圖片，請問在剛剛瀏覽的過程中，有哪些商品是您印象中有看過的？請將看過的商品打勾。</h5>
                        <h5>(答案可能有任意數目，如果全部都沒看過，直接按下一題即可)</h5>
                    </div>
                    <Row>
                    {
                        this.state.list1.map(element => {
                            return (
                                <SurveyProductCell hideOption key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} handleClick={this.handleClick} checkbox/>
                            )
                        })
                    }
                    </Row>
                </Row>
                <Row style={{display: this.state.questionId == 2? "block": "none"}}>
                    <div className="d-flex flex-column align-items-center">
                        <h5>下面有四件商品的名稱與圖片，請問在剛剛瀏覽的過程中，有哪些商品是您印象中有看過的？請將看過的商品打勾。</h5>
                        <h5>(答案可能有任意數目，如果全部都沒看過，直接按下一題即可)</h5>
                    </div>
                    <Row>
                    {
                        this.state.list2.map(element => {
                            return <SurveyProductCell hideOption key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} handleClick={this.handleClick} checkbox/>
                        })
                    }
                    </Row>
                </Row>
                <Row style={{display: this.state.questionId == 3? "block": "none"}}>
                    {/* <h4>請看以下商品的圖片和名稱，如果以第一印象而言，您對它感興趣的程度？</h4> */}
                    <div className="d-flex flex-column align-items-center">
                        <h5>請看以下商品的圖片和名稱，如果只看第一印象，不論價錢的話，您對它感興趣的程度？</h5>
                        {/* <h5>(如果您在其他地方看到這款商品)</h5> */}
                    </div>
                    <Row className="my--2">
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}></Col>
                        <SurveyProductCell hideOption key={this.state.list3.id} product={this.state.list3} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} handleClick={this.handleClick}/>
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <div key={`inline-radio`} className="mb-3">
                                <Form className="d-flex flex-column justify-content-center">
                                    {/* <div className="my-2"></div> */}
                                    <br/>
                                    <Form.Check inline label="非常感興趣" name="survey3" type={'radio'} id={`inline-radio-1`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="有點感興趣" name="survey3" type={'radio'} id={`inline-radio-2`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="普通" name="survey3" type={'radio'} id={`inline-radio-3`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="不太感興趣" name="survey3" type={'radio'} id={`inline-radio-4`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="完全不感興趣" name="survey3" type={'radio'} id={`inline-radio-5`} onChange={this.handleClick2} /><br/>
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
                        <SurveyProductCell hideOption key={this.state.list4.id} product={this.state.list4} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} handleClick={this.handleClick}/>
                        <Col xs={12} sm={6} md={4} lg={3} >
                            <div key={`inline-radio`} className="mb-3">
                                <Form className="d-flex flex-column justify-content-center">
                                    {/* <div className="my-2"></div> */}
                                    <br/>
                                    <Form.Check inline label="非常感興趣" name="survey4" type={'radio'} id={`inline-radio-11`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="有點感興趣" name="survey4" type={'radio'} id={`inline-radio-12`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="普通" name="survey4" type={'radio'} id={`inline-radio-13`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="不太感興趣" name="survey4" type={'radio'} id={`inline-radio-14`} onChange={this.handleClick2} /><br/>
                                    <Form.Check inline label="完全不感興趣" name="survey4" type={'radio'} id={`inline-radio-15`} onChange={this.handleClick2} /><br/>
                                </Form>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} style={{paddingLeft: "5px", paddingRight: "5px"}}></Col>
                    </Row>
                </Row>
                <Row style={{display: this.state.questionId == 5? "block": "none"}}>
                    <div className="d-flex flex-column align-items-center">
                        <h5>在本次任務的過程中，您覺得影響您選擇商品的因素為何？請勾選您覺得<strong>最重要的兩項</strong></h5>
                    </div>
                    <Col className="my-4 d-flex justify-content-center" sm={12}>
                        <div key={`inline-radio`} className="mb-3 w-50">
                            <Form.Check inline label={`商品外觀`} type={'checkbox'} name="survey5" id={`inline-radio-21`} onChange={this.handleClick2} /><br/><br/>
                            <Form.Check inline label={`商品價格`} type={'checkbox'} name="survey5" id={`inline-radio-22`} onChange={this.handleClick2} /><br/><br/>
                            <Form.Check inline label={`商品說明`} type={'checkbox'} name="survey5" id={`inline-radio-23`} onChange={this.handleClick2} /><br/><br/>
                            <Form.Check inline label={`自身對商品的需求`} type={'checkbox'} name="survey5" id={`inline-radio-24`} onChange={this.handleClick2} /><br/><br/>
                            {/* <Form.Check onClick={this.otherFactor} inline label={this.state.other} type={'radio'} name="survey5" id={`inline-radio-4`} onChange={this.handleClick2} /> */}
                        </div>
                    </Col>
                    <div className="d-flex flex-column align-items-center">
                        <h5>如果您覺得還有在上述選項中沒包含到的其他因素，請填寫在下方的欄位(非必填)：</h5>
                    </div>
                    <Col className="my-4 d-flex justify-content-center" sm={12}>
                        <Form.Group controlId="exampleForm.ControlTextarea1" className="w-50" >
                            <Form.Control as="textarea" rows="3" ref={(ref)=>{this.otherTextField = ref}} />
                        </Form.Group>
                    </Col>
                </Row>
                <div className="w-100 justify-content-center align-items-center flex-column" style={{height: "80%", display: this.state.questionId == 6? "flex": "none"}}>
                    {
                        this.state.testId == "3"?
                        <h2>本次實驗已經全部完成，感謝您的協助！</h2> :
                        <h2>感謝您的回答！接下來將進行下一階段的實驗</h2>
                    }
                    {
                        <button className="survey-btn" type="button"  size="lg" className="mx-1 my-2" style={{display: "block"}} onClick={() => {this.finish()}}>繼續</button> 
                    }
                </div>
                <div className="w-100 justify-content-center align-items-center flex-column" style={{ display: this.state.questionId > 6? "flex": "none"}}>
                <Row className="my-4" style={{display: this.state.questionId > 6? "block": "none"}}>
                    <div className="d-flex flex-column align-items-center">
                        <h5>在三次不同的任務中，我們分別採用了三種不同的驗證碼 (CAPTCHA)，如下圖：</h5>
                    </div>
                    <Row className="my-3">
                        <Col md={4} className="px-1">
                            <h5>TextCaptcha</h5>
                            <span>文字驗證碼，最傳統的驗證碼形式。</span><br/>
                            <span>題目為輸入經過處理的文字</span>
                            <div className="mt-2" style={{minHeight: "360px"}}>
                                <img width="240" src="https://i.imgur.com/Fb80XyH.jpg"></img>
                            </div>
                        </Col>
                        <Col md={4} className="px-1">
                            <h5>ReCaptcha</h5>
                            <span>Google所提出的圖像驗證碼</span><br/>
                            <span>題目為找出指定類型的照片</span>
                            <div className="mt-2" style={{minHeight: "360px"}}>
                                <img width="240" src="https://i.imgur.com/yAaN0xC.jpg"></img>
                            </div>
                        </Col>
                        <Col md={4} className="px-1">
                            <h5>YouCaptcha</h5>
                            <span>與ReCaptcha類似的圖像驗證碼</span><br/>
                            <span>題目為找出相同物品的圖片</span>
                            <div className="mt-2" style={{minHeight: "360px"}}>
                                <img width="240" src="https://i.imgur.com/9CmPnPr.jpg"></img>
                            </div>
                        </Col>
                    </Row>
                    <hr className="my-4" style={{width: "100%", height: "1px", border: "none", backgroundColor: "gray"}}/>
                    <Row className="my-4" style={{display: this.state.questionId == 7 ? "flex": "none"}}>
                        <Col className="mb-2" md={12}><h4>請將這三種驗證碼按＂解題難易度＂排名</h4></Col>
                        <Col md={4} className="d-flex flex-row">
                            <span>第一名：</span>
                            <DropdownButton variant="outline-secondary" id="dropdown-basic-button" title={this.state.answer61[0] == ""? "請選擇": this.state.answer61[0]}>
                                <Dropdown.Item href="#" onSelect={()=>{let answer61 = this.state.answer61; answer61[0]="ReCaptcha"; this.setState({answer61: answer61.slice()})}}>ReCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer61 = this.state.answer61; answer61[0]="TextCaptcha"; this.setState({answer61: answer61.slice()})}}>TextCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer61 = this.state.answer61; answer61[0]="YouCaptcha"; this.setState({answer61: answer61.slice()})}}>YouCaptcha</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                        <Col md={4} className="d-flex flex-row">
                            <span>第二名：</span>
                            <DropdownButton variant="outline-secondary" id="dropdown-basic-button" title={this.state.answer61[1] == ""? "請選擇": this.state.answer61[1]}>
                                <Dropdown.Item href="#" onSelect={()=>{let answer61 = this.state.answer61; answer61[1]="ReCaptcha"; this.setState({answer61: answer61.slice()})}}>ReCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer61 = this.state.answer61; answer61[1]="TextCaptcha"; this.setState({answer61: answer61.slice()})}}>TextCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer61 = this.state.answer61; answer61[1]="YouCaptcha"; this.setState({answer61: answer61.slice()})}}>YouCaptcha</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                        <Col md={4} className="d-flex flex-row">
                            <span>第三名：</span>
                            <DropdownButton variant="outline-secondary" id="dropdown-basic-button" title={this.state.answer61[2] == ""? "請選擇": this.state.answer61[2]}>
                                <Dropdown.Item href="#" onSelect={()=>{let answer61 = this.state.answer61; answer61[2]="ReCaptcha"; this.setState({answer61: answer61.slice()})}}>ReCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer61 = this.state.answer61; answer61[2]="TextCaptcha"; this.setState({answer61: answer61.slice()})}}>TextCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer61 = this.state.answer61; answer61[2]="YouCaptcha"; this.setState({answer61: answer61.slice()})}}>YouCaptcha</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                    <Row className="my-4" style={{display: this.state.questionId == 8 ? "flex": "none"}}>
                        <Col className="mb-2" md={12}><h4>請將這三種驗證碼按＂解題成就感＂排名</h4></Col>
                        <Col md={4} className="d-flex flex-row">
                            <span>第一名：</span>
                            <DropdownButton variant="outline-secondary" id="dropdown-basic-button" title={this.state.answer62[0] == ""? "請選擇": this.state.answer62[0]}>
                                <Dropdown.Item href="#" onSelect={()=>{let answer62 = this.state.answer62; answer62[0]="ReCaptcha"; this.setState({answer62: answer62.slice()})}}>ReCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer62 = this.state.answer62; answer62[0]="TextCaptcha"; this.setState({answer62: answer62.slice()})}}>TextCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer62 = this.state.answer62; answer62[0]="YouCaptcha"; this.setState({answer62: answer62.slice()})}}>YouCaptcha</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                        <Col md={4} className="d-flex flex-row">
                            <span>第二名：</span>
                            <DropdownButton variant="outline-secondary" id="dropdown-basic-button" title={this.state.answer62[1] == ""? "請選擇": this.state.answer62[1]}>
                                <Dropdown.Item href="#" onSelect={()=>{let answer62 = this.state.answer62; answer62[1]="ReCaptcha"; this.setState({answer62: answer62.slice()})}}>ReCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer62 = this.state.answer62; answer62[1]="TextCaptcha"; this.setState({answer62: answer62.slice()})}}>TextCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer62 = this.state.answer62; answer62[1]="YouCaptcha"; this.setState({answer62: answer62.slice()})}}>YouCaptcha</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                        <Col md={4} className="d-flex flex-row">
                            <span>第三名：</span>
                            <DropdownButton variant="outline-secondary" id="dropdown-basic-button" title={this.state.answer62[2] == ""? "請選擇": this.state.answer62[2]}>
                                <Dropdown.Item href="#" onSelect={()=>{let answer62 = this.state.answer62; answer62[2]="ReCaptcha"; this.setState({answer62: answer62.slice()})}}>ReCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer62 = this.state.answer62; answer62[2]="TextCaptcha"; this.setState({answer62: answer62.slice()})}}>TextCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer62 = this.state.answer62; answer62[2]="YouCaptcha"; this.setState({answer62: answer62.slice()})}}>YouCaptcha</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                    <Row className="my-4" style={{display: this.state.questionId == 9 ? "flex": "none"}}>
                        <Col className="mb-2" md={12}><h4>請將這三種驗證碼按＂您個人的喜好＂排名</h4></Col>
                        <Col md={4} className="d-flex flex-row">
                            <span>第一名：</span>
                            <DropdownButton variant="outline-secondary" id="dropdown-basic-button" title={this.state.answer63[0] == ""? "請選擇": this.state.answer63[0]}>
                                <Dropdown.Item href="#" onSelect={()=>{let answer63 = this.state.answer63; answer63[0]="ReCaptcha"; this.setState({answer63: answer63.slice()})}}>ReCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer63 = this.state.answer63; answer63[0]="TextCaptcha"; this.setState({answer63: answer63.slice()})}}>TextCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer63 = this.state.answer63; answer63[0]="YouCaptcha"; this.setState({answer63: answer63.slice()})}}>YouCaptcha</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                        <Col md={4} className="d-flex flex-row">
                            <span>第二名：</span>
                            <DropdownButton variant="outline-secondary" id="dropdown-basic-button" title={this.state.answer63[1] == ""? "請選擇": this.state.answer63[1]}>
                                <Dropdown.Item href="#" onSelect={()=>{let answer63 = this.state.answer63; answer63[1]="ReCaptcha"; this.setState({answer63: answer63.slice()})}}>ReCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer63 = this.state.answer63; answer63[1]="TextCaptcha"; this.setState({answer63: answer63.slice()})}}>TextCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer63 = this.state.answer63; answer63[1]="YouCaptcha"; this.setState({answer63: answer63.slice()})}}>YouCaptcha</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                        <Col md={4} className="d-flex flex-row">
                            <span>第三名：</span>
                            <DropdownButton variant="outline-secondary" id="dropdown-basic-button" title={this.state.answer63[2] == ""? "請選擇": this.state.answer63[2]}>
                                <Dropdown.Item href="#" onSelect={()=>{let answer63 = this.state.answer63; answer63[2]="ReCaptcha"; this.setState({answer63: answer63.slice()})}}>ReCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer63 = this.state.answer63; answer63[2]="TextCaptcha"; this.setState({answer63: answer63.slice()})}}>TextCaptcha</Dropdown.Item>
                                <Dropdown.Item href="#" onSelect={()=>{let answer63 = this.state.answer63; answer63[2]="YouCaptcha"; this.setState({answer63: answer63.slice()})}}>YouCaptcha</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                </Row>
                </div>
                {
                    this.state.empty &&
                    <Row className="my-2 d-flex justify-content-center">
                        <h3 className="text-danger">
                            請完成作答再前往下一題
                        </h3>
                    </Row>
                }
                {
                    (this.state.questionId > 0 && this.state.questionId < 6) &&
                    <Row className="my-2 d-flex justify-content-center">
                        <button className="survey-btn mx-1" type="button" size="lg" style={{display: this.state.questionId == 1? "none": "block"}} onClick={() => this.prevQuestion()}>上一題</button>
                        <button className="survey-btn mx-1" type="button" size="lg" style={{display: this.state.questionId == 5? this.state.testId != "3"? "none": "block": "block"}} onClick={() => this.nextQuestion()}>下一題</button>
                        <button className="survey-btn mx-1" type="button" size="lg" style={{display: this.state.questionId == 5? this.state.testId != "3"? "block": "none": "none"}} onClick={() => {this.nextQuestion()}}>完成</button> 
                    </Row>
                }
                {
                    (this.state.questionId > 6) &&
                    <Row className="my-2 d-flex justify-content-center">
                        <button className="survey-btn mx-1" type="button" size="lg" style={{display: this.state.questionId == 1? "none": "block"}} onClick={() => this.prevQuestion()}>上一題</button>
                        <button className="survey-btn mx-1" type="button" size="lg" style={{display: this.state.questionId == 9? "none": "block"}} onClick={() => this.nextQuestion()}>下一題</button>
                        <button className="survey-btn mx-1" type="button" size="lg" style={{display: this.state.questionId == 9? "block": "none"}} onClick={() => {this.nextQuestion()}}>完成</button> 
                    </Row>
                }
            </Container>
            </div>
        )
    }

    otherFactor() {
        let factor = prompt("請填寫原因：")
        if(!factor || factor == "") return
        this.setState({
            other: factor
        })
        console.log(factor)
    }

    changeAnswer(e) {
        console.log(e.target)
    }

    checkValid() {
        if(this.state.questionId == 1 && this.state.answer1.length < 1){
            return false
        }
        if(this.state.questionId == 2 && this.state.answer2.length < 1){
            return false
        }
        if(this.state.questionId == 3 && this.state.answer3 == -1){
            return false
        }
        if(this.state.questionId == 4 && this.state.answer4 == -1){
            return false
        }
        if(this.state.questionId == 5 && this.state.answer5.length !== 2){
            return false
        }
        if(this.state.questionId == 7){
            if(!this.state.answer61.includes("ReCaptcha"))
                return false
            if(!this.state.answer61.includes("YouCaptcha"))
                return false
            if(!this.state.answer61.includes("TextCaptcha"))
                return false
        }
        if(this.state.questionId == 8){
            if(!this.state.answer62.includes("ReCaptcha"))
                return false
            if(!this.state.answer62.includes("YouCaptcha"))
                return false
            if(!this.state.answer62.includes("TextCaptcha"))
                return false
        }
        if(this.state.questionId == 9){
            if(!this.state.answer63.includes("ReCaptcha"))
                return false
            if(!this.state.answer63.includes("YouCaptcha"))
                return false
            if(!this.state.answer63.includes("TextCaptcha"))
                return false
        }
        return true
    }

    nextQuestion() {
        console.log("nextQuestion")
        // console.log(this.otherTextField.value)
        if(!this.checkValid()){
            this.setState({
                empty: true
            })
            return
        }
        else{
            this.setState({
                empty: false
            })
        }
        let nextQuestionId = this.state.questionId + 1
        if(nextQuestionId == 6 && this.state.testId == "3") {
            nextQuestionId = 7
        }
        if(this.state.questionId == 9){
            nextQuestionId = 6
        }
        this.setState({
            questionId: nextQuestionId,
            other: this.otherTextField.value? this.otherTextField.value: "其他"
        })
    }

    prevQuestion() {
        let nextQuestionId = Math.max(this.state.questionId - 1, 1)
        if(nextQuestionId == 6){
            nextQuestionId = 5
        }
        this.setState({
            questionId: nextQuestionId
        })
    }

    finish() {
        this.setState({
            showDialog: false
        })
        this.logResult()

        if(this.state.testId == "3"){
            return
        }

        document.title = 'KocoShop';
        this.changeFavicon("/shopping-cart.png");

        setTimeout(()=>{
            this.props.nextTest()
            this.props.clearCart()
            this.props.history.push('') 
        }, 250)
    }

    logResult() {

        logSurvey(this.state)
        logEvents()
        setTimeout(() => {
            logFinish(this.state)
        }, 200)
    }

    handleClick(productId, selected) {
        let answer = []
        if(this.state.questionId == 1){
            answer = this.state.answer1
        }
        else if(this.state.questionId == 2){
            answer = this.state.answer2
        }

        if(!answer.includes(productId) && selected){
            answer.push(productId)
        }
        if(answer.includes(productId) && !selected){
            let index = answer.indexOf(productId)
            answer.splice(index, 1)
        }

        // console.log(answer)

        if(this.state.questionId == 1){
            this.setState({answer1: answer.slice()})
        }
        else if(this.state.questionId == 2){
            this.setState({answer2: answer.slice()})
        }
    }

    handleClick2(e) {
        console.log(e.target)
        let answer = parseInt(e.target.id.slice(-1))

        if(e.target.name == "survey3"){
            this.setState({
                answer3: answer
            })
        }
        else if(e.target.name == "survey4"){
            this.setState({
                answer4: answer
            })
        }
        else if(e.target.name == "survey5"){
            let answer5 = this.state.answer5
            if(answer5.includes(answer)){
                let index = answer5.indexOf(answer)
                answer5.splice(index, 1)
            }   
            else{
                answer5.push(answer)
            }
            this.setState({
                answer5: answer5
            })
        }
    }
}

export default withRouter(withCookies(Survey));