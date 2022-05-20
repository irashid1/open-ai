import { useEffect, useState } from 'react';
import './styles/App.scss';

function App() {

  const [userPrompt, setUserPrompt] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [userInput, setUserInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserPrompt(userInput);
  }

  const handleChange = (e) => {
    setUserInput(e.target.value);
  }

  useEffect(() => {
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
          console.log(jsondata.choices[0]);
          setUserResponse(jsondata.choices[0].text);
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
          <h1>Fun with AI</h1>
        </div>
      </header>

      <main>
        <div className="wrapper">
          <form action="" onSubmit={handleSubmit}>
          <label htmlFor="prompt">Enter Prompt</label>
          <textarea name="prompt" id="prompt" cols="100" rows="10" onChange={handleChange}></textarea>

          <div className="button-container">
            <button className="submit-prompt-button" type="submit" >Submit</button>
          </div>
          </form>

          <div>
            <h2>Responses</h2>

            <div className="response-container">
              <p className="user-prompt">{userPrompt}</p>
              <p className="user-response">{userResponse}</p>
            </div>
          </div>
        </div>
      </main>

      <footer>

      </footer>
    </div>
  );
}

export default App;
