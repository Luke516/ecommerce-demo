export function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

let events = []
let positions = []
const serverUrl = "http://localhost:5000/"

export function logEvent(username, event){
  const timestamp = Date.now();
  let data={
      username,
      timestamp,
      event
  }
  if(events.length < 1000){
    events.push(data)
  }
  else{
    logEvents()
  }
}

export function logEvents(){
  let data = events

  const url = serverUrl + "events/";

  fetch(url, {
      method: 'post',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  }).then(res=>{
    // console.log(res)
  })
}

export function logSurvey(data) {
  const url = serverUrl + "log/";
  fetch(url, {
      method: 'post',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  }).then(res=>{
    // res.json()
  })
}

export function logFinish() {
  
  const url = serverUrl + "finish/";
  fetch(url, {
      method: 'post',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
  }).then(res=>{
    // res.json()
  })
}

export function logPosition(username, timestamp, event) {
  
  let data={
      username,
      timestamp,
      event
  }
  if(positions.length < 1000){
    positions.push(data)
  }
  else{
    logPositions()
  }
}

export function logPositions() {
  let data = positions

  const url = serverUrl + "events/";

  fetch(url, {
      method: 'post',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  }).then(res=>{
    // console.log(res)
  })
}