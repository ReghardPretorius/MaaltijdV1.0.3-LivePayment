import Hero from '../components/Hero';
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import products from "../assets/data/products";
import ProductCard from "../components/ProductCard";

import { useSelector } from 'react-redux';
 //import { useNavigate } from 'react-router-dom';

 import "../styles/home.css";
 import "../styles/background.css";
  

const HomeScreen = () => {

  const [pageNumber] = useState(0);
  const { userInfo } = useSelector((state) => state.auth);

  const searchedProduct = products;

  const productPerPage = 8;
  const visitedPage = pageNumber * productPerPage;
  const displayPage = searchedProduct.slice(
    visitedPage,
    visitedPage + productPerPage
  );
  return (
<div className={` ${!userInfo ? 'hero-background' : ''}`}>
    {userInfo ? (
      <div className="homelayout">
      <Container >
        <Row className='pl-1 pr-1 '>
          <div className="rowitem">
        <div className="home_card">
        {/* <div class="card-title">Special Offer!</div> */}
        <div className="card-content">Get Free Delivery when you order 3 or more items</div>
    </div>
    </div>
        </Row>
        <Row >
          {displayPage.map((item) => (
            <Col
              lg="3"
              md="4"
              sm="6"
              xs="6"
              key={item.id}
              className=" mt-4"
            >
              <ProductCard item={item} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
    ) : (
      <div className='welcomebanner'>
      <Hero />
      </div>
    )}
</div>
  );
  
  // return <Hero />;
};
export default HomeScreen;


