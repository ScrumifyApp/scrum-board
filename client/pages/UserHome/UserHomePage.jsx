import React, { useState, useContext, useEffect } from 'react';
import { userContext, teamContext, pageContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import TeamDisplay from './components/TeamDisplay';


const UserHomePage = () => {
	const { user, setUser } = useContext(userContext);
  const { team, setTeam } = useContext(teamContext);
  const { lastPage } = useContext(pageContext);
	const [joinTeamCode, setJoinTeamCode] = useState('');
	const [newTeamName, setNewTeamName] = useState('');
	const [teamArray, setTeamArray] = useState([]);
	const navigate = useNavigate();
  
  // Set lastPage to variable that will prevent automatic page jump if page has just loaded
  useEffect(() => {
    if (lastPage.current !== '/ScrumBoardPage') {
      lastPage.current = 'JustLoadedUserHomePage';
    }
  }, [])

  // Navigate to ScrumBoardPage after team has successfully been updated from either 
  // creating a team, joining a team, or selecting an existing team
  useEffect(() => {
    // Make sure the team has been set and the user didn't just get to this page before navigating to scrumboard
    if (team !== null && lastPage.current !== 'JustLoadedUserHomePage' && lastPage.current !== '/ScrumBoardPage') {
      return navigate('/ScrumBoardPage');
    }
  }, [team])

	//Update teamArray displayed below after user has been loaded from global context
	useEffect(() => {
    setTeamArray(makeTeamArray(user?.userTeams));
  }, [user]);


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

		if (response.status === 200) {
      const res = await response.json();
      // update user to include new team in teams array 
      setUser({
        ...user,
        userTeams: res.user.userTeams
      });
			//Updates global team context to the team_id that was just created
      setTeam(Number(res.team_id));
      // update last page to this page before navigating away from it
      lastPage.current = '/UserHomePage';
      return;
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
		// send a post request to the backend to add current context user to team from url
    // Using param to make it easier to transistion from using the team_id number to a more complex link
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
      switch (res.teamAddStatus) {
        case ('Success'): {
        // update user to include new team in teams array 
        setUser({
          ...user,
          userTeams: res.user.userTeams
        });
        //Updates global team context to the team_id that was just created
			  setTeam(Number(res.team_id));
				// update last page to this page before navigating away from it
        lastPage.current = '/UserHomePage';
        return;  
        }
        case ('AlreadyMember'): {
          //There's probably a smoother way to make this happen. Maybe adding a stateful message in the page
          alert(
            'You are already a member of this team'
          );
          return;
        }
        case ('InvalidURL'): {
          alert(
            'This team url is invalid, please try a different url'
          );
          return;
        }
        default: {
          console.log('The UserHomePage switch case failed to find a match before the default case')
          return;
        }
      }
		}
		alert('Server fail');
		return;
	};


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
		return <div>Please create or join a team</div>;
	}
  return userTeamArray.map((userTeam) => {
		return <TeamDisplay userTeamName={userTeam.team_name} userTeamId={userTeam.id} />;
	});
}
