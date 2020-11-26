import React from 'react';
import './App.css';

import {withRouter} from 'react-router-dom'
import { Modal, InputGroup, Form, FormControl,Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import YouCaptchaApp from './YouCaptcha/YouCaptchaApp'

class LoginModal extends React.Component {
  
    constructor(props) {
        super(props);

        this.state = {
            empty: false,
            wrong: false,
            captchaVerified: false,
        }

        this.handleClick = this.handleClick.bind(this)
        this.otherCaptchaSuccess = this.otherCaptchaSuccess.bind(this)
        this.recaptchaCheck = this.recaptchaCheck.bind(this)
    }
  
    render (){
        return (
            <div className={(this.props.captchaVerified && this.props.captchaType == "YouCaptcha")?"ww-50 scale":"ww-50"} style={{minHeight: this.props.captchaType == "YouCaptcha"? this.props.captchaVerified? "160px" :"120px":"80px"}}>
                {this.props.captchaType == "YouCaptcha" && 
                    <YouCaptchaApp captchaId={this.props.captchaId} captchaIdList={this.props.captchaIdList} onVerify={() => {}} onSuccess={this.props.captchaSuccess} closeAd={this.props.closeDialog}/>}
                <div className="justify-content-center mt-3" style={{display: (this.props.captchaVerified && this.props.captchaType == "ReCaptcha")? "flex": "none"}}>
                    {
                        <Button className="px-2 w-25" onClick={this.props.userLogin}>{('Login Your Account')}</Button>
                    }
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

    recaptchaCheck(click = true) {
        if(click){
            this.setState({
                empty: !this.props.captchaSuccess()
            })
        }
    }
}

export default LoginModal