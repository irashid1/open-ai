import { useEffect, useState } from 'react';
import './styles/App.scss';

function App() {

  // states for prompt, response, key, flag and the object with all of the above info
  const [userPrompt, setUserPrompt] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [userInput, setUserInput] = useState("");
  const [userKey, setUserKey] = useState();
  const [flag, setFlag] = useState(false);
  const [allPromptResponse, setAllPromptResponse] = useState([]);

  // a function that handles submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setUserPrompt(userInput);
  }

  // a function that handles change
  const handleChange = (e) => {
    setUserInput(e.target.value);
  }


  useEffect(() => {
    // if flag is true then a new object is created with prompt, response and key
    if (flag === true) {
      const newObj = {
        prompt: userPrompt,
        response: userResponse,
        key: userKey,
      };
      // using spread operator, sets the array with all prompts and response to itself plus all values in the new object
      setAllPromptResponse([newObj, ...allPromptResponse]);
      setFlag(false);
    }
    console.log(allPromptResponse);
  }, [allPromptResponse, flag, userKey, userPrompt, userResponse]);

  useEffect(() => {
    const data = {
      prompt: userPrompt,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    // if there is a input by the user then fetches data from the API
    if (userPrompt) {
      fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // accessing the secret key from the env file
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
          // if the fetch is successfull we set the state for userResponse, userKey and flag
          setUserResponse(jsondata.choices[0].text);
          setUserKey(jsondata.created);
          setFlag(true);
        })
        .catch((error) => {
          console.log(error);
        });

    }
  }, [userPrompt]);


  return (
    <div className="App">
      <header>
        <div className="wrapper">
          <h1>Fun with AI 🤖</h1>
        </div>
      </header>

      <main>
        <div className="wrapper">
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="prompt">Enter a prompt to begin</label>
            <textarea name="prompt" id="prompt" cols="100" rows="1" onChange={handleChange}></textarea>

            <div className="button-container">
              <button className="submit-prompt-button" type="submit" >Submit</button>
            </div>
          </form>

          <div>
            <h2>Responses</h2>
            <div className="word-container">

              {/* mapping the allPromptResponse array */}
              {allPromptResponse.map((prop) => {
                return (
                  <div className="response-container" key={prop.key}>
                    <p className="user-prompt">Prompt: <span className="text">{prop.prompt}</span></p>
                    <p className="user-response">Response: <span className="text">{prop.response}</span></p>
                  </div>
                );
              })}

            </div>

          </div>
        </div>
      </main>

      <footer>
        {/* <div className="wrapper">
          <p>Created by Imtiaz Rashid</p>
        </div> */}
      </footer>
    </div>
  );
}

export default App;
