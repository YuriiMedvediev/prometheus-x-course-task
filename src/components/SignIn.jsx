import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, Tooltip, Switch } from '@mui/material';

import Avatar from '../assets/avatar.png';
import Hair from '../assets/hair.png';

import cn from 'classnames';

function SignIn({ handleSignIn }) {
  const [userName, setUserName] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isUserNameValid, setIsUserNameValid] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isHairShown, setIsHairShown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let storedUserName = localStorage.getItem('userName');
    if (storedUserName !== null && storedUserName !== '') {
      setUserName(storedUserName);
      setIsUserLoggedIn(true);
      navigate('/books');
    }
  }, []);

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
    setIsUserNameValid(isUserNameValidCheck(event.target.value));
  };

  const handleSignInButtonClick = (event) => {
    event.preventDefault();
    localStorage.setItem('userName', userName);
    handleSignIn(userName);
    navigate('/books');
  };

  const isUserNameValidCheck = (value) => {
    return value.length >= 4 && value.length <= 16;
  };

  const handleButtonOnMouseEnter = () => {
    if (!isUserNameValid) {
      setIsTooltipOpen(true);
    }
  };

  const handleButtonOnMouseLeave = () => {
    setIsTooltipOpen(false);
  };

  const handleHairShow = () => {
    setIsHairShown(!isHairShown);
  };

  return (
    <section className="signInSection">
      <div className="avatarContainer">
        <div className="switchContainer">
          <Switch
            checked={isHairShown}
            onChange={handleHairShow}
            color="primary"
          />
          <span className="switchLabel">Female mode</span>
        </div>
        <img src={Avatar} alt="User avatar" />
        {isHairShown && <img src={Hair} alt="Hair" className="hairOverlay" />}
      </div>
      <form>
        <TextField
          type="text"
          id="userName"
          className="userNameInput"
          name="userName"
          label="Type UserName"
          size="small"
          variant="outlined"
          value={userName}
          onChange={handleUserNameChange}
          autoFocus
          fullWidth
        />
        <span
          className={cn('buttonContainer', {
            disabledButtonStyle: !isUserNameValid,
          })}
          onMouseEnter={handleButtonOnMouseEnter}
          onMouseLeave={handleButtonOnMouseLeave}
        >
          <Button
            type="submit"
            className="signInButton"
            variant="contained"
            disabled={!isUserNameValid}
            onClick={handleSignInButtonClick}
            fullWidth
          >
            <span>Sign-In</span>
          </Button>
        </span>
        <Tooltip
          title={<h3>Username must be between 4 and 16 characters.</h3>}
          open={isTooltipOpen}
          arrow={true}
          placement="right"
        >
          <span></span>
        </Tooltip>
      </form>
    </section>
  );
}

export default SignIn;
