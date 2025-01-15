import { Link } from "react-router-dom";
import "./SliderTab.css";
import PropTypes from "prop-types";
const SliderTab = ({ className, link, children, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <Link className="pl-4" to={link}>{children}</Link>
    </div>
  );
};

export default SliderTab;

SliderTab.propTypes = {
  className: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}