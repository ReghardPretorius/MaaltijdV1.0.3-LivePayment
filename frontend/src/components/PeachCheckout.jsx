// import React, { useEffect, useState } from 'react';

// const PaymentForm = () => {
//   const [checkout, setCheckout] = useState('');
//   const [entityId, setEntityId] = useState('');
//   const [checkoutId, setCheckoutId] = useState('');


//   useEffect(() => {
//     const loadCheckoutScript = () => {
//       const script = document.createElement('script');
//       script.src = 'https://sandbox-checkout.peachpayments.com/js/checkout.js';
//       script.async = true;
//       script.onload = () => initializeCheckout();
//       document.body.appendChild(script);
//     };

//     const initializeCheckout = () => {
//       if (window.Checkout && checkoutId) {
//         const checkoutInstance = window.Checkout.initiate({
//           key: entityId,
//           checkoutId: checkoutId,
//           options: {
//             theme: {
//               brand: {
//                 primary: '#ff0000',
//               },
//               cards: {
//                 background: '#00ff00',
//                 backgroundHover: '#F3F3F4',
//               },
//             },
//           },
//         });
//         checkoutInstance.render('#payment-form');
//         setCheckout(checkoutInstance);
//       }
//     };

//     const authenticate = async (clientId, clientSecret, merchantId) => {
//       let response = await fetch('https://sandbox-dashboard.peachpayments.com/api/oauth/token', {
//         method: 'POST',
//         body: JSON.stringify({
//           clientId,
//           clientSecret,
//           merchantId,
//         }),
//       });

//       if (response.ok) {
//         let body = await response.json();
//         return body.access_token;
//       } else {
//         throw new Error('Unable to authenticate');
//       }
//     };

//     const createCheckoutId = async (token, body) => {
//       const response = await fetch('https://testsecure.peachpayments.com/v2/checkout', {
//         headers: new Headers({
//           Authentication: `bearer ${token}`,
//           origin: 'https://maaltijd.co.za',
//         }),
//         method: 'POST',
//         body: JSON.stringify(body),
//       });

//       if (response.ok) {
//         return await response.json();
//       } else {
//         throw new Error('Unable to retrieve Checkout Id.');
//       }
//     };

//     const initializePayment = async () => {
//       const clientId = 'df2e9be9b7aaa049e20cf96c738785';
//       const clientSecret = 'FzLigc7ghU3t9XeYXgwxZOtFd63rY3U/6cYhl6sf4zXqkTbKw7uaE4DpSbx+Ar8aLUy00U+xbf+TZbXtCKeaDA==';
//       const merchantId = '2394665d428b40ae819a18bca94d1b5b';
//       const body = {
//         amount: '100.00',
//         currency: 'ZAR',
//       };

//       try {
//         const token = await authenticate(clientId, clientSecret, merchantId);
//         const checkoutData = await createCheckoutId(token, body);
//         setCheckoutId(checkoutData.id);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     if (!checkout) {
//       loadCheckoutScript();
//       initializePayment();
//     }
//   }, [checkout, entityId, checkoutId]);

//   return <div id="payment-form"></div>;
// };

// export default PaymentForm;

//======================================================================================

// import React, { useState } from 'react';

// const Checkout = () => {
//   const [loading, setLoading] = useState(false);

//   const getCheckoutId = async () => {
//     const response = await fetch('/api/checkout', { method: 'POST' });

//     if (response.ok) {
//       const json = await response.json();

//       const checkout = window.Checkout.initiate({
//         checkoutId: json.checkoutId,
//         key: json.entityId,
//         options: {
//           theme: {
//             brand: {
//               primary: "#EC5228",
//               secondary: "#111927",
//             },
//             cards: {
//               background: "#ffffff",
//               backgroundHover: "#F3F3F4",
//             },
//           },
//           ordering: {
//             CARD: 1,
//             EFTSECURE: 4,
//             MASTERPASS: 2,
//             CAPITECPAY: 3,
//           },
//         },
//         events: {
//           onCompleted: (event) => {
//             console.log(event);
//             checkout.unmount();
//             document.getElementById("payment-form").innerText = "Paid!";
//           },
//           onCancelled: (event) => {
//             console.log(event);
//             checkout.unmount();
//             document.getElementById("payment-form").innerText = "Cancelled!";
//           },
//           onExpired: (event) => {
//             console.log(event);
//             checkout.unmount();
//             document.getElementById("payment-form").innerText = "Expired!";
//           },
//         },
//       });

//       checkout.render("#payment-form");
//     }
//   };

//   const handleClick = (event) => {
//     event.preventDefault();
//     setLoading(true);

//     getCheckoutId().then(() => {
//       setLoading(false);
//       document.getElementById("complete-checkout").style.display = "none";
//     });

//     document.getElementById("complete-checkout").innerText = "Loading...";
//   };

//   return (
//     <div>
//       <div id="complete-checkout">
//         <button id="pay-now" onClick={handleClick} disabled={loading}>
//           Pay now
//         </button>
//       </div>
//       <div id="payment-form"></div>
//     </div>
//   );
// };

// export default Checkout;

//========================================================================================

import React, { useState, useEffect } from 'react';
import { useCheckoutMutation } from '../slices/paymentApislice';

const PaymentForm = () => {
  const [loading, setLoading] = useState(false);
  const [checkoutLoaded, setCheckoutLoaded] = useState(false);

  const [checkoutApi, { isLoadingCheckoutApi }] = useCheckoutMutation();
  const checkoutJsUrl = 'https://sandbox-checkout.peachpayments.com/js/checkout.js';

  useEffect(() => {
    if (!checkoutJsUrl) {
      console.error('Checkout JS URL not provided');
      return;
    }

    const loadCheckoutScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = checkoutJsUrl;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject('Error loading checkout.js script');
        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      });
    };

    loadCheckoutScript()
      .then(() => {
        setCheckoutLoaded(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [checkoutJsUrl]);



  const getCheckoutId = async () => {
    //const response = await fetch('/api/checkout', { method: 'POST' });
    const response = await checkoutApi().unwrap();
    console.log(response.checkout_Id);
    //const json = await response.json();
    //console.log(json);

    if (response) {
      console.log('intiate');
      //const json = await response.json();

      if (window.PaymentForm) {
        
        const checkout = window.PaymentForm.initiate({
          checkoutId: response.checkout_Id,
          key: response.entityId,
          options: {
            theme: {
              brand: {
                primary: "#EC5228",
                secondary: "#111927",
              },
              cards: {
                background: "#ffffff",
                backgroundHover: "#F3F3F4",
              },
            },
            ordering: {
              CARD: 1,
              EFTSECURE: 4,
              MASTERPASS: 2,
              CAPITECPAY: 3,
            },
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
        });

        checkout.render("#payment-form");
      } else {
        console.error('Checkout object is not available');
      }
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    setLoading(true);

    getCheckoutId().then(() => {
      setLoading(false);
      document.getElementById("complete-checkout").style.display = "none";
    });

    document.getElementById("complete-checkout").innerText = "Loading...";
  };

  return (
    <div>
      <div id="complete-checkout">
        <button id="pay-now" onClick={handleClick} disabled={loading}>
          Pay now
        </button>
      </div>
      <div id="payment-form">
      {/* <script src="https://sandbox-checkout.peachpayments.com/js/checkout.js"></script> */}
      </div>
    

    {/* <script>
      const checkout = Checkout.initiate({
        key: "{entityId}",
        checkoutId: "{checkoutId}",
        options: {
          theme: {
            brand: {
              primary: "#ff0000",
            },
            cards: {
              background: "#00ff00",
              backgroundHover: "#F3F3F4",
            },
          },
        },
      });

      checkout.render("#payment-form");
    </script> */}
    </div>
    
  );
};

export default PaymentForm;

//==================================================================================

// import React, { useState } from 'react';

// const PaymentForm = () => {
//   const [loading, setLoading] = useState(false);

//   const getCheckoutId = async () => {
//     const response = await fetch('/api/checkout', { method: 'POST' });

//     if (response.ok) {
//       const json = await response.json();

//       const checkout = window.PaymentForm.initiate({
//         checkoutId: json.checkoutId,
//         key: json.entityId,
//         options: {
//           theme: {
//             brand: {
//               primary: "#EC5228",
//               secondary: "#111927",
//             },
//             cards: {
//               background: "#ffffff",
//               backgroundHover: "#F3F3F4",
//             },
//           },
//           ordering: {
//             CARD: 1,
//             EFTSECURE: 4,
//             MASTERPASS: 2,
//             CAPITECPAY: 3,
//           },
//         },
//         events: {
//           onCompleted: (event) => {
//             console.log(event);
//             checkout.unmount();
//             document.getElementById("payment-form").innerText = "Paid!";
//           },
//           onCancelled: (event) => {
//             console.log(event);
//             checkout.unmount();
//             document.getElementById("payment-form").innerText = "Cancelled!";
//           },
//           onExpired: (event) => {
//             console.log(event);
//             checkout.unmount();
//             document.getElementById("payment-form").innerText = "Expired!";
//           },
//         },
//       });

//       checkout.render("#payment-form");
//     }
//   };

//   const handleClick = (event) => {
//     event.preventDefault();
//     setLoading(true);

//     getCheckoutId().then(() => {
//       setLoading(false);
//       document.getElementById("complete-checkout").style.display = "none";
//     });

//     document.getElementById("complete-checkout").innerText = "Loading...";
//   };

//   return (
//     <div>
//       <div id="complete-checkout">
//         <button id="pay-now" onClick={handleClick} disabled={loading}>
//           Pay now
//         </button>
//       </div>
//       <div id="payment-form"></div>
//     </div>
//   );
// };

// export default PaymentForm;


//=========================================================================================


// import React, { useState, useEffect } from 'react';
// import { useCheckoutMutation } from '../slices/paymentApislice';


// const PaymentForm = ({ checkoutJsUrl }) => {
//   const [loading, setLoading] = useState(false);
//   const [checkoutLoaded, setCheckoutLoaded] = useState(false);

//   const [checkoutApi, { isLoadingCheckoutApi }] = useCheckoutMutation();
//   console.log(checkoutJsUrl);

//   useEffect(() => {
//     if (!checkoutJsUrl) {
//       console.error('Checkout JS URL not provided');
//       return;
//     }

//     // Dynamically load the checkout.js script
//     const script = document.createElement('script');
//     script.src = checkoutJsUrl;
//     script.async = true;
//     script.onload = () => setCheckoutLoaded(true);
//     script.onerror = () => console.error('Error loading checkout.js script');
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [checkoutJsUrl]);

//   const getCheckoutId = async () => {
//     //const response = await fetch('/api/checkout', { method: 'POST' });
//     const response = await checkoutApi().unwrap();

//     if (response) {
//       //const json = await response.json();

//       if (window.PaymentForm) {
//         const checkout = window.PaymentForm.initiate({
//           checkoutId: response.checkout_Id,
//           key: response.entityId,
//           options: {
//             theme: {
//               brand: {
//                 primary: "#EC5228",
//                 secondary: "#111927",
//               },
//               cards: {
//                 background: "#ffffff",
//                 backgroundHover: "#F3F3F4",
//               },
//             },
//             ordering: {
//               CARD: 1,
//               EFTSECURE: 4,
//               MASTERPASS: 2,
//               CAPITECPAY: 3,
//             },
//           },
//           events: {
//             onCompleted: (event) => {
//               console.log(event);
//               checkout.unmount();
//               document.getElementById("payment-form").innerText = "Paid!";
//             },
//             onCancelled: (event) => {
//               console.log(event);
//               checkout.unmount();
//               document.getElementById("payment-form").innerText = "Cancelled!";
//             },
//             onExpired: (event) => {
//               console.log(event);
//               checkout.unmount();
//               document.getElementById("payment-form").innerText = "Expired!";
//             },
//           },
//         });

//         checkout.render("#payment-form");
//       } else {
//         console.error('Checkout object is not available');
//       }
//     }
//   };

//   const handleClick = (event) => {
//     event.preventDefault();
//     setLoading(true);

//     getCheckoutId().then(() => {
//       setLoading(false);
//       document.getElementById("complete-checkout").style.display = "none";
//     });

//     document.getElementById("complete-checkout").innerText = "Loading...";
//   };

//   return (
//     <div>
//       <div id="complete-checkout">
//         <button id="pay-now" onClick={handleClick} disabled={loading}>
//           Pay now
//         </button>
//       </div>
//       <div id="payment-form"></div>
//     </div>
//   );
// };

// export default PaymentForm;

//==================================================================================