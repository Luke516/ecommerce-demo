import React from 'react';
import './App.css';
import priceData from './data/prices2All.json';
import flatData from './data/flat_products_list_zh.json';

import {withRouter} from 'react-router-dom'
import { Modal, InputGroup, Form, FormControl,Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { translate } from './utils/translate';
import RCG from 'react-captcha-generator';
import Recaptcha from 'react-recaptcha';
import YouCaptchaApp from './YouCaptcha/YouCaptchaApp'

class LoginModal extends React.Component {
  
    constructor(props) {
        super(props);

        this.state = {
            showPassword: false,
            empty: false,
            wrong: false,
            captchaVerified: false
        }

        this.handleClick = this.handleClick.bind(this)
        this.otherCaptchaSuccess = this.otherCaptchaSuccess.bind(this)
        this.toggleShowPassword = this.toggleShowPassword.bind(this)
        this.recaptchaCheck = this.recaptchaCheck.bind(this)
        this.showLoginButton = this.showLoginButton.bind(this)
    }
  
    render (){
        return (
            <Modal show={this.props.showLogin} onHide={this.props.closeDialog} dialogClassName="login-dialog" centered>
                <Modal.Header closeButton className="align-items-baseline" style={{borderBottom: 0}}>
                    <Modal.Title>
                    {this.props.captchaVerified? translate("Welcome") + ", " + this.props.username : translate("Login Your Account")}
                    </Modal.Title>
                    {
                        !this.props.captchaVerified &&
                        <span className="mx-2 text-secondary text-muted">
                            沒有帳號？請先<a href="#">註冊</a>
                        </span>
                }      
                </Modal.Header>
                <Modal.Body className="mt-2">
                    <Form className="d-flex flex-row justify-content-center">
                    <div className={(this.props.captchaVerified && this.props.captchaType == "YouCaptcha")
                        ?"justify-content-center ml-2 d-flex flex-column ww-50 shrink vertLine mr-4 pr-4":"justify-content-center ml-2 d-flex flex-column ww-50 vertLine mr-4 pr-4"}>
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
                    </div>
                    <div className={(this.props.captchaVerified && this.props.captchaType == "YouCaptcha")?"ww-50 scale":"ww-50"} style={{minHeight: this.props.captchaType == "YouCaptcha"? this.props.captchaVerified? "160px" :"120px":"80px"}}>
                        {/* {
                            !this.props.captchaVerified &&
                            <p>完成驗證碼</p>
                        } */}
                        {this.props.captchaType == "textCaptcha" && 
                            <div className="text-captcha">
                                <RCG result={this.props.result} />
                            </div>
                        }
                        {this.props.captchaType == "textCaptcha" && 
                            <>
                            <form className="d-flex flex-row" onSubmit={this.handleClick}>
                                <input type='text' className={'d-flex w-75 form-control'} placeholder={translate("Enter captcha...")} ref={ref => this.captchaEnter = ref} />
                                {/* <input type='submit' /> */}
                                <Button className="mx-2" onClick={this.handleClick}>{translate("Proceed")}</Button>
                            </form>
                            <div className="my-3 justify-content-center" style={{display: (this.state.empty || this.state.wrong)? "flex": "none"}}>
                                <div className="captcha-error">
                                {this.state.empty && <span className="text-danger">請完成必要欄位</span>}
                                {this.state.wrong && <span className="text-danger">驗證碼錯誤</span>}
                                </div>
                            </div>
                            </>
                        }
                        {this.props.captchaType == "YouCaptcha" && 
                            <YouCaptchaApp captchaId={this.props.captchaId} onVerify={() => {}} onSuccess={this.props.captchaSuccess} closeAd={this.props.closeDialog}/>}
                        {this.props.captchaType == "ReCaptcha" && 
                            <div onClick={this.recaptchaCheck}>
                                <div className={(this.props.usernameValid && this.props.passwordValid)? (this.props.username == "" || this.props.password == "")? "disabled-element": "enabled-element": "disabled-element"}>
                                    <Recaptcha sitekey="6LfG6rkUAAAAAOxhm3p9iOJZ-92gHJb_UGtsTxpE" 
                                        render="explicit" 
                                        onloadCallback={()=>{console.log("onload")}} 
                                        verifyCallback={this.otherCaptchaSuccess}  />
                                </div>
                                <div className="justify-content-center" style={{display: this.state.empty? "flex": "none"}}>
                                    <div className="captcha-error">
                                    <span className="text-danger">請完成必要欄位</span>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="justify-content-center my-3" style={{display: (this.props.captchaVerified && this.props.captchaType !== "YouCaptcha")? "flex": "none"}}>
                           {
                               <Button className="px-2" onClick={this.props.userLogin}>{translate('Login Your Account')}</Button>
                           }
                        </div>
                    </div>
                    </Form>
                    <div className="mb-1"></div>
                </Modal.Body>
            </Modal>
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

    showLoginButton() {

    }
}

export default LoginModal