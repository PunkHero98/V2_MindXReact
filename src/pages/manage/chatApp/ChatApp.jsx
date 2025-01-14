import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Input   } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import ChatContainer from '../../../components/chaterContainer/ChatContainer';
import './chatApp.css'
const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null); // Tạo ref cho container cuối cùng
const user = useSelector(state => state.user.user);

const username = user?.username || 'Guest';
  useEffect(() => {
    // Mở kết nối WebSocket
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
      // Kiểm tra nếu dữ liệu là một Blob
      if (event.data instanceof Blob) {
        const reader = new FileReader();

        reader.onloadend = () => {
          const decodedMessage = reader.result;
          console.log('Decoded message:', decodedMessage);
          
          // Cập nhật trạng thái messages với tin nhắn đã giải mã
          setMessages((prevMessages) => [
            ...prevMessages, 
            { username: 'Server', message: decodedMessage }
          ]);
        };

        reader.readAsText(event.data);
      } else {
        // Nếu dữ liệu là chuỗi hoặc kiểu khác, xử lý như thông thường
        setMessages((prevMessages) => [
          ...prevMessages,
          JSON.parse(event.data) // Dữ liệu là JSON có cả username và message
        ]);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setWs(socket);

    // Đảm bảo đóng kết nối khi component unmount
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (ws && message) {
      // Tạo dữ liệu tin nhắn (bao gồm username và message)
      const messageData = JSON.stringify({
        username,
        message
      });

      // Thêm tin nhắn của chính mình vào danh sách tin nhắn trước khi gửi
      setMessages((prevMessages) => [
        ...prevMessages,
        { username, message }
      ]);

      // Gửi tin nhắn đến WebSocket server
      ws.send(messageData);  

      // Reset input sau khi gửi tin nhắn
      setMessage('');
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className='w-full h-[75vh] pb-4 flex justify-between items-center'>
      <div className='w-1/3 h-full outline flex flex-col gap-4 px-4 py-8 overflow-y-scroll outline-blue-500 my-2 mr-2 ml-8 rounded-lg'>
        <ChatContainer />
        <ChatContainer />
        <ChatContainer />
        <ChatContainer />
      </div>
      <div className='w-full h-full flex flex-col justify-end pl-4 mr-8 outline rounded-lg outline-red-400'> 
        <div className='mb-10'>
          <div className='scroll-container' style={{ maxHeight: '600px', overflowY: 'scroll' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.username !== username ? 'text-left' : 'text-right mr-8'}`}
              >
                {msg.username !== username ? (
                  <>
                    <div className={` ${msg.username !== username ? 'justify-start' : 'justify-end '} flex gap-3 mt-5 items-center`}>
                      <img className='w-10 h-10 rounded-full' 
                      src="https://res.cloudinary.com/dvntykgtk/image/upload/v1736853642/ulgvf3obw6jhlfprm7hf.jpg" alt="" />
                      <strong>{msg.username}: </strong>{msg.message}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={` ${msg.username !== username ? 'justify-start' : 'justify-end '} flex gap-3 mt-5 items-center`}>
                        {msg.message}: <strong>{msg.username}</strong>
                        <img className='w-10 h-10 rounded-full'
                       src="https://res.cloudinary.com/dvntykgtk/image/upload/v1736853642/ulgvf3obw6jhlfprm7hf.jpg" alt="" />
                    </div>
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} /> 
          </div>
        </div>
        <div style={{ marginBottom: '10px' }} className='pr-4'>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className='w-full'
            size='large'
            onKeyUp={handleKeyDown}
            addonAfter={<SendOutlined onClick={handleSendMessage} className='text-blue-600'/>}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
