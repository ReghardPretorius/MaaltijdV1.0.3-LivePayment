import React, { useRef, useEffect } from 'react';

const ScrollToTopInput = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleInputClick = () => {
      if (window.innerWidth <= 768) { // Assuming mobile view is up to 768px wide
        window.scrollTo({
          top: inputRef.current.offsetTop,
          behavior: 'smooth',
        });
      }
    };

    const inputElement = inputRef.current;
    inputElement.addEventListener('click', handleInputClick);

    return () => {
      inputElement.removeEventListener('click', handleInputClick);
    };
  }, []);

  return (
    <input
      type="text"
      name="searchAddress"
      placeholder="Search for a location"
      id="searchInput"
      required
      className="form-control"
      ref={inputRef}
    />
  );
};

export default ScrollToTopInput;
