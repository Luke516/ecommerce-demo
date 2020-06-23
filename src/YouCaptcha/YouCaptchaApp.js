import React, { useState, useEffect } from 'react';
import { Container, Collapse } from 'react-bootstrap';
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
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [startCaptcha, setStartCaptcha] = useState(false);
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
      errorPolicy: 'all'
    }
  );

  const toggleCaptcha = () => {
    setShowCaptcha(!showCaptcha);
    if(!startCaptcha){
      setStartCaptcha(true);
    }
  }

  const verifyCaptcha = (id, answer) => {
    setCaptchaId(id);
    setCaptchaAnswer(answer.slice());
  }

  useEffect(() => {
    if(!loading && !error){
      if(data.result.title.length > 50){
        data.result.title = data.result.title.substring(0,50) + "...";
      }
      if(data.result.status != "incorrect"){
        setShowCaptcha(false);
        props.onSuccess();
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
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Container id="demo" className="device px-4" style={{display: "block"}}>
        <HeaderView captchaId={props.captchaId} toggleCaptcha={toggleCaptcha} showCaptcha={startCaptcha} result={loading? defaultResult: data.result}/>
        <Collapse in={showCaptcha}>
          <div><CaptchaView captchaId={props.captchaId} verifyCaptcha={verifyCaptcha}/></div>
        </Collapse>
      </Container>
    </div>
  );
}

export default YouCaptchaApp;
