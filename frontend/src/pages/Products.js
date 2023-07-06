import React, { useContext, useEffect, useRef, useState } from "react";
import authContext from "../context/authContext";
import gql from 'graphql-tag'

export default function Products() {
  const [isCreating, setIsCreating] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const titleRef = useRef();
  const descRef = useRef();
  const priceRef = useRef();
  const globalUserContext = useContext(authContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const requestBody = {
      query: `
        query{
          products(user_id: "${globalUserContext.userId}") {
            title
            description
            price
          }  
        }
        `,
    };

    let data = await fetch(`http://localhost:8000/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer " + globalUserContext.token,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(data);

    data = await data.json();
    console.log(data);
    if (data.data.products.length > 0) setProducts(data.data.products);
    setLoading(false)

  };

  const toggleProductCreationHandler = () => {
    setIsCreating((prev) => {
      return !prev;
    });
    if(isCreating)
    getData();
  };

  const submitProductFormHandler = async (e) => {
    setLoading(true)
    e.preventDefault();

    const title = titleRef.current.value;
    const description = descRef.current.value;
    const price = priceRef.current.value;

    const requestBody = {
      query: `
        mutation {
            createProduct(productInput: {title:"${title}", description:"${description}", price:${price}, user_id: "${globalUserContext.userId}"}) {title, description, price}
        }
        `,

      // Other way of doing this -
      // query: gql`
      //   mutation createProduct($title: String!, $description: String!, $price: Float!, $user_id: String!){
      //       createProduct(productInput: {title: "$title", description: "$description", price: $price, user_id: "$user_id"}) {title, description, price} 
      //   }
      //   `,
      // variables: {
      //   title: title,
      //   description: description, 
      //   price: price,
      //   user_id: globalUserContext.userId
      // }
    };

    const token = globalUserContext.token;

    const product = await fetch(`http://localhost:8000/graphql`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer " + token,
      },
    });

    console.log(product);

    if (product.status != 200 && product.status != 201) {
      alert("Something happened but we couldnt process your request");
      return;
    }

    const jsonProductData = await product.json();
    toggleProductCreationHandler();
    setLoading(false)
  };

  return (
    <div>
      <p>Create your product listing here to be used for orders.</p>
      <button onClick={toggleProductCreationHandler}>Create Product</button>
      {isCreating && (
        <form onSubmit={submitProductFormHandler}>
          <label htmlFor="ptitle">Product Title</label>
          <input type="text" id="ptitle" ref={titleRef}></input>
          <label htmlFor="pdesc">Product Description</label>
          <input type="text" id="pdesc" ref={descRef}></input>
          <label htmlFor="pprice">Product Price</label>
          <input type="number" id="pprice" ref={priceRef}></input>
          <button type="reset" onClick={toggleProductCreationHandler}>
            Cancel
          </button>
          <button type="submit">Submit</button>
        </form>
      )}

      <h1>List of Products</h1>
      {!isLoading ? products.length > 0 ? (
        products.map((e) => {
          return (
            <div>
              <h1>{e.title}</h1>
              <p>{e.description}</p>
              <h2>{'₹' + e.price}</h2>
            </div>
          );
        })
      ) : (
        <h3>No Products Found</h3>
      ) : <p>Loading...</p>}
    </div>
  );
}
