import { Container, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartItem from "../components/cartItem";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col , Modal } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa'; 
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { updateDeliveryDay } from "../slices/orderSlice";
import Loader from '../components/Loader';
//import { cartUiActions } from "../../../store/shopping-cart/cartUiSlice";

import "../styles/shopping-cart.css";

// import { LocalStorage } from 'local-storage'; // Install using npm install local-storage
import { Alert } from 'react-bootstrap'; // Import Alert component

const localStorageKey = 'foodDeliveryNotificationShown'; // Unique key for storage



const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartProducts = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [message, setMessage] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [targetTime, setTargetTime] = useState(new Date());
  const [deliveryDay, setDeliveryDay] = useState(); // Set target time to 12:00 noon
  const [loadingMessage, setLoadingMessage] = useState(true);

  const detailsRef = useRef(null);
  const deliveryRef = useRef(null);
  const subtotalRef = useRef(null);
  const [remainingHeight, setRemainingHeight] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // useEffect(() => {
  //   const storage = new LocalStorage();
  //   const notificationShownToday = storage.getItem(localStorageKey);

  //   // Check if notification has already been shown today (using date comparison)
  //   const today = new Date().toLocaleDateString();
  //   if (!notificationShownToday || notificationShownToday !== today) {
  //     setShowNotification(true);
  //     storage.setItem(localStorageKey, today); // Store the shown date
  //   }
  // }, []);

  const checkNotification = () => {
    const lastShownDate = localStorage.getItem("notificationDate");
    const today = new Date().toISOString().split('T')[0];
    
    if (lastShownDate !== today) {
      localStorage.setItem("notificationDate", today);
      setShowNotification(true);
    }
  };

  useEffect(() => {
    checkNotification();
  }, []);


  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const now = new Date();

  //     // Set target time to 12:00:00 for the current day
  //     const targetYear = now.getFullYear();
  //     const targetMonth = now.getMonth();
  //     const targetDay = now.getDate();
  //     setTargetTime(new Date(targetYear, targetMonth, targetDay, 12, 0, 0));
  //     const difference = targetTime - now;


  //     // Check if target time has passed (within the current day)
  //     if (difference > 0) {
  //       const hours = Math.floor(Math.abs(difference) / (1000 * 60 * 60));
  //       const minutes = Math.floor(Math.abs((difference % (1000 * 60 * 60)) / (1000 * 60)));
  //       const seconds = Math.floor(Math.abs((difference % (1000 * 60)) / 1000));

  //       setMessage(`Order in ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} to qualify for Next Day Delivery`);
  //     } else {
  //       const tomorrow = new Date(now.getTime() + 1000 * 60 * 60 * 24);
  //       const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  //       const dayAfterTomorrow = new Intl.DateTimeFormat('en-ZA', options).format(tomorrow.setDate(tomorrow.getDate() + 1));
  //       setMessage(`Next delivery date: ${dayAfterTomorrow}`);
  //     }

  //   }, 1000);

  //   return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
  // }, []);

  useLayoutEffect(() => {
    const updateHeight = () => {
      const deliveryHeight = deliveryRef.current ? deliveryRef.current.offsetHeight : 0;
      const detailsHeight = detailsRef.current ? detailsRef.current.offsetHeight : 0;
      

      const windowHeight = window.innerHeight;


      setRemainingHeight(windowHeight - 130 - 70 - 10  - 5  - deliveryHeight - detailsHeight);;
    };

    // Initial calculation
    // updateHeight();
    setTimeout(updateHeight, 3000);

    // Recalculate on window resize
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);



  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // Sunday - Saturday : 0 - 6
      // Set target time to 12:00:00 for the current day
      const targetYear = now.getFullYear();
      const targetMonth = now.getMonth();
      const targetDay = now.getDate();
      const targetTime = new Date(targetYear, targetMonth, targetDay, 12, 0, 0);
      const difference = targetTime - now;
  
      const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-ZA', options).format(date);
      };
  
      const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      };
  
      let nextDeliveryDate;
  
      if (dayOfWeek >= 1 && dayOfWeek <= 4) {
        // Monday - Thursday
        if (difference > 0) {
          const hours = Math.floor(Math.abs(difference) / (1000 * 60 * 60));
          const minutes = Math.floor(Math.abs((difference % (1000 * 60 * 60)) / (1000 * 60)));
          const seconds = Math.floor(Math.abs((difference % (1000 * 60)) / 1000));
  
          
          setMessage(`Order in ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} to qualify for Next Day Delivery`);
         setLoadingMessage(false);
        } else {
          nextDeliveryDate = addDays(now, 2);
          setMessage(`Next delivery date: ${formatDate(nextDeliveryDate)}`);
          setLoadingMessage(false);
        }
      } else if (dayOfWeek === 5) {
        // Friday
        if (difference > 0) {
          const hours = Math.floor(Math.abs(difference) / (1000 * 60 * 60));
          const minutes = Math.floor(Math.abs((difference % (1000 * 60 * 60)) / (1000 * 60)));
          const seconds = Math.floor(Math.abs((difference % (1000 * 60)) / 1000));
  
          setMessage(`Order in ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} to qualify for Next Day Delivery`);
          setLoadingMessage(false);
        } else {
          nextDeliveryDate = addDays(now, (7 - dayOfWeek + 1)); // Next Monday
          setMessage(`Next delivery date: ${formatDate(nextDeliveryDate)}`);
          setLoadingMessage(false);
        }
      } else if (dayOfWeek === 6) {
        // Saturday
        if (difference > 0) {
          nextDeliveryDate = addDays(now, (7 - dayOfWeek + 1)); // Next Monday
          setMessage(`Next delivery date: ${formatDate(nextDeliveryDate)}`);
          setLoadingMessage(false);
        } else {
          nextDeliveryDate = addDays(now, (7 - dayOfWeek + 2)); // Next Tuesday
          setMessage(`Next delivery date: ${formatDate(nextDeliveryDate)}`);
          setLoadingMessage(false);
        }
      } else if (dayOfWeek === 0) {
        // Sunday
        nextDeliveryDate = addDays(now, ( dayOfWeek + 2)); // Next Tuesday
        setMessage(`Next delivery date: ${formatDate(nextDeliveryDate)}`);
        setLoadingMessage(false);
      }
  
    }, 1000);
  
    return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
  }, []);
  


  useEffect(() => {

    if (totalQuantity >= 3){
      setDeliveryFee('Free');
    } else if (totalQuantity < 3){
      setDeliveryFee('R20');
    }
  }, [totalQuantity]);

  const toggleCart = () => {
    //dispatch(cartUiActions.toggle());

  };

  

  const toggleCheckout = () => {

      const options2 = {
        timeZone: 'Etc/GMT-2', // GMT+2 is represented as GMT-2 in IANA timezone database
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false // 24-hour format
    };
    
    const now = new Date();
      const dayOfWeek = now.getDay(); // Sunday - Saturday : 0 - 6
      // Set target time to 12:00:00 for the current day
      const targetYear = now.getFullYear();
      const targetMonth = now.getMonth();
      const targetDay = now.getDate();
      const targetTime = new Date(targetYear, targetMonth, targetDay, 12, 0, 0);
      const difference = targetTime - now;
  
  
      const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      };
  
      let nextDeliveryDate;
  
      if (dayOfWeek >= 1 && dayOfWeek <= 4) {
        // Monday - Thursday
        if (difference > 0) {
          nextDeliveryDate = addDays(now,1);
          const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
          const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
          dispatch(updateDeliveryDay(ndd));
        } else {
          nextDeliveryDate = addDays(now, 2);
          const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
          const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
          dispatch(updateDeliveryDay(ndd));
        }
      } else if (dayOfWeek === 5) {
        // Friday
        if (difference > 0) {
          nextDeliveryDate = addDays(now,1);
          const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
          const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
          dispatch(updateDeliveryDay(ndd));
        } else {
          nextDeliveryDate = addDays(now, (7 - dayOfWeek + 1)); // Next Monday
          const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
          const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
          dispatch(updateDeliveryDay(ndd));
        }
      } else if (dayOfWeek === 6) {
        // Saturday
        if (difference > 0) {
          nextDeliveryDate = addDays(now, (7 - dayOfWeek + 1)); // Next Monday
          const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
          const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
          dispatch(updateDeliveryDay(ndd));
        } else {
          nextDeliveryDate = addDays(now, (7 - dayOfWeek + 2)); // Next Tuesday
          const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
          const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
          dispatch(updateDeliveryDay(ndd));
        }
      } else if (dayOfWeek === 0) {
        // Sunday
        nextDeliveryDate = addDays(now, ( dayOfWeek + 2)); // Next Tuesday
        const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
        const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
        dispatch(updateDeliveryDay(ndd));
      }

    /////////////////////////////////////////////////////////////////////////////////////


    //dispatch(updateDeliveryDay(deliveryDay));
    navigate('/precheckout');
  };

  const toMenu = () => {
    //dispatch(cartUiActions.toggle());
    navigate('/');
  };

  if (loadingMessage) {
    return (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
          <Loader animation="border" />
        </div>
      );
}

  return (

<>
<Modal show={showNotification} onHide={() => setShowNotification(false)} style={{ paddingTop: '100px' }}>
        <Modal.Header closeButton style={{ textAlign: 'center' }}>
          <Modal.Title className="px-auto" >Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          To ensure optimal freshness, your meals arrive pre-chilled. 
          </p>
          <p>
          For meals you plan to enjoy beyond the next two days, we recommend freezing them upon arrival and defrosting them as needed.
          <span role="img" aria-label="snowflake">❄️</span>
          </p>
        </Modal.Body>
      </Modal>
    <div className={showNotification ? 'blurred-background' : ''}>
    <div style={{paddingTop: '70px', paddingBottom: '60px'}}>
              
      <ListGroup onClick={(event) => event.stopPropagation()} className="cart">
        <div className="cart__item-list">
          {cartProducts.length === 0 ? (
            <Container>
            <Row className='pl-1 pr-1 '>
            <div className="messageCard">
                    <div className="rowitem">
                  <div className="shopping_card">
                  {/* <div class="card-title">Special Offer!</div> */}
                  <div className="card-content">No item added to the cart</div>
              </div>
              </div>
              </div>
                  </Row>
            </Container>

) : (
<>
  <Container>
  <Row className='pl-1 pr-1 '  ref={detailsRef}>
<div className="messageCard">
          <div className="rowitem">
        <div className="shopping_card">
        <div className="card-content">{message}</div>
    </div>
    </div>
    </div>
        </Row> 
        {/* {showNotification && (
                    <Alert variant="info" dismissible onClose={() => setShowNotification(false)}>
                      <p>
                        Remember, your food gets delivered at fridge temperature. We recommend freezing and defrosting as needed any meals you don't consume within the first 2 days.
                      </p>
                    </Alert>
                  )} */}
<div className="deliveryfee_item" ref={deliveryRef}>
        {/* {(totalQuantity > 0 && totalQuantity < 3) ? ( */}
          <div className="border-0 cart__item carditem">
  <div className="cart__item-info d-flex gap-4">
    <div className="cart__product-info w-100 d-flex align-items-center gap-4 justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <h6 className="cart__product-title m-0">Delivery</h6>
        <p className="deliveryfeeprice m-0">{deliveryFee}</p>
      </div>
    </div>
  </div>
</div>

        {/* ) : (<> 
        </>)} */}
   </div > 
   <div className="cartdetails__item-list" style={{ height: remainingHeight }}>
    {cartProducts.map((item, index) => (
      <CartItem item={item} key={index} onClose={toggleCart}/>
    ))}
    </div>
    </Container>
    </>
)}

        </div>

        <div className="cart__bottom d-flex align-items-center justify-content-between">
          <h6>
            Total : <span>R {totalAmount}</span>
          </h6>
          {/* <Button onClick={togglePayment} disabled={totalAmount <= 0}>
            Checkout
          </Button> */}
                {totalAmount > 0 && (
        <Button onClick={toggleCheckout}>
          {/* <Link to="/checkout" onClick={toggleCart}>
            Checkout
          </Link> */}
          Checkout
        </Button>
      )}
        </div>
      </ListGroup>
    </div>
    </div>
    </>
  );
};

export default Cart;