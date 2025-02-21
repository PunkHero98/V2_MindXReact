import { Input, Button, Modal, FloatButton } from "antd";
import {
  SendOutlined,
  RedditOutlined,
  Loading3QuartersOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import Card from "./components/Card";
// import { dataProducts } from "./data/data.js";

const apiKey = import.meta.env.VITE_APP_AI_API_KEY;

const HomeWork = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState(null);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [wishlistState, setWishlistState] = useState({});
  const [buttonWL, setButtonWL] = useState(false);
  const originalData = useRef([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetch("https://dummyjson.com/products");
        if (!result.ok) {
          setLoading(false);
          throw new Error("Fail to fetch data");
        }
        setLoading(false);
        const response = await result.json();
        originalData.current = response.products;
        setData(response.products);
      } catch (err) {
        setLoading(false);
        alert(err.message);
        return;
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredList =
    data.length > 0
      ? data.filter(
          (item) =>
            (item.brand &&
              item.brand.toLowerCase().includes(searchText.toLowerCase())) ||
            (item.description &&
              item.description.toLowerCase().includes(searchText.toLowerCase()))
        )
      : [];

  const handleSendMessage = async () => {
    const userMessage = inputRef.current.input.value.trim();
    if (!userMessage) {
      setInputValue("");
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    inputRef.current.input.value = "";
    setInputValue("");

    setMessages((prev) => [...prev, { sender: "bot", text: "loading..." }]);

    const botReply = await askGemini(userMessage);

    setMessages((prev) => [
      ...prev.slice(0, -1),
      { sender: "bot", text: botReply },
    ]);
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
      return;
    }
  };

  const handleClickWlIcon = (id) => {
    setWishlistState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const askGemini = async (message) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: message }] }],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.error) {
        console.error("Gemini API Error:", data.error.message);
        return "Xin lỗi, tôi không thể trả lời ngay bây giờ.";
      }

      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Không có phản hồi từ AI."
      );
    } catch (error) {
      console.error("Request failed:", error);
      return "Lỗi khi kết nối với AI.";
    }
  };
  useEffect(() => {
    if (buttonWL) {
      setData(originalData.current.filter((item) => wishlistState[item.id]));
    } else {
      setData(originalData.current);
    }
  }, [buttonWL, wishlistState]);

  const handleWishList = () => {
    setButtonWL((prev) => !prev);
  };
  return (
    <>
      <div className="relative w-full flex flex-col px-8">
        <div className="w-full flex gap-20">
          <Input
            placeholder="Search for a list"
            size="large"
            className="w-1/5"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            size="large"
            variant="solid"
            color={buttonWL ? "danger" : "primary"}
            onClick={handleWishList}
          >
            Wish List
          </Button>
        </div>

        {loading ? (
          <div className="w-full h-[60vh] flex justify-center items-center text-center gap-5 pacifico text-[#1677ff] text-4xl mt-8">
            <Loading3QuartersOutlined spin />
            <div className="flex space-x-1 text-4xl font-bold">
              {["L", "o", "a", "d", "i", "n", "g"].map((letter, index) => (
                <span
                  key={index}
                  className="animate-[bounce_1.5s_infinite] inline-block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        ) : filteredList.length > 0 ? (
          <div className="grid grid-cols-5 gap-20 mt-8">
            {filteredList.map((item) => (
              <Card
                key={item.id}
                brand={item.title}
                description={item.description}
                price={item.price}
                imageItem={item.thumbnail}
                discountPercentage={item.discountPercentage}
                handleClickWlIcon={() => handleClickWlIcon(item.id)}
                imagess={item.images}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-[65vh] flex flex-col justify-center items-center text-gray-500 text-lg">
            <InboxOutlined className="text-6xl mb-4" />
            <p>Your Wish List is currently empty!</p>
          </div>
        )}
      </div>

      <FloatButton
        type="primary"
        onClick={() => setOpenModal(true)}
        icon={<RedditOutlined />}
      />

      <Modal
        title="Chat Support"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <div className="w-full max-w-md mx-auto border rounded-2xl shadow-lg flex flex-col h-[40rem] bg-white">
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {msg.text === "loading..." ? (
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t flex items-center gap-2">
            <Input
              ref={inputRef}
              type="text"
              size="large"
              placeholder="Type a message..."
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              onKeyUp={handleEnter}
            />
            <Button
              onClick={handleSendMessage}
              className="text-gray-500 hover:text-blue-500"
              size="large"
            >
              <SendOutlined className="text-xl" />
            </Button>
          </div>
        </div>
      </Modal>
      <div className="bg-black w-full flex justify-between px-8 mt-10 text-white">
        <p>Copyright@huy-lam</p>
        <p>MindX</p>
      </div>
    </>
  );
};

export default HomeWork;
