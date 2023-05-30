import React, { useContext, useEffect } from 'react';
import { useNavigate, Form, useActionData } from 'react-router-dom';
import { userContext, pageContext } from '../../context';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext)
  const { lastPage } = useContext(pageContext);
  const data = useActionData();

  // Set lastPage to variable that will prevent automatic page jump if page has just loaded
  useEffect(() => {
    lastPage.current = 'JustLoadedSignUp';
  }, [])

  useEffect(() => {
    // Make sure the user has been set and they didn't just get to this page before navigating to UserHomePage
    if (user !== null && lastPage.current === '/SignUpPage') {
      return navigate('/UserHomePage');
    }
  }, [user]);

  // After a user submits info and a valid response from the backend has been received, 
  // this useEffect will set the user accordingly
  useEffect(() => {
    if (data?.user !== undefined) {
      setUser(data.user)
      // Update lastPage to this page on successful submission
      lastPage.current = '/SignUpPage';
    }
  }, [data]);

  return (
    <div className="login-container">
      <h1>Create New Account</h1>
      <Form method='post' action='/SignupPage' className='login-form'>
        <label>
          <span>New Username</span>
          <input type="username" name="username" required />
        </label>
        <br></br>
        <label>
          <span>New Password</span>
          <input type="password" name="password" required />
        </label>
        <br></br>
        {data && data.error && <p>{data.error}</p>}
          <button>Submit</button>
      </Form>

    </div>
  )
};

export const signupAction = async ({ request }) => {
  const submitData = await request.formData();

  //need to store username/password to DB, then

  const res = await fetch('/api/user/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: submitData.get('username'),
      password: submitData.get('password')
    })
  });
      
  // console.log(res);
  if (res.status === 200) {
        
  // console.log('in function body after fetch')

  const response = await res.json();
  // console.log('after json parse ')
  // console.log("info we received from backend", response);
  // console.log(response.user)
  if (response.status === 'valid') {
    // console.log('Signup was successful!');
    return {user: response.user};
  }

  if (response.status === 'UserNameExists') {
    return { error: 'This username is taken, please choose another' };
  }

  return { error: `The status "${response.status}" sent in the response doesn't match the valid cases.` };
  
  } 

  return { error: 'The server responded with a status other than 200'};
 }

export default SignUpPage;