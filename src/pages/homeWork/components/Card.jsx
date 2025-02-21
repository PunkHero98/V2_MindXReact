import { Button, Tag, Divider } from "antd";
import labelPhoto from "../photo/Frame.png";
import arrow from "../photo/arrow.png";
import { useState } from "react";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Image } from "antd";
const Card = ({
  brand,
  description,
  price,
  imageItem,
  handleClickWlIcon,
  discountPercentage,
  imagess,
}) => {
  const [icon, setIcon] = useState(false);
  const [visible, setVisible] = useState(false);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  const handleClick = () => {
    handleClickWlIcon();
    setIcon((prev) => !prev);
  };
  const calculateFinalPrice = () => {
    if (!discountPercentage || discountPercentage <= 0) {
      return { original: null, final: price };
    }
    const discountAmount = (price * discountPercentage) / 100;
    const finalPrice = price - discountAmount;
    return { original: price, final: finalPrice };
  };
  const { original, final } = calculateFinalPrice();
  return (
    <>
      <div className="w-[310px] h-[616px] flex flex-col justify-between items-center py-4 rounded-lg shadow-lg cursor-pointer border">
        <div className="w-[192px]">
          {imagess.length > 1 ? (
            <>
              <Image
                src={imageItem}
                loading="lazy"
                className="cursor-pointer hover:opacity-80 transition duration-200"
                onClick={() => {
                  setVisible(true);
                }}
                preview={{ visible: false }}
              />
              {imagess.length > 0 && (
                <div className="hidden">
                  <Image.PreviewGroup
                    preview={{
                      visible: visible,
                      onVisibleChange: setVisible,
                    }}
                  >
                    {imagess.map((img, index) => (
                      <Image key={index} src={img} />
                    ))}
                  </Image.PreviewGroup>
                </div>
              )}
            </>
          ) : (
            <Image
              src={imageItem}
              loading="lazy"
              onClick={() => setVisible(true)}
              preview={{ visible, onVisibleChange: setVisible, src: imagess }}
            />
          )}
        </div>

        <div className="h-[192px] overflow-hidden self-start px-4 flex flex-col ">
          <h4 className="text-[20px] mb-4 font-bold">{brand}</h4>
          <p className="text-[16px]">{description}</p>
        </div>
        <div className="flex flex-col w-full text-left px-4">
          <div className="flex gap-6 flex-wrap items-center">
            <div className="flex gap-2 items-center">
              {original && (
                <h4 className="text-[14px] font-bold line-through text-stone-400">
                  {formatCurrency(original)}
                </h4>
              )}
              <h4 className="text-[22px] font-bold">{formatCurrency(final)}</h4>
            </div>
            <Tag color="volcano-inverse">{discountPercentage}% Off</Tag>
          </div>
          <Divider className="bg-slate-500 my-2"></Divider>
          <img src={labelPhoto} alt="" />
        </div>
        <div className="flex gap-20">
          <Button variant="solid" color="green">
            View Deal <img src={arrow} alt="" />
          </Button>
          <Button
            onClick={handleClick}
            shape="circle"
            variant="outlined"
            color={icon ? "danger" : "green"}
          >
            {!icon ? (
              <HeartOutlined />
            ) : (
              <HeartFilled className="text-red-500 " />
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Card;
