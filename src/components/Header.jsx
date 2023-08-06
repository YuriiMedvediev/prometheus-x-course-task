import { Button } from '@mui/material';
import favicon from '../assets/favicon.ico';
import avatar from '../assets/avatar.png';
import cart from '../assets/cart.png';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { Badge } from '@mui/material';
import { CartContext } from '../contexts/CartContext';

function Header({ userName, isUserLoggedIn, handleSignOut }) {
  const { totalQuantity, totalAmount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSignOutButtonClick = (event) => {
    event.preventDefault();
    handleSignOut();
    navigate('/signin');
  };

  return (
    <header>
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
            <img src={cart} height="80" alt="cart" />
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
        <img src={avatar} height="80" alt="avatar" />
        <h3>{userName}</h3>
      </section>
    </header>
  );
}

export default Header;
