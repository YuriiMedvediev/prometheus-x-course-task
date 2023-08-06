import { useNavigate, useParams } from 'react-router-dom';
import { BooksContext } from '../contexts/BooksContext';
import { CartContext } from '../contexts/CartContext';
import { useState, useEffect, useContext } from 'react';
import notFoundImage from '../assets/imageNotFound.png';
import ReplyAllTwoToneIcon from '@mui/icons-material/ReplyAllTwoTone';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Paper,
  Chip,
} from '@mui/material';
import { AddShoppingCart, BookSharp } from '@mui/icons-material';

function SpecificBook({ isUserLoggedIn }) {
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [orderSum, setOrderSum] = useState(0);
  const { addToCart, removeFromCart, getQuantityById } =
    useContext(CartContext);
  const { id } = useParams();

  const books = useContext(BooksContext);

  const navigate = useNavigate();

  useEffect(() => {
    setOrderSum(calcOrderSum());
  }, [quantity]);

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate('/signin');
    }
  }, [isUserLoggedIn]);

  useEffect(() => {
    if (books.length > 0) {
      setBook(books.find((book) => book.id === parseInt(id)));
      setLoading(false);
    }
  }, [books, id]);

  const calcOrderSum = () => {
    if (!book) {
      return 0;
    }
    return (quantity * book.price).toFixed(2);
  };

  const handleQuantityChange = (event) => {
    setQuantity(Math.max(Math.min(event.target.value, book.amount), 1));
  };

  const handleAddToCartButtonClick = (event) => {
    event.preventDefault();
    const bookItem = {
      id: book.id,
      title: book.title,
      price: book.price,
      image: book.image,
      avaliableQuantity: book.amount,
      quantity,
    };

    addToCart(bookItem);
  };

  const handleRemoveFromCartButtonClick = (event) => {
    event.preventDefault();
    removeFromCart(book.id);
  };

  const handleMouseClick = (event) => {
    event.preventDefault();
    const flyingImage = document.createElement('img');
    flyingImage.src = book.image || notFoundImage;
    flyingImage.className = 'flyingBookImage';

    document.body.appendChild(flyingImage);

    const rect = flyingImage.getBoundingClientRect();
    const offsetX = event.clientX - rect.width + 385;
    const offsetY = event.clientY - rect.height;

    flyingImage.style.position = 'fixed';
    flyingImage.style.left = `${offsetX}px`;
    flyingImage.style.top = `${offsetY}px`;

    setTimeout(() => {
      flyingImage.style.transition = 'all 1s ease';
      flyingImage.style.top = '-140px';
      flyingImage.style.right = '0';
      flyingImage.style.transform = 'scale(0)';
    }, 100);
  };

  return (
    <div className="specificBook" data-testid="specific-book-component">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <Paper elevation={6} className="specificBookSection">
          <section className="specificBookCard">
            <img src={book.image || notFoundImage} alt={book.title} />
            <div className="specificBookCardHeader">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p> {'Level: ' + book.level}</p>
              <p>
                {book.tags.map((tag) => (
                  <Chip key={tag} label={tag} />
                ))}
              </p>
            </div>

            <div className="specificBookCardFooter">
              <p>{book.description} </p>
            </div>
          </section>

          <Paper elevation={6} className="specificBookOrderCard">
            <h3>Order Details</h3>
            <p>Price: ${book.price}</p>

            <TextField
              data-testid="quantity-input"
              label="Quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      data-testid="decrease-button"
                      aria-label="decrease count"
                      onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                    >
                      -
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      data-testid="increase-button"
                      aria-label="increase count"
                      onClick={() =>
                        setQuantity(Math.min(quantity + 1, book.amount))
                      }
                    >
                      +
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <p>Total: ${orderSum}</p>
            <Button
              className="addToCartButton"
              variant="contained"
              color="primary"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCartButtonClick}
              onMouseDown={handleMouseClick}
            >
              Add to cart
            </Button>
            {getQuantityById(book.id) > 0 && (
              <div>
                <Chip
                  label={`Already in cart: ${getQuantityById(book.id)} pcs`}
                />
                <Button
                  className="removeFromCartButton"
                  variant="contained"
                  color="error"
                  startIcon={<RemoveShoppingCartIcon />}
                  onClick={handleRemoveFromCartButtonClick}
                >
                  Remove from cart
                </Button>
              </div>
            )}
          </Paper>

          <Button
            className="backToBooksButton"
            variant="contained"
            color="secondary"
            startIcon={<ReplyAllTwoToneIcon />}
            onClick={() => navigate('/books')}
          >
            Back to catalog
          </Button>
        </Paper>
      )}
    </div>
  );
}

export default SpecificBook;
