"use client";

import Header from "@/components/Header";
import Head from "next/head";
import { useState, useEffect } from "react";
export default function Home() {
  // Sample stock data (you can replace this with your actual stock data)

  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState([
    // { _id: "64d69054aadd342db6552139", slug: "sneakers", quantity: "20" },
  ]);
  const [loadingaction, setLoadingaction] = useState(false);

  useEffect(() => {
    // Fetch products on load
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setProducts(rjson.products);
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    // setDropdown([]);
    if (value.length > 3) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      setDropdown(rjson.products);
      setLoading(false);
    } else {
      setDropdown([]);
    }
    // setQuery("")
  };

  const buttonAction = async (action, slug, initialquantity) => {
    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialquantity) + 1;
      console.log(newProducts[index].quantity);
    } else {
      newProducts[index].quantity = parseInt(initialquantity) - 1;
      console.log(newProducts[index].quantity);
    }
    setProducts(newProducts);

    let dropindex = dropdown.findIndex((item) => item.slug == slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action == "plus") {
      newDropdown[dropindex].quantity = parseInt(initialquantity) + 1;
      console.log(newDropdown[dropindex].quantity);
    } else {
      newDropdown[dropindex].quantity = parseInt(initialquantity) - 1;
      console.log(newDropdown[dropindex].quantity);
    }
    setDropdown(newDropdown);

    setLoadingaction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, initialquantity }),
    });
    let r = await response.json();
    console.log(r);
    setLoadingaction(false);
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        console.log("Product Added Succesfully");
        setAlert("Your Product has been Added!");
        setProductForm({});
      } else {
        console.log("Error Adding Product");
      }
    } catch (error) {
      console.log("Error: ", error);
    }

    const response = await fetch("/api/product");
    let rjson = await response.json();
    setProducts(rjson.products);
  };

  return (
    <>
      {/* <Head>
        <title>Sling Academy</title>
        <meta
          name="description"
          content="I hope this tutorial is helpful for you"
        />
      </Head> */}
      <Header />
      <div className="container mx-auto px-4 my-8">
        <div className="text-green-800 text-center">{alert}</div>
        <h1 className="mt-4 text-3xl font-semibold mb-6">Search a Product</h1>
        <div className="flex mb-2">
          <input
            // onBlur={() => {
            //   setDropdown([]);
            // }}
            onChange={onDropdownEdit}
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter product name"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-r-md">
            <option value="">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
        </div>
        {loading && (
          <div classname="flex justify-center items-center">
            <svg
              width="50px"
              height="50px"
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
              stroke="black"
            >
              <circle
                cx={25}
                cy={25}
                r={20}
                fill="none"
                strokeWidth={5}
                strokeDasharray="30 90"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        )}
        <div className="dropContainer absolute w-[75vw]  border-1  bg-purple-100 rounded-md">
          {dropdown.map((item) => {
            return (
              <div
                key={item.slug}
                className="container flex justify-between p-2 my-1"
              >
                <span className="slug">
                  {item.slug}({item.quantity} available for ₹{item.price})
                </span>
                <button
                  disabled={loadingaction}
                  onClick={() =>
                    buttonAction("minus", item.slug, item.quantity)
                  }
                  className="subtract cursor-pointer inline-block px-3 py-1 bg-purple-400 rounded-xl disabled:bg-purple-100"
                >
                  -
                </button>
                <span className="quantity mx-1">{item.quantity}</span>
                <button
                  disabled={loadingaction}
                  onClick={() => buttonAction("plus", item.slug, item.quantity)}
                  className="add cursor-pointer inline-block px-3 py-1 bg-purple-400 rounded-xl disabled:bg-purple-100"
                >
                  +
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="container mx-auto px-4 my-8">
        <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          {/* Add your product adding UI elements here */}
          <label className="block mb-2 font-medium">Product Name:</label>
          <input
            value={productForm?.slug || ""}
            onChange={handleChange}
            name="slug"
            type="text"
            id="productName"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter product name"
          />
          <label className="block mt-2 mb-2 font-medium">Quantity:</label>
          <input
            value={productForm?.quantity || ""}
            name="quantity"
            onChange={handleChange}
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter quantity"
          />
          <label className="block mt-2 mb-2 font-medium">Price:</label>
          <input
            value={productForm?.price || ""}
            name="price"
            onChange={handleChange}
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter price"
          />
          <button
            onClick={addProduct}
            type="submit"
            className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md "
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 my-8">
        <h1 className="mt-4 text-3xl font-semibold mb-6">
          Display Current Stock
        </h1>
        <div className="mt-4 w-full">
          <table className="border-collapse border border-gray-400 w-full">
            <thead>
              <tr className="bg-purple-300">
                <th className="p-2 border border-gray-400">Product Name</th>
                <th className="p-2 border border-gray-400">Quantity</th>
                <th className="p-2 border border-gray-400">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                return (
                  <tr key={product.slug}>
                    <td className="border px-4 py-2">{product.slug}</td>
                    <td className="border px-4 py-2">{product.quantity}</td>
                    <td className="border px-4 py-2">₹{product.price}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
