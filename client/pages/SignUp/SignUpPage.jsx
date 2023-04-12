import React, { useState, useContext } from 'react';
import { useNavigate, Form, redirect } from 'react-router-dom';
import { userContext } from '../../context';

const SignUpPage = () => {

  const data = useActionData();

  return (
    <div>
      <h1>Create New Account</h1>
      <Form method='post' action='/SignupPage'>
        <label>
          <span>New Username</span>
          <input type="username" name="username" required />
        </label>
        {data && data.error && <p>{data.error}</p>}
        <br></br>
        <label>
          <span>New Password</span>
          <input type="password" name="password" required />
        </label>
        <br></br>
          <button>Submit</button>
      </Form>

    </div>
  )
};

export const signupAction = async ({ request }) => {
  const { user, setUser } = userContext;
  const submitData = await request.formData();
  
  //need to store username/password to DB, then
  
  fetch('/api/signup', {
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: submitData.get('username'),
      password: submitData.get('password')
    })
  })
    .then(response => response.json())
    .then(response => {
      console.log("info we received from backend", response);
      //if statement
      switch (response.status) {
        case 'valid': {
          console.log('Signup was successful!');
          // setUser(response.user); //doing this to make this response.user info accessible from userHomePage
          return redirect('/UserHomePage');
        }
        case 'DuplicateUsername': {
          return {error: 'This username is taken, please choose another'}
        }
        default: {
          console.log(`The status "${response.status}" sent in the response doesn't match the valid cases.`)
          alert(`The status "${response.status}" sent in the response doesn't match the valid cases.`);
          return
          }
      }
    })
    .catch(err => console.log("error in sending signup info to DB", err));
   
   //replace below later
  // return submission;
}

export default SignUpPage;