import { TextField, Button, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import { LocalStorageService, LS_KEYS } from '../services/localStorage';
import { useNavigate } from 'react-router-dom';
import Avatar from '../assets/avatar.png';
import cn from 'classnames';

function SignIn({ handleSignIn }) {
  const [userName, setUserName] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isUserNameValid, setIsUserNameValid] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let storedUserName = LocalStorageService.getItem(LS_KEYS.USER_NAME);
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
    LocalStorageService.setItem(LS_KEYS.USER_NAME, userName);
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

  return (
    <section className="signInSection">
      <img src={Avatar} alt="User avatar" />

      <form>
        <TextField
          type="text"
          id="userName"
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
          arrow="true"
          placement="right"
        ></Tooltip>
      </form>
    </section>
  );
}

export default SignIn;
