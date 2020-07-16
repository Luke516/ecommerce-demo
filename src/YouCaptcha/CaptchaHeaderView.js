import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button, Fade } from 'react-bootstrap';
import { useQuery } from 'react-apollo';
import { gql } from "apollo-boost";
import './CaptchaView.css';
import './CaptchaHeaderView.css'

import flatData from '../data/flat_products_list_zh.json';

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
    const [originImgLoad, setOriginImgLoad] = useState(false);

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
            let origin = new Image()
            origin.onload = () => {
                setOriginImgLoad(true);
            }
            origin.src = props.result.origin
            setTimeout(() => {
                setShowAd(true);
            }, 1200);
        }
      }, [props.success]);

    if(error){
        return (
            <div>error</div>
        )
    }

    return (
        <> 
        <Row className={(showAd&&originImgLoad)?"my-4 captcha-row":"title captcha-row"}>
            <div className={"youcaptcha-image-container"} style={{width: "110px"}}>
                <img className={(props.success&&originImgLoad)? "slide" : "youcaptcha-hide"} src={props.result.origin} />
                <img className={(props.success&&originImgLoad)? "slideFade" : "youcaptcha-img"} src={loading? "": data.targetCaptcha.question} />
                <div className={props.success? "check-shift" : ""} style={{width: "100px", height: "100px", zIndex: "200"}}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" style={{display: props.success? "inline-block": "none", zIndex:"200"}}>
                        <polyline className={props.success? "path check" : ""} fill="none" stroke="#73AF55" strokeWidth="10" strokeLinecap="square" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                        <circle className={props.success? "path circle" : ""} cx="60" cy="60" r="50" stroke="#73AF55" stroke-width="10" strokeLinecap="square" strokeMiterlimit="10" fill-opacity="0" />
                    </svg>  
                    {/* <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" style={{display: props.success? "inline-block": "none", zIndex:"200"}}>
                        <polyline className={props.success? "path check" : ""} fill="none" stroke="#73AF55" strokeWidth="10" strokeLinecap="square" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                        <circle className={props.success? "path circle" : ""} cx="50" cy="50" r="45" stroke="#73AF55" stroke-width="10" strokeLinecap="square" strokeMiterlimit="10" fill-opacity="0" />
                    </svg>   */}
                    {/* <svg style={{width: "100px", height: "100px", zIndex: "200"}}>
                        <circle class="circle" cx="50" cy="50" r="45" stroke="#231f20" stroke-width="10" fill-opacity="0" />
                    </svg> */}
                </div>
            </div>
            {/* {!showAd } */}
            <Fade in={!props.success} style={{visibility: showAd?"hidden":"visible"}}>
                <div className="youcaptcha-description">
                    <h5>請從以下的九宮格中，選出一個以上與左圖相同的物品</h5>
                </div>
            </Fade>
            {
                showAd &&
                <div className="youcaptcha-ad fadeIn" >
                    <div className="youcaptcha-ad-text my-2">
                        <h4>{flatData[decodeURIComponent(props.result.origin).split("/").pop().substr(0,10)].name}</h4>
                    </div>
                    <div>
                        <Button className="mx-1" style={{width: "7.5rem"}} size="lg" href={"http://localhost:3000/Product?p=" + decodeURIComponent(props.result.origin).split("/").pop().substr(0,10)}>去看看</Button>
                        <Button variant={"secondary"} className="mx-1" style={{width: "7.5rem"}} size="lg" target="_blank" rel="noopener noreferrer" href={""} onClick={props.closeAd}>略過</Button>
                    </div>
                </div>
            }
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