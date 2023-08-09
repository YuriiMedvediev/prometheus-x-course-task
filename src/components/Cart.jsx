import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { Button } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReplyAllTwoToneIcon from '@mui/icons-material/ReplyAllTwoTone';
import prometheusLogo from '../assets/prometheus_logo.png';
import authorPhoto from '../assets/author_photo.png';

import EmptyCart from '../assets/cart_empty.png';
import {
  Table,
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
} from '@mui/material';
import { Delete, Add, Remove, Close } from '@mui/icons-material';
import dogCourier from '../assets/delivery.png';
import notFoundImage from '../assets/imageNotFound.png';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ClearIcon from '@mui/icons-material/Clear';

function Cart({ isUserLoggedIn }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    totalAmount,
    cartItems,
    clearCart,
    removeFromCart,
    updateQuantityInCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate('/signin');
    }
  }, [isUserLoggedIn]);

  const handleQuantityChange = (itemId, newQuantity, avaliableQuantity) => {
    updateQuantityInCart(
      itemId,
      Math.min(Math.max(newQuantity, 1), avaliableQuantity)
    );
  };

  const handleDeleteItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handlePurchaseClick = () => {
    clearCart();
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

  return (
    <section className="cartSection">
      <Button
        className="backToBooksButton"
        variant="contained"
        color="secondary"
        startIcon={<ReplyAllTwoToneIcon />}
        onClick={() => navigate('/books')}
      >
        Back to books
      </Button>

      <Button
        type="submit"
        className="purchaseButton"
        variant="contained"
        size="large"
        color="success"
        startIcon={<MonetizationOnIcon />}
        disabled={cartItems.length === 0}
        onClick={handlePurchaseClick}
      >
        Purchase
      </Button>
      {cartItems.length > 0 ? (
        <TableContainer className="cartTableContainer" component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Book's title</TableCell>
                <TableCell style={{ width: '100px' }}>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="clear-cart"
                    onClick={clearCart}
                    style={{ color: 'red' }}
                  >
                    <ClearIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link to={`/books/${item.id}`}>
                      <img
                        src={item.image || notFoundImage}
                        alt={item.title}
                        className="cartBookImage"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/books/${item.id}`}>{item.title}</Link>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="reduce"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity - 1,
                          item.avaliableQuantity
                        )
                      }
                    >
                      <Remove />
                    </IconButton>
                    {item.quantity}
                    <IconButton
                      aria-label="increase"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity + 1,
                          item.avaliableQuantity
                        )
                      }
                    >
                      <Add />
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
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className="dialogContent">
          <Typography variant="h6">Thank you for your purchase!!!</Typography>

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
  );
}

export default Cart;
