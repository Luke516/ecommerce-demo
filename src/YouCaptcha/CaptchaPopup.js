import React, { useState, useEffect } from 'react';
import { Container, Collapse, Row, Button } from 'react-bootstrap';
import axios from 'axios';
import LoadingSpinner from '../layout/LoadingSpinner';
import './CaptchaPopup.css'

import {getCaptcha} from '../api/api'

function CaptchaPopup(props) {
	const [loading, setLoading] = useState(true);
	const [solved, setSolved] = useState(false);
	const [selected, setSelected] = useState([false, false, false, false, false, false, false, false, false]);
  const [challengeUrl, setChallengeUrl] = useState("");
	const [originalUrl, setOriginalUrl] = useState("");

	const originalImageUrlDict = {
		B000A6XGY6: "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Sports+%26+Outdoors/Sports+%26+Fitness/Other+Sports/B000A6XGY6.jpg",
		B000F4AVPA: "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Pet Supplies/Dogs/Toys/B000F4AVPA.jpg",
		B0001YW09E: "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Sports+%26+Outdoors/Sports+%26+Fitness/Hunting+%26+Fishing/B0001YW09E.jpg",
		B00006LHR8: "https://youcaptcha.s3-us-west-2.amazonaws.com/content_man/B00006LHR8.jpg"
	}

  const onChallengeLoad = () => {
    setLoading(false);
  }

	const loadImage = (url) => {
		let tmpImg = new Image();
		tmpImg.src = url;
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

			console.log(jsonData["originalImgUrl"]["S"]);
			let originalImgUrl = jsonData["originalImgUrl"]["S"];
			Object.keys(originalImageUrlDict).forEach(element => {
				console.log(element);
				if(originalImgUrl.includes(element)){
					console.log(originalImgUrl);
					originalImgUrl = originalImageUrlDict[element];
					setOriginalUrl(originalImgUrl);
					loadImage(originalImgUrl);
					props.insertTargetUrl(originalImgUrl);
				}
			});
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
        // alert("wrong");
        getChallenge()
      }
      else{
        // alert("yes");
				setSolved(true);
				props.captchaSolved();
      }
    }).catch((e)=>{
      console.log(e);
      // alert("wrong");
      getChallenge();
    });
  }

  return (
    <div className={"captcha-popup " + (solved?"fadeOutBack":"")} style={{pointerEvents: solved?"none":"auto"}}>
			<div className="popup-content">
				{
					loading ?
					<div>
						<LoadingSpinner/>
						<span>Loading...</span>
					</div>:
					<div className={"device "+ (solved?"fadeOutBack":"")}>
						<div className="mt-3 mb-1 mx-1 d-flex flex-column">
							<div className="d-flex flex-row">
								<div className={"mx-1 youcaptcha-image-container " + (solved?"fadeOutSlow":"")} style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left ${size}px top 0`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
									<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div>
									<img className={solved? "fadeInOut":""} src={originalUrl} style={{opacity: 0, width: "120px", height: "120px"}}/>
									<div className={solved? "" : ""} style={{width: "120px", height: "120px", zIndex: "2"}}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" style={{display: solved? "inline-block": "none", zIndex:"2000"}}>
                        <polyline className={solved? "path check" : ""} fill="none" stroke="rgba(115, 175, 85, 0.7)" strokeWidth="10" strokeLinecap="square" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                    </svg> 
         					</div>
								</div>
								<div className={"youcaptcha-description" + (solved? "hide-text": "")}>
									<div className={"challenge-text "  + (solved? "fadeOutBackFast":"")}><h5>請從以下的九宮格中，選出與左圖相同的物品</h5></div>
									<div className={"verify-success-text " + (solved? "show-text":"")}><h5>認證成功！</h5></div>
								</div>
							</div>
						</div>
						<Collapse in={!solved}>
						<div>
						<div className="mt-3 mb-1 mx-1 d-flex flex-column">
								<div className="mt-1 d-flex flex-row">
									<div className={"mr-1 p-0 "+(selected[0]? "selected": "unselected")} onClick={()=>{select(0)}}>
										<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left 0 top 0`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
										<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
									<div className={"mx-0 p-0 "+(selected[1]? "selected": "unselected")} onClick={()=>{select(1)}}>
										<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left 0 top -${size}px`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
										<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
									<div className={"ml-1 p-0 "+(selected[2]? "selected": "unselected")} onClick={()=>{select(2)}}>
										<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left 0 top -${size*2}px`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
										<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
								</div>
								<div className="mt-1 d-flex flex-row">
									<div className={"mr-1 p-0 "+(selected[3]? "selected": "unselected")} onClick={()=>{select(3)}}>
										<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size}px top 0`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
										<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
									<div className={"mx-0 p-0 "+(selected[4]? "selected": "unselected")} onClick={()=>{select(4)}}>
										<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size}px top -${size}px`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
										<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
									<div className={"ml-1 p-0 "+(selected[5]? "selected": "unselected")} onClick={()=>{select(5)}}>
										<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size}px top -${size*2}px`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
										<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
								</div>
								<div className="mt-1 d-flex flex-row">
								<div className={"mr-1 p-0 "+(selected[6]? "selected": "unselected")} onClick={()=>{select(6)}}>
									<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size*2}px top 0`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
									<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
								<div className={"mx-0 p-0 "+(selected[7]? "selected": "unselected")} onClick={()=>{select(7)}}>
									<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size*2}px top -${size}px`, backgroundSize: `${size*4}px ${size*3}px`, width: `${size}px`, height: `${size}px`}}>
									<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
								<div className={"ml-1 p-0 "+(selected[8]? "selected": "unselected")} onClick={()=>{select(8)}}>
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
						</Collapse>
					</div>
				}
			</div>
    </div>
  );
}

export default CaptchaPopup;
