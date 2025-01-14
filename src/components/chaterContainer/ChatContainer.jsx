import { Avatar } from "antd";
const ChatContainer = () =>{
    return (
        <div className="outline hover:outline-blue-500 outline-stone-200 rounded-lg flex justify-start gap-5 items-center p-4">
            {/* <img className="w-12 h-12 rounded-full"
            src="https://res.cloudinary.com/dvntykgtk/image/upload/v1736853642/ulgvf3obw6jhlfprm7hf.jpg" alt="" /> */}
            <Avatar size={64}  src={"https://res.cloudinary.com/dvntykgtk/image/upload/v1736853642/ulgvf3obw6jhlfprm7hf.jpg"} />
            <div className="flex flex-col ">
                <label className="roboto-slab-base">lam.huy1</label>
                <p>lam.huy1: Bạn còn ở đó không ?</p>
            </div>
        </div>
    )
}

export default ChatContainer;