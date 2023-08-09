import { useContext, useState, useEffect } from 'react';
import { BooksContext } from '../contexts/BooksContext';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import {
  Badge,
  Divider,
  Button,
  Typography,
  InputAdornment,
  Input,
  MenuItem,
  Select,
  Popover,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import notFoundImage from '../assets/imageNotFound.png';
import cn from 'classnames';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

function BookList({ isUserLoggedIn }) {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [booksAfterFilter, setBooksAfterFilter] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popOverTitle, setPopOverTitle] = useState('');

  const books = useContext(BooksContext);
  const { getQuantityById, addToCart, handleAddToCartAnimation } =
    useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate('/signin');
    }
  }, [isUserLoggedIn]);

  useEffect(() => {
    const filteredBooks = books
      .filter((book) =>
        book.title.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((book) => {
        if (priceFilter === '0-15') {
          return book.price <= 15;
        } else if (priceFilter === '15-30') {
          return book.price > 15 && book.price <= 30;
        } else if (priceFilter === '>30') {
          return book.price > 30;
        }
        return true;
      });

    setBooksAfterFilter(filteredBooks);
    if (books.length > 0) {
      setLoading(false);
    }
  }, [books, searchText, priceFilter]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handlePriceFilterChange = (event) => {
    setPriceFilter(event.target.value);
  };

  const handleClickView = (bookID) => {
    navigate(`/books/${bookID}`);
  };

  const handleClickPriceFilterOff = () => {
    setPriceFilter('all');
    setSearchText('');
  };

  const shortenTitle = (title) => {
    return title.length > 24 ? title.substring(0, 24) + '...' : title;
  };

  const handlePopoverOpen = (event, bookTitle) => {
    if (bookTitle.length > 24) {
      setAnchorEl(event.currentTarget);
      setPopOverTitle(bookTitle);
    } else {
      setAnchorEl(null);
      setPopOverTitle('');
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleAddToCartButtonClick = (event, book) => {
    event.preventDefault();
    const bookItem = {
      id: book.id,
      title: book.title,
      price: book.price,
      image: book.image,
      avaliableQuantity: book.amount,
      quantity: 1,
    };
    handleAddToCartAnimation(event, 1, book);
    addToCart(bookItem, false);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="bookList">
      {loading ? (
        <section className="bookListSection">
          <section className="bookFilterSection">
            <Skeleton
              variant="rounded"
              animation="wave"
              width={250}
              height={30}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              width={250}
              height={30}
            />
            <Skeleton
              variant="circular"
              animation="wave"
              width={40}
              height={40}
            />
          </section>

          <section className="bookListSection">
            {Array(15)
              .fill()
              .map((item, index) => (
                <Paper elevation={6} className="bookCard" key={index}>
                  <div className="bookCardHeader">
                    <Skeleton
                      className="bookCardImage"
                      variant="rectangular"
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width={190}
                      height={30}
                    />
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width={190}
                      height={30}
                    />
                  </div>
                  <Divider />
                  <div className="bookCardFooter">
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width={200}
                      height={40}
                    />
                    <Skeleton
                      variant="rounded"
                      animation="wave"
                      width={200}
                      height={40}
                    />
                  </div>
                </Paper>
              ))}
          </section>
        </section>
      ) : (
        <section className="bookListSection">
          <section className="bookFilterSection">
            <Input
              className="searchInput"
              id="search"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              placeholder="Search by book name"
              value={searchText}
              onChange={handleSearchChange}
            />
            <Select
              defaultValue="all"
              id="priceFilter"
              label=""
              variant="standard"
              className="selectPrice"
              onChange={handlePriceFilterChange}
              value={priceFilter}
            >
              <MenuItem value="" disabled>
                Choose price
              </MenuItem>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="0-15">Between $0 and $15</MenuItem>
              <MenuItem value="15-30">Between $15 and $30</MenuItem>
              <MenuItem value=">30">Greater than $30</MenuItem>
            </Select>
            <IconButton
              className={cn('filterIcon', {
                hidden: priceFilter === 'all' && searchText === '',
              })}
              aria-label="filter"
              onClick={handleClickPriceFilterOff}
            >
              <FilterAltOffIcon />
            </IconButton>
          </section>
          {booksAfterFilter.length > 0 ? (
            booksAfterFilter.map((book) => (
              <Paper elevation={6} className="bookCard" key={book.id}>
                <div className="bookCardHeader">
                  {getQuantityById(book.id) > 0 ? (
                    <Badge
                      badgeContent={getQuantityById(book.id)}
                      color="secondary"
                    >
                      <img
                        className="bookCardImage"
                        src={book.image || notFoundImage}
                        alt={book.title}
                      />
                    </Badge>
                  ) : (
                    <img
                      className="bookCardImage"
                      src={book.image || notFoundImage}
                      alt={book.title}
                    />
                  )}

                  <h3
                    onMouseEnter={(event) =>
                      handlePopoverOpen(event, book.title)
                    }
                    onMouseLeave={handlePopoverClose}
                  >
                    {shortenTitle(book.title)}
                  </h3>
                  <p>{book.author}</p>
                </div>
                <Divider />
                <div className="bookCardFooter">
                  <h3>${book.price}</h3>

                  <IconButton
                    aria-label="Add to cart"
                    onClick={(event) => handleAddToCartButtonClick(event, book)}
                    style={{ width: '40px', height: '40px', margin: '0' }}
                  >
                    <AddShoppingCartIcon />
                  </IconButton>

                  <Button
                    className="viewBtn"
                    type="button"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleClickView(book.id)}
                  >
                    View
                  </Button>
                </div>
              </Paper>
            ))
          ) : (
            <h2>Sorry, such books are not found!!!</h2>
          )}

          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: 'none',
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Typography sx={{ p: 1 }}>{popOverTitle}</Typography>
          </Popover>
        </section>
      )}
    </div>
  );
}

export default BookList;
