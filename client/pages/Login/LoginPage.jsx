import React, { useContext, useEffect } from 'react';
import { useNavigate, Form, Link, useActionData } from 'react-router-dom';
import { userContext, pageContext } from '../../context';

const LoginPage = () => {
	const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);
  const { lastPage } = useContext(pageContext);
	const data = useActionData();
  
  // Set lastPage to variable that will prevent automatic page jump if page has just loaded
  useEffect(() => {
    lastPage.current = 'JustLoadedLogin'
  }, [])

  useEffect(() => {
    // Make sure the user has been set and they didn't just get to this page before navigating to UserHomePage
    if (user !== null && lastPage.current === '/') {
      return navigate('/UserHomePage');
    }
  }, [user]);

  useEffect(() => {
		if (data?.user !== undefined) {
      setUser(data.user);
      // Update lastPage to this page on successful submission
      lastPage.current = '/';
		}
  }, [data]);

	return (
		<div className='login-container'>
			<h1>WELCOME TO SCRUMIFY</h1>
			<h2>Please Log In</h2>
			<br></br>
			<Form method='post' action='/' className='login-form'>
				<label>
					<span>Username</span>
					<input type='username' name='username' required />
				</label>
				<br></br>
				<label>
					<span>Password</span>
					<input type='password' name='password' required />
				</label>
				{data && data.error && <p>{data.error}</p>}
				<br></br>
				<button>Login</button>
			</Form>
			<div id='noAccount'>
				<br></br>
				<p>No account?</p>
				<Link to='/SignUpPage'> Sign up!</Link>
			</div>
		</div>
	);
};

export const loginAction = async ({ request }) => {
	const loginInfo = await request.formData();

	//need to pull data from DB and check to see if authentication passed

	const res = await fetch('/api/user/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			username: loginInfo.get('username'),
			password: loginInfo.get('password'),
		}),
	});
	// console.log(res);
	if (res.status === 200) {
		// console.log('in function body after fetch');

		const response = await res.json();
		// console.log('after json parse');
		// console.log('info we received from backend', response);
		// console.log(response.user);
		if (response.status === 'valid') {
			// console.log('Login was successful!');
			return { user: response.user };
		}

		if (
			response.status === 'IncorrectPassword' ||
			response.status === 'UserNotFound'
		) {
			return { error: 'Username password combination was not valid' };
		}

		return {
			error: `The status "${response.status}" sent in the response doesn't match the valid cases.`,
		};
	}

	return { error: 'The server responded with a status other than 200' };
};

export default LoginPage;
