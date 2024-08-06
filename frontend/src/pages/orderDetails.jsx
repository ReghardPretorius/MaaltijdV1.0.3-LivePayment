import React,  { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderItemsMutation, useGetOrderDetailsMutation, useGetPaidOrderDetailsMutation } from "../slices/orderAPIslice";
import { Form, Button, Row, Col, Container, ListGroup  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"; 
import { FaArrowLeft } from 'react-icons/fa';
import products from "../assets/data/products";
import { ListGroupItem } from "react-bootstrap";
import Loader from '../components/Loader';

import "../styles/orderDetails.css";


const OrderDetails = () => {
    const { orderId } = useParams();
    const orderID = orderId;
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [loadingItems, setLoadingItems] = useState(true);
    //const order = orderDetails[orderId];
    const detailsRef = useRef(null);
    const headerRef = useRef(null);
    const [remainingHeight, setRemainingHeight] = useState(0);

    const [displayDetails, setDisplayDetails] = useState([]);
    const [shortAddress, setShortAddress] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [status, setStatus] = useState('');
    const [dateDelivered, setDateDelivered] = useState('');
    const [orderTotalPrice, setOrderTotalPrice] = useState('');
    const [orderTotalQuantity, setOrderTotalQuantity] = useState('');
    const [freeDelivery, setFreeDelivery] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [merchantTransactionId, setMerchantTransactionId] = useState('');
    const [validOrder, setValidOrder] = useState(false);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [getOrderDetails, { isLoadingGetUserOrders }] = useGetOrderItemsMutation();
    const [getOrder, { isLoadingGetOrder }] = useGetOrderDetailsMutation();
    const [getPaidOrder, { isLoadingGetPaidOrder }] = useGetPaidOrderDetailsMutation();
    const userID = useSelector((state) => state.auth.userInfo._id);




      const handleArrowClick = () => {
        navigate('/user/orders');
      };

      useLayoutEffect(() => {
        const updateHeight = () => {
          const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
          const detailsHeight = detailsRef.current ? detailsRef.current.offsetHeight : 0;

          const windowHeight = window.innerHeight;

    
          setRemainingHeight(windowHeight - 130 - 30 - headerHeight - detailsHeight);
        };
    
        // Initial calculation
        // updateHeight();
        setTimeout(updateHeight, 500);
    
        // Recalculate on window resize
        window.addEventListener('resize', updateHeight);
    
        return () => window.removeEventListener('resize', updateHeight);
      }, []);


    useEffect(() => {
        const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        
        const Order = async () => {
            try {
                const order = await getPaidOrder({ orderID, userID }).unwrap();
                if (order) {
                    setValidOrder(true);
                }
                //const order = await getPaidOrder({ orderID, userID });
                // if (order.status === 200){
                //   setValidOrder(true);
                // } else {

                // }
                let orderDate = new Date(order.timestamp);
                let orderDateFormatted = orderDate.toLocaleDateString('en-ZA', options);
                let deliveryDate = new Date(order.deliveryDate);
                let deliveryDateFormatted = deliveryDate.toLocaleDateString('en-ZA', options);

                setMerchantTransactionId(order.merchantTransactionId)
                setStatus(order.status);
                setDateDelivered(order.actualDateDelivered);
                setDeliveryDate(deliveryDateFormatted);
                setFreeDelivery(order.freeDelivery);
                setOrderTotalPrice(order.totalPrice);
                setOrderTotalQuantity(order.totalQuantity);
                setShortAddress(order.shortAddress);
                setOrderDate(orderDateFormatted);

            } catch (error) {
                console.error("Failed to fetch order:", error);
                setValidOrder(false);
              } finally {
                setLoadingDetails(false);
            };
        };
        
        
        const OrderDetails = async () => {
            try {
                const data = await getOrderDetails({ orderID }).unwrap();
                let outputArray = [];
            for (let i = 0; i < data.length; i++) {
                let product = products.find(product => product.id === data[i].orderItemCode);

                let picture = product ? product.image01 : null;
                let entry = {
                    itemCode: data[i].orderItemCode,
                    itemName: data[i].orderItemName,
                    itemPrice: data[i].orderItemPrice,
                    totalPrice: data[i].orderTotalPrice,
                    quantity: data[i].quantity,
                    itemPicture: picture
                    
                    //time: date.toLocaleDateString('en-ZA', options)
                   
                };
                outputArray.push(entry);
            }

                // Sort the array by timestamp in descending order (newest to oldest)
                outputArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));



                setDisplayDetails(outputArray);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoadingItems(false);
            }
        };
        Order();
        OrderDetails();
    }, [orderID, getOrderDetails, getPaidOrder]);

    const ItemCard = ({ item }) => {
        //const { id, title, price, image01, quantity, extraIngredients } = item;
        return (
            <ListGroupItem className="pl-1 pr-1  border-0  orderdetails_item orderdetails__item" >
            <div className="orderdetails__item-info d-flex gap-4">
              <img src={item.itemPicture} alt="product-img" style={{ maxWidth: '75px', maxHeight: '75px' }}/>
      
              <div className="cart__product-info w-100 d-flex align-items-center gap-4 justify-content-between">
                <div>
                  <h6 className="orderdetails__product-title">{item.itemName}</h6>
                  <p className=" d-flex align-items-center gap-3 justify-content-between orderdetails__product-price">
                    {item.quantity}x <span>R {item.itemPrice}</span>
                    <span className="orderdetails_total_amount m-0">
                            Total: R {item.totalPrice}
                          </span>
                  </p>
                  <div className="d-flex flex-column">   
                    </div>
                </div>
              </div>
            </div>
          </ListGroupItem>
        );
      };


    if (!orderID) {
        return <div>Order not found</div>;
    }

    if (!validOrder && (!loadingDetails || !loadingItems)) {
      return (
      <>
      <div className='ordersheader' ref={headerRef}>
      <div className="d-flex align-items-center">
        <div className="arrow">
          <FaArrowLeft onClick={handleArrowClick} />
        </div>
        <div className="profile flex-grow-1">
          <h1 className="text-center my-auto">Order Details</h1>
        </div>
      </div>
    </div>
      
      <div>Invalid Order</div>
      </>
      );
  }

    if (loadingDetails || loadingItems) {
      return (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
            <Loader animation="border" />
          </div>
        );
  }

    return (
//       <div className='orderdetails__page'>
//         <Container >

//         {/* <Row> */}
//         <div className='ordersheader' ref={headerRef}>
//             <div className="d-flex align-items-center">
//   <div className="arrow">
//     <FaArrowLeft onClick={handleArrowClick} />
//   </div>
//   <div className="profile flex-grow-1">
//     <h1 className="text-center my-auto">Order Details</h1>
//   </div>
// </div>
//             </div>
//             {/* </Row> */}
//             <div ref={detailsRef}>
//             <Row class="pl-1 pr-1 orderrow_rowitem">
//           <div class="orderdetails_rowitem">
//         <div class="orderdetails_overview_card d-flex ">
//         <div class="orderdetails_card-content">
//         <Row>Status: {status}</Row>
//         <Row>Order Number: {merchantTransactionId}</Row>
//         <Row>Delivery Address: {shortAddress}</Row>
//         <Row>Amount: R {orderTotalPrice}</Row>
//               <Row>Number Of Meals: {orderTotalQuantity}</Row>
//               {/* <Row>Estimated Delivery Date: {deliveryDate}</Row> */}
//               {status === 'Delivered' ? (
//   <Row>
//     Delivery Date: {dateDelivered}
//   </Row>
// ) : (
//   <Row>
//     Estimated Delivery Date: {deliveryDate}
//   </Row>
// )}

//               {/* const [shortAddress, setShortAddress] = useState('');
//     const [deliveryDate, setDeliveryDate] = useState('');
//     const [orderTotalPrice, setOrderTotalPrice] = useState('');
//     const [orderTotalQuantity, setOrderTotalQuantity] = useState('');
//     const [freeDelivery, setFreeDelivery] = useState('');
//     const [orderDate, setOrderDate] = useState(''); */}

//         </div>
//     </div>
//     </div>
    
//         </Row>
//         </div>
//         <div className='orderdetails__item-list' style={{ height: remainingHeight }}>
//             <Row class="pl-1 pr-1 ">
//             {/* <p>Delivery Date: {order.deliveryDate}</p>
//             <p>Status: {order.status}</p> */}
//             {displayDetails.map(item => (
//                 <ItemCard item={item} key={item.itemCode}/>

// ))}
//         </Row>
//         </div>
//         </Container>
//         </div>

<div className='orderdetails__page'>
  <Container>
    <div className='ordersheader' ref={headerRef}>
      <div className="d-flex align-items-center">
        <div className="arrow">
          <FaArrowLeft onClick={handleArrowClick} />
        </div>
        <div className="profile flex-grow-1">
          <h1 className="text-center my-auto">Order Details</h1>
        </div>
      </div>
    </div>
    <div ref={detailsRef}>
      <Row className="pl-1 pr-1 orderrow_rowitem">
        <div className="orderdetails_rowitem">
          <div className="orderdetails_overview_card d-flex ">
            <div className="orderdetails_card-content">
              <Row>Status: {status}</Row>
              <Row>Order Number: {merchantTransactionId}</Row>
              <Row>Delivery Address: {shortAddress}</Row>
              <Row>Amount: R {orderTotalPrice}</Row>
              <Row>Number Of Meals: {orderTotalQuantity}</Row>
              {status === 'Delivered' ? (
                <Row>Delivery Date: {dateDelivered}</Row>
              ) : (
                <Row>Estimated Delivery Date: {deliveryDate}</Row>
              )}
            </div>
          </div>
        </div>
      </Row>
    </div>
    <div className='orderdetails__item-list' style={{ height: remainingHeight }}>
      <Row className="pl-1 pr-1">
        {displayDetails.map(item => (
          <ItemCard item={item} key={item.itemCode} />
        ))}
      </Row>
    </div>
  </Container>
</div>

    );
};

export default OrderDetails;
