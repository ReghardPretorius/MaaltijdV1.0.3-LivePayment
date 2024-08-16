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
import { useGetWalletAmountMutation, useCreateWalletLogMutation, useCreateTempWalletLogMutation } from '../slices/usersApiSlice';
//import { cartUiActions } from "../../../store/shopping-cart/cartUiSlice";
import { useCreateOrderMutation, useUpdateOrderMutation, useCreateOrderItemMutation} from "../slices/orderAPIslice"; 
import { useManualAllWalletMutation } from "../slices/postPaymentAPIslice"
import {  updateMerchantTransactionId } from "../slices/paymentSlice";
import { cartActions } from "../slices/cartSlice";
import "../styles/shopping-cart.css";
import "../styles/precheckout.css";

const localStorageKey = 'foodDeliveryNotificationShown'; // Unique key for storage



const PreCheckout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _id = useSelector((state) => state.auth.userInfo._id);
  const totalAmountInitial = useSelector((state) => state.cart.totalAmount);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [message, setMessage] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [mealsTotal, setMealsTotal] = useState(0);
  const [walletAvailable, setWalletAvailable] = useState(0);
  const [deliveryFeeShow, setDeliveryFeeShow] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [walletAmountAdded, setWalletAmountAdded] = useState(0);
  const [walletAmountInitial, setWalletAmountInitial] = useState(0);

  const [showWalletAdded, setShowWalletAdded] = useState(false);
  
  const [deliveryDateGlobal, setDeliveryDateGlobal] = useState('');
  const [isToggledPayment, setIsToggledPayment] = useState(false);
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

  const userID = useSelector((state) => state.auth.userInfo._id);
  const givenName = useSelector((state) => state.auth.userInfo.name);
  const surname = useSelector((state) => state.auth.userInfo.surname);
  const mobile = useSelector((state) => state.auth.userInfo.cellNumber);
  const email = useSelector((state) => state.auth.userInfo.email);
  const merchantCustomerId = useSelector((state) => state.auth.userInfo._id);
  
  
  const city = useSelector((state) => state.auth.userInfo.town);
  const street = useSelector((state) => state.auth.userInfo.street);
  const streetNumber = useSelector((state) => state.auth.userInfo.streetNumber);
  const street1 = streetNumber + ' ' + street;
  const postcode = useSelector((state) => state.auth.userInfo.postalCode);
  const amount = useSelector((state) => state.cart.totalAmount);
  const state = 'North West';
  const country = 'ZA';

  const deliveryLat = useSelector((state) => state.auth.userInfo.lat);
  const deliveryLong = useSelector((state) => state.auth.userInfo.long);
  const deliveryAddress = useSelector((state) => state.auth.userInfo.formattedAddress);
  const shortAddress = useSelector((state) => state.auth.userInfo.addressName);

  
  const totalPrice = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => state.cart.cartItems);
  //const deliveryDate = useSelector((state) => state.order.deliveryDay);
  const typesOfItems = cartItems.length;

  const [merchantInvoiceId, setMerchantInvoiceId] = useState("");

  const [remainingHeight, setRemainingHeight] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const [getUsersWallet, { isLoadingGetUsersWallet }] = useGetWalletAmountMutation();
  const [createTempWalletLog, { isLoadingCreateWalletLog }] = useCreateTempWalletLogMutation();

  const [manualAllWallet, { isLoadingManualAllWallet }] = useManualAllWalletMutation();
  

  const [createOrder, { isLoadingCreateOrder }] = useCreateOrderMutation();
  const [updateOrder, { isLoadingUpdateOrder }] = useUpdateOrderMutation();
  const [createOrderItem, { isLoadingCreateOrderItem }] = useCreateOrderItemMutation();

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
    setTotalAmount(totalAmountInitial)
    if (totalQuantity >= 3){
      let meals = totalAmountInitial;
      setDeliveryFeeShow(0);
      setMealsTotal(meals);
      
    } else if (totalQuantity < 3){
      let meals = totalAmountInitial - 20;
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
    let userID = _id;
    const handleGetWalletAmount = async ( userID ) => {
    let amount1 = await getUsersWallet({ userID }).unwrap();
    setWalletAvailable(amount1.totalAmount);
    setWalletAmountInitial(amount1.totalAmount);
  };
  
  handleGetWalletAmount(userID);
  }, [_id]);
  


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

  const handleWalletAddSubmit = () => {
setShowWalletAdded(true);
if (walletAvailable > totalAmount){
  setWalletAvailable(walletAvailable - totalAmount);
  setWalletAmountAdded(totalAmount);
  setTotalAmount(0);
} else if (walletAvailable <= totalAmount){
  setWalletAvailable(0);
  setTotalAmount(totalAmount - walletAvailable);
  setWalletAmountAdded(walletAvailable);
}

  };

  const handleWalletRemoveSubmit = () => {
    setShowWalletAdded(false);
    setWalletAmountAdded(0);
    setTotalAmount(totalAmountInitial);
    setWalletAvailable(walletAmountInitial);

    
  }

  
  const togglePayment = () => {

    const calculateDeliveryDate = () => {
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
                nextDeliveryDate = addDays(now, 1);
            } else {
                nextDeliveryDate = addDays(now, 2);
            }
        } else if (dayOfWeek === 5) {
            // Friday
            if (difference > 0) {
                nextDeliveryDate = addDays(now, 1);
            } else {
                nextDeliveryDate = addDays(now, (7 - dayOfWeek + 1)); // Next Monday
            }
        } else if (dayOfWeek === 6) {
            // Saturday
            if (difference > 0) {
                nextDeliveryDate = addDays(now, (7 - dayOfWeek + 1)); // Next Monday
            } else {
                nextDeliveryDate = addDays(now, (7 - dayOfWeek + 2)); // Next Tuesday
            }
        } else if (dayOfWeek === 0) {
            // Sunday
            nextDeliveryDate = addDays(now, (dayOfWeek + 2)); // Next Tuesday
        }

        const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(), 2, 0, 0);
        const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
        dispatch(updateDeliveryDay(ndd));

        if (walletAmountAdded > 0 && totalAmount === 0) {  // If No amount needs paying
          createOrderNumberNoCheckout(ndd);
          dispatch(cartActions.changeTotal(totalAmount));
          
      } else if (walletAmountAdded > 0 && totalAmount > 0) { // If a portion of the amount needs paying
          createOrderNumberHalfCheckout(ndd);
          dispatch(cartActions.changeTotal(totalAmount));
          navigate('/checkout');
      } else if (walletAmountAdded === 0) {
          createOrderNumberFullCheckout(ndd);
          navigate('/checkout');
      }

        setDeliveryDateGlobal(ndd);
    };

    // Calculate and set the delivery date before any further logic
    calculateDeliveryDate();


    // Proceed with payment logic

};

  

//   const togglePayment = () => {

//       const options2 = {
//         timeZone: 'Etc/GMT-2', // GMT+2 is represented as GMT-2 in IANA timezone database
//         year: 'numeric',
//         month: 'numeric',
//         day: 'numeric',
//         hour: 'numeric',
//         minute: 'numeric',
//         second: 'numeric',
//         hour12: false // 24-hour format
//     };
    
//     const now = new Date();
//       const dayOfWeek = now.getDay(); // Sunday - Saturday : 0 - 6
//       // Set target time to 12:00:00 for the current day
//       const targetYear = now.getFullYear();
//       const targetMonth = now.getMonth();
//       const targetDay = now.getDate();
//       const targetTime = new Date(targetYear, targetMonth, targetDay, 12, 0, 0);
//       const difference = targetTime - now;
  
  
//       const addDays = (date, days) => {
//         const result = new Date(date);
//         result.setDate(result.getDate() + days);
//         return result;
//       };
  
//       let nextDeliveryDate;
  
//       if (dayOfWeek >= 1 && dayOfWeek <= 4) {
//         // Monday - Thursday
//         if (difference > 0) {
//           nextDeliveryDate = addDays(now,1);
//           const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
//           const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
//           dispatch(updateDeliveryDay(ndd));

//           console.log("Setting delivery date to:", ndd);
// setDeliveryDateGlobal(ndd);


//         } else {
//           nextDeliveryDate = addDays(now, 2);
//           const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
//           const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
//           dispatch(updateDeliveryDay(ndd));

//           console.log("Setting delivery date to:", ndd);

//           setDeliveryDateGlobal(ndd);
//         }
//       } else if (dayOfWeek === 5) {
//         // Friday
//         if (difference > 0) {
//           nextDeliveryDate = addDays(now,1);
//           const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
//           const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
//           dispatch(updateDeliveryDay(ndd));

//           console.log("Setting delivery date to:", ndd);

//           setDeliveryDateGlobal(ndd);
//         } else {
//           nextDeliveryDate = addDays(now, (7 - dayOfWeek + 1)); // Next Monday
//           const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
//           const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
//           dispatch(updateDeliveryDay(ndd));

//           console.log("Setting delivery date to:", ndd);
// setDeliveryDateGlobal(ndd);

//         }
//       } else if (dayOfWeek === 6) {
//         // Saturday
//         if (difference > 0) {
//           nextDeliveryDate = addDays(now, (7 - dayOfWeek + 1)); // Next Monday
//           const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
//           const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
//           dispatch(updateDeliveryDay(ndd));

//           console.log("Setting delivery date to:", ndd);

//           setDeliveryDateGlobal(ndd);
//         } else {
//           nextDeliveryDate = addDays(now, (7 - dayOfWeek + 2)); // Next Tuesday
//           const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
//           const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
//           dispatch(updateDeliveryDay(ndd));

//           console.log("Setting delivery date to:", ndd);

//           setDeliveryDateGlobal(ndd);
//         }
//       } else if (dayOfWeek === 0) {
//         // Sunday
//         nextDeliveryDate = addDays(now, ( dayOfWeek + 2)); // Next Tuesday
//         const date2h = new Date(nextDeliveryDate.getFullYear(), nextDeliveryDate.getMonth(), nextDeliveryDate.getDate(),2 ,0 ,0);
//         const ndd = new Intl.DateTimeFormat('en-za', options2).format(date2h);
//         dispatch(updateDeliveryDay(ndd));

//         console.log("Setting delivery date to:", ndd);

//         setDeliveryDateGlobal(ndd);
//       }



//       // if (walletAmountAdded > 0) {
//       //   createWalletEntry();
//       //   dispatch(cartActions.changeTotal(totalAmount));
//       // }

//       // if ( totalAmount === 0 ) {
        
//       //   createOrderNumber();
//       //   navigate(`/postpayment/MAA000108`);
        
//       // } else {
//       //   navigate('/checkout');
//       // }



// console.log(deliveryDateGlobal);
//       if (walletAmountAdded > 0 && totalAmount === 0) {  /// If No amount needs paying
//         createOrderNumberNoCheckout();
//         dispatch(cartActions.changeTotal(totalAmount));
//       } else if (walletAmountAdded > 0 && totalAmount > 0){ // If a portion of the amount needs paying
//         createOrderNumberHalfCheckout();
//         dispatch(cartActions.changeTotal(totalAmount));
//         navigate('/checkout');
 
//       } else if (walletAmountAdded === 0) {
//         createOrderNumberFullCheckout();
//         navigate('/checkout');
//       }

//   };


  // useEffect(() => {
  //   console.log(deliveryDateGlobal);
  //   if (walletAmountAdded > 0 && totalAmount === 0) {  /// If No amount needs paying
  //     createOrderNumberNoCheckout();
  //     //createWalletEntry();
  //     dispatch(cartActions.changeTotal(totalAmount));
  //   } else if (walletAmountAdded > 0 && totalAmount > 0){ // If a portion of the amount needs paying
  //     createOrderNumberHalfCheckout();
  //     dispatch(cartActions.changeTotal(totalAmount));
  //     navigate('/checkout');

  //   } else if (walletAmountAdded === 0) {
  //     createOrderNumberFullCheckout();
  //     navigate('/checkout');

  // }}, [deliveryDateGlobal, isToggledPayment]);

  const createWalletEntry = async () => {
    let walletAmount = -1*walletAmountAdded;
    let campaign = 'Wallet Used By User';
    let expire = 'No';
    let userName = givenName + " " + surname;

   await createTempWalletLog({userID, walletAmount, campaign, expire,  userName})

  };


    const createOrderNumberNoCheckout = async (ndd) => {
      let freeDelivery; // Declare here
      let deliveryFee;  // Declare here
      let deliveryDate = ndd;
  
      if (totalQuantity >= 3) {
          freeDelivery = 'Yes';
          deliveryFee = '0';
      } else {
          freeDelivery = 'No';
          deliveryFee = '20';
      }
        const orderIDraw = await createOrder({userID}).unwrap();

        const order = orderIDraw;

        //let deliveryDate = deliveryDateGlobal;

        const updatedOrderId = await updateOrder({order, totalPrice, totalQuantity, deliveryLat, deliveryLong, deliveryAddress, typesOfItems, freeDelivery, deliveryDate, shortAddress, deliveryFee}).unwrap();
        const orderID = orderIDraw._id;
        const merchantTransactionId = orderIDraw.merchantTransactionId;
        const merchantInvoiceId = orderIDraw.merchantTransactionId;
        dispatch(updateMerchantTransactionId(merchantTransactionId));

        for (let i = 0; i < cartItems.length; i++) {
          let orderItemCode = cartItems[i].id;
          let orderItemPrice = cartItems[i].price;
          let quantity = cartItems[i].quantity;
          let orderItemName = cartItems[i].title;
          let orderTotalPrice = cartItems[i].totalPrice;
          

          const orderItemID = await createOrderItem({orderID, userID, orderItemCode, orderItemName, quantity, orderTotalPrice, orderItemPrice, deliveryDate, merchantTransactionId    }).unwrap();

        }

        let walletAmount = -1*walletAmountAdded;
        let campaign = 'Wallet Used By User';
        let expire = 'No';
        let userName = givenName + " " + surname;

    
       await createTempWalletLog({userID, walletAmount, merchantTransactionId,  userName});

        let amount = totalAmountInitial;


        const walletlogged = await manualAllWallet({ merchantTransactionId, amount });

        navigate(`/postpayment/${merchantTransactionId}`);


      };

      const createOrderNumberHalfCheckout = async (ndd) => {
        let freeDelivery; // Declare here
        let deliveryFee;  // Declare here
        let deliveryDate = ndd;
    
        if (totalQuantity >= 3) {
            freeDelivery = 'Yes';
            deliveryFee = '0';
        } else {
            freeDelivery = 'No';
            deliveryFee = '20';
        }
          const orderIDraw = await createOrder({userID}).unwrap();
          const order = orderIDraw;
  
          //let deliveryDate = deliveryDateGlobal;
          const updatedOrderId = await updateOrder({order, totalPrice, totalQuantity, deliveryLat, deliveryLong, deliveryAddress, typesOfItems, freeDelivery, deliveryDate, shortAddress, deliveryFee}).unwrap();
          const orderID = orderIDraw._id;
          const merchantTransactionId = orderIDraw.merchantTransactionId;
          const merchantInvoiceId = orderIDraw.merchantTransactionId;
          dispatch(updateMerchantTransactionId(merchantTransactionId));
  
          for (let i = 0; i < cartItems.length; i++) {
            let orderItemCode = cartItems[i].id;
            let orderItemPrice = cartItems[i].price;
            let quantity = cartItems[i].quantity;
            let orderItemName = cartItems[i].title;
            let orderTotalPrice = cartItems[i].totalPrice;
            
  
            const orderItemID = await createOrderItem({orderID, userID, orderItemCode, orderItemName, quantity, orderTotalPrice, orderItemPrice, deliveryDate, merchantTransactionId    }).unwrap();
  
          }
  
          let walletAmount = -1*walletAmountAdded;
          let userName = givenName + " " + surname;
      
         await createTempWalletLog({userID, walletAmount, merchantTransactionId,  userName});
        };

        const createOrderNumberFullCheckout = async (ndd) => {
          let freeDelivery; // Declare here
          let deliveryFee;  // Declare here
          let deliveryDate = ndd;
      
          if (totalQuantity >= 3) {
              freeDelivery = 'Yes';
              deliveryFee = '0';
          } else {
              freeDelivery = 'No';
              deliveryFee = '20';
          }
            const orderIDraw = await createOrder({userID}).unwrap();
            const order = orderIDraw;
    
            //let deliveryDate = deliveryDateGlobal;
            const updatedOrderId = await updateOrder({order, totalPrice, totalQuantity, deliveryLat, deliveryLong, deliveryAddress, typesOfItems, freeDelivery, deliveryDate, shortAddress, deliveryFee}).unwrap();
            const orderID = orderIDraw._id;
            const merchantTransactionId = orderIDraw.merchantTransactionId;
            const merchantInvoiceId = orderIDraw.merchantTransactionId;
            dispatch(updateMerchantTransactionId(merchantTransactionId));
    
            for (let i = 0; i < cartItems.length; i++) {
              let orderItemCode = cartItems[i].id;
              let orderItemPrice = cartItems[i].price;
              let quantity = cartItems[i].quantity;
              let orderItemName = cartItems[i].title;
              let orderTotalPrice = cartItems[i].totalPrice;

              const orderItemID = await createOrderItem({orderID, userID, orderItemCode, orderItemName, quantity, orderTotalPrice, orderItemPrice, deliveryDate, merchantTransactionId    }).unwrap();
            }
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
              {showWalletAdded ? (
                <div className="walletcard-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div >Wallet: - R {walletAmountAdded}</div>
                <BsX size={24} onClick={handleWalletRemoveSubmit}/>
                </div>
                ): null}
              <div className="card-content">Total: R {totalAmount}</div>
            </div>
          </div>
        </div>
      </Row>
      <div style={{ marginTop: '20px', marginBottom: '20px', borderBottom: '1px solid #daa927' }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div className="wallet">Wallet Available: R {walletAvailable}</div>

  {walletAvailable > 0 ? (
    <Button
    variant="primary"
    onClick={handleWalletAddSubmit}
    style={{backgroundColor: '#1F305E',  borderColor: '#1F305E'}}
    >Use Wallet</Button>
  ) : null}
</div>

      <div style={{ marginTop: '20px', marginBottom: '20px', borderBottom: '1px solid #daa927' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <BootstrapForm.Group controlId="promoForm">
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
    
        
        <Button
      variant="primary"
      onClick={handlePromoSubmit}
      style={{backgroundColor: '#1F305E',  borderColor: '#1F305E'}}
    >
      Add Code
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