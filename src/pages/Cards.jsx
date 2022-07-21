import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import  Axios  from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";

export default function Cards() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [title,setTitle]=useState("");
  const [sapp,setSapp]=useState("");
  const [rating,setRating]=useState(0);
  const [review,setReview]=useState("");
  const [tvList, setTvList]=useState([]);
  const [newDetails,setNewDetails]=useState("");
  const addToList=()=>{
    Axios.post("http://localhost:4000/insert",{
      title: title,
      sapp: sapp,
      rating: rating,
      review: review,
    });
  };
  const updateDetails=(id)=>{
    Axios.put("http://localhost:4000/update",{
      id: id,
      newDetails: newDetails,
    });
  };
  const deleteDetails=(id)=>{
    Axios.delete(`http://localhost:4000/delete/${id}`);
  };
  useEffect(() => {
    Axios.get("http://localhost:4000/read").then((response)=>{
      setTvList(response.data);
    });
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else
          toast(`Hi ${data.user} 🦄`, {
            theme: "dark",
          });
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);

  const logOut = () => {
    removeCookie("jwt");
    navigate("/login");
  };
  return (
    <>
      <div className="private">
        <h1>Tv Shows</h1>
        <label>Title:</label>
        <input type="text" onChange={(event)=>{
            setTitle(event.target.value);
        }}/>
        <label>Streaming App:</label>
        <input type="text" onChange={(event)=>{
            setSapp(event.target.value);
        }}/>
        <label>Rating:</label>
        <input type="number" onChange={(event)=>{
            setRating(event.target.value);
        }}/>
        <label>Reviews:</label>
        <input type="text" onChange={(event)=>{
            setReview(event.target.value);
        }}/>
        <button onClick={addToList}>Add to List</button>
        <h1>Shows List</h1>
        {tvList.map((val,key)=>{
          return (
            <div className="tv">
          <div key={key}> 
            <h1>{val.title}</h1>
            <h1>{val.streamingApp}</h1>
            <h1>{val.rating}</h1>
            <h1>{val.review}</h1>
            <input type="text" placeholder="New details..." onChange={(event)=>{
            setNewDetails(event.target.value);
        }}/>
            <button onClick={()=>updateDetails(val._id)}> Update </button>
            <button onClick={()=>deleteDetails(val._id)}> Delete </button>
            </div>
            </div>
          );
        })}
        <button onClick={logOut}>Log out</button>
      </div>
      <ToastContainer />
    </>
  );
}