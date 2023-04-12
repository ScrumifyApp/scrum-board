import React, { useState, useContext } from 'react';
import { useNavigate, Form, redirect, Link, useActionData } from 'react-router-dom';
import { userContext } from '../../context';

const LoginPage = () => {

  const data = useActionData();

  return (
    <div>
      <h1>WELCOME TO SCRUMIFY</h1>
      <h2>Please Log In</h2>
      <br></br>
      <Form method='post' action='/'>
        <label>
          <span>Username</span>
          <input type="username" name="username" required />
        </label>
        <br></br>
        <label>
          <span>Password</span>
          <input type="password" name="password" required />
        </label>
        {data && data.error && <p>{data.error}</p>}
        <br></br>
        <button>Login</button>
      </Form>
      <div id="noAccount">
        <br></br>
        <p>No account?</p><Link to="/SignupPage"> Sign up!</Link>
        </div>
    </div>
  )
};

export const loginAction = async ({ request }) => {
  console.log("he are in the loginAction")
  const { user, setUser } = userContext;
  const loginInfo = await request.formData()
  
  //need to pull data from DB and if authentication passed
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginInfo.get('username'),
        password: loginInfo.get('password')
      })
    })

    console.log('in function body after fetch')
    console.log(res, typeof res);
    const response = await res.json();
    console.log('after ')
    console.log("info we received from backend", response);
    
    if (response.status === 'valid') {
      console.log('Login was successful!');
      await setUser(response.user); //doing this to make this response.user info accessible from userHomePage
      return redirect('/UserHomePage');
    }

    if (response.status === 'UserNotFound') {
      return { error: 'Username was not Found' };
    }

    if (response.status === 'IncorrectPassword') {
      return { error: 'Password is incorrect' };
    }

    return { error: `The status "${response.status}" sent in the response doesn't match the valid cases.` };
        
  } catch (err) {
    console.log('In catch statement')
    return `You got an error when using login action: ${err.message}`;
  }
  
  return 'fail';
 }

export default LoginPage;


/*
export const loginAction = async ({ request }) => {
  const { user, setUser } = userContext;
  const loginInfo = await request.formData()
  
  //need to pull data from DB and if authentication passed
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: loginInfo.get('username'),
      password: loginInfo.get('password')
    })
  })
  .then(response =>response.json())
    .then(response => {
      console.log("data received after login fetch");
      switch (response.status) {
        case 'valid': {
          console.log('Login was successful!');
          setUser(response.user); //doing this to make this response.user info accessible from userHomePage
          return redirect('/UserHomePage');
        }
        case 'IncorrectPassword': {
          return {error: 'Password is incorrect'}
        }
        default: {
          return {error: `The status "${response.status}" sent in the response doesn't match the valid cases.`}
          }
       }
     })
  .catch(err => { error: err.message; });
  return;
 }

*/