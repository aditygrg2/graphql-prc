import React, { useRef, useState, useContext } from "react";
import authContext from "../context/authContext";

const AuthPage = (props) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const globalAuthContext = useContext(authContext);

  const [loginSwitcher, setLoginSwitcher] = useState(false); 

  const switchHandler = async (e) => {
    setLoginSwitcher((state) => {
        return state = !state;
    })
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if(email.trim().length === 0 || password.trim().length === 0){
        return;
    }

    const requestBody = {
        query:  !loginSwitcher ? `mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
                _id, email
            }
        }` : `query {
            login(email: "${email}", password:"${password}") {
                userId, token, tokenExpiration
            }
        }`
    }

    const data = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const result = await data.json();

    if(result.data?.login?.token){
        globalAuthContext.login(result.data.login.token, result.data.login.userId);
    }
  };

  return <form onSubmit={submitHandler}>
    <div className="form-control">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={emailRef}/>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordRef}/>
        <button type="button" onClick={switchHandler}> Switch to {!loginSwitcher ? 'Login' : 'Signup'} </button>
        <button type="submit">Submit</button>
    </div>
  </form>
};

export default AuthPage;
