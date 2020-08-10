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
      event: {
        ...event,
        timestamp
      }
  }
  if(events.length < 200){
    events.push(data)
  }
  else{
    events.push(data)
    logEvents()
  }
  // console.log(events.length)
}

export function logEvents(){
  let data = events.slice()
  console.log("log events " + data.length)
  const url = serverUrl + "events/";
  events = []

  if(!data){
    return
  }
  if(data.length < 1){
    return
  }

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

export function logFinish(data) {
  
  const url = serverUrl + "finish/";
  fetch(url, {
      method: 'post',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: data.username,
        targetCategory: data.targetCategory
      })
  }).then(res=>{
    // res.json()
  })
}

export function logPosition(username, timestamp, event) {
  
  let data={
      username,
      event: {
        ...event,
        timestamp
      }
  }
  if(positions.length < 200){
    positions.push(data)
  }
  else{
    positions.push(data)
    logPositions()
  }
}

export function logPositions() {
  console.log("log positions " + positions.length)
  let data = positions.slice()
  positions = []

  const url = serverUrl + "positions/";

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