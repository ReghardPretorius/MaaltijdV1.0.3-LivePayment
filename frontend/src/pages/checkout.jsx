import "../styles/checkout.css";
import { AiFillCheckCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { cartActions } from "../slices/cartSlice"; 
import { useEffect, useState } from "react";
import Payment from '../pages/payment.jsx';



const Checkout = () => {
    //const dispatch = useDispatch();

    //dispatch(cartActions.clearCart());
  return (
    <>
      {/* <div className="checkoutMessage" style={{marginTop: '70px'}}>
        <div className="checkoutTitleContainer">
          <AiFillCheckCircle className="checkoutIcon" />
          <h3>Awaiting Paygate Feature</h3>
        </div> */}
        {/* <span>
          Your order is being processed and will be delivered as fast as
          possible.
        </span> */}
      {/* </div> */}
      <Payment  />
    </>
  );
};

export default Checkout;