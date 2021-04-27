import React, { useState, useEffect } from 'react';
import { Container, Collapse, Row, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import LoadingSpinner from '../layout/LoadingSpinner';
import './CaptchaPopup.css'
import styled, { keyframes }  from 'styled-components';

import {getCaptcha} from '../api/api'
import Keyframes from '@keyframes/core';


function CaptchaPopup(props) {
	const [loading, setLoading] = useState(true);
	const [solved, setSolved] = useState(false);
	const [fallback, setFallback] = useState(false);
	const [closeModal, setCloseModal] = useState(false);
	const [dissmissModal, setDismiss] = useState(false);
	const [startTransition, setStartTransition] = useState(false);
	const [productIndex, setProductIndex] = useState(0);
	const [selected, setSelected] = useState([false, false, false, false, false, false, false, false, false]);
  	const [challengeUrl, setChallengeUrl] = useState("");
	const [originalUrl, setOriginalUrl] = useState("");
	const [originalName, setOriginalName] = useState("");
	const [marginOffset, setMarginOffset] = useState(5);

	const [transXOffset, settransXOffset] = useState(0);
	const [transYOffset, settransYOffset] = useState(0);

	const originalImageUrlDict = {
		B000A6XGY6: "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Sports+%26+Outdoors/Sports+%26+Fitness/Other+Sports/B000A6XGY6.jpg",
		B000F4AVPA: "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Pet Supplies/Dogs/Toys/B000F4AVPA.jpg",
		B0001YW09E: "https://youcaptcha.s3-us-west-2.amazonaws.com/seed/Sports+%26+Outdoors/Sports+%26+Fitness/Hunting+%26+Fishing/B0001YW09E.jpg",
		B00006LHR8: "https://youcaptcha.s3-us-west-2.amazonaws.com/content_man/B00006LHR8.jpg"
	}

	const originalImageNameDict = {
		B000A6XGY6: "Cowboy Magic Detangler and Shine",
		B000F4AVPA: "Chuckit! Ultra Ball",
		B0001YW09E: "ONYX Adult Universal Type 2 USCG Approved Life Jacket",
		B00006LHR8: "Digi International 70001851 230Kbps Ethernet Device Server"
	}

  const onChallengeLoad = () => {
    setLoading(false);
  }

	const loadImage = (url) => {
		let tmpImg = new Image();
		tmpImg.src = url;
	}

  const getChallenge = ()=> {
    // QWQ setLoading(true);
    // let url = `https://11rp38z9gg.execute-api.us-west-2.amazonaws.com/20210315?client=${1}`;
	let url = `https://oic9qtjg54.execute-api.us-west-2.amazonaws.com/prod`;
	let randProductIndex = (Math.floor(Math.random() * 4));
    axios.post(url, { client: 1, owner: 1, productIndex: randProductIndex, difficulty: 0 }).then((res) => {
      if (res.status !== 200)
          throw new Error(`Unexpected response code: ${res.status}`);

      return res.data;
    })
		// fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },      
    //   body: JSON.stringify({client: 1, owner: 1, productIndex: 0, difficulty: 0 })
    // })
		.then((data)=>{
			console.log(data);
      let jsonData = data;//JSON.parse(data)
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
				let originalImgUrl2 = originalImageUrlDict[element];
				let originalName = originalImageNameDict[element];
				setOriginalUrl(originalImgUrl2);
				setOriginalName(originalName);
				loadImage(originalImgUrl2);
				if(randProductIndex === 0 || randProductIndex ===3){
					props.insertTargetUrl("");
					setFallback(true);
				}
				else{
					props.insertTargetUrl(originalImgUrl2);
					setFallback(false);
				}

				// let rotationId = originalImgUrl.split(element)[1].split(".")[2];
				// console.log("rotationId: " + rotationId);
				// let rotationAngle = (parseInt(rotationId) * 8) - 60;
				// console.log("rotationAngle: " + rotationAngle);

			}
		});
    });
    let tmp = [false, false, false, false, false, false, false, false, false];
    setSelected(tmp.slice());
  }

  	const dismissLater = () => {
		  setTimeout(()=>{
			  setDismiss(true);
		  }, 800)
	  }

	useEffect(() => {
		if(challengeUrl.length < 1){
			getChallenge();
		}
		if(props.targetOffset !== 0 && marginOffset > props.targetOffset){
			console.log("animate QWQ");
			setTimeout(animate, 50);
		}
  	}, [props.targetOffset, marginOffset]);

	let clientId = "1";
  let originSize = 224;
  let size = 120;
  // let scale = ((size / originSize) * 100) + "%";

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

		let xOffset = -(parseFloat(res.data.result.trn_x.N));
		let yOffset = -(parseFloat(res.data.result.trn_y.N));

		let xScale = (parseFloat(res.data.result.scl_x.N));
		let yScale = (parseFloat(res.data.result.scl_y.N));

		let rotationAngle = (parseInt(res.data.result.rot.N));
		console.log("rotationAngle: " + rotationAngle);

		const sinTheta = Math.sin(-rotationAngle / 180 * Math.PI);
		const cosTheta = Math.cos(-rotationAngle / 180 * Math.PI);

		let xOffset2 = -(yOffset * sinTheta + xOffset * cosTheta);
		let yOffset2 = (yOffset * cosTheta - xOffset * sinTheta);

		var targetElement = document.getElementById("target-img").getBoundingClientRect();

		let widthScale = targetElement.width / 120;
		let heightScale = targetElement.height / 120;
		let biggerScale = widthScale > heightScale? widthScale: heightScale;

		let xScale2 = ((biggerScale / xScale) / 1.28);
		let yScale2 = ((biggerScale / yScale) / 1.28);
		let xScale3 = ((biggerScale / 1) / 1.28);
		let yScale3 = ((biggerScale / 1) / 1.28);

		let targetYcenter = (targetElement.top + targetElement.bottom) / 2;
		let globalYoffset = 0;
		if(targetYcenter < window.innerHeight / 2){
			console.log(targetYcenter);
			console.log(window.innerHeight / 2);
			globalYoffset = parseInt((window.innerHeight / 2) - targetYcenter)
			console.log("globalYoffset : " + globalYoffset);
		}

		Keyframes.define({
			name: 'rotateProductAnimation',
			from: {
				transform: `translateY(0px) scale(1, 1) rotate(0deg) translateX(${0}px) translateY(${0}px)`,
				borderRadius: `0`
			},
			to: {
				transform: `translateY(${-globalYoffset}px) scale(${xScale2}, ${yScale2}) rotate(${rotationAngle}deg) translateX(${xOffset}px) translateY(${yOffset}px) `,
				borderRadius: `0%`
			}
		});

		Keyframes.define({
			name: 'rotateProductReverseAnimation',
			from: {
				transform: `rotate(0deg)`,
				borderRadius: `0`
			},
			to: {
				transform: `rotate(${-rotationAngle}deg)`,
				borderRadius: `0%`
			}
		});

		props.captchaSolved();
      }
    }).catch((e)=>{
      console.log(e);
      // alert("wrong");
      getChallenge();
    });
  }

	// const translateAnimation = keyframes`
	// 	from {
	// 		margin-left: 0;
	// 	}

	// 	to {
	// 		margin-left: -20px;
	// 	}
	// `

	// const Wrapper = styled.div`
	// 	animation: ${translateAnimation} 4s ease-in-out forward;
	// `;
	const animate = () => {
		console.log("animate QWQ~");
		let curOffset = marginOffset;
		if(props.targetOffset < marginOffset){
			// setTimeout(()=>{
			// 	console.log("animate QWQ~!!");
			// 	console.log("offset: " + curOffset);
			// 	setMarginOffset(curOffset-1);
			// 	animate();
			// }, 500);
			console.log("animate QWQ~!!");
			console.log("offset: " + curOffset);
			setMarginOffset(curOffset-1);
		}
	}

  return (
	// <Modal show={!closeModal} onHide={()=>{}}>
    dissmissModal?
	<></>
	:<div className={"captcha-popup " + (closeModal?"fadeOutModalBack":"")} style={{pointerEvents: closeModal?"none":"auto"}}>
		<div className="popup-content fadeIn2 ">
			{
				// loading ?
				// <div>
				// 	<LoadingSpinner/>
				// 	<span>Loading...</span>
				// </div>:
				<div className={"device "+ ((startTransition && !fallback)?"fadeOutBack2":(closeModal)?"fadeOutAll":"")} style={{marginLeft: `${fallback? 0: marginOffset}px`}}>
					<div className="mt-1 mb-1 mx-1 d-flex flex-column">
						<div className={((startTransition && !fallback)? "marginShrink	":"") + "d-flex flex-row my-1"}>
							<div className={"mx-1 youcaptcha-image-container " + (startTransition?fallback?"":"fadeOutSlow":"")} style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size*4}px top -${size}px`, backgroundSize: `${size*5}px ${size*2}px`, width: `${size}px`, height: `${size}px`}}  ref={props.setSourceRef}>
								{/* {loading && <div className="w-100 h-100 d-flex justify-content-center align-items-center"><LoadingSpinner/></div>} */}
								<div className={"d-flex justify-content-center align-items-center " + ((startTransition && fallback)? "fadeIn	":"")} style={{position: "absolute", width: "120px", height: "120px", backgroundColor: "white", opacity: loading? 1:0}}>
									{
										loading? 
										<LoadingSpinner/> :
										<img className={(startTransition && fallback)? "fadeIn	":""} src={originalUrl} style={{opacity: 0, maxWidth: "120px", maxHeight: "120px"}}/>
									}	
								</div>
							</div>
							{
								loading? 
								<div className="youcaptcha-description">
									<span>Loading...</span>
								</div>:
								<div className={"youcaptcha-description"}>
									<div className={"challenge-text "  + (solved? "fadeOutBackFast":"")} style={{display: startTransition? "none": "flex"}}><h5>請從以下的九宮格中，選出與左圖相同的物品</h5></div>
									{
										fallback?
										<div className={"verify-success-text " + (solved? "show-text ":"")} style={{width: "0"}}>
											{
												<div>
													<div className={"d-flex justify-content-center align-items-center flex-row " + (startTransition? "fadeOutFast" : "")}>
														<div className={startTransition? "fadeOutFastQWQ" : ""} style={{width: "40px", height: "40px", zIndex: "2"}}>
															<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" style={{display: solved? "inline-block": "none", zIndex:"2000"}}>
																<polyline className={solved? "path check" : ""} fill="none" stroke="rgba(115, 175, 85, 0.7)" strokeWidth="10" strokeLinecap="square" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
															</svg> 
														</div>
														<h5 className="m-0">認證成功！</h5>
													</div>
													<div className={"w-100 justify-content-center align-items-center flex-column " + (startTransition? "fadeIn" : "")} style={{display:startTransition?"flex":"none", position: "absolute", top:"0", left: "0", height: "120px", backgroundColor: "white"}}>
														<div>
															<h5 className="m-0">{originalName}</h5>
														</div>
														<div className="d-flex w-100 justify-content-center flex-row mt-2">
														<Button className="mx-1" onClick={()=>{setCloseModal(true); dismissLater();}}>去看看</Button>
														<Button variant="secondary" className="mx-1" onClick={()=>{setCloseModal(true); dismissLater();}}>略過</Button>
													</div>
													</div>
													<div className="d-flex w-100 justify-content-center flex-row mt-2">
														<Button className="mx-1" onClick={()=>{setStartTransition(true)}}>看看解答</Button>
														<Button variant="secondary" className="mx-1" onClick={()=>{setCloseModal(true); dismissLater();}}>略過</Button>
													</div>
												</div>
											}
										</div>:
										<div className={"verify-success-text " + (solved? startTransition? "hide-text " : "show-text ":"")} style={{width: startTransition? "250px": solved? "0": "0"}}>
											<div className="d-flex justify-content-center align-items-center flex-row">
												<div className={startTransition? "fadeOutFast" : ""} style={{width: "40px", height: "40px", zIndex: "2"}}>
													<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" style={{display: solved? "inline-block": "none", zIndex:"2000"}}>
														<polyline className={solved? "path check" : ""} fill="none" stroke="rgba(115, 175, 85, 0.7)" strokeWidth="10" strokeLinecap="square" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
													</svg> 
												</div>
												<h5 className="m-0">認證成功！</h5>
											</div>
											<div className="d-flex w-100 justify-content-center flex-row mt-2">
												<Button className="mx-1" onClick={()=>{setStartTransition(true); setCloseModal(true);}}>看看解答</Button>
												<Button variant="secondary" className="mx-1" onClick={()=>{setCloseModal(true); dismissLater();}}>略過</Button>
											</div>
										</div>
									}
								</div>
							}
						</div>
					</div>
					<Collapse in={!solved && !loading}>
					<div>
					<div className="mt-3 mb-1 mx-1 d-flex flex-column">
							<div className="mt-1 d-flex flex-row">
								<div className={"mr-1 p-0 "+(selected[0]? "selected": "unselected")} onClick={()=>{select(0)}}>
									<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left 0 top 0`, backgroundSize: `${size*5}px ${size*2}px`, width: `${size}px`, height: `${size}px`}}>
									<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
								<div className={"mx-0 p-0 "+(selected[1]? "selected": "unselected")} onClick={()=>{select(1)}}>
									<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left 0 top -${size}px`, backgroundSize: `${size*5}px ${size*2}px`, width: `${size}px`, height: `${size}px`}}>
									<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
								<div className={"ml-1 p-0 "+(selected[2]? "selected": "unselected")} onClick={()=>{select(2)}}>
									<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size}px top 0`, backgroundSize: `${size*5}px ${size*2}px`, width: `${size}px`, height: `${size}px`}}>
									<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
							</div>
							<div className="mt-1 d-flex flex-row">
								<div className={"mr-1 p-0 "+(selected[3]? "selected": "unselected")} onClick={()=>{select(3)}}>
									<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size}px top -${size}px`, backgroundSize: `${size*5}px ${size*2}px`, width: `${size}px`, height: `${size}px`}}>
									<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
								<div className={"mx-0 p-0 "+(selected[4]? "selected": "unselected")} onClick={()=>{select(4)}}>
									<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size*2}px top 0`, backgroundSize: `${size*5}px ${size*2}px`, width: `${size}px`, height: `${size}px`}}>
									<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
								<div className={"ml-1 p-0 "+(selected[5]? "selected": "unselected")} onClick={()=>{select(5)}}>
									<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size*2}px top -${size}px`, backgroundSize: `${size*5}px ${size*2}px`, width: `${size}px`, height: `${size}px`}}>
									<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
							</div>
							<div className="mt-1 d-flex flex-row">
							<div className={"mr-1 p-0 "+(selected[6]? "selected": "unselected")} onClick={()=>{select(6)}}>
								<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size*3}px top 0`, backgroundSize: `${size*5}px ${size*2}px`, width: `${size}px`, height: `${size}px`}}>
								<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
							<div className={"mx-0 p-0 "+(selected[7]? "selected": "unselected")} onClick={()=>{select(7)}}>
								<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size*3}px top -${size}px`, backgroundSize: `${size*5}px ${size*2}px`, width: `${size}px`, height: `${size}px`}}>
								<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
							<div className={"ml-1 p-0 "+(selected[8]? "selected": "unselected")} onClick={()=>{select(8)}}>
								<div className="" style={{backgroundImage: `url(${challengeUrl})`, backgroundPosition: `left -${size*4}px top 0`, backgroundSize: `${size*5}px ${size*2}px`, width: `${size}px`, height: `${size}px`}}>
								<div className={"m-0 loading-placeholder " + (loading? "show": "hide")}></div></div></div>
							</div>
					</div>
					<div className="my-2 d-flex flex-row justify-content-between">
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
	// </Modal>
  );
}

export default CaptchaPopup;
