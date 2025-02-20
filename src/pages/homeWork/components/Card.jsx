import { Button, Tag, Divider } from "antd";
import labelPhoto from "../photo/Frame.png";
import arrow from "../photo/arrow.png";
import { HeartOutlined } from "@ant-design/icons";
const Card = ({ brand, description, price, deal }) => {
  return (
    <>
      <div className="w-[310px] h-[416px] flex flex-col justify-between items-center py-4 rounded-lg border border-stone-300">
        <div className="w-[192px] h-[132px]">
          <img
            src="https://cdnphoto.dantri.com.vn/COm1qksauO2sqAC-gVVI2DdH_1I=/thumb_w/1020/2023/01/24/khoa-hocdocx-1674520013659.png"
            alt=""
          />
          <img src="" alt="" />
        </div>
        <div className="w-[192px] h-[73px] overflow-hidden flex flex-col ">
          <h4 className="text-[20px]">{brand}</h4>
          <p className="text-[16px]">{description}</p>
        </div>
        <div className="flex flex-col w-full text-left px-4">
          <div className="flex gap-6">
            <h4 className="text-[16px]">{price}</h4>
            {brand === "Apple" && <Tag color="default">35% Off</Tag>}
          </div>
          <Divider className="bg-slate-500"></Divider>
          <img src={labelPhoto} alt="" />
        </div>
        <div className="flex gap-20">
          <Button variant="solid" color="green">
            {deal} <img src={arrow} alt="" />{" "}
          </Button>
          <Button shape="circle" variant="outlined" color="green">
            <HeartOutlined />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Card;
