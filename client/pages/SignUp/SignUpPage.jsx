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
  // this useEffect will set the user accordingly and update lastPage to a value that allows navigation away from signup
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

// This action function is called when the Form above is submitted (see router setup in App.jsx).
export const signupAction = async ({ request }) => {
  // Data from the form submission is available via the following message
  const submitData = await request.formData();
  // On submit, we need to send a post request to the backend with the proposed username and password
  const res = await fetch('/api/user/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: submitData.get('username'),
      password: submitData.get('password')
    })
  });
      
  // If the request repsonse has status 200, convert the response back to JS from JSON and proceed 
  if (res.status === 200) {
    const response = await res.json();

    if (response.status === 'valid') {
      // console.log('Signup was successful!');
      return {user: response.user};
    }

    if (response.status === 'UserNameExists') {
      return { error: 'This username is unavailable, please choose another' };
    }
    // Included for dev testing, only appears if response.status string in the frontend and backend are misaligned 
    return { error: `The status "${response.status}" sent in the response doesn't match the valid cases.` };
  } 
  // If the response wasn't 200, let the user know they need to try again later
  return { error: 'The server was unresponsive. Please try again later'};
}

export default SignUpPage;