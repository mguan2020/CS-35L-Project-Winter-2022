import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import "./SearchResult.css";


function SearchResult(props) {
  const [show,setShow] = useState(false);
  const numbers = props.list;
  const listItems = numbers.map((number) =>
  <li>{number}</li>);

return ( (true) ? (<div style={{backgroundColor: "skyblue"}} className="search-res">
         <ul style={{color: "red"}}>{listItems}</ul>
</div>) : (<div></div>) );
  }



export default SearchResult;
