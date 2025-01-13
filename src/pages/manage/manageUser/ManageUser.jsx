import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Input   } from 'antd';
import { SendOutlined } from '@ant-design/icons';
const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  // const [username, setUsername] = useState('User'); // Tên người dùng
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
    <div className='w-full h-[77vh] flex justify-between items-center'>
      <div className='w-1/3 h-full outline outline-blue-500 my-2 mr-2 ml-8 rounded-lg'>

      </div>
      <div className='w-full h-full flex flex-col justify-end pl-4 mr-8 outline rounded-lg outline-red-400'> 
        <div className='mb-10'>
          <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.username !== username ? 'text-left' : 'text-right mr-8'}`}
              >
                {msg.username !== username ? (
                  <>
                    <strong>{msg.username}: </strong>{msg.message}
                  </>
                ) : (
                  <>
                    {msg.message}: <strong>{msg.username}</strong>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '10px' }} className='pr-4'>
          {/* <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={{ width: '300px', padding: '10px', marginBottom: '10px' }}
          /> */}
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
