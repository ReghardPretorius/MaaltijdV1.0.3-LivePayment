import "../styles/checkout.css";
import { AiFillCheckCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { cartActions } from "../slices/cartSlice"; 



const Pay = () => {
    const dispatch = useDispatch();

    dispatch(cartActions.clearCart());
  return (
    <>

    </>
  );
};

export default Pay;