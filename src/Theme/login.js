import React, { useState } from 'react';
import { ArticleAlignCenter } from './Components/MainComponents'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
import url from '../config';

function Login() {
  const cookies = new Cookies();
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    document.querySelector(".load").style.display = "flex";
    loginUser();
  }

  async function loginUser() {

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputs),
    };

    const response = await fetch(url + '/login', requestOptions);
    let responseBody = await response.json();
    document.querySelector(".load").style.display = "none";
    if(response.status === 401){
      document.getElementById('errorMessage').innerHTML = responseBody.error;
    }
    if(response.status === 422){
      document.getElementById('errorMessage').innerHTML = "Preencha todos os campos.";
    }
    if (responseBody.result) {
      cookies.set('token', responseBody.result);
      cookies.set('user', true);
    }
  };

  if(cookies.get('user')){
    return <Redirect from="*" to="/simulated" />
  }


  return (
    <ArticleAlignCenter>
      <div>
        <div className="figureImage"></div>
      </div>
      <div id="errorMessage"></div>
      <form className="flex-column" onSubmit={handleSubmit}>
        <label>
          <input onChange={handleChange} type="email" name="email" placeholder="Email" />
        </label>
        <label>
          <input onChange={handleChange} type="password" name="password" placeholder="senha" />
        </label>
        <button>Login</button>
      </form>
    </ArticleAlignCenter>
  );
}

export default Login;