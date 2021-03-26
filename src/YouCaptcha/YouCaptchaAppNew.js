import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Collapse, Button } from 'react-bootstrap';
import {getCaptcha} from './api/captcha'
import './App.css';
import './CaptchaHeaderView.css'
import './CaptchaView.css'

function YouCaptchaAppNew() {
  const [selected, setSelected] = useState([false, false, false, false, false, false, false, false, false]);
  const [challengeUrl, setChallengeUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const onChallengeLoad = () => {
    setLoading(false);
  }

  const getChallenge = ()=> {
    setLoading(true);
    let url = `https://11rp38z9gg.execute-api.us-west-2.amazonaws.com/20210315?client=${1}`;
    axios.get(url).then((res) => {
      if (res.status !== 200)
          throw new Error(`Unexpected response code: ${res.status}`);

      return res.data;
    }).then((data)=>{
      let jsonData = JSON.parse(data.body)
      setChallengeUrl(jsonData["challengeImgUrl"]["S"].replace("eu-west", "us-west"));
      let tmpImg = new Image();
      tmpImg.src = jsonData["challengeImgUrl"]["S"].replace("eu-west", "us-west");
      tmpImg.onload = onChallengeLoad;
    });
    let tmp = [false, false, false, false, false, false, false, false, false];
    setSelected(tmp.slice());
  }

  useEffect(() => {
    getChallenge();
  }, []);

  let clientId = "1";
  let originSize = 224;
  let size = 120;
  let scale = ((size / originSize) * 100) + "%";

  const select = (selectId) => {
    let tmp = selected;
    tmp[selectId] = !tmp[selectId];
    setSelected(tmp.slice());
  }

  const submit = () => {
    let count = 1;
    let sum = 0;
    for(let i=0; i<9; i++){
      if(selected[i]){
        sum += count;
      }
      count = count * 2;
    }
    console.log(sum);

    let url = `https://ofnef7j6nk.execute-api.us-west-2.amazonaws.com/20210316?client=${1}&ans=${sum}`;
    axios.get(url).then((res) => {
      console.log(res);
      if (res.status !== 200){
        alert("wrong");
        getChallenge()
      }
      else{
        alert("yes");
      }
    }).catch((e)=>{
      console.log(e);
      alert("wrong");
      getChallenge();
    });
  }

  return (
    <div className="App p-3">
      {/* <img src={challengeUrl}/> */}
      <div className="device">
        <div className="mt-3 mb-1 mx-1 d-flex flex-column">
          <div className="d-flex flex-row">
            <div className="mx-1 youcaptcha-image-container" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left ${size}px top 0`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
              <div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div>
            </div>
            <div className="youcaptcha-description">
              <h5>請從以下的九宮格中，選出與左圖相同的物品</h5>
            </div>
          </div>
          <div className="my-1 d-flex flex-row">
            <div className={"mx-1 p-0 "+(selected[0]? "selected": "unselected")} onClick={()=>{select(0)}}>
              <div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left 0 top 0`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
              <div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
            <div className={"mx-1 p-0 "+(selected[1]? "selected": "unselected")} onClick={()=>{select(1)}}>
              <div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left 0 top -${size}px`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
              <div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
            <div className={"mx-1 p-0 "+(selected[2]? "selected": "unselected")} onClick={()=>{select(2)}}>
              <div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left 0 top -${size*2}px`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
              <div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
          </div>
          <div className="my-1 d-flex flex-row">
            <div className={"mx-1 p-0 "+(selected[3]? "selected": "unselected")} onClick={()=>{select(3)}}>
              <div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size}px top 0`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
              <div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
            <div className={"mx-1 p-0 "+(selected[4]? "selected": "unselected")} onClick={()=>{select(4)}}>
              <div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size}px top -${size}px`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
              <div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
            <div className={"mx-1 p-0 "+(selected[5]? "selected": "unselected")} onClick={()=>{select(5)}}>
              <div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size}px top -${size*2}px`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
              <div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
          </div>
          <div className="my-1 d-flex flex-row">
            <div className={"mx-1 p-0 "+(selected[6]? "selected": "unselected")} onClick={()=>{select(6)}}>
              <div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size*2}px top 0`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
              <div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
            <div className={"mx-1 p-0 "+(selected[7]? "selected": "unselected")} onClick={()=>{select(7)}}>
              <div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size*2}px top -${size}px`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
              <div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
            <div className={"mx-1 p-0 "+(selected[8]? "selected": "unselected")} onClick={()=>{select(8)}}>
              <div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size*2}px top -${size*2}px`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
              <div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
          </div>
        </div>
        <div className="mt-1 mb-3 d-flex flex-row justify-content-between">
          <div className="ml-3 text-muted cell" onClick={getChallenge}>
            <i className="fas fa-sync-alt"></i>
          </div>
          <Button variant="secondary" className="mr-3" onClick={submit}>
            送出
          </Button>
        </div>
      </div>
    </div>
  );
}

export default YouCaptchaAppNew;
