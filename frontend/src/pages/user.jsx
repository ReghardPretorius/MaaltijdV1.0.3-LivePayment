import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import {   Modal  } from "react-bootstrap";

import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

import "../styles/user.css"; 



const UserProfilePage = () => {
    const email = useSelector((state) => state.auth.userInfo.email);
    const [displayEmail, setDisplayEmail] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showPP, setShowPP] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showContact, setShowContact] = useState(false);

    const handleCloseTerms = () => setShowTerms(false);
    const handleShowTerms = () => setShowTerms(true);
  
    const handleClosePP = () => setShowPP(false);
    const handleShowPP = () => setShowPP(true);

    const handleCloseContact = () => setShowContact(false);
    const handleShowContact = () => setShowContact(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
      try {
        await logoutApiCall().unwrap();
        dispatch(logout());
        navigate('/login');
      } catch (err) {
      }
    };

    const handleOrdersClicked = () => {
      navigate('/user/orders');
    }

    
    const handleUpdateDetailsClicked = () => {
      navigate('/user/updateprofile');
    }

    useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
    
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

      useEffect(() => {
        if (email) {
          let truncatedEmail;
      
          if (email.length > 30) {
            truncatedEmail =
              windowWidth <= 550
                ? email.slice(0, 30) + '...'
                : email;
          } else if (email.length > 25) {
            truncatedEmail =
              windowWidth <= 450
                ? email.slice(0, 25) + '...'
                : email;
          } else if (email.length > 20) {
            truncatedEmail =
              windowWidth <= 350
                ? email.slice(0, 20) + '...'
                : email;
          } else {
            truncatedEmail = email;
          }
      
          setDisplayEmail(truncatedEmail);
        }
      }, [email, windowWidth]);

  return (
    <div className="container">
      <div className="email">
        <h4>{displayEmail}</h4>
        {/* <span>{displayEmail}</span> */}
      </div>
      <div className="user__item-list">
      <div className="user_card" onClick={handleOrdersClicked}>
            <div className="user_card-title">
              <h5 className='my-1'>Orders</h5>
            </div>
          </div>
        {/* <div className="block">
          <Link to="/user/orders" className="link">Orders</Link>
        </div> */}

<div className="user_card" onClick={handleUpdateDetailsClicked}>
            <div className="user_card-title">
              <h5 className='my-1'>Update Details</h5>
            </div>
          </div>
        {/* <div className="block">
          <Link to="/user/updateprofile" className="link">Update Details</Link>
        </div> */}


<div className="user_card" onClick={handleShowPP}>
            <div className="user_card-title">
              <h5 className='my-1'>Privacy Policy</h5>
            </div>
          </div>

        {/* <div className="block">
        <span onClick={handleShowPP} style={{color: '#1F305E'}}>
                Privacy Policy
              </span>
        </div> */}
      <div className="user_card" onClick={handleShowTerms}>
            <div className="user_card-title">
              <h5 className='my-1'>Terms of Use</h5>
            </div>
          </div>


        {/* <div className="block">
    <span  onClick={handleShowTerms} style={{color: '#1F305E'}}>
                Terms of Use
              </span>

        </div> */}

<div className="user_card" onClick={handleShowContact}>
            <div className="user_card-title">
              <h5 className='my-1'>Contact Us</h5>
            </div>
          </div>

        {/* <div className="block">
        <span  onClick={handleShowContact} style={{color: '#1F305E'}}>
                Contact Us
              </span>
        </div> */}
        <div className="mt-1 d-flex justify-content-end">
      <Button onClick={logoutHandler}>
        Logout
      </Button>
    </div>
      </div>

      <Modal show={showContact} onHide={handleCloseContact}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
      <h1>Maaltijd - Terms of Use</h1>
      <p>Thank you for choosing Maaltijd for your food ordering and delivery needs. By using our services, you agree to comply with the following Terms of Use:</p>

      <h2>1. Order Placement and Delivery Schedule:</h2>
      <p>1.1. Order Placement Deadline: Orders must be placed before 12:00 (noon) to qualify for next-day delivery.</p>
      <p>1.2. Delivery Days and Hours: Deliveries will be carried out from Monday to Friday between 08:00 and 17:00, and on Saturdays from 08:00 to 12:00. No deliveries will be made on Sundays.</p>

      <h2>2. Returns Policy:</h2>
      <p>2.1. Product Returns: Due to the nature of our products, we do not accept returns. However, if you believe a product does not meet our standards, please contact us at <a href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a> promptly. We will conduct an inspection and issue a refund for any sub-standard products. No refund will be provided if it is determined that the food's quality was affected by improper consumer handling.</p>

      <h2>3. Collection Responsibilities:</h2>
      <p>3.1. Address Accuracy: Please ensure that the provided delivery address is accurate and that someone is available to collect the food at the specified location.</p>
      <p>3.2. Collection Timeframe: Failure to collect the food within a reasonable timeframe will result in the order being considered as your loss. If the initial delivery is unsuccessful, we will attempt one additional free delivery on the next delivery day. Subsequent attempts will incur additional charges, and arrangements can be made via contact at <a href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a>.</p>

      <h2>4. Food Storage Recommendations:</h2>
      <p>4.1. Refrigeration: It is recommended to refrigerate any food intended for consumption within the next day or two.</p>
      <p>4.2. Freezing: For food intended to be consumed after two days, please freeze and defrost as needed.</p>

      <h2>5. Consumer Risk and Liability:</h2>
      <p>5.1. Consumption Risk: While Maaltijd maintains the highest standards in ingredients, food preparation, and handling, the consumption of Maaltijd products is at your own risk.</p>
      <p>5.2. Liability Disclaimer: Maaltijd will not be liable for any sickness or death resulting from the consumption of any Maaltijd product.</p>

      <h2>6. General Provisions</h2>
      <p>6.1 Intellectual Property: All content on the Maaltijd platform, including but not limited to text, graphics, logos, and images, is the property of Maaltijd and is protected by copyright and other intellectual property laws.</p>
      <p>6.2 Privacy Policy: Your use of the Services is also governed by our Privacy Policy.</p>
      <p>6.3 Modifications: Maaltijd reserves the right to modify, suspend, or terminate the Services or these Terms of Use at any time. Users will be notified of significant changes.</p>
      <p>6.4 Contact Information: For any inquiries or assistance, please contact us at <a href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a>.</p>

      <p>By using Maaltijd's Services, you agree to these Terms of Use. If you do not agree with any part of these terms, please refrain from using our Services.</p>
    </div>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseContact}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showPP} onHide={handleClosePP}>
        <Modal.Header closeButton>
          <Modal.Title>Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="privacy-policy">
  <h1>Privacy Policy for Maaltijd Food Ordering and Delivery Service</h1>
  <p>Last Updated: 30/01/2024</p>

  <p>
    Thank you for choosing Maaltijd for your food ordering and delivery needs.
    This Privacy Policy outlines how we collect, use, and protect your personal
    information in accordance with the Protection of Personal Information Act
    (POPIA) in South Africa.
  </p>

  <h2>1. Information We Collect</h2>

  <p>
    We collect the following personal information from users for the purpose of
    providing our food ordering and delivery services:
  </p>

  <ul>
    <li>
      Name and Surname: To personalize your experience and address you
      appropriately.
    </li>
    <li>Address: To facilitate the delivery of your food orders.</li>
    <li>Cellphone Number: To contact you for order updates and delivery purposes.</li>
    <li>Email Address: To communicate order confirmations, promotions, and other
      service-related information.</li>
  </ul>

  <h2>2. How We Use Your Information</h2>

  <p>
    We use the collected information solely for the purpose of delivering food
    orders to you and improving our services. Specifically, we may use your
    information for:
  </p>

  <ul>
    <li>Confirming and processing your food orders.</li>
    <li>Communicating order status, delivery updates, and promotions.</li>
    <li>Ensuring the accuracy and efficiency of our delivery services.</li>
  </ul>

  <h2>3. Information Security</h2>

  <p>
    We are committed to ensuring the security and confidentiality of your personal
    information. We implement reasonable security measures to protect against
    unauthorized access, disclosure, alteration, or destruction of your data.
  </p>

  <h2>4. Third-Party Services</h2>

  <p>
    We may use third-party services to facilitate aspects of our business, such
    as payment processing and delivery logistics. These third parties are
    required to adhere to privacy and data protection standards consistent with
    this Privacy Policy.
  </p>

  <h2>5. Your Consent</h2>

  <p>
    By using our website and services, you consent to the collection and use of
    your personal information as described in this Privacy Policy.
  </p>

  <h2>6. Contact Information</h2>

  <p>
    If you have any questions or concerns about our Privacy Policy or the
    handling of your personal information, please contact us at:
  </p>

  <ul>
    <li>Maaltijd</li>
    <li>15 Leivoorlaan,</li>
    <li>Potchefstroom, 2351</li>
    <li>Email: info@maaltijd.co.za</li>
  </ul>

  <h2>7. Changes to the Privacy Policy</h2>

  <p>
    We reserve the right to update and modify this Privacy Policy at any time.
    Any changes will be effective immediately upon posting the updated Privacy
    Policy on our website.
  </p>

  <h2>8. Governing Law</h2>

  <p>
    This Privacy Policy is governed by the laws of South Africa and is subject
    to the jurisdiction of South African courts.
  </p>

  <p>Thank you for choosing Maaltijd for your food ordering and delivery needs.</p>
</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePP}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showTerms} onHide={handleCloseTerms}>
        <Modal.Header closeButton>
          <Modal.Title>Terms of Use</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
      <h1>Maaltijd - Terms of Use</h1>
      <p>Thank you for choosing Maaltijd for your food ordering and delivery needs. By using our services, you agree to comply with the following Terms of Use:</p>

      <h2>1. Order Placement and Delivery Schedule:</h2>
      <p>1.1. Order Placement Deadline: Orders must be placed before 12:00 (noon) to qualify for next-day delivery.</p>
      <p>1.2. Delivery Days and Hours: Deliveries will be carried out from Monday to Friday between 08:00 and 17:00, and on Saturdays from 08:00 to 12:00. No deliveries will be made on Sundays.</p>

      <h2>2. Returns Policy:</h2>
      <p>2.1. Product Returns: Due to the nature of our products, we do not accept returns. However, if you believe a product does not meet our standards, please contact us at <a href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a> promptly. We will conduct an inspection and issue a refund for any sub-standard products. No refund will be provided if it is determined that the food's quality was affected by improper consumer handling.</p>

      <h2>3. Collection Responsibilities:</h2>
      <p>3.1. Address Accuracy: Please ensure that the provided delivery address is accurate and that someone is available to collect the food at the specified location.</p>
      <p>3.2. Collection Timeframe: Failure to collect the food within a reasonable timeframe will result in the order being considered as your loss. If the initial delivery is unsuccessful, we will attempt one additional free delivery on the next delivery day. Subsequent attempts will incur additional charges, and arrangements can be made via contact at <a href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a>.</p>

      <h2>4. Food Storage Recommendations:</h2>
      <p>4.1. Refrigeration: It is recommended to refrigerate any food intended for consumption within the next day or two.</p>
      <p>4.2. Freezing: For food intended to be consumed after two days, please freeze and defrost as needed.</p>

      <h2>5. Consumer Risk and Liability:</h2>
      <p>5.1. Consumption Risk: While Maaltijd maintains the highest standards in ingredients, food preparation, and handling, the consumption of Maaltijd products is at your own risk.</p>
      <p>5.2. Liability Disclaimer: Maaltijd will not be liable for any sickness or death resulting from the consumption of any Maaltijd product.</p>

      <h2>6. General Provisions</h2>
      <p>6.1 Intellectual Property: All content on the Maaltijd platform, including but not limited to text, graphics, logos, and images, is the property of Maaltijd and is protected by copyright and other intellectual property laws.</p>
      <p>6.2 Privacy Policy: Your use of the Services is also governed by our Privacy Policy.</p>
      <p>6.3 Modifications: Maaltijd reserves the right to modify, suspend, or terminate the Services or these Terms of Use at any time. Users will be notified of significant changes.</p>
      <p>6.4 Contact Information: For any inquiries or assistance, please contact us at <a href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a>.</p>

      <p>By using Maaltijd's Services, you agree to these Terms of Use. If you do not agree with any part of these terms, please refrain from using our Services.</p>
    </div>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTerms}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default UserProfilePage;
