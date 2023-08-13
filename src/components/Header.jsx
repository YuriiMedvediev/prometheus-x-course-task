import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { CartContext } from '../contexts/CartContext';

import { Button, Popover, Typography, Badge } from '@mui/material';

import favicon from '../assets/favicon.ico';
import avatar from '../assets/avatar.png';
import cart from '../assets/cart.png';

import cn from 'classnames';

function Header({ userName, isUserLoggedIn, handleSignOut }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const { totalQuantity, totalAmount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSignOutButtonClick = (event) => {
    event.preventDefault();
    handleSignOut();
    navigate('/signin');
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <header className="header">
      <section className="title">
        <Link to="/books">
          <img src={favicon} height="50" alt="To Do" />
        </Link>
        <h2>
          <Link to="/books"> JS BAND STORE </Link> /
          <a
            href="https://www.linkedin.com/in/yurii-medvediev-554530271/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            Medvediev Yurii
          </a>
        </h2>
      </section>
      <section className={cn('controls', { hidden: !isUserLoggedIn })}>
        <div className="cartControl">
          <Link to="/cart">
            <img id="cartImg" src={cart} alt="cart" />
          </Link>
          {totalQuantity > 0 && (
            <Badge
              className="quantityCircleBadge"
              badgeContent={totalQuantity}
              color="secondary"
              size="large"
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              style={{
                transform: 'translate(50%, -50%)',
              }}
            ></Badge>
          )}

          {totalAmount > 0 && (
            <Badge
              className="sumRectangleBadge"
              badgeContent={'$' + totalAmount.toFixed(2)}
              color="info"
              overlap="rectangular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              style={{
                transform: 'translate(50%, -50%)',
              }}
            ></Badge>
          )}
        </div>
        <Button
          variant="contained"
          color="inherit"
          size="large"
          onClick={handleSignOutButtonClick}
        >
          Sign-Out
        </Button>
        <div
          className="userBlock"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <img src={avatar} alt="avatar" id="avatarImg" />
          <h3>{userName}</h3>
        </div>

        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
          disableScrollLock
        >
          <Typography
            sx={{
              p: 1,
              fontSize: '20px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            style={{ width: '200px', height: '300px' }}
          >
            Someday,
            <br />
            it will be a cool advanced profile menu hear.
            <br />
            <br />
            But not today!
          </Typography>
        </Popover>
      </section>
    </header>
  );
}

export default Header;
