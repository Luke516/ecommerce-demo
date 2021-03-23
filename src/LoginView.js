import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert, Modal, InputGroup, Form, FormControl } from 'react-bootstrap';
import { useQuery } from 'react-apollo';
import { gql } from "apollo-boost";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { translate } from './utils/translate';
import YouCaptchaApp from './YouCaptcha/YouCaptchaApp'
import LoginBackground from './img/bg-pattern.png'


import './LoginView.css';

class LoginView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showPassword: false,
            empty: false,
            wrong: false,
            captchaVerified: false,
            textCaptchaRefreshing: false,
        }

        this.handleClick = this.handleClick.bind(this)
        this.otherCaptchaSuccess = this.otherCaptchaSuccess.bind(this)
        this.toggleShowPassword = this.toggleShowPassword.bind(this)
        this.recaptchaCheck = this.recaptchaCheck.bind(this)
        this.showLoginButton = this.showLoginButton.bind(this)
        this.refreshTextCaptcha = this.refreshTextCaptcha.bind(this)
    }

    render(){
        return (
            <div id="login" style={{backgroundImage: `url(${LoginBackground})`, backgroundColor: "linear-gradient(to left, #003e3e, #005ab5)"}}>
                <div id="login-view" className="h-100 py-4">
                        {/* <div className="brand-div">
                            
                        </div> */}
                    <Modal.Header className="justify-content-center align-items-baseline" style={{borderBottom: 0}}>
                        <Modal.Title className="d-flex align-items-center">
                        <img
                            alt=""
                            src="shopping-cart.png"
                            width="64"
                            height="64"
                            className="d-inline-block align-top"
                            />{' '}
                        <span className="p-0 mr-2 brand ">{`KocoShop`}</span>
                        {(this.props.captchaVerified && this.props.captchaType == "YouCaptcha") ? translate("Welcome") + ", " + this.props.username : translate("Login Your Account")}
                        </Modal.Title>
                        {/*
                            !this.props.captchaVerified &&
                            <span className="mx-2 text-secondary text-muted">
                                沒有帳號？請先<a href="#">註冊</a>
                            </span>
                        */}      
                    </Modal.Header>
                    <Modal.Body className="mt-2">
                        <Form className="d-flex flex-row justify-content-center">
                        <div className={(this.props.captchaVerified && this.props.captchaType == "YouCaptcha")
                            ?"justify-content-center align-items-center ml-2 d-flex flex-column w-100 shrink mr-4 pr-4":"justify-content-center align-items-center ml-2 d-flex flex-column w-100 mr-4 pr-4"}>
                            <InputGroup className="d-flex align-items-center mb-3" style={{borderRadius:"0.25rem"}}>
                                <InputGroup.Prepend>
                                    {/* <label htmlFor="basic-url">{translate("Username")}</label>    */}
                                    <span className="mr-2">{translate("Username")}</span>
                                </InputGroup.Prepend> 
                                <FormControl
                                className={this.props.usernameValid? "": "is-invalid"}
                                required 
                                placeholder={translate("Enter username...")}
                                aria-label="username"
                                aria-describedby="basic-addon"
                                onChange={this.props.handleUserNameChange}
                                />
                            </InputGroup>
                            <InputGroup className="d-flex align-items-center mb-3" style={{borderRadius:"0.25rem"}}>
                                <InputGroup.Prepend>
                                    {/* <label htmlFor="basic-url">{translate("Password")}</label>   */}
                                    <span className="mr-2">{translate("Password")}</span>  
                                </InputGroup.Prepend> 
                                <FormControl
                                type={this.state.showPassword?"text":"password"}
                                className={this.props.passwordValid? "": "is-invalid"}
                                required
                                placeholder={translate("Enter password...")}
                                aria-label="password"
                                aria-describedby="basic-addon2"
                                onChange={this.props.handlePasswordChange}
                                />
                                <InputGroup.Append onClick={this.toggleShowPassword}>
                                    <InputGroup.Text className="toggle-password">
                                        {   this.state.showPassword?
                                            <FontAwesomeIcon icon={faEye}/>:
                                            <FontAwesomeIcon icon={faEyeSlash}/>
                                        }
                                    </InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                            {
                                this.props.wrongPassword &&
                                <div className="justify-content-center" style={{display: this.props.wrongPassword? "flex": "none"}}>
                                    <div className="captcha-error">
                                        <span className="text-danger">帳號或密碼錯誤</span>
                                    </div>
                                </div>
                            }
                            <div>
                                <a href="#" className="text-">忘記密碼？</a>
                            </div>
                            {/* <div className="my-3 d-flex justify-content-center align-items-center">
                                <div class="left-seperator"></div>
                                <span class="">其他登入方式</span>
                                <div class="right-seperator"></div>
                            </div>
                            <div className="d-flex flex-row">
                                <Button variant="google text-light" className="d-flex align-items-center google-login mr-2"><FontAwesomeIcon icon={faGoogle}/>Google<span></span></Button>
                                <Button variant="facebook text-light" className="d-flex align-items-center facebook-login ml-2"><FontAwesomeIcon icon={faFacebookF}/>Facebook<span></span></Button>
                            </div> */}
                            <Button className="px-2 my-2 w-25" onClick={this.props.userLogin}>{translate('Login Your Account')}</Button>
                        </div>
                        {/* <div className={(this.props.captchaVerified && this.props.captchaType == "YouCaptcha")?"ww-50 scale":"ww-50"} style={{minHeight: this.props.captchaType == "YouCaptcha"? this.props.captchaVerified? "160px" :"120px":"80px"}}>
                            {this.props.captchaType == "textCaptcha" && 
                                <YouCaptchaApp captchaId={this.props.captchaId} captchaIdList={this.props.captchaIdList} onVerify={() => {}} onSuccess={this.props.captchaSuccess} closeAd={this.props.closeDialog}/>}
                            {this.props.captchaType == "YouCaptcha" && 
                                <YouCaptchaApp captchaId={this.props.captchaId} captchaIdList={this.props.captchaIdList} onVerify={() => {}} onSuccess={this.props.captchaSuccess} closeAd={this.props.closeDialog}/>}
                            {this.props.captchaType == "ReCaptcha" && 
                                <YouCaptchaApp captchaId={this.props.captchaId} captchaIdList={this.props.captchaIdList} onVerify={() => {}} onSuccess={this.props.captchaSuccess} closeAd={this.props.closeDialog}/>}
                            
                            <div className="justify-content-center mt-3" style={{display: (this.props.captchaVerified && this.props.captchaType == "ReCaptcha")? "flex": "none"}}>
                            {
                                <Button className="px-2 w-25" onClick={this.props.userLogin}>{translate('Login Your Account')}</Button>
                            }
                            </div>
                        </div> */}
                        </Form>
                        <div className="mb-1"></div>
                    </Modal.Body>
                </div>
            </div>
        );
    }
    
    otherCaptchaSuccess(){
        if(this.props.captchaSuccess(true)){
            if(this.props.captchaType !== "YouCaptcha"){
                this.setState({
                    captchaVerified: true
                })
            }
        }
        // setTimeout(()=>{
        //     this.props.closeDialog()
        // }, 1000)
    }

    handleClick(e) {
        e.preventDefault();
        this.props.handleClick(e);
        return;
        if(!this.props.captchaSuccess()){
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
        if(this.props.captcha === this.captchaEnter.value){
            this.setState({
                empty: false,
                wrong: false
            })
            this.props.handleClick(e)
        }
        else{
            this.setState({
                empty: false,
                wrong: true
            })
        }
    }

    toggleShowPassword() {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    recaptchaCheck(click = true) {
        // console.log()
        if(click){
            this.setState({
                empty: !this.props.captchaSuccess()
            })
        }
    }

    refreshTextCaptcha() {
        this.setState({
            textCaptchaRefreshing: true
        }, ()=>{
            setTimeout(()=>{
                this.setState({
                    textCaptchaRefreshing: false
                })
            }, 500)
        })
    }

    showLoginButton() {

    }
}

export default LoginView;