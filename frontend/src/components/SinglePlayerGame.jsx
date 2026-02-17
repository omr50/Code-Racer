import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import "./CleanSinglePlayerGame.css"
import EndGame from "./EndGame/EndGame";
import { Languages } from "./Nav/languages";
import { useAuth } from "../context/AuthContext";

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
  const [isFocused, setIsFocused] = useState(true)
  const [mistakeStart, setMistakeStart] = useState(null)
  const wpmArrayRef = useRef([]);
  const keystrokeTimesRef = useRef([]);
  const [gamestate, setGamestate] = useState(true)
  const mistakesRef = useRef(0);
  const containerRef = useRef(null);
  const caretIndexRef = useRef(0);
  const {token} = useAuth()


  // get username from auth context

  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const refocus = (e) => {
      if (!gamestate || !containerRef.current) return;

      // if you're clicking inside the code container, do nothing
      if (containerRef.current.contains(e.target)) return;

      // let the browser finish its focus changes, then force focus back
      requestAnimationFrame(() => {
        containerRef.current?.focus();
      });
    };

    // capture phase so we run BEFORE most other handlers
    window.addEventListener("pointerdown", refocus, true);
    window.addEventListener("mousedown", refocus, true);

    return () => {
      window.removeEventListener("pointerdown", refocus, true);
      window.removeEventListener("mousedown", refocus, true);
    };
  }, [gamestate]);

  useEffect(() => {
    if (!gamestate && token) {

      const totalChars = codeRef.current.length;
      const wpm = Math.floor((totalChars / 5) / (time / 60));
      const accuracy = Math.floor(
        100 * (totalChars - mistakesRef.current) / totalChars
      );


      axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/games`,
        {
          wpm,
          accuracy,
          mistakes: mistakesRef.current,
          durationSeconds: time,
          language
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('send info to server')
    }
  }, [gamestate]);


    const renderTypedOverlay = () =>
    snippet.split("").map((char, index) => {
        let className = "char";

        if (index < userInput.length) {
          const isCorrect = userInput[index] === char;

          if (mistakeStart !== null && index >= mistakeStart) {
            className += " wrong forced-wrong";
          } else {
            className += isCorrect ? " correct" : " wrong";
          }
        }

        else if (index === userInput.length) {
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
        
       const WINDOW_MS = 10_000; // 10 seconds
        const now = Date.now();

        // keep only keystrokes within the window
        keystrokeTimesRef.current = keystrokeTimesRef.current.filter(
          (t) => now - t <= WINDOW_MS
        );

        const charsInWindow = keystrokeTimesRef.current.length;

        // WPM = (chars / 5) * (60 / windowSeconds)
        const rollingWpm = Math.round(
          (charsInWindow / 5) * (60 / (WINDOW_MS / 1000))
        );

        // push once per second
        if (currTime > wpmArrayRef.current.length) {
          wpmArrayRef.current.push(rollingWpm);
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
    const expectedChar = codeArray[updatedInput.length];
   
    // END GAME HERE
    if (mistakeStart === null && userInput.length + 1 === codeArray.length && e.key === codeArray[codeArray.length - 1]) {

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
      if (containerRef.current) {
        containerRef.current.scrollTop -= 30;
      }

    }
    else { 
      updatedInput.pop()

      while (
        updatedInput.length > 0 &&
        (codeArray[updatedInput.length] === "\t" || codeArray[updatedInput.length] == '\n')
      ) {
        console.log('tab backspaced')
        updatedInput.pop();
      }
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
          if (containerRef.current) {
            containerRef.current.scrollTop += 30;
          }
        }
    }
    else {
      updatedInput.push(e.key);

      keystrokeTimesRef.current.push(Date.now());

      if (updatedInput[updatedInput.length - 1] !== codeArray[updatedInput.length - 1]) {
        if (mistakeStart === null) {
          setMistakeStart(updatedInput.length - 1);
        }
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

    while (codeArray[updatedInput.length] === "\t" && e.key != "Backspace") {
      // just advance the expected position
      updatedInput.length++;
      console.log("TAB HIT")
    }

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
      keystrokeTimesRef.current = [];
      clearInterval(intervalID)
      if (containerRef.current) {
        containerRef.current.focus();
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