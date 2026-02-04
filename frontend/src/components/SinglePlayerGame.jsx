import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import "./CleanSinglePlayerGame.css"
import EndGame from "./EndGame/EndGame";
import { Languages } from "./Nav/languages";

function SinglePlayerGame() {
  const navigate = useNavigate();
  const { language } = useParams();
  const [snippet, setSnippet] = useState('')
  const [userInput, setUserInput] = useState([])
  const userInputRef = useRef([]);
  const codeRef = useRef("");
  const checkpointRef = useRef({})
  const [start, setStart] = useState(false)
  const initTime = useRef(0);
  const [time, setTime] = useState(0);
  const [intervalID, setIntervalID] = useState(null)
  const gameDivRef = useRef(null);
  const [isFocused, setIsFocused] = useState(true)
  const [mistakeStart, setMistakeStart] = useState(null)
  const wpmArrayRef = useRef([]);
  const [gamestate, setGamestate] = useState(true)
  const mistakesRef = useRef(0);
    const containerRef = useRef(null);
  // get username from auth context

  
  useEffect(() => {
    if (gameDivRef.current) {
      gameDivRef.current.focus();
    }
  }, []);

    const renderTypedOverlay = () =>
    snippet.split("").map((char, index) => {
        let className = "char";

        if (index < userInput.length) {
        className += userInput[index] === char ? " correct" : " wrong";
        } else if (index === userInput.length) {
        className += " caret";
        }

        return (
        <span key={index} className={className}>
            {char === "\n" ? "\n" : char}
        </span>
        );
    });

  const onKeyDown = (e) => {
    // Ignore tabs and meta keys like shift and ctrl
    console.log(e.key)
    console.log('every', checkpointRef.current)
    e.stopPropagation();
    if (!start){
      setStart(true)
      initTime.current = Date.now()
      setIntervalID(setInterval(()=>{
        let currTime = Math.floor((Date.now()-initTime.current)/ 1000);
        setTime(currTime)
        if (currTime > wpmArrayRef.current.length) {
          let diff = currTime - wpmArrayRef.current.length
          for (let i = 0; i < diff; i++) {
            wpmArrayRef.current.push(Math.round(60*(userInputRef.current.length/(5*(wpmArrayRef.current.length + i + 1)))))
          }

          console.log(wpmArrayRef.current)
        }
      }, 50))
    }
    if (['Shift', 'Control', 'Alt', ''].includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (["'", '/', ' '].includes(e.key)) {
      e.preventDefault();
    }
    let updatedInput = [...userInputRef.current];
    let codeArray = codeRef.current.split('')
    
    if (mistakeStart === null && userInput.length + 1 === codeArray.length && e.key === codeArray[codeArray.length - 1]) {
      // if user finishes the game, end it
      // and store their info in the db.
      // if the user is not a guest then send
      // the data otherwise don't.

    //   if (username) {
    //     // since the user exists we send their data to the 
    //     // endpoint to be saved in the database.
    //       console.log("sending game info")
    //       apiClient.post(`/user/saveGame/${username}`, {
    //         username: username,
    //         wpm: Math.floor(60 * (codeRef.current.length / (5 * time))),
    //         accuracy: Math.floor(100 * (codeRef.current.length - mistakesRef.current)/codeRef.current.length)
    //       },{
    //       headers: {
    //         'Authorization': `Bearer ${token}`,
    //         // must add that the content will be json
    //         // to avoid error.
    //         'Content-Type' : 'application/json'
    //     }})
    //     .then(response => console.log("Sucessfully saved data"))
    //     .catch(error => console.log("unable to save data", error))
    //   }
    
      // either way if user or guest we want to set the game state
      // to false and clear the intervalID so that our set Interval
      // stops.
      setGamestate(false)
      clearInterval(intervalID)
      
    }
    if (e.key === 'Backspace') {
      // so if user hits backspace on new line, we want them to go back to the previous line. There
      // is \n, and spaces, so we have to take those into account.
      console.log('backspace index', updatedInput.length-1)
      console.log('deletion checkpoint', checkpointRef.current)
      if (updatedInput.length-1 in checkpointRef.current){
        // pop the difference between checkpoint
        // the reason -1 is added is because even though it checkpoint[updatedInput.length -1]
        // is the index of the character before the \n, we always hover over the character after that.
        // so we have to move it back one more.
        const destinationIndex = checkpointRef.current[updatedInput.length-1] - 1
        while (updatedInput.length-1 != destinationIndex) {
          updatedInput.pop()
      }
      // so the backspace should only scroll back up to top by a bit if we are on a
      // checkpoint that takes us back to the previous line. Otherwise removing one
      // letter will take you back one line which is not what we want.
      if (gameDivRef.current) {
        gameDivRef.current.scrollTop -= 30;
      }

    }
    else { 
      updatedInput.pop()
    }
      // if we undo the mistake get rid of the
      // mistake start index.
      if (mistakeStart != null && updatedInput.length - 1 <= mistakeStart) {
        setMistakeStart(null)
      }
    }
    else if (e.key === 'Enter') {
      if (updatedInput[updatedInput.length-1] != codeArray[updatedInput.length-1]) {
        mistakesRef.current++;
      }
      
      updatedInput.push('\n')

        if (updatedInput[updatedInput.length-1] === codeArray[updatedInput.length-1]) {
          if (gameDivRef.current) {
            gameDivRef.current.scrollTop += 30;
          }
        }
    }
    else {
      updatedInput.push(e.key)
      if (updatedInput[updatedInput.length-1] != codeArray[updatedInput.length-1]) {
        mistakesRef.current++;
      }
    }
    if (updatedInput.length < codeArray.length && codeArray[updatedInput.length-1] === '\n' && e.key != "Backspace") {
      let previous = updatedInput.length-2
      while (updatedInput.length < codeArray.length && codeArray[updatedInput.length] == ' ') {
        updatedInput.push(' ');
      }
      console.log('pre checkpoint', checkpointRef.current)
      checkpointRef.current[updatedInput.length-1] = previous;
      console.log("checkpoint added", checkpointRef.current)
    }
    setUserInput(updatedInput);
    userInputRef.current = updatedInput;
  }

  useEffect(() => {
    async function getSnippet() {
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/game/${language}`)
        console.log("TEST BACKEND?", import.meta.env.VITE_BACKEND_URL)
        return response;
      } catch (e) {
        console.log(e)
      }
    }

    if (gamestate){
      setSnippet('')
      initTime.current = 0
      mistakesRef.current = 0
      setStart(false)
      setUserInput([])
      userInputRef.current = []
      wpmArrayRef.current = []
      clearInterval(intervalID)
      if (gameDivRef.current) {
        gameDivRef.current.focus();
      }
      codeRef.current = "";
      for (const prop in checkpointRef.current) {
        if (checkpointRef.current.hasOwnProperty(prop)) {
            delete checkpointRef.current[prop];
        }
    }
    console.log("Clearing checkpoint!!!!!!!");

      getSnippet()
        .then((response) => {
          if (response) {
            setSnippet(response.data.snippet)
            console.log("SNIPPET?", response.data.snippet)
            codeRef.current = response.data.snippet;
          }
        })
        .catch(e=> console.log(e))

    }
  }, [language, gamestate])
  const highlighted = Prism.highlight(
    snippet,
    Prism.languages[language] || Prism.languages.javascript,
    language
  );

  if (!gamestate) {
  const totalChars = codeRef.current.length;
  const wpm = Math.floor((totalChars / 5) / (time / 60));
  const accuracy = Math.floor(
    100 * (totalChars - mistakesRef.current) / totalChars
  );

  return (
    <EndGame
      wpm={wpm}
      time={time}
      mistakes={mistakesRef.current}
      accuracy={accuracy}
      wpmArray={wpmArrayRef.current}
      changeGameState={setGamestate}
    />
  );
}


  return (
    <div className="game-contain">
    <div className="game-page">
      {/* HEADER */}
      <div className="game-header">
        <div className="langs">
          {Languages.map(l => (
            <button
              key={l.language}
              className={language === l.language ? "active" : ""}
              onClick={() => navigate(`/game/${l.language}`)}
            >
         <span className="lang-icon">{l.img}</span>
         <span style={{color: l.color }} className="lang-text">{l.language.toUpperCase()}</span>
            </button>
          ))}
        </div>

        <div className="timer">{time}s</div>
      </div>

      {/* CODE VIEW */}
      <div
        className="code-container"
        ref={containerRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        
        <div className="code-wrapper">
            <pre className="code syntax">
                <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>

            <pre className="code overlay">
                {renderTypedOverlay()}
            </pre>
      </div>



        {/* Cursor */}
        <div
        className="cursor"
        style={{
        transform: `translateY(${Math.floor(codeRef.current.length / 80) * 1.6}em)`
        }}
        />
    </div>
    </div>
    </div>
  );
}


export default SinglePlayerGame;