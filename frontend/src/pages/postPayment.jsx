import "../styles/checkout.css";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
//import { useDispatch } from "react-redux";
import { cartActions } from "../slices/cartSlice"; 

import React, { useState, useEffect } from "react";
import { useQueryStatusMutation } from '../slices/paymentApislice';
import { useDispatch, useSelector } from "react-redux";
import {    useCreatePaidOrderMutation } from "../slices/orderAPIslice"; 
import Loader from '../components/Loader';
import { useGetOrderDetailsMutation, useGetOrderItemsMutation, useUpdateOrderMutation, useCreateStatusLogMutation, useSendOrderEmailMutation, useSendAdminOrderEmailMutation } from "../slices/orderAPIslice";
import products from "../assets/data/products";
import { Container } from "react-bootstrap"; 

import "../styles/postPayment.css"; 

const PostPay = () => {



  const [orderPlacedTimestamp, setOrderPlacedTimestamp] = useState('');
  const [stateMerchantTransactionId, setStateMerchantTransactionId] = useState('');
  
  

  const [getOrder, { isLoadingGetOrder }] = useGetOrderDetailsMutation();
  const [createPaidOrder, { isLoadingCreatePaidOrder }] = useCreatePaidOrderMutation();
  const [updateOGOrder, { isLoadingUupdateOGOrder }] = useUpdateOrderMutation();
  const [createStatus, { isLoadingCreateStatus }] = useCreateStatusLogMutation();
  const [sendOrderEmail, { isLoadingSendOrderEmail }] = useSendOrderEmailMutation();
  const [getOrderDetails, { isLoadingGetOrderDetails }] = useGetOrderItemsMutation();
  const [sendAdminOrderEmail, { isLoadingSendAdminOrderEmail }] =useSendAdminOrderEmailMutation();
  
    //const [checkoutId, setcheckoutId] = useState('');
    //const [bearerToken, setBearerToken] = useState('');


    const orderID = useSelector((state) => state.order.orderId);
    //const orderID = '668654574830c40fa740db25';


    //const checkoutId = useSelector((state) => state.payment.checkoutId);
    const bearerToken = useSelector((state) => state.payment.bearerToken);


    const merchantTransactionId = useSelector((state) => state.payment.merchantTransactionId);
//const merchantTransactionId  = 'INV0000006';
//const merchantTransactionId  = '';

// const now = new Date();
// setOrderPlacedTimestamp( now);
const email = useSelector((state) => state.auth.userInfo.email);
const cellNumber = useSelector((state) => state.auth.userInfo.cellNumber);
const name = useSelector((state) => state.auth.userInfo.name);
const surname = useSelector((state) => state.auth.userInfo.surname);
const [estDeliveryDate, setEstDeliveryDate] = useState('');


    //const checkoutId = '8ac7a4a09039ce5001903b43848f21e4';
   // const checkoutId = '040e45f5f8bc411eb640bc28609810ea';
   //const checkoutId = '8ac7a4a19039c5ff01903b62096025eb';
    // const bearerToken = 'OGFjN2E0Yzk4ZjlmNjI4MjAxOGZhMDEzZDk3MDAxYmR8OG5adFlmOWNkQkI0Wm5mUw==';
    //const bearerToken ='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjEtMDktMDYifQ.eyJlbnRpdHlJRCI6IjIzOTQ2NjVkNDI4YjQwYWU4MTlhMThiY2E5NGQxYjViIiwicGFydG5lciI6ZmFsc2UsInNpZCI6Ijc2MmRiNDk3ODE0YTQ0NmExOWU3IiwibWVyY2hhbnRJZCI6IjIzOTQ2NjVkNDI4YjQwYWU4MTlhMThiY2E5NGQxYjViIiwiaWF0IjoxNzE5NDc0MzA1LCJuYmYiOjE3MTk0NzQzMDUsImV4cCI6MTcxOTQ4ODcwNSwiYXVkIjoiaHR0cHM6Ly9tMm0ucGVhY2hwYXltZW50cy5jb20iLCJpc3MiOiJodHRwczovL3NhbmRib3gtc2VydmljZXMucHBheS5pby8iLCJzdWIiOiJkZjJlOWJlOWI3YWFhMDQ5ZTIwY2Y5NmM3Mzg3ODUifQ.bcv8tlkzEedy0mILl0v1qvsJTeR5Nx_x1tOiuGbwHJMRW2Z5iCR2VlkAaubMfxkKvZHW_PBCrj_jfU-wKT5B2AZWsIcD-lWHCatU__gKcQFb-IRN4HQ_24SZrmzw43GQWcYIW5DaksolpEBghaaJlkG3s6SmxaXRmujO24ph9gGAmKXz2xbXSVi6MeZFYJwJrQ4zF5tpvzO_ZjPp_Mgr92ftv4uDNhdFNSRncir0dUuM4Z5SAFRtd7VB0Uh0v_Tl_w_uNZs-uluQOpnFSfSSXZfqCcC_efun-epb8lF36CPTd2-Mqjm1yGOLzekDr5nXz_573auaAfC9BA2Ut6-zyd80R6KekL723N2SQ2e8rB65slu0zC1wTI_NlkNmP6dc6Stt2cSxu0Kc3Oms-F22JaENLAErimZJYxcgxSXxQHV4O1_6EgNTW8W_Q6V69hbJWAz1oSsOXmhbn_Qe80TaFshcTH5c9yPl3hmcrOpl_TfbRQ9KspzgVfE-86dvdOoS0o2BSPChRpImheTHnKpIGb5cLQB8qmI46G6DNQ1DDF7ykc6k0eF5tdzJBlIuTpnJ217Pzxq_B0HYNBrPDmc8RtsdhYmVgs5iIr4SkZ-4pc4XO4PYAY6H1WigdoetmvhjfPCn33riMj_BcXthVe4d8cxeZNmRdzPU4D4PVt4gKw8'


    //const bearerToken = 'OGFjN2E0Yzk4ZjlmNjI4MjAxOGZhMDEzZDk3MDAxYmR8OG5adFlmOWNkQkI0Wm5mUw==';
    const dispatch = useDispatch();
    dispatch(cartActions.clearCart());

    //dispatch(cartActions.clearCart());
    const [status, setStatus] = useState("");
    const [loadingMessage, setLoadingMessage] = useState(true);
    //const [checkoutId, setCheckoutId] = useState("");

    const [checkoutStatusApi, { isLoadingCheckoutStatusApi  }] = useQueryStatusMutation();

    // const successCodes = [
    //   '000.000.000'
    // ];

    const successCodes = [
      '000.000.000',
      '000.000.100',
      '000.100.105',
      '000.100.106',
      '000.100.110',
      '000.100.111',
      '000.100.112',
      '000.300.000',
      '000.300.100',
      '000.300.101',
      '000.300.102',
      '000.300.103',
      '000.310.100',
      '000.310.101',
      '000.310.110',
      '000.400.110',
      '000.400.120',
      '000.600.000'
    ];
    

    useEffect(() => {
      setStateMerchantTransactionId(merchantTransactionId);
    }, [merchantTransactionId]);
    


    useEffect(() => {
      //const merchantTransactionId = 'INV0000007'
        const fetchPaymentStatusUrl = async () => {
          const data = await checkoutStatusApi({ merchantTransactionId, bearerToken  }).unwrap();
          const code = data.statusCode;
          
          //setCheckoutId(data.checkout_Id); // Assuming API returns checkoutId
          //setApiKey(data.entityId); // Assuming API returns key
          if (successCodes.includes(code)) {
            setStatus('Successful');

            try {
              const order1 = await getOrder({ orderID }).unwrap();
              let orderDate = new Date(order1[0].timestamp);
              const orderPlacedTimestamp = new Date();
              //let orderDateFormatted = orderDate.toLocaleDateString('en-ZA', options);
              //let deliveryDate = new Date(order[0].deliveryDate);
              //let deliveryDateFormatted = deliveryDate.toLocaleDateString('en-ZA', options);
              
              const deliveryAddress = order1[0].deliveryAddress;
              const deliveryLat = order1[0].deliveryLat;
              const deliveryLong = order1[0].deliveryLong;
              const typesOfItems = order1[0].typesOfItems;
              const deliveryDate = order1[0].deliveryDate;
              const userID = order1[0].userID;
              const OGOrderID = order1[0]._id;
              const freeDelivery = order1[0].freeDelivery;
              const totalPrice = order1[0].totalPrice;
              const totalQuantity = order1[0].totalQuantity;
              const shortAddress = order1[0].shortAddress;
              const deliveryFee = order1[0].deliveryFee;
              const status = 'Order Placed';

              
              const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
              const orderDateFormatted = orderDate.toLocaleDateString('en-ZA', options);
              const deliveryDateObject = new Date(deliveryDate);
              const deliveryDateFormatted = deliveryDateObject.toLocaleDateString('en-ZA', options);
              setEstDeliveryDate(deliveryDateFormatted);


              const order = {
                _id: OGOrderID,
                transactionId: merchantTransactionId
              };

    
              await createPaidOrder({userID, totalPrice, deliveryLat, deliveryLong ,deliveryAddress, freeDelivery, totalQuantity, typesOfItems, deliveryDate, shortAddress , status, OGOrderID, merchantTransactionId, deliveryFee }).unwrap();
              await updateOGOrder({order, status});
              await createStatus({OGOrderID, userID, merchantTransactionId, status, orderPlacedTimestamp});
              


              try {
                const data = await getOrderDetails({ orderID }).unwrap();
                let orderDetails = [];
            for (let i = 0; i < data.length; i++) {
                let product = products.find(product => product.id === data[i].orderItemCode);

                let picture = product ? product.image02 : null;
                let entry = {
                    itemCode: data[i].orderItemCode,
                    itemName: data[i].orderItemName,
                    itemPrice: data[i].orderItemPrice,
                    totalPrice: data[i].orderTotalPrice,
                    quantity: data[i].quantity,
                    itemPicture: picture
                    
                    //time: date.toLocaleDateString('en-ZA', options)
                   
                };
                orderDetails.push(entry);
            }    
            await sendOrderEmail({email, merchantTransactionId, status, orderDateFormatted, deliveryDateFormatted, freeDelivery, totalPrice, totalQuantity, shortAddress, orderDetails, deliveryFee , orderID  });         
            //await sendAdminOrderEmail({merchantTransactionId, status, orderDateFormatted, deliveryDateFormatted, freeDelivery, totalPrice, totalQuantity, shortAddress, orderDetails, deliveryFee , orderID, name, surname, deliveryAddress, cellNumber});

          } catch (error) {
              console.error("Failed to fetch order details:", error);
            };
          } catch (error) {
              console.error("Failed to fetch order:", error);
          };




setLoadingMessage(false);
          } else {
            setStatus('Unsuccessful');
            setLoadingMessage(false);
          }

        };
    
        fetchPaymentStatusUrl();
        
      }, []);


      if (loadingMessage) {
        return (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
              <Loader animation="border" />
            </div>
          );
    }

    if (!stateMerchantTransactionId && !loadingMessage ) {
      return (
        <Container>
         
            <div className="d-flex align-items-center mb-3 mt-3">
              <div className="profile flex-grow-1">
                <h1 className="text-center my-auto">Invalid Transaction</h1>
              </div>
            </div>
        
        </Container>
      );
    }

//   return (
//     <Container>
//                   <div className='postpaymentheader'>
//             <div className="d-flex align-items-center mb-3">
//   <div className="profile flex-grow-1">
//     <h1 className="text-center my-auto">Order Complete</h1>
//   </div>
// </div>
//             </div>
//       <p>Status: {status}</p>
//       <AiFillCheckCircle className="checkoutIcon" />
//     </Container>
//   );
return (
  <Container>
    <div className='postpaymentheader'>
      <div className="d-flex align-items-center mb-3">
        <div className="profile flex-grow-1">
          <h1 className="text-center my-auto">Order Complete</h1>
        </div>
      </div>
    </div>
    {/* <p>Status: {status}</p> */}
    {status === 'Successful' ? (
      <>
                <div className="checkoutTitleContainer justify-content-center">
          <AiFillCheckCircle className="checkoutIcon" />
          <h3>Success</h3>
        </div>
        <div className="postpaymentinfo">
        <p>Your order was successfully placed.</p>
        <p>To view your orders, go to:</p>
        <p>Profile &rarr; Orders.</p>
        </div>
      </>
    ) : (
      <>
      <div className="checkoutTitleContainer justify-content-center">
        <AiFillCloseCircle className="checkoutIcon" style={{ color: 'red' }} />
        <h3>Failed</h3>
        </div>
        <div className="postpaymentinfo">
        <p>Payment was unsuccessful. </p>
        <p>Please try again or if error persist contact Maaltijd at <a href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a>.</p>
        </div>
      </>
    )}
  </Container>
);
};

export default PostPay;