import React, { useState, useContext } from 'react';
import { userContext, teamContext } from '../../context';
import MainContainer from './components/MainContainer';


const ScrumBoardPage = () => {
  const { user } = useContext(userContext);
  const { team } = useContext(teamContext);
  const [teamName, setTeamName] = useState(findTeamName(user, team))

  return (
    <>
      <header>
        <h1>Scrumify Board for {teamName}</h1>
      </header>
      <MainContainer user={ user } team={ team } />
    </>
  )
};

export default ScrumBoardPage;



function findTeamName(user, team) {
  if (user?.userTeams && team) {
    for (const userTeam of user.userTeams) {
      if (userTeam.id === team) {
        return userTeam.team_name;
      }
    }
  }
}