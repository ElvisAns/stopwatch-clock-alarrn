import { Link } from "react-router-dom";
export default function ErrorPage() {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>We are not able to serve what you are looking for, are you {<Link to='/'>lost?</Link>}</p>
    </div>
  );
}