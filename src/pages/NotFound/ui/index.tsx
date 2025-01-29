import { Div, Text } from "@components";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Div className="not-found-container">
      <Text as="h1">Sorry, the page you were looking for was not found.</Text>
      <Link to="/" className="link-button">
        Return to Home
      </Link>
    </Div>
  );
};

export default NotFound;
