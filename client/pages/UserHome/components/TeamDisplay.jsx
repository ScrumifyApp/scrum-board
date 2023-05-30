import React, { useContext } from 'react';
import { teamContext, pageContext } from '../../../context';
import { useNavigate } from 'react-router-dom';

const TeamDisplay = ({ userTeamName, userTeamId }) => {
	const navigate = useNavigate();
  const { team, setTeam } = useContext(teamContext);
  const { lastPage } = useContext(pageContext);


	// When a button is clicked, sets that team to global context for use in the ScrumBoardPage
	const selectTeam = (userTeamId) => {
    lastPage.current = '/UserHomePage';
    // if the user clicks on the same team they were just viewing, navigate back to that team's board
    if (team === userTeamId) {
      return navigate('/ScrumBoardPage');
    } else {
      //if it's a new team, set the team to that and let UserHomePage useEffect handle navigation after team updates
      setTeam(userTeamId);
    }
	};

	return (
		<div key={userTeamId} className='team'>
			<span>
        <button onClick={() => selectTeam(userTeamId)}>
          {userTeamName}
        </button>
        <div>Join url: {userTeamId}</div>
			</span>
		</div>
	);
};

export default TeamDisplay;
