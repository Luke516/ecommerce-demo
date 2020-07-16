import React, { useState, useEffect } from 'react';
import { Container, Collapse, Row, Button } from 'react-bootstrap';
import CaptchaView from './CaptchaView.js'
import HeaderView from './HeaderView.js'
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider, Query, Mutation, useQuery } from 'react-apollo';
import { gql } from "apollo-boost";
import './YouCaptchaApp.css';

const GET_CAPTCHAS = gql`
  query Captchas($id: Int!, $type: String!, $answer: [Int]) {
    result(id: $id, type: $type, answer: $answer){
      status
      title
      origin
    }
  }
`;

function YouCaptchaApp(props) {
  const [firstLoad, setFirstLoad] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showWrongMessage, setShowWrongMessage] = useState(false);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [startCaptcha, setStartCaptcha] = useState(false);
  const [fetchData, setFetchData] = useState({result: {status: "incorrect"}});
  const [captchaId, setCaptchaId] = useState(props.captchaId);
  const [captchaAnswer, setCaptchaAnswer] = useState([]);
  const defaultResult = {
    status: "incorrect",
    origin: "",
    title: ""
  }

  const { loading, error, data, refetch } = useQuery(
    GET_CAPTCHAS,{
      variables: {
        id: captchaId,
        type: "",
        answer: captchaAnswer
      },
      errorPolicy: 'all',
      onCompleted: ()=>{
        console.log('hahaha')
        if(firstLoad){
          setFirstLoad(false);
        }
        else{
          if(data.result.status === "incorrect"){
            setShowEmptyMessage(false)
            setShowWrongMessage(true)
          }
        }
      }
    }
  );

  const toggleCaptcha = () => {
    setShowCaptcha(!showCaptcha);
    if(!startCaptcha){
      setStartCaptcha(true);
    }
  }

  const verifyCaptcha = (id, answer) => {
    if(props.onSuccess()){
      setCaptchaId(id);
      setCaptchaAnswer(answer.slice());
      if(answer.length == 0){
        setShowEmptyMessage(false)
        setShowWrongMessage(true)
      }
    }
    else{
      setShowWrongMessage(false)
      setShowEmptyMessage(true)
    }
  }

  const toggleShowCaptcha = () => {
    setTimeout(()=>{
      setShowCaptcha(!showCaptcha)
    }, 180)
  }

  const refreshCaptcha = () => {
    console.log("refreshCaptcha QWQ")
    setFirstLoad(true)
    let newCaptchaId = props.captchaIdList[Math.floor(Math.random() * props.captchaIdList.length)];
    console.log(newCaptchaId)
    setCaptchaId(newCaptchaId)
  }

  useEffect(() => {
    if(!loading && !error){
      if(data.result.title.length > 50){
        data.result.title = data.result.title.substring(0,50) + "...";
      }
      console.log(data)
      if(data.result.status != "incorrect"){
        if(props.onSuccess(true)){
          setShowWrongMessage(false)
          setShowEmptyMessage(false)
          // setShowCaptcha(false)
          toggleShowCaptcha()
          setFirstLoad(true)
          setFetchData(data)
          setVerified(true)
          setShowAd(true)
        }
        else {
          setShowWrongMessage(false)
          setShowEmptyMessage(true)
        }
      }
      else{ // incorrect
        if(!firstLoad){
          setShowEmptyMessage(false)
          setShowWrongMessage(true)
        }
      }
    }
  }, [data]);

  if(error){
      return(
        <div>error...App
          <pre>Bad: {error.graphQLErrors.map(({ message }, i) => (
            <span key={i}>{message}</span>
          ))}
          </pre>
        </div>
      )
  }

  return (
    <div className="App">
      <div id="demo" className={showAd? "completed": "device px-4"} style={{display: "block"}}>
        <HeaderView captchaId={captchaId} toggleCaptcha={toggleCaptcha} showCaptcha={startCaptcha} result={loading? defaultResult: fetchData.result} showAd={showAd} verified={verified} closeAd={props.closeAd}/>
        <Collapse in={showCaptcha}>
          <div id="youcaptcha-collpase">
            <CaptchaView captchaId={captchaId} showWrongMessage={showWrongMessage} showEmptyMessage={showEmptyMessage} 
            verifyCaptcha={verifyCaptcha} verified={verified} showCaptcha={showCaptcha} toggleShowCaptcha={toggleShowCaptcha} refreshCaptcha={refreshCaptcha}/>
          </div>
        </Collapse>
      </div>
    </div>
  );
}

export default YouCaptchaApp;
