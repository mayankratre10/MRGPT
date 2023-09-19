import { useState, useRef } from "react";
import OpenAI from "openai";
import axios from 'axios';
import { personaOptions } from "./personas";
import "./App.scss";
import { useEffect } from "react";
function App() {
  const messageRef = useRef();
  const chatRef = useRef();
  const btnRef = useRef();
  // const openai = new OpenAI({
  //   organization: import.meta.env.VITE_ORGANISATION_KEY,
  //   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  //   dangerouslyAllowBrowser: true,
  // });
  const [loading, setloading] = useState(false);

  const [chat, setChat] = useState([
    {
      role: "user",
      content:
        "Conversation Style Should Be Humorous and Conversational always",
    },
    { role: "assistant", content: "Sure, How can I help you" },
  ]);

  const submitMessage = async () => {
    setshowwelcome(false)
    let message = messageRef.current.value;

    setloading(true);

    // console.log(message);
    chat.push({ role: "user", content: message });
    messageRef.current.value = "";
    checkInput();
    try {
      // const result = await openai.chat.completions.create({
      //   messages: [
      //     { role: "system", content: "You are a helpful assistant." },
      //     ...chat,
      //   ],
      //   temperature: randomness,
      //   model: model,
      // });https://mrgpt-server.onrender.com/
      const result = await axios("https://mrgpt-server.onrender.com/",{
        params:{
        messages:[
              { role: "system", content: "You are a helpful assistant." },
              ...chat,
            ],
        temperature: randomness,
        model: model,
      }})
      // console.log(result.choices[0].message)
      chat.push({
        role: result.data.choices[0].message.role,
        content: result.data.choices[0].message.content,
      });
      // setapiresponse(result.choices[0]);
    } catch (err) {
      console.log(err);
      chat.push({role:"assistant",content:err.message})
    }
    setloading(false);
  };

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [loading]);

  const checkInput = () => {
    if (messageRef.current.value.length === 0) {
      btnRef.current.disabled = true;
      btnRef.current.style.backgroundColor = "#b2d4bb";
    } else {
      btnRef.current.disabled = false;
      btnRef.current.style.backgroundColor = "#01803a";
    }
  };
  useEffect(() => {
    btnRef.current.disabled = true;
  }, []);

  const [showModels, setShowModels] = useState(false);
  const modelOptions = [
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo-0613",
    "gpt-3.5-turbo-16k-0613",
    "gpt-3.5-turbo-0301",
    "text-davinci-003"
  ];
  const [model, setModel] = useState("gpt-3.5-turbo");

  const selectModel = (e) => {
    let option = e.target.id;
    setModel(option);

    setShowModels(false);
  };

  const [showPersona, setShowPersona] = useState(false);
  const [persona, setPersona] = useState("Humorous");
  const [randomness, setrandomness] = useState(0.5);
  const selectPersona = (e) => {
    let option = e.target.id;
    console.log(option);
    personaOptions.forEach((element) => {
      if (option === element.persona) {
        console.log(element);
        setPersona(element.persona);
        setChat(element.feed);
      }
    });
    
    setShowPersona(false);
  };
  const [showwelcome,setshowwelcome] = useState(true);
  return (
    <>
      <div className="container">
        <div className="chat-container">
          {showwelcome && <div className="welcome" >
            <h1>Welcome To MRGPT</h1>
            <h2>Uses OpenAI API, Lets try something below..</h2>
          </div>}

          <div ref={chatRef} className="messages">
            {/* <span className="sent">Sent</span>
            <span className="received">Received</span> */}
            {chat.map((msg, index) => {
              if (index >= 2) {
                if (msg.role === "assistant")
                  return (
                    <span key={index} className="received">
                      {msg.content}
                    </span>
                  );
                else
                  return (
                    <span key={index} className="sent">
                      {msg.content}
                    </span>
                  );
              }
            })}
            {loading && <span>Generating Please Wait.......</span>}
          </div>
          <div className="input-box">
            <textarea
              onChange={checkInput}
              ref={messageRef}
              placeholder="Type a message..."
              rows="4"
              min-rows="4"
              max-rows="6"
            />
            <button ref={btnRef} onClick={submitMessage}>
              Send
            </button>
          </div>
        </div>
        <div className="setting">
          <h3>MRGPT</h3>
          <button className="models" onClick={() => setShowModels(!showModels)}>
            Select Model
          </button>
          {showModels && (
            <div className="options">
              {modelOptions.map((option, index) => {
                return (
                  <span
                    onClick={selectModel}
                    key={index}
                    id={option}
                    className="option"
                  >
                    {option}
                  </span>
                );
              })}
            </div>
          )}
          <span className="model">{model}</span>


          <button
            className="models"
            onClick={() => setShowPersona(!showPersona)}
          >
            Select Persona
          </button>
          {showPersona && (
            <div className="options">
              {personaOptions.map((option, index) => {
                return (
                  <span
                    onClick={selectPersona}
                    key={index}
                    id={option.persona}
                    className="option"
                  >
                    {option.persona}
                  </span>
                );
              })}
            </div>
          )}
          <span className="model">{persona}</span>

          <div className="wrap">
            <label htmlFor="creative" className="creative">
              Creativity Level
            </label>
            <input
              name="creative"
              className="creative_value"
              type="number"
              step={0.1}
              max={1}
              min={0}
              value={randomness}
              onChange={(e) => setrandomness(e.target.value)}
            />
          </div>
          <button className="clear-chat" onClick={() => {
            setChat([]);
          }}>Clear Chat</button>
        </div>
      </div>
    </>
  );
}

export default App;
