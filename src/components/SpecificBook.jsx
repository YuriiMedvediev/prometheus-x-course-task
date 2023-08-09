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
  Divider,
  Chip,
  Skeleton,
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

function SpecificBook({ isUserLoggedIn }) {
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [orderSum, setOrderSum] = useState(0);

  const {
    addToCart,
    removeFromCart,
    getQuantityById,
    getSumById,
    handleAddToCartAnimation,
  } = useContext(CartContext);
  const { id } = useParams();
  const books = useContext(BooksContext);

  const navigate = useNavigate();

  useEffect(() => {
    setOrderSum(calcOrderSum());
  }, [quantity, book]);

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
  }, [books]);

  useEffect(() => {
    if (!loading && addToCart && getQuantityById) {
      const initialQuantity = getQuantityById(parseInt(id));
      setQuantity(initialQuantity > 0 ? initialQuantity : 1);
    }
  }, [loading, addToCart, getQuantityById, id]);

  const calcOrderSum = () => {
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
    handleAddToCartAnimation(event, quantity, book);

    addToCart(bookItem);
  };

  const handleRemoveFromCartButtonClick = (event) => {
    event.preventDefault();
    removeFromCart(book.id);
  };

  return (
    <div className="specificBook" data-testid="specific-book-component">
      {loading ? (
        <Paper elevation={6} className="specificBookSection">
          <section className="specificBookCard">
            <Skeleton className="bookImg" variant="rounded" animation="wave" />
            <div className="specificBookCardHeader">
              <div className="specificBookCardHeaderTop">
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={300}
                  height={40}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={300}
                  height={40}
                />
              </div>

              <div className="specificBookCardHeaderBottom">
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={300}
                  height={40}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={300}
                  height={40}
                />
              </div>
            </div>

            <div className="specificBookCardFooter">
              {Array(13)
                .fill()
                .map((item, index) => (
                  <Skeleton
                    key={index}
                    variant="text"
                    animation="wave"
                    width={770}
                  />
                ))}
            </div>
          </section>

          <section className="specificBookOrderDetails">
            <Paper elevation={6} className="specificBookOrderCard">
              <div className="priceSection">
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={120}
                  height={40}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={120}
                  height={40}
                />
              </div>
              <div className="quantitySection">
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={120}
                  height={40}
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={150}
                  height={50}
                />
              </div>
              <div className="totalSumSection">
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={120}
                  height={40}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={120}
                  height={40}
                />
              </div>
              <Divider style={{ marginBottom: '10px' }} />

              <div className="addButtonSection">
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={200}
                  height={50}
                />
              </div>
            </Paper>

            <Skeleton
              variant="rounded"
              animation="wave"
              width={200}
              height={50}
            />
          </section>
        </Paper>
      ) : (
        <Paper elevation={6} className="specificBookSection">
          <section className="specificBookCard">
            <img
              className="bookImg"
              src={book.image || notFoundImage}
              alt={book.title}
            />
            <div className="specificBookCardHeader">
              <div className="specificBookCardHeaderTop">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>

              <div className="specificBookCardHeaderBottom">
                <p> {'Level: ' + book.level}</p>
                {book.tags.map((tag) => (
                  <Chip key={tag} label={tag} />
                ))}
              </div>
            </div>

            <div className="specificBookCardFooter">{book.description}</div>
          </section>

          <section className="specificBookOrderDetails">
            <Paper elevation={6} className="specificBookOrderCard">
              <div className="priceSection">
                <h3>Price, $ </h3>
                <h3>{book.price}</h3>
              </div>
              <div className="quantitySection">
                <h3>Quantity</h3>
                <TextField
                  className="quantityInput"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  style={{
                    width: '150px',
                    marginTop: 0,
                  }}
                  InputProps={{
                    inputProps: {
                      'data-testid': 'quantity-input',
                      style: {
                        fontWeight: 'bold',
                        fontSize: '18px',
                        textAlign: 'center',
                      },
                    },
                    inputMode: 'numeric',
                    pattern: '[0-9]*',

                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          data-testid="decrease-button"
                          aria-label="decrease count"
                          onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                          style={{
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                          }}
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
                          style={{
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                          }}
                        >
                          +
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="totalSumSection">
                <h3>Total, $ </h3>
                <h3 data-testid="order-sum" className="orderSum">
                  {orderSum}
                </h3>
              </div>
              <Divider style={{ marginBottom: '10px' }} />

              {getQuantityById(book.id) > 0 ? (
                <div className="changeButtonSection">
                  <Chip
                    variant="outlined"
                    style={{
                      fontSize: '16px',
                      padding: '3px',
                      height: 'auto',
                    }}
                    onDelete={handleRemoveFromCartButtonClick}
                    deleteIcon={
                      <RemoveShoppingCartIcon style={{ color: 'red' }} />
                    }
                    label={
                      <span>
                        <span>{`In the cart: ${getQuantityById(
                          book.id
                        )} items`}</span>
                        <br />
                        {`Total: $${getSumById(book.id).toFixed(2)}`}
                      </span>
                    }
                  />
                  <Button
                    className="changeCartButton"
                    variant="contained"
                    color="success"
                    startIcon={<AddShoppingCart />}
                    onClick={(event) => handleAddToCartButtonClick(event)}
                  >
                    Change Qty
                  </Button>
                </div>
              ) : (
                <div className="addButtonSection">
                  <Button
                    className="addToCartButton"
                    variant="contained"
                    color="primary"
                    startIcon={<AddShoppingCart />}
                    onClick={(event) => handleAddToCartButtonClick(event)}
                  >
                    Add to cart
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
              Back to books
            </Button>
          </section>
        </Paper>
      )}
    </div>
  );
}

export default SpecificBook;
