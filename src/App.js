import { useEffect, useState } from 'react';
import './styles/App.scss';

function App() {

  const [userPrompt, setUserPrompt] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [userInput, setUserInput] = useState("");

  const [userKey, setUserKey] = useState(1);

  const [flag, setFlag] = useState(false);

  const [allPromptResponse, setAllPromptResponse] = useState([]);

  // let key = 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserPrompt(userInput);
  }

  const handleChange = (e) => {
    setUserInput(e.target.value);
  }

  useEffect(() => {
    // debugger
    if (flag === true) {
      const newObj = {
        prompt: userPrompt,
        response: userResponse,
        key: userKey,
      };
      setAllPromptResponse([newObj, ...allPromptResponse]);
      setFlag(false);
      // console.log(newObj);
    }
    console.log(allPromptResponse);
  }, [allPromptResponse, flag, userKey, userPrompt, userResponse]);

  useEffect(() => {
    // debugger
    const data = {
      prompt: userPrompt,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };


    if (userPrompt) {
      fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY
            }`,
        },
        body: JSON.stringify(data),
      })
        .then((results) => {
          if (results.ok) {
            return results.json();

          } else {
            throw new Error("The call to the Open AI API wasn't successful");
          }
        })
        .then((jsondata) => {
          setUserResponse(jsondata.choices[0].text);
          setUserKey(jsondata.created);        
          setFlag(true);
        })
        .catch((error) => {
          console.log(error);
        });

    }
  }, [userPrompt]);

  // useEffect(() => {

  //   if (toggle === true) {
  //     const element = {
  //       userPrompt : userPrompt,
  //       userResponse : userResponse,

  //     };
  //     // setToggle(false);
  //     // let newElement = [];
  //     // setAllPromptResponse([element, ...allPromptResponse])
  //     // console.log(toggle);
  //     console.log(element);
  //     // newElement = [...element, newElement];
  //     // newElement.userPrompt = userPrompt;
  //     // newElement.userResponse = userResponse;
  //     // setAllPromptResponse(...element);
  //     console.log(allPromptResponse);
  //   }
  // },[allPromptResponse, toggle, userPrompt, userResponse]);



  return (
    <div className="App">
      <header>
        <div className="wrapper">
          <h1>Fun with AI</h1>
        </div>
      </header>

      <main>
        <div className="wrapper">
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="prompt">Enter Prompt</label>
            <textarea name="prompt" id="prompt" cols="100" rows="2" onChange={handleChange}></textarea>

            <div className="button-container">
              <button className="submit-prompt-button" type="submit" >Submit</button>
            </div>
          </form>

          <div>
            <h2>Responses</h2>
            {/* map */}

            {allPromptResponse.map((prop) => {
              return (
                <div className="response-container" key={prop.key}>
                  <p className="user-prompt">Prompt: {prop.prompt}</p>
                  <p className="user-response">Response: {prop.response}</p>
                </div>
              );
            })}

            {/* <div className="response-container">
              <p className="user-prompt">Prompt: {userPrompt}</p>
              <p className="user-response">Response: {userResponse}</p>
            </div> */}

          </div>
        </div>
      </main>

      <footer>

      </footer>
    </div>
  );
}

export default App;
