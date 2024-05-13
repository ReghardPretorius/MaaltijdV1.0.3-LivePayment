import "../styles/product-card.css";

// import productImg from "../../../assets/images/product_2.1.jpg";

import { useDispatch } from "react-redux";
import { cartActions } from "../slices/cartSlice";
import { BsPlus, BsDash, BsTrash } from 'react-icons/bs';

import { Link } from "react-router-dom";

const ProductCard = (props) => {
  const { id, title, image01, price, extraIngredients } = props.item;
  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        id,
        title,
        image01,
        price,
        extraIngredients
      })
    );
  };

  return (
    <div className="product__item d-flex flex-column justify-content-between">
      <div className="product__content">
        <img className="product__img w-100" src={image01} alt="Pizza" />
      <div className='meal_name'>
          {/* <Link to={`/meals/${id}`}>{title}</Link> */}
          <span>{title}</span>
          </div>
      </div>
      {/* <div className="d-flex flex-column align-items-center justify-content-between"> */}
      <div className="d-flex align-items-center justify-content-between">  
        <span className="product__price"> R {price}</span>
        <button className="addTOCART__btn" onClick={addToCart}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <BsPlus />
  </div>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;