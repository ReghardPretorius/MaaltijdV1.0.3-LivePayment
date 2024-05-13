import Hero from '../components/Hero';
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import products from "../assets/data/products";
import ProductCard from "../components/ProductCard";

import { useSelector } from 'react-redux';
 //import { useNavigate } from 'react-router-dom';

 import "../styles/home.css";
  

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
<div className='homelayout'>
    {userInfo ? (
      <>
      <Container >
        <Row>
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
    </>
    ) : (
      <>
      <Hero />
      </>
    )}
</div>
  );
  
  // return <Hero />;
};
export default HomeScreen;


