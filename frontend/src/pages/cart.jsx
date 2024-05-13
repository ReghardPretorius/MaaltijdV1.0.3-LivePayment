import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartItem from "../components/cartItem";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa'; 
//import { cartUiActions } from "../../../store/shopping-cart/cartUiSlice";

import "../styles/shopping-cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartProducts = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const toggleCart = () => {
    //dispatch(cartUiActions.toggle());

  };

  

  const togglePayment = () => {
navigate('/checkout');
  };

  const toMenu = () => {
    //dispatch(cartUiActions.toggle());
    navigate('/');
  };
  return (
    // <div className="cart__container" onClick={toggleCart}>
    // <div style={{marginTop: '60px', marginBottom: '60px'}} >
    <div style={{paddingTop: '70px', paddingBottom: '60px'}}>
      <ListGroup onClick={(event) => event.stopPropagation()} className="cart">
        {/* <div className="cart__closeButton">
          <span onClick={toMenu}>
            <BsX />
          </span>
        </div> */}

    {/* <button
      style={{
        position: 'absolute',
        top: '10px', // Adjust top position as needed
        right: '10px', // Adjust right position as needed
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        border: 'none',
        backgroundColor: '#ff0000',
        color: '#ffffff',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={toMenu}
    >
      <FaTimes />
    </button> */}

        <div className="cart__item-list">
          {/* {cartProducts.length === 0 ? (
            <h6 className="text-center">No item added to the cart</h6>
          ) : (
            <h6 className="text-center">Order before 12h00 Noon to qualify for next day delivery</h6>
            cartProducts.map((item, index) => (
              <CartItem item={item} key={index} onClose={toggleCart}/>
            ))
          )} */}
          {cartProducts.length === 0 ? (
  <h4 className="text-center pt-1">No item added to the cart</h4>
) : (
  <>
    <h4 className="text-center pt-1">Order before 12h00 Noon to qualify for next day delivery</h4>
    {cartProducts.map((item, index) => (
      <CartItem item={item} key={index} onClose={toggleCart}/>
    ))}
  </>
)}

        </div>

        <div className="cart__bottom d-flex align-items-center justify-content-between">
          <h6>
            Subtotal : <span>R {totalAmount}</span>
          </h6>
          <Button onClick={togglePayment}>
            {/* <Link to="/checkout" onClick={toggleCart}>
              Checkout
            </Link> */}
            Checkout
          </Button>
        </div>
      </ListGroup>
    </div>
  );
};

export default Cart;