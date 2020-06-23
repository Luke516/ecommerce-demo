import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useQuery } from 'react-apollo';
import { gql } from "apollo-boost";
import './CaptchaView.css';

const GET_CAPTCHAS = gql`
  query Captchas($id: Int!) {
    targetCaptcha(id: $id) {
      id,
      question,
      candidates
    }
  }
`;

function CaptchaView(props) {
    // const { loading, error, data, refetch} = useQuery(GET_CAPTCHAS);
    const { loading, error, data, refetch } = useQuery(
        GET_CAPTCHAS,{
          variables: {
            id: props.captchaId,
          },
          errorPolicy: 'all'
        }
    );
    const [selected, setSelected] = useState([false, false, false, false, false, false, false, false, false]);
    const [captchaUrls, setCaptchaUrls] = useState(["","","","","","","","","",""]);

    const toggleSelection = (candidate_id) => {
        let new_selected = selected;
        console.log(new_selected);
        new_selected[candidate_id] = !new_selected[candidate_id];
        console.log(new_selected);
        setSelected(new_selected.slice());
    }

    const verifyCaptcha = () => {
        let selectedIds = [];
        for(var i=0; i<9; i++){
            if(selected[i]){
                selectedIds.push(i);
            }
        }
        props.verifyCaptcha(data.targetCaptcha.id, selectedIds);
    }

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
        <div id="captchaBody">
        <Row className="captcha-row">
            <img id="captcha1" className={selected[0]? "selected youcaptcha-img": "youcaptcha-img"} src={data.targetCaptcha.candidates[0]} onClick={() => {toggleSelection(0)}/*this.props.selectCaptcha(1)*/}/>
            <img id="captcha2" className={selected[1]? "selected youcaptcha-img": "youcaptcha-img"} src={data.targetCaptcha.candidates[1]} onClick={() => {toggleSelection(1)}/*this.props.selectCaptcha(2)*/}/>
            <img id="captcha3" className={selected[2]? "selected youcaptcha-img": "youcaptcha-img"} src={data.targetCaptcha.candidates[2]} onClick={() => {toggleSelection(2)}/*this.props.selectCaptcha(3)*/}/>
        </Row>
        <Row className="captcha-row">
            <img id="captcha4" className={selected[3]? "selected youcaptcha-img": "youcaptcha-img"} src={data.targetCaptcha.candidates[3]} onClick={() => {toggleSelection(3)}/*this.props.selectCaptcha(4)*/}/>
            <img id="captcha5" className={selected[4]? "selected youcaptcha-img": "youcaptcha-img"} src={data.targetCaptcha.candidates[4]} onClick={() => {toggleSelection(4)}/*this.props.selectCaptcha(5)*/}/>
            <img id="captcha6" className={selected[5]? "selected youcaptcha-img": "youcaptcha-img"} src={data.targetCaptcha.candidates[5]} onClick={() => {toggleSelection(5)}/*this.props.selectCaptcha(6)*/}/>
        </Row>
        <Row className="captcha-row">
            <img id="captcha7" className={selected[6]? "selected youcaptcha-img": "youcaptcha-img"} src={data.targetCaptcha.candidates[6]} onClick={() => {toggleSelection(6)}/*this.props.selectCaptcha(7)*/}/>
            <img id="captcha8" className={selected[7]? "selected youcaptcha-img": "youcaptcha-img"} src={data.targetCaptcha.candidates[7]} onClick={() => {toggleSelection(7)}/*this.props.selectCaptcha(8)*/}/>
            <img id="captcha9" className={selected[8]? "selected youcaptcha-img": "youcaptcha-img"} src={data.targetCaptcha.candidates[8]} onClick={() => {toggleSelection(8)}/*this.props.selectCaptcha(9)*/}/>
        </Row>
        <Row className="captcha-row ending align-items-center">
            <div className="ml-2 text-muted cell" onClick={() => {refetch(0)}/*this.props.getCaptcha*/}>
                <i className="fas fa-sync-alt"></i>
            </div>
            <div className="cell">
                <Button variant="primary" onClick={() => {verifyCaptcha()}}>送出</Button>
            </div>
        </Row>
        </div>
    );
}

export default CaptchaView;