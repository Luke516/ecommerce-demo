import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useQuery } from 'react-apollo';
import { gql } from "apollo-boost";
import './InvisibleCaptchaView.css';

const GET_CAPTCHAS = gql`
  query Captchas($id: Int!) {
    targetCaptcha(id: $id) {
      id,
      question,
      candidates
    }
  }
`;

function InvisibleCaptchaView(props) {
    const [checkAnimation, setCheckAnimation] = useState(false);

    // const { loading, error, data } = useQuery(GET_CAPTCHAS);
    const { loading, error, data, refetch } = useQuery(
        GET_CAPTCHAS,{
          variables: {
            id: props.captchaId,
          },
          errorPolicy: 'all'
        }
    );
    
    if(loading){
        return(
            <div>
                loading...
            </div>
        )
    }
    if(error){
        return(
            <div>
                error...
            </div>
        )
    }
    return (
        <>
        <Row className="mt-3 mb-2 captcha-row justify-content-between align-items-center text-left">
            <div className="d-flex align-items-center">
                <div className="checkbox-container">
                    {checkAnimation?
                    <Spinner className="youcaptcha-spinner" animation="border" role="status" variant="primary">
                        <span className="sr-only">Loading...</span>
                    </Spinner>:
                    <div className="youcaptcha-checkbox"
                        // onClick={this.props.toggleCaptcha}
                        onClick={() => {
                            setCheckAnimation(true); 
                            setTimeout(() => {
                                props.toggleCaptcha();
                            }, 1000);
                        }/*this.props.checkCaptcha*/}
                        style={{display: /*this.props.captcha.success? "none": */"block"}}
                        aria-controls="captchaBody"
                        aria-expanded={false/*this.props.captcha.start*/}
                    />
                    }
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" style={{display: /*this.props.captcha.success? "inline-block":*/ "none"}}>
                        {/* <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/> */}
                        {/* <polyline className={this.props.captcha.success? "path check" : ""} fill="none" stroke="#73AF55" strokeWidth="10" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/> */}
                    </svg>
                </div>
                {/* <span className="ml-2">I'm not a robot</span> */}
                <span className="ml-2">我不是機器人</span>
            </div>
            <div className="sponser">
                {/* <span className="small-text">YouCaptcha</span> */}
                {/* <img src={icon} width="40px" height="40px"/> */}
                <span className="small-text" style={{color:"gray", marginLeft:"5px"}}>YouCaptcha</span>
                <div>
                    <img className={/*this.props.captcha.success? "" :*/ ""} src={data.targetCaptcha.question} width="40px" height="40px" style={{borderRadius: "2px"}}/> 
                    <img className={/*this.props.captcha.success? "slideFade2" :*/ ""} src={data.targetCaptcha.question} width="40px" height="40px" style={{borderRadius: "2px"}}/>
                </div>
                {/* <span className="small-text" style={{visibility: "hidden"}}>YouCaptcha</span> */}
                <span className="small-text text-secondary"><a className="text-secondary" href="#">Privacy</a> - <a className="text-secondary" href="#">Terms</a></span>
            </div>
        </Row>
        <Row className="mb-2 captcha-row">
            {/* <span className="small-text"><a href="#">Privacy</a> - <a href="#">Terms</a></span> */}
        </Row>
        </>
    );
}

export default InvisibleCaptchaView;