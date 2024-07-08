import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { BsPersonFill, BsBagFill, BsGeoAltFill, BsHouseFill } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
 import { useNavigate } from 'react-router-dom';

 import "../styles/footer.css";

//import { cartUiActions } from "../../store/shopping-cart/cartUiSlice";

function BottomNavbar() {
  const { userInfo } = useSelector((state) => state.auth);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleCart = () => {
    //dispatch(cartUiActions.toggle());
    navigate('/cart');
  };


  return (
<div>
    {userInfo ? (
      <>
      <Navbar className='footercomponent' fixed="bottom" bg="light" variant="light" style={{height: '60px', backgroundColor:'#DCDCDC !important'}}>
      <Nav className="mx-auto">
      <Nav.Link href="/">
          <BsHouseFill size={24} />
          {/* <span className="d-sm-none">Home</span> */}
          <span>Home</span>
        </Nav.Link>
        <Nav.Link href="/user">
          <BsPersonFill size={24} />
          <span>Profile</span>
        </Nav.Link>
        <Nav.Link href="/cart">
          <BsBagFill size={24} />
          {/* <span className="d-sm-none">Cart</span> */}
          {totalQuantity > 0 ? (
          <span className="cart__icon" onClick={toggleCart}>
              {/* <i className="ri-shopping-basket-line z"></i> */}
              <span className="cart__badge">{totalQuantity}</span>
            </span>
            ) :
            (<span>Cart</span>)}
        </Nav.Link>
        <Nav.Link href="/address">
          <BsGeoAltFill size={24} />
          <span>Address</span>
        </Nav.Link>
      </Nav>
    </Navbar>
    </>
    ) : (
      <>
      </>
    )}
</div>

  );
}

export default BottomNavbar;
