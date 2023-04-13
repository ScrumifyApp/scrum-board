import React, { useState, useContext, useEffect } from 'react';
import { userContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import MainContainer from '../../components/MainContainer';


const ScrumBoardPage = () => {
  return (
    <>
      <header>
        <h1>SCRUMIFY</h1>
      </header>
      <MainContainer />
    </>
  )
};

export default ScrumBoardPage;