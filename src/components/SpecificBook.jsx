import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BooksContext } from '../contexts/BooksContext';
import { CartContext } from '../contexts/CartContext';

import {
  Badge,
  Button,
  Fab,
  Popover,
  IconButton,
  InputAdornment,
  TextField,
  Paper,
  Divider,
  Chip,
  Skeleton,
  Snackbar,
  Alert,
} from '@mui/material';

import { AddShoppingCart } from '@mui/icons-material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';

import notFoundImage from '../assets/imageNotFound.png';

function SpecificBook({ isUserLoggedIn, userName }) {
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [orderSum, setOrderSum] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackBarMargins, setSnackBarMargins] = useState({
    marginTop: 0,
    marginLeft: 0,
  });
  const [anchorElQ, setAnchorElQ] = useState(null);

  const {
    addToCart,
    removeFromCart,
    getQuantityById,
    handleAddToCartAnimation,
  } = useContext(CartContext);
  const { id } = useParams();
  const books = useContext(BooksContext);

  const navigate = useNavigate();

  const quantityInputRef = useRef(null);

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
      const initialQuantity = getQuantityById(parseInt(id), userName);
      setQuantity(initialQuantity > 0 ? initialQuantity : 1);
    }
  }, [loading, addToCart, getQuantityById, id]);

  const calcOrderSum = () => {
    return (quantity * book.price).toFixed(2);
  };

  const handleQuantityChange = (event, increaseTo = 0) => {
    const newQuantity =
      increaseTo === 0 ? event.target.value : quantity + increaseTo;

    if (newQuantity > book.amount) {
      setAnchorElQ(event.currentTarget);
      setTimeout(() => {
        setAnchorElQ(null);
      }, 2000);
    }
    setQuantity(Math.max(Math.min(newQuantity, book.amount), 1));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAddToCartButtonClick = (event, isUpdate = false) => {
    event.preventDefault();
    const bookItem = {
      id: book.id,
      price: book.price,
      quantity: quantity,
      userName: userName,
    };

    addToCart(bookItem);
    if (!isUpdate) {
      handleAddToCartAnimation(event, quantity, book);
    } else {
      const cartImage = document.querySelector('#cartImg');
      const rect = cartImage.getBoundingClientRect();
      setSnackBarMargins({
        marginTop: rect.bottom + 5,
        marginLeft: rect.left - 110,
      });
      setSnackbarOpen(true);
    }
  };

  const handleRemoveFromCartButtonClick = () => {
    removeFromCart(book.id, userName);
  };

  return (
    <div className="specificBook" data-testid="specific-book-component">
      {loading ? (
        <Paper elevation={6} className="specificBookSection">
          <div className="specificBookHeader">
            <Skeleton
              className="backToBooksButton"
              variant="rounded"
              animation="wave"
              width={200}
              height={50}
            />
          </div>
          <div className="specificBookBody">
            <section className="specificBookCard">
              <Skeleton
                className="bookImg"
                variant="rounded"
                animation="wave"
              />
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
            </section>
          </div>
        </Paper>
      ) : (
        <Paper elevation={6} className="specificBookSection">
          <div className="specificBookHeader">
            <Fab
              className="backToBooksButton"
              variant="extended"
              onClick={() => navigate('/books')}
            >
              <ArrowBackIosIcon />
              Back to books
            </Fab>
          </div>

          <div className="specificBookBody">
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
              <Badge
                badgeContent={getQuantityById(book.id, userName)}
                color="secondary"
              >
                <Paper elevation={6} className="specificBookOrderCard">
                  <div className="priceSection">
                    <h3>Price, $ </h3>
                    <h3>{book.price}</h3>
                  </div>
                  <div className="quantitySection">
                    <h3>Quantity</h3>
                    <TextField
                      ref={quantityInputRef}
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
                              disabled={quantity === 1}
                              onClick={() =>
                                setQuantity(Math.max(quantity - 1, 1))
                              }
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
                              onClick={(event) =>
                                handleQuantityChange(event, 1)
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

                  {getQuantityById(book.id, userName) > 0 ? (
                    <div className="changeButtonSection">
                      <IconButton
                        onClick={() => handleRemoveFromCartButtonClick()}
                      >
                        <RemoveShoppingCartIcon />
                      </IconButton>
                      <Button
                        className="changeCartButton"
                        variant="contained"
                        color="success"
                        startIcon={<AddShoppingCart />}
                        onClick={(event) =>
                          handleAddToCartButtonClick(event, true)
                        }
                        disabled={
                          getQuantityById(book.id, userName) === quantity
                        }
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
              </Badge>
            </section>
          </div>
        </Paper>
      )}

      <Popover
        open={Boolean(anchorElQ)}
        anchorEl={quantityInputRef.current}
        onClose={() => setAnchorElQ(null)}
        anchorReference="anchorEl"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
          <CloseIcon style={{ color: 'red', marginRight: '10px' }} />
          <span>Sorry, we have only {book.amount} books.</span>
        </div>
      </Popover>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        style={snackBarMargins}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Quantity has been updated!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SpecificBook;
