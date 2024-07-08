import PaymentForm from '../components/PeachCheckout.jsx'; 
import PaymentScreen from '../components/paymentForm1.jsx'; 
import "../styles/postPayment.css"; 


const Payment = () => {
    return (
  <div>

    <PaymentScreen  />
  </div>
  // <div>
  // <div id="payment-form"></div>
  //   <script src="https://sandbox-checkout.peachpayments.com/js/checkout.js"></script>

  //   <script>
  //     const checkout = Checkout.initiate({
  //       key: "8ac7a4ca8f9f6a2b018fa014509d0208",
  //       checkoutId: "d57dab6cef9b4bc48438f78c48e3c9d0",
  //       options: {
  //         theme: {
  //           brand: {
  //             primary: "#ff0000",
  //           },
  //           cards: {
  //             background: "#00ff00",
  //             backgroundHover: "#F3F3F4",
  //           },
  //         },
  //       },
  //     });

  //     checkout.render("#payment-form");
  //   </script>
  //   </div>
  );
};

export default Payment;
