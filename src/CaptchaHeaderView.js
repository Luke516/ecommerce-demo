import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button, Fade } from 'react-bootstrap';
import { useQuery } from 'react-apollo';
import { gql } from "apollo-boost";
import './CaptchaView.css';
import './CaptchaHeaderView.css'

const GET_CAPTCHAS = gql`
  query Captchas($id: Int!) {
    targetCaptcha(id: $id) {
      id,
      question,
      candidates
    }
  }
`;

function CaptchaHeaderView(props) {
    const [showAd, setShowAd] = useState(false);

    // const { loading, error, data } = useQuery(GET_CAPTCHAS);
    const { loading, error, data, refetch } = useQuery(
        GET_CAPTCHAS,{
          variables: {
            id: props.captchaId,
          },
          errorPolicy: 'all'
        }
    );

    useEffect(() => {
        if(props.success && !showAd){
            setTimeout(() => {
                setShowAd(true);
            }, 2000);
        }
      }, [props.success]);

    let width = "120px";
    let height = "120px";
    if(error){
        return (
            <div>error</div>
        )
    }
    return (
        <> 
        <Row className="title captcha-row">
            <div className="youcaptcha-image-container" style={{width: showAd? "260px": "130px"}}>
                <img className={props.success? "slide youcaptcha-img" : "youcaptcha-hide"} src={props.result.origin} />
                <img className={props.success? "slideFade youcaptcha-img" : "youcaptcha-img"} src={loading? "": data.targetCaptcha.question} />
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" style={{display: props.success? "inline-block": "none"}}>
                    <polyline className={props.success? "path check" : ""} fill="none" stroke="#73AF55" strokeWidth="10" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                </svg> 
            </div>
            {!showAd?
            <Fade in={!props.success}>
                <div className="youcaptcha-description">
                    <h5>請從以下的九宮格中，選出與左圖相同的物品</h5>
                </div>
            </Fade>:
            <Fade in={showAd}>
                <div className="youcaptcha-ad" >
                    <span style={{fontSize: "14px"}}>{props.result.title}</span><br/>
                    <Button size="sm" target="_blank" rel="noopener noreferrer" href={"https://www.amazon.com/dp/"/* + this.props.captcha.captchaUrls[10].split("/").pop().substr(0,10)*/}>Check it out</Button>
                </div>
            </Fade>}
        </Row>
        {/* <Row style={{display: this.props.captcha.finish? "block": "none", maxWidth: "360px"}}>
            <Alert variant={this.props.captcha.success? "success": "danger"}>
                {this.props.captcha.success? "success": "fail"}
            </Alert>         
        </Row> */}
        </>
    );

}

export default CaptchaHeaderView;