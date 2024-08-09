import { Container, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartItem from "../components/cartItem";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col , Modal,  Form as BootstrapForm, ProgressBar, FormGroup, FormCheck  } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa'; 
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { updateDeliveryDay } from "../slices/orderSlice";
import Loader from '../components/Loader';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
//import { cartUiActions } from "../../../store/shopping-cart/cartUiSlice";

import "../styles/shopping-cart.css";
import "../styles/precheckout.css";

const localStorageKey = 'foodDeliveryNotificationShown'; // Unique key for storage



const PreCheckout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartProducts = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [message, setMessage] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [mealsTotal, setMealsTotal] = useState(0);
  const [walletAvailable, setWalletAvailable] = useState(0);
  const [deliveryFeeShow, setDeliveryFeeShow] = useState('');
  
  const [isValidPromo, setIsValidPromo] = useState(false);
  const [isBlurPromo, setIsBlurPromo] = useState(false);
  const [promoCode, setPromo] = useState('');
  const [mealsCost, setMealsCost] = useState('');
  const [targetTime, setTargetTime] = useState(new Date());
  const [deliveryDay, setDeliveryDay] = useState(); // Set target time to 12:00 noon
  const [loadingMessage, setLoadingMessage] = useState(true);

  const detailsRef = useRef(null);
  const deliveryRef = useRef(null);
  const subtotalRef = useRef(null);
  const [remainingHeight, setRemainingHeight] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

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
    if (totalQuantity >= 3){
      let meals = totalAmount;
      setDeliveryFeeShow(0);
      setMealsTotal(meals);
      
    } else if (totalQuantity < 3){
      let meals = totalAmount - 20;
      setDeliveryFeeShow(20);
      setMealsTotal(meals);
    }
    
  }, []);


  useLayoutEffect(() => {
    const updateHeight = () => {
      const deliveryHeight = deliveryRef.current ? deliveryRef.current.offsetHeight : 0;
      const detailsHeight = detailsRef.current ? detailsRef.current.offsetHeight : 0;
      

      const windowHeight = window.innerHeight;


      setRemainingHeight(windowHeight - 130 - 70 - 10  - 5  - deliveryHeight - detailsHeight);
    };

    setTimeout(updateHeight, 2000);

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

  const handlePromoBlur = () => {
    setIsBlurPromo(true);
  };

  const handlePromoChange = (e) => {
    let newpromo = e.target.value;
    setPromo(newpromo);
  };

  const handlePromoSubmit = () => {

  }
  

  const togglePayment = () => {

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

    navigate('/checkout');
  };

  const toMenu = () => {
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

<div className="px-0 cart">


<div className="precheckout_body mx-auto">
<Container>
      <Row className="pl-1 pr-1" ref={detailsRef}>
        <div className="messageCard">
          <div className="rowitem">
            <div className="shopping_card">
              <div className="card-content">{message}</div>
            </div>
          </div>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #daa927' }}></div>
          <div >
            <div>
              <div className="card-content">Sub Total: R {mealsTotal}</div>
              <div className="card-content">Delivery Fee: R {deliveryFeeShow}</div>
              <div className="card-content">Total: R {totalAmount}</div>
            </div>
          </div>
        </div>
      </Row>
      <div style={{ marginTop: '20px', marginBottom: '20px', borderBottom: '1px solid #daa927' }}></div>

      <div className="wallet">Wallet Available: R {walletAvailable}</div>

      <div style={{ marginTop: '20px', marginBottom: '20px', borderBottom: '1px solid #daa927' }}></div>

      <BootstrapForm.Group className="mt-2" controlId="promoForm">
          <input
            type="text"
            name="unitForm"
            className="form-control"
            placeholder="Enter Promo Code"
            value={promoCode}
            onChange={handlePromoChange}
            onBlur={handlePromoBlur}
            required
            style={{
              border: isValidPromo
                ? "1px solid #198754"
                : !isValidPromo && isBlurPromo
                ? "1px solid #ea868f"
                : "",
            }}
          />
        </BootstrapForm.Group>
      <div className="mt-2">
        
        <Button
      variant="primary"
      onClick={handlePromoSubmit}
      style={{backgroundColor: '#1F305E',  borderColor: '#1F305E'}}
    >
      Add Promo Code
    </Button>
      </div>
      <div style={{ marginTop: '20px', marginBottom: '20px', borderBottom: '1px solid #daa927' }}></div>
    </Container>
    </div>
   

    <div className="cart__bottom d-flex align-items-center justify-content-between">
<h6 className="my-auto">
  Total : <span>R {totalAmount}</span>
</h6>
<Button onClick={togglePayment}>
Pay
</Button>
</div>

        


        </div>


  );
};

export default PreCheckout;