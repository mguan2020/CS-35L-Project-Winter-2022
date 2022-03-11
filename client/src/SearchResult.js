import "./SearchResult.css";


function SearchResult(props) {
  const numbers = props.list;
  const listItems = numbers.map((number) =>
  <li>{number}</li>);
  const t = props.term;
  const s = props.search;
return ( (s) ? (<div style={{backgroundColor: "skyblue"}} className="search-res">
  <h1>Here are the messages in this chatroom that contain the keyword: {t} </h1>
         <ul style={{color: "red"}}>{listItems}</ul>
</div>) : (<div></div>) );
  }



export default SearchResult;
