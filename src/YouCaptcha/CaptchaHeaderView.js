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
                <img className={(showAd&&originImgLoad)? "slide" : "youcaptcha-hide"} src={props.result.origin} />
                <img className={(showAd&&originImgLoad)? "slideFade" : "youcaptcha-img"} src={loading? "": data.targetCaptcha.question} />
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" style={{display: props.success? "inline-block": "none"}}>
                    <polyline className={props.success? "path check" : ""} fill="none" stroke="#73AF55" strokeWidth="10" strokeLinecap="square" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                </svg> 
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
                    <div className="youcaptcha-ad-text my-2" style={{fontSize: "18px"}}>{flatData[decodeURIComponent(props.result.origin).split("/").pop().substr(0,10)].name}</div>
                    <div>
                        <Button className="mx-1" size="md" target="_blank" rel="noopener noreferrer" href={"http://localhost:3000/Product?p=" + decodeURIComponent(props.result.origin).split("/").pop().substr(0,10)}>去看看</Button>
                        <Button variant={"secondary"} className="mx-1" size="md" target="_blank" rel="noopener noreferrer" href={""} onClick={props.closeAd}>略過</Button>
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