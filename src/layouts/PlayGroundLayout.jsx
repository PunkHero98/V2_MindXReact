import SliderTab from "../components/sliderTab/SliderTab";
import { Outlet } from "react-router-dom";
const PlayGroundLayout = () => {
  const tabArray = [
    { link: "/playground/caro", name: "Caro" },
    { link: "/playground/chess", name: "Chess" },
  ];
  const tabClassName = "sliderTab w-full bg-stone-700 px-2  py-4";
  return (
    <div className="w-full h-[75vh] flex px-8 justify-between rounded-lg">
      <div className="slider flex flex-col outline outline-blue-300 w-1/12 rounded-l-lg bg-stone-400">
        {tabArray.map((item, index) => (
          <SliderTab
            key={Date.now() + index}
            className={tabClassName}
            link={item.link}
          >
            {item.name}
          </SliderTab>
        ))}
      </div>
      <div className="main w-11/12 outline outline-red-300">
        <Outlet />
      </div>
    </div>
  );
};

export default PlayGroundLayout;
