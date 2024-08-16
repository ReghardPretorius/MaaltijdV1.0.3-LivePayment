import asyncHandler from 'express-async-handler';
import transporterOrders from '../config/nodemailerConfigOrders.js';

const sendOrderEmail = asyncHandler(async (req, res) => {
  const { email, merchantTransactionId, status, orderDateFormatted, deliveryDateFormatted, freeDelivery, totalPrice, totalQuantity, shortAddress, orderDetails, deliveryFee, orderID } = req.body;

  const subtotal = deliveryFee > 0 ? totalPrice - deliveryFee : totalPrice;

  let orderItemsHtml = '';
  orderDetails.forEach(item => {
    orderItemsHtml += `
      <tr>
        <td style="padding: 10px;">
          <img src="${item.itemPicture}" alt="${item.itemName}" style="width: 50px; height: 50px; margin-right: 20px;"/>
        </td>
        <td style="padding: 10px;">
          <p style="margin: 0; font-weight: bold; color: #000000;">${item.itemName}</p>
          <p style="margin: 0; color: #000000;">${item.quantity}x</p>
          <p style="margin: 0; color: #000000;">Total Price: R${item.totalPrice}</p>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-top: 4px;">
        </td>
      </tr>
    `;
  });

  const mailOptions = {
    from: 'orders@maaltijd.co.za',
    to: email,
    subject: `Maaltijd Order Confirmed | ${merchantTransactionId}`,
    html: `
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; background: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #434343;">
        <div style="max-width: 680px; margin: 0 auto; padding: 20px; background: #f4f7ff; background-image: url('https://maaltjidassets.s3.af-south-1.amazonaws.com/Background.png'); background-repeat: repeat; background-size: cover;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
              <td style="padding: 20px; background: #ffffff; border-radius: 10px; border: 1px solid #daa927;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1f1f1f; text-align: center;">Order Confirmation</h1>
                <p style="margin: 10px 0 0; font-weight: 700; letter-spacing: 0.56px; color: #1f1f1f; text-align: center;">Thank you for your order!</p>
                <p style="margin: 10px 0 0; font-weight: 400; color: #8c8c8c;"><strong>Order Number:</strong></p>
                <p style="margin: 5px 0 2px; font-weight: 400; color: #1F305E;">
                  <a href="https://maaltijd.co.za/user/order/${orderID}" style="color: #1F305E; text-decoration: underline;">${merchantTransactionId}</a>
                </p>
                <p style="margin: 5px 0 0; font-weight: 400; color: #8c8c8c;"><strong>Estimated Delivery Date:</strong></p>
                <p style="margin: 5px 0 2px; font-weight: 400; color: #8c8c8c;">${deliveryDateFormatted}</p>
                <p style="margin: 5px 0 0; font-weight: 400; color: #8c8c8c;"><strong>Delivery Address:</strong></p>
                <p style="margin: 5px 0 2px; font-weight: 400; color: #8c8c8c;">${shortAddress}</p>
                <p style="margin: 5px 0 0; font-weight: 400; color: #8c8c8c;"><strong>Total Quantity:</strong></p>
                <p style="margin: 5px 0 2px; font-weight: 400; color: #8c8c8c;">${totalQuantity}</p>
                <p style="margin: 5px 0 0; font-weight: 400; color: #8c8c8c;"><strong>Total Price:</strong></p>
                <p style="margin: 5px 0 2px; font-weight: 400; color: #8c8c8c;">R ${totalPrice}</p>
                <hr style="border: 0; border-top: 2px solid #e0e0e0; margin: 20px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  ${orderItemsHtml}
                </table>
                <div style="margin: 20px 0 0; text-align: left;">
                  <p style="margin: 0; font-weight: bold; color: #000000;">Subtotal: R ${subtotal}</p>
                  <p style="margin: 0; color: #000000;">Delivery: R ${deliveryFee}</p>
                  <p style="margin: 0; font-weight: bold; color: #000000;">Total: R ${totalPrice}</p>
                </div>
                <p style="margin: 20px 0 0; color: #000000;">Need help? Ask at <a style="color: #499fb6;" href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a></p>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>`
  };

  try {
    await transporterOrders.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
});





// import asyncHandler from 'express-async-handler';

// import transporterOrders from '../config/nodemailerConfigOrders.js';


// const sendOrderEmail = asyncHandler(async (req, res) => {

//   const { email, merchantTransactionId, status, orderDateFormatted, deliveryDateFormatted, freeDelivery, totalPrice, totalQuantity, shortAddress, orderDetails,  deliveryFee, orderID  } = req.body;

//   const subtotal = deliveryFee > 0 ? totalPrice - deliveryFee : totalPrice;

//   let orderItemsHtml = '';
//   orderDetails.forEach(item => {
//     orderItemsHtml += `
//       <div style="display: flex; align-items: center; margin-bottom: 20px;">
//         <img src="${item.itemPicture}" alt="${item.itemName}" style="width: 50px; height: 50px; margin-right: 20px;"/>
//         <div>
//           <p style="margin: 0; font-weight: bold; text-align: left; color: #000000">${item.itemName}</p>
//           <p style="margin: 0; text-align: left; color: #000000">${item.quantity}x</p>
//           <p style="margin: 0; text-align: left; color: #000000">Total Price: R${item.totalPrice}</p>
//         </div>
//       </div>
//       <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-top: 4px;">
//     `;
//   });

//   const mailOptions = {
//     from: 'orders@maaltijd.co.za',
//     to: email,
//     subject: `Maaltijd Order Confirmed | ${merchantTransactionId}`,
//     html: `
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <meta http-equiv="X-UA-Compatible" content="ie=edge" />
//         <title>Order Confirmation</title>
//         <link href="https://fonts.googleapis.com/css2?family=Sen:wght@400;700&display=swap" rel="stylesheet" />
//       </head>
//       <body style="margin: 0; font-family: 'Sen', sans-serif; background: #ffffff; font-size: 14px;">
//         <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: url(https://maaltjidassets.s3.af-south-1.amazonaws.com/Background.png); background-repeat: repeat; background-size: cover; overflow: hidden; background-position: top center; height: auto; font-size: 15px; color: #434343;">
//           <main>
//             <div style="margin: 0; padding: 50px 30px 50px; background: #ffffff; border-radius: 30px; border-color: #daa927; border-style:solid; border-width:medium; text-align: center;">
//               <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1f1f1f;">Order Confirmation</h1>
//               <p style="margin: 0; margin-top: 10px; font-weight: 700; letter-spacing: 0.56px; color: #1f1f1f;">Thank you for your order!</p>
//               <p style="margin: 0; margin-top: 10px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Order Number:</strong></p>
// <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #1F305E; text-align: left;">
//   <a href="https://maaltijd.co.za/user/order/${orderID}" style="color: #1F305E; text-decoration: underline;">${merchantTransactionId}</a>
// </p>
//               <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Estimated Delivery Date:</strong></p>
//               <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${deliveryDateFormatted}</p>
//               <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Delivery Address:</strong></p>
//               <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${shortAddress}</p>
//               <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Total Quantity:</strong></p>
//               <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${totalQuantity}</p>
//               <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Total Price:</strong></p>
//               <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">R ${totalPrice}</p>
//               <hr style="border: 0; border-top: 2px solid #e0e0e0; margin-top: 20px;">
//               <div style="margin-top: 20px;">
//                 ${orderItemsHtml}
//               </div>
//                 <div style="margin-top: 20px; text-align: left;">
//                 <p style="margin: 0; font-weight: bold; color: #000000"">Subtotal: R ${subtotal}</p>
//                 <p style="margin: 0; color: #000000"">Delivery: R ${deliveryFee}</p>
//                 <p style="margin: 0; font-weight: bold; color: #000000"">Total: R ${totalPrice}</p>
//               </div>
//               <p style="margin-top: 20px;color: #000000"">Need help? Ask at <a style="color: #499fb6;" href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a></p>
//             </div>
//           </main>
//         </div>
//       </body>
//     </html>`
//   };

//   try {
//     await transporterOrders.sendMail(mailOptions);
//     //res.status(200).send('OTP sent successfully');
//     res.status(200).json({ message: 'OTP sent successfully' });
//   } catch (error) {
//     //console.error(error);
//     //res.status(500).send('Error sending OTP');
//     res.status(500).json({ message: 'Error sending OTP' });
//   }


// });

const sendAdminOrderEmail = asyncHandler(async (req, res) => {
  const { merchantTransactionId, status, orderDateFormatted, deliveryDateFormatted, freeDelivery, totalPrice, totalQuantity, shortAddress, orderDetails, deliveryFee , orderID, name, surname, deliveryAddress, cellNumber  } = req.body;

  const subtotal = deliveryFee > 0 ? totalPrice - deliveryFee : totalPrice;

  let orderItemsHtml = '';
  orderDetails.forEach(item => {
    orderItemsHtml += `
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="${item.itemPicture}" alt="${item.itemName}" style="width: 50px; height: 50px; margin-right: 20px;" width="50" height="50"/>
        <div>
          <p style="margin: 0; font-weight: bold; text-align: left; color: #000000">${item.itemName}</p>
          <p style="margin: 0; text-align: left; color: #000000">${item.quantity}x</p>
          <p style="margin: 0; text-align: left; color: #000000">Total Price: R${item.totalPrice}</p>
        </div>
      </div>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-top: 4px;">
    `;
  });

  const mailOptions = {
    from: 'orders@maaltijd.co.za',
    to: 'ordersmaaltijd@gmail.com',
    subject: `Maaltijd Order Confirmed | ${merchantTransactionId}`,
    html: `
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; font-family: Arial, sans-serif; background: #ffffff; font-size: 14px;">
        <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: url(https://maaltjidassets.s3.af-south-1.amazonaws.com/Background.png); background-repeat: repeat; background-size: cover; overflow: hidden; background-position: top center; height: auto; font-size: 15px; color: #434343;">
          <main>
            <div style="margin: 0; padding: 50px 30px 50px; background: #ffffff; border-radius: 30px; border-color: #daa927; border-style:solid; border-width:medium; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1f1f1f;">Order Confirmation</h1>
              
              <p style="margin: 0; margin-top: 10px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Order Number:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${merchantTransactionId}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Name:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${name} ${surname}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Cellphone Number:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${cellNumber}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Estimated Delivery Date:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${deliveryDateFormatted}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Full Delivery Address::</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${deliveryAddress}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Delivery Address:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${shortAddress}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Total Quantity:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${totalQuantity}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Total Price:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">R ${totalPrice}</p>
              <hr style="border: 0; border-top: 2px solid #e0e0e0; margin-top: 20px;">
              <div style="margin-top: 20px;">
                ${orderItemsHtml}
              </div>
                <div style="margin-top: 20px; text-align: left;">
                <p style="margin: 0; font-weight: bold;">Subtotal: R ${subtotal}</p>
                <p style="margin: 0;">Delivery: R ${deliveryFee}</p>
                <p style="margin: 0; font-weight: bold;">Total: R ${totalPrice}</p>
              </div>
              <p style="margin-top: 20px;">Need help? Ask at <a style="color: #499fb6;" href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a></p>
            </div>
          </main>
        </div>
      </body>
    </html>`
  };

  try {
    await transporterOrders.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
});



export { sendOrderEmail, sendAdminOrderEmail };
