import { Input, Button, Modal, FloatButton } from "antd";
import { SendOutlined, RedditOutlined } from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import Card from "./components/Card";
import { dataProducts } from "./data/data.js";

const apiKey = import.meta.env.VITE_APP_AI_API_KEY;

const HomeWork = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState(null);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredList = dataProducts.filter(
    (item) =>
      item.brand.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
  );

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

  return (
    <>
      <div className="relative w-full flex flex-col px-8">
        <Input
          placeholder="Search for a list"
          size="large"
          className="w-1/5"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="grid grid-cols-5 gap-20 mt-8">
          {filteredList.map((item) => (
            <Card
              brand={item.brand}
              description={item.description}
              price={item.price}
              deal={item.deal}
              key={item.id}
            />
          ))}
        </div>
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
    </>
  );
};

export default HomeWork;
