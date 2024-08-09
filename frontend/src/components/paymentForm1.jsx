// import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
// import { useCheckoutMutation } from '../slices/paymentApislice';
// import { useDispatch, useSelector } from "react-redux";
// //import { updateBearerToken } from "../slices/paymentSlice";
// import { updateCheckoutId, updateBearerToken, updateMerchantTransactionId } from "../slices/paymentSlice";
// import {    useCreateOrderMutation, useUpdateOrderMutation, useCreateOrderItemMutation,} from "../slices/orderAPIslice"; 
// import Loader from '../components/Loader';
// import "../styles/paymentForm.css";

// //const yourApi = "https://maaltijd.co.za";


// const PaymentForm = ({ checkoutId, apiKey }) => {


//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://sandbox-checkout.peachpayments.com/js/checkout.js";
//     script.async = true;
//     script.onload = () => {
//       const Checkout = window.Checkout;
//       const checkout = Checkout.initiate({
//         checkoutId,
//         key: apiKey,
//         options: {
//         theme: {
//                 brand: {
//                   primary: "#1F305E",
//                 },
//                 cards: {
//                   background: "#F3F3F4",
//                   backgroundHover: "#F3F3F4",
//                 },
//               },
//         ordering: {
//           CARD: 1,
//           // CAPITECPAY: 2,
//           // SCANTOPAY: 3,
//           // PAYBYBANK: 4,
//           // MASTERPASS: 5,
//           // EFTSECURE: 6,

//           // MASTERPASS: 2,
//           // CAPITECPAY: 3,
//           // EFTSECURE: 4,
//           // PAYBYBANK: 5,
//           // SCANTOPAY:6,
//         },
  
//           events: {
//             onCompleted: (event) => {
             
//               checkout.unmount();
//               document.getElementById("payment-form").innerText = "Paid!";
//             },
//             onCancelled: (event) => {
             
//               checkout.unmount();
//               document.getElementById("payment-form").innerText = "Cancelled!";
//             },
//             onExpired: (event) => {
              
//               checkout.unmount();
//               document.getElementById("payment-form").innerText = "Expired!";
//             },
//           },
//         },
//       });
//       checkout.render("#payment-form");
//     };

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [checkoutId, apiKey]);

//   return <div id="payment-form"></div>;
// };

// const PaymentScreen = () => {
//   const headerRef = useRef(null);
//   const [remainingHeight, setRemainingHeight] = useState(0);
//   const totalQuantity = useSelector((state) => state.cart.totalQuantity);
//     const userID = useSelector((state) => state.auth.userInfo._id);
//     const givenName = useSelector((state) => state.auth.userInfo.name);
//     const surname = useSelector((state) => state.auth.userInfo.surname);
//     const mobile = useSelector((state) => state.auth.userInfo.cellNumber);
//     const email = useSelector((state) => state.auth.userInfo.email);
//     const merchantCustomerId = useSelector((state) => state.auth.userInfo._id);
    
    
//     const city = useSelector((state) => state.auth.userInfo.town);
//     const street = useSelector((state) => state.auth.userInfo.street);
//     const streetNumber = useSelector((state) => state.auth.userInfo.streetNumber);
//     const street1 = streetNumber + ' ' + street;
//     const postcode = useSelector((state) => state.auth.userInfo.postalCode);
//     const amount = useSelector((state) => state.cart.totalAmount);
//     const state = 'North West';
//     const country = 'ZA';

//     const deliveryLat = useSelector((state) => state.auth.userInfo.lat);
//     const deliveryLong = useSelector((state) => state.auth.userInfo.long);
//     const deliveryAddress = useSelector((state) => state.auth.userInfo.formattedAddress);
//     const shortAddress = useSelector((state) => state.auth.userInfo.addressName);

    
//     const totalPrice = useSelector((state) => state.cart.totalAmount);
//     const cartItems = useSelector((state) => state.cart.cartItems);
//     const deliveryDate = useSelector((state) => state.order.deliveryDay);
//     const typesOfItems = cartItems.length;
//     //const [freeDelivery, setFreeDelivery] = useState("");


//     useLayoutEffect(() => {
//       const updateHeight = () => {
//         const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
  

//         const windowHeight = window.innerHeight;

  
//         setRemainingHeight(windowHeight - 130 - 30 - headerHeight );
//       };
  
//       // Initial calculation
//       // updateHeight();
//       setTimeout(updateHeight, 2000);
  
//       // Recalculate on window resize
//       window.addEventListener('resize', updateHeight);
  
//       return () => window.removeEventListener('resize', updateHeight);
//     }, []);

//     useEffect(() => {


//     }, [totalQuantity]); 


//     //const street1 = streetNumber + ' ' + street;
//     //const postcode = useSelector((state) => state.auth.userInfo.postalCode);
//     //const amount = useSelector((state) => state.cart.totalAmount);
    
//     const [merchantInvoiceId, setMerchantInvoiceId] = useState("");
//     //const merchantInvoiceId = 'INV0000008';


//   const [url, setUrl] = useState("");
//   const [checkoutId, setCheckoutId] = useState("");
//   const [apiKey, setApiKey] = useState("");
//   const [bearerToken, setBearerToken] = useState("");
//   const [isLoadingMerchantID, setIsLoadingMerchantID] = useState(true);
  
  
//   const [checkoutApi, { isLoadingCheckoutApi }] = useCheckoutMutation();
//   const [createOrder, { isLoadingCreateOrder }] = useCreateOrderMutation();
//   const [updateOrder, { isLoadingUpdateOrder }] = useUpdateOrderMutation();
//   const [createOrderItem, { isLoadingCreateOrderItem }] = useCreateOrderItemMutation();
//   const dispatch = useDispatch();



//   useEffect(() => {
//     const fetchPaymentUrl = async () => {

//       //const data = await checkoutApi(amount, givenName, surname, mobile , email, merchantCustomerId, street1, city, country ,state, postcode , merchantInvoiceId).unwrap();
//       //const data = await response.json();
//       const data = await checkoutApi({amount, givenName, surname, mobile , email, merchantCustomerId, street1, city, country ,state, postcode , merchantInvoiceId}).unwrap();
//       setUrl(data.url);
//       setCheckoutId(data.checkout_Id); // Assuming API returns checkoutId
//       setApiKey(data.entityId); // Assuming API returns key
//       setBearerToken(data.bearerToken);

//       dispatch(updateCheckoutId(checkoutId));
//       dispatch(updateBearerToken(bearerToken));

//     };

//     const createOrderNumber = async () => {
//       let freeDelivery; // Declare here
//       let deliveryFee;  // Declare here
  
//       if (totalQuantity >= 3) {
//           freeDelivery = 'Yes';
//           deliveryFee = '0';
//       } else {
//           freeDelivery = 'No';
//           deliveryFee = '20';
//       }
//         const orderIDraw = await createOrder({userID}).unwrap();
//         const order = orderIDraw;


//         const updatedOrderId = await updateOrder({order, totalPrice, totalQuantity, deliveryLat, deliveryLong, deliveryAddress, typesOfItems, freeDelivery, deliveryDate, shortAddress, deliveryFee}).unwrap();
//         const orderID = orderIDraw._id;
//         const merchantTransactionId = orderIDraw.merchantTransactionId;
//         const merchantInvoiceId = orderIDraw.merchantTransactionId;
//         dispatch(updateMerchantTransactionId(merchantTransactionId));
//         //setIsLoadingMerchantID(false);

//         for (let i = 0; i < cartItems.length; i++) {
//           let orderItemCode = cartItems[i].id;
//           let orderItemPrice = cartItems[i].price;
//           let quantity = cartItems[i].quantity;
//           let orderItemName = cartItems[i].title;
//           let orderTotalPrice = cartItems[i].totalPrice;
          

//           const orderItemID = await createOrderItem({orderID, userID, orderItemCode, orderItemName, quantity, orderTotalPrice, orderItemPrice, deliveryDate, merchantTransactionId    }).unwrap();


//         }

//         const data = await checkoutApi({amount, givenName, surname, mobile , email, merchantCustomerId, street1, city, country ,state, postcode , merchantInvoiceId}).unwrap();
//        console.log(data);
//         setUrl(data.url);
//         setCheckoutId(data.checkout_Id); // Assuming API returns checkoutId
//         setApiKey(data.entityId); // Assuming API returns key
//         setBearerToken(data.bearerToken);

//         dispatch(updateCheckoutId(checkoutId));
//         dispatch(updateBearerToken(bearerToken));
//        // const order = await updateOrder({}).unwrap();


//       };
      
    


//   //   function checkLoadingStatus() {

//   //     if (!isLoadingMerchantID) {
        
//   //         fetchPaymentUrl();
//   //         clearInterval(checkInterval); // Stop the interval once fetchPaymentUrl is executed
//   //     }
//   // }
//   createOrderNumber();

//   //let checkInterval = setInterval(checkLoadingStatus, 100);
//     //fetchPaymentUrl();

//   }, []);

//   // if (!url) {
//   //   return <div>Loading...</div>;
//   // }
//   if (!url) {
//     return (
//         <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
//           <Loader animation="border" />
//         </div>
//       );
// }

//   return (
//     <>
//     <div className='postpaymentheader' ref={headerRef}>
//     <div className="d-flex align-items-center mb-3">
// <div className="profile flex-grow-1">
// <h1 className="text-center my-auto">Checkout</h1>
// </div>
// </div>
//     </div>
//     <div style={{  flexDirection: "column", alignItems: "center", height: remainingHeight,  overflowY: "auto", paddingBottom: "60px" }}>
//       {/* <iframe src={url} title="Payment" style={{ width: "100%", height: "50%", border: "none" }} /> */}
//       {checkoutId && apiKey && <PaymentForm checkoutId={checkoutId} apiKey={apiKey}/>}
//     </div>
//     </>
//   );
// };

// export default PaymentScreen;


////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useCheckoutMutation } from '../slices/paymentApislice';
import { useDispatch, useSelector } from "react-redux";
//import { updateBearerToken } from "../slices/paymentSlice";
import { updateCheckoutId, updateBearerToken, updateMerchantTransactionId } from "../slices/paymentSlice";
import {    useCreateOrderMutation, useUpdateOrderMutation, useCreateOrderItemMutation,} from "../slices/orderAPIslice"; 
import Loader from '../components/Loader';
import "../styles/paymentForm.css";

//const yourApi = "https://maaltijd.co.za";


const PaymentForm = ({ checkoutId, apiKey }) => {


  useEffect(() => {
console.log("ping");
    console.log(checkoutId);
    console.log(apiKey);
    const script = document.createElement("script");
    script.src = "https://sandbox-checkout.peachpayments.com/js/checkout.js";
    script.async = true;
    script.onload = () => {
      const Checkout = window.Checkout;
      const checkout = Checkout.initiate({
        checkoutId,
        key: apiKey,
        options: {
        theme: {
                brand: {
                  primary: "#1F305E",
                },
                cards: {
                  background: "#F3F3F4",
                  backgroundHover: "#F3F3F4",
                },
              },
        ordering: {
          CARD: 1
          // MASTERPASS: 2,
          // CAPITECPAY: 3,
          // EFTSECURE: 4,
          // PAYBYBANK: 5,
          // SCANTOPAY:6,
        },
  
          events: {
            onCompleted: (event) => {
              console.log(event);
              checkout.unmount();
              document.getElementById("payment-form").innerText = "Paid!";
            },
            onCancelled: (event) => {
              console.log(event);
              checkout.unmount();
              document.getElementById("payment-form").innerText = "Cancelled!";
            },
            onExpired: (event) => {
              console.log(event);
              checkout.unmount();
              document.getElementById("payment-form").innerText = "Expired!";
            },
          },
        },
      });
      checkout.render("#payment-form");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [checkoutId, apiKey]);

  return <div id="payment-form"></div>;
};

const PaymentScreen = () => {
  const headerRef = useRef(null);
  const [remainingHeight, setRemainingHeight] = useState(0);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
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
    const deliveryDate = useSelector((state) => state.order.deliveryDay);
    const typesOfItems = cartItems.length;
    //const [freeDelivery, setFreeDelivery] = useState("");


    useLayoutEffect(() => {
      const updateHeight = () => {
        const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
  

        const windowHeight = window.innerHeight;

  
        setRemainingHeight(windowHeight - 130 - 30 - headerHeight );
        //console.log(`Header Height: ${headerHeight}, Details Height: ${detailsHeight}, Window Height: ${windowHeight}`);
      };
  
      // Initial calculation
      // updateHeight();
      setTimeout(updateHeight, 2000);
  
      // Recalculate on window resize
      window.addEventListener('resize', updateHeight);
  
      return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {


    }, [totalQuantity]); 


    //const street1 = streetNumber + ' ' + street;
    //const postcode = useSelector((state) => state.auth.userInfo.postalCode);
    //const amount = useSelector((state) => state.cart.totalAmount);
    
    const [merchantInvoiceId, setMerchantInvoiceId] = useState("");
    //const merchantInvoiceId = 'INV0000008';
    //console.log(givenName);

  const [url, setUrl] = useState("");
  const [checkoutId, setCheckoutId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [isLoadingMerchantID, setIsLoadingMerchantID] = useState(true);
  
  
  const [checkoutApi, { isLoadingCheckoutApi }] = useCheckoutMutation();
  const [createOrder, { isLoadingCreateOrder }] = useCreateOrderMutation();
  const [updateOrder, { isLoadingUpdateOrder }] = useUpdateOrderMutation();
  const [createOrderItem, { isLoadingCreateOrderItem }] = useCreateOrderItemMutation();
  const dispatch = useDispatch();



  useEffect(() => {
    const fetchPaymentUrl = async () => {
    //   const response = await fetch(yourApi, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       basket: [
    //         {
    //           id: "item-1",
    //           quantity: 1,
    //         },
    //       ],
    //     }),
    //   });

    //   if (!response.ok) {
    //     console.log("Error");
    //     return;
    //   }
    //console.log(amount);

      //const data = await checkoutApi(amount, givenName, surname, mobile , email, merchantCustomerId, street1, city, country ,state, postcode , merchantInvoiceId).unwrap();
      //const data = await response.json();
      console.log(merchantInvoiceId);
      const data = await checkoutApi({amount, givenName, surname, mobile , email, merchantCustomerId, street1, city, country ,state, postcode , merchantInvoiceId}).unwrap();
      console.log(data)
      setUrl(data.url);
      setCheckoutId(data.checkout_Id); // Assuming API returns checkoutId
      setApiKey(data.entityId); // Assuming API returns key
      setBearerToken(data.bearerToken);
      //console.log(data.bearerToken);
      dispatch(updateCheckoutId(checkoutId));
      dispatch(updateBearerToken(bearerToken));
      //console.log(data.entityId);
    };

    const createOrderNumber = async () => {
      let freeDelivery; // Declare here
      let deliveryFee;  // Declare here
  
      if (totalQuantity >= 3) {
          freeDelivery = 'Yes';
          deliveryFee = '0';
      } else {
          freeDelivery = 'No';
          deliveryFee = '20';
      }
        const orderIDraw = await createOrder({userID}).unwrap();
        console.log(orderIDraw);
        const order = orderIDraw;

        //console.log(freeDelivery);
        const updatedOrderId = await updateOrder({order, totalPrice, totalQuantity, deliveryLat, deliveryLong, deliveryAddress, typesOfItems, freeDelivery, deliveryDate, shortAddress, deliveryFee}).unwrap();
        const orderID = orderIDraw._id;
        const merchantTransactionId = orderIDraw.merchantTransactionId;
        const merchantInvoiceId = orderIDraw.merchantTransactionId;
        dispatch(updateMerchantTransactionId(merchantTransactionId));
        //setIsLoadingMerchantID(false);
        //console.log(updatedOrderId);
        //console.log(orderID);
        //console.log(cartItems);
        console.log(merchantTransactionId);
        console.log(merchantInvoiceId);
        for (let i = 0; i < cartItems.length; i++) {
          let orderItemCode = cartItems[i].id;
          let orderItemPrice = cartItems[i].price;
          let quantity = cartItems[i].quantity;
          let orderItemName = cartItems[i].title;
          let orderTotalPrice = cartItems[i].totalPrice;
          

          //console.log(`i:${i}`);
          //console.log(`Title :${orderItemName}`);
          const orderItemID = await createOrderItem({orderID, userID, orderItemCode, orderItemName, quantity, orderTotalPrice, orderItemPrice, deliveryDate, merchantTransactionId    }).unwrap();
          //console.log(orderItemID);
          //console.log(merchantInvoiceId);

        }

        const data = await checkoutApi({amount, givenName, surname, mobile , email, merchantCustomerId, street1, city, country ,state, postcode , merchantInvoiceId}).unwrap();
        console.log(data)
        setUrl(data.url);
        setCheckoutId(data.checkout_Id); // Assuming API returns checkoutId
        setApiKey(data.entityId); // Assuming API returns key
        setBearerToken(data.bearerToken);
        //console.log(data.bearerToken);
        dispatch(updateCheckoutId(checkoutId));
        dispatch(updateBearerToken(bearerToken));
        console.log(checkoutId);
       // const order = await updateOrder({}).unwrap();


      };
      
    


  //   function checkLoadingStatus() {
  //     console.log('ping');
  //     if (!isLoadingMerchantID) {
        
  //         fetchPaymentUrl();
  //         clearInterval(checkInterval); // Stop the interval once fetchPaymentUrl is executed
  //     }
  // }
  createOrderNumber();

  //let checkInterval = setInterval(checkLoadingStatus, 100);
    //fetchPaymentUrl();

  }, []);

  // if (!url) {
  //   return <div>Loading...</div>;
  // }
  if (!url) {
    return (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
          <Loader animation="border" />
        </div>
      );
}

  return (
    <>
    <div className='postpaymentheader' ref={headerRef}>
    <div className="d-flex align-items-center mb-3">
<div className="profile flex-grow-1">
<h1 className="text-center my-auto">Checkout</h1>
</div>
</div>
    </div>
    <div style={{  flexDirection: "column", alignItems: "center", height: remainingHeight,  overflowY: "auto" }}>
      {/* <iframe src={url} title="Payment" style={{ width: "100%", height: "50%", border: "none" }} /> */}
      {checkoutId  && <p>ChackoutId: {checkoutId}</p>}
      {apiKey && <p>API KEY: {apiKey}</p>}
      {checkoutId && apiKey && <PaymentForm checkoutId={checkoutId} apiKey={apiKey}/>}
    </div>
    </>
  );
};

export default PaymentScreen;
