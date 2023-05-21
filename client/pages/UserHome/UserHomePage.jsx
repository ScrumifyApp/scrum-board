import React, { useState, useContext, useEffect } from 'react';
import { userContext, teamContext } from '../../context';
import { useNavigate } from 'react-router-dom';

import TeamDisplay from './components/TeamDisplay';

const UserHomePage = () => {
	const { user, setUser } = useContext(userContext);
	const { team, setTeam } = useContext(teamContext);
	const [joinTeamCode, setJoinTeamCode] = useState('');
	const [newTeamName, setNewTeamName] = useState('');
	const [teamArray, setTeamArray] = useState([]);
	const navigate = useNavigate();

	// Function executes when the user clicks the "Create New Team" button.
	// Takes the input from the associated input field, creates a team with that input as the team name,
	// adds the current user to that team, and then redirects to that team's scrum board
	const handleCreateTeam = async (e) => {
		e.preventDefault();
		//check to make sure they've entered info into the team name input element
		if (newTeamName === '') {
			alert('Please enter a team name before submitting');
			return;
		}

		// query to backend middleware to handle insertion of user and team into userTeam table
		const response = await fetch('/api/user/create-team', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				user_id: user.user_id,
				team_name: newTeamName,
			}),
		});

		// console.log('repsonse:', response);
		if (response.status === 200) {
			const res = await response.json();
			//Updates global team context to the team_id that was just created
			setTeam(res.team_id);
			// console.log('team_id:', res.team_id);
			//navigates to scrumboard
			return navigate('/ScrumBoardPage');
		}

		alert('Server fail');
		return;
	};

	// Function executes when a team url is added and the user clicks the "Join Team" button.
	// Adds the user to the team provided and navigates to the ScrumBoardPage for that team
	const handleJoinTeam = async (e) => {
		e.preventDefault();
		//check to make sure they've put info into the join team input field
		if (joinTeamCode === '') {
			alert('Please enter a team url before submitting');
			return;
		}
		// console.log('join team code:', joinTeamCode);
		//send a post request to the backend to add current context user to team from url
		const response = await fetch(`/api/user/join-team/${joinTeamCode}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user_id: user.user_id }),
		});

		// console.log('repsonse:', response);
		if (response.status === 200) {
			const res = await response.json();
			//check variable sent back to see if add was successful
			if (res.teamAdded) {
				// console.log(user.username, 'was successfully added to the team!');
				//Updates global team context to the team_id that was just created
				setTeam(res.team_id);
				// console.log('team_id:', res.team_id);
				//navigates to scrumboard
				return navigate('/ScrumBoardPage');
			}
			//There's probably a smoother way to make this happen. Maybe adding a stateful
			//message in the page
			alert(
				'Server could not add you to the team because the team url was invalid'
			);
			return;
		}
		alert('Server fail');
		return;
	};

	//Update teamArray displayed below after user has been loaded from global context
	useEffect(() => {
		setTeamArray(makeTeamArray(user.userTeams));
	}, [user]);

	//What renders from the funcitonal component
	return (
		<>
			<div className='user-home-page login-container'>
				<h1>User Home Page</h1>
				<div id='create-team-div' className=' '>
					<input
						type='text'
						placeholder='Enter your team name here'
						onChange={(e) => setNewTeamName(e.target.value)}
					/>
					<button onClick={handleCreateTeam}>Create New Team</button>
				</div>
				<div id='create-team-div'>
					<input
						type='text'
						placeholder={'Enter your team url here'}
						onChange={(e) => setJoinTeamCode(e.target.value)}
					/>
					<button onClick={handleJoinTeam}>Join Team</button>
				</div>
			</div>
			<div id='teams-container-div' className='login-container'>
				<h2>Your Teams</h2>
				{teamArray}
			</div>
		</>
	);
};

export default UserHomePage;

function makeTeamArray(userTeamArray) {
	if (!userTeamArray || userTeamArray.length === 0) {
		return <div>Join some teams already!!! Don't you have friends?</div>;
	}
	return userTeamArray.map((team) => {
		return <TeamDisplay teamName={team.team_name} teamId={team.id} />;
	});
}
