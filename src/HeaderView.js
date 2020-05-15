import React from 'react';
import CaptchaHeaderView from './CaptchaHeaderView'
import InvisibleCaptchaView from './InvisibleCaptchaView'
import './CaptchaView.css';

function HeaderView(props) {

    if (!props.showCaptcha)
        return (
            <InvisibleCaptchaView captchaId={props.captchaId} toggleCaptcha={props.toggleCaptcha}/>
        );
    else 
        return (
            <CaptchaHeaderView captchaId={props.captchaId} finish={false} success={props.result.status != "incorrect"} result={props.result}/>
        );
}

export default HeaderView;