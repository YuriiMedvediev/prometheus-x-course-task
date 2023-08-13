import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { CartContext } from '../contexts/CartContext';
import { BooksContext } from '../contexts/BooksContext';

import {
  Snackbar,
  Alert,
  Fab,
  Table,
  Popover,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  Chip,
  Divider,
  Avatar,
  Skeleton,
} from '@mui/material';

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import prometheusLogo from '../assets/prometheus_logo.png';
import authorPhoto from '../assets/author_photo.png';
import notFoundImage from '../assets/imageNotFound.png';
import dogCourier from '../assets/delivery.png';
import EmptyCart from '../assets/cart_empty.png';

import cn from 'classnames';

function Cart({ isUserLoggedIn, userName }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackBarMargins, setSnackBarMargins] = useState({
    marginTop: 0,
    marginLeft: 0,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorElQ, setAnchorElQ] = useState(null);
  const [sorryPopoverTitle, setSorryPopoverTitle] = useState('');

  const {
    totalAmount,
    userCartItems,
    clearCart,
    removeFromCart,
    updateQuantityInCart,
  } = useContext(CartContext);

  const books = useContext(BooksContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate('/signin');
    }
  }, [isUserLoggedIn]);

  useEffect(() => {
    if (books) {
      setLoading(false);
    }
  }, [books]);

  const handleQuantityChange = (
    event,
    itemId,
    newQuantity,
    availableQuantity
  ) => {
    if (newQuantity > availableQuantity) {
      setSorryPopoverTitle(`Sorry, we have only ${availableQuantity} books`);
      setAnchorElQ(event.currentTarget);
      setTimeout(() => {
        setAnchorElQ(null);
      }, 2000);
    } else if (newQuantity > 0) {
      const cartImage = document.querySelector('#cartImg');
      const rect = cartImage.getBoundingClientRect();
      setSnackBarMargins({
        marginTop: rect.bottom + 5,
        marginLeft: rect.left - 110,
      });
      setSnackbarOpen(true);
    }

    updateQuantityInCart(
      itemId,
      userName,
      Math.min(Math.max(newQuantity, 1), availableQuantity)
    );
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDeleteItem = (itemId) => {
    removeFromCart(itemId, userName);
  };

  const handlePurchaseClick = () => {
    clearCart(userName);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAuthorLinkInClick = () => {
    const url = 'https://www.linkedin.com/in/yurii-medvediev-554530271/';
    window.open(url, '_blank');
  };

  const handlePrometheusCourseClick = () => {
    const url = 'https://prometheus.org.ua/prometheus-plus/front-end-ciklum/';
    window.open(url, '_blank');
  };

  const getBookById = (id) => {
    return books.find((book) => book.id === id);
  };

  return (
    <div className="cartComponent">
      {loading ? (
        <section className="cartSection">
          <div className="cartHeader">
            <Skeleton
              variant="rounded"
              width={200}
              height={50}
              animation="wave"
            />
            <div className="cartControls">
              <Skeleton
                variant="circular"
                width={50}
                height={50}
                animation="wave"
                className="clearCartButton"
              />

              <Skeleton
                variant="rounded"
                width={200}
                height={50}
                animation="wave"
              />
            </div>
          </div>

          <Skeleton
            variant="rounded"
            width={800}
            height={400}
            animation="wave"
          />
        </section>
      ) : (
        <section className="cartSection">
          <div className="cartHeader">
            <Fab
              className="backToBooksButton"
              variant="extended"
              onClick={() => navigate('/books')}
            >
              <ArrowBackIosIcon />
              Back to books
            </Fab>
            <div
              className={cn('cartControls', {
                hidden: userCartItems.length === 0,
              })}
            >
              <Fab
                className="clearCartButton"
                variant="circle"
                color="error"
                onClick={() => clearCart(userName)}
                disabled={userCartItems.length === 0}
              >
                <RemoveShoppingCartIcon />
              </Fab>

              <Fab
                className="purchaseButton"
                variant="extended"
                color="success"
                onClick={handlePurchaseClick}
                disabled={userCartItems.length === 0}
              >
                <MonetizationOnIcon />
                Purchase
              </Fab>
            </div>
          </div>

          {userCartItems.length > 0 ? (
            <TableContainer className="cartTableContainer" component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Photo</TableCell>
                    <TableCell>Book's title</TableCell>
                    <TableCell style={{ width: '100px' }}>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userCartItems.map(
                    (item) =>
                      item.userName === userName && (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Link to={`/books/${item.id}`}>
                              <img
                                src={
                                  getBookById(item.id).image || notFoundImage
                                }
                                alt={getBookById(item.id).title}
                                className="cartBookImage"
                              />
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link to={`/books/${item.id}`}>
                              {getBookById(item.id).title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="reduce"
                              disabled={item.quantity === 1}
                              onClick={(event) =>
                                handleQuantityChange(
                                  event,
                                  item.id,
                                  item.quantity - 1,
                                  getBookById(item.id).amount
                                )
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                            {item.quantity}
                            <IconButton
                              aria-label="increase"
                              onClick={(event) =>
                                handleQuantityChange(
                                  event,
                                  item.id,
                                  item.quantity + 1,
                                  getBookById(item.id).amount
                                )
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell>
                            ${(item.quantity * item.price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                  )}
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="right"
                      style={{ fontWeight: 'bold' }}
                    >
                      Total:
                    </TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>
                      ${totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <section className="emptyCartSection">
              <img src={EmptyCart} alt="Empty Cart" />
              <h3>Cart is empty...</h3>
            </section>
          )}
          <Dialog
            open={isDialogOpen}
            onClose={handleCloseDialog}
            className="dialog"
          >
            <DialogTitle className="dialogTitle">
              <IconButton
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent className="dialogContent">
              <Typography variant="h6">
                Thank you for your purchase!!!
              </Typography>

              <img src={dogCourier} alt="Thank You" />
              <Typography variant="h6">
                We'll be glad to see you again!!!
              </Typography>
            </DialogContent>
            <Divider />
            <DialogActions className="dialogActions">
              <Chip
                avatar={<Avatar alt="author" src={authorPhoto} />}
                label="author's LinkedIn"
                variant="outlined"
                onClick={handleAuthorLinkInClick}
              />
              <Chip
                avatar={<Avatar alt="Prometheus" src={prometheusLogo} />}
                label="cool Front-End courses"
                variant="outlined"
                onClick={handlePrometheusCourseClick}
              />
              <Chip
                icon={<PriorityHighIcon color="primary" />}
                label="also don't forget to test 404 page"
                variant="outlined"
                onClick={() => navigate('/fakePage')}
              />
            </DialogActions>
          </Dialog>
        </section>
      )}

      <Popover
        open={Boolean(anchorElQ)}
        anchorEl={anchorElQ}
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
          <span>{sorryPopoverTitle}</span>
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

export default Cart;
