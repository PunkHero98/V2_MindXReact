import { Link } from "react-router-dom";
import "./SliderTab.css";
const SliderTab = (props) => {
  return (
    <div className={props.className}>
      <Link to={props.link}>{props.children}</Link>
    </div>
  );
};

export default SliderTab;
