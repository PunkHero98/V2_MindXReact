import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Input } from 'antd';
import { FormOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import './chatApp.css';
import { Modal } from 'antd';
import { notification } from 'antd';
import { addConversation, getUser, updateUser } from '../../../services/apiHandle';

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userList, setUserList] = useState([]);
  const [currentConversationId , setCurrentConversationId] = useState(null);
  const [conversationList, setConversationList] = useState([]);

  const user = useSelector(state => state.user.user);
  const username = user?.username || 'Guest';

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8081');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = async (event) => {
      try {
        const text = await event.data.text(); // Chuyển Blob thành chuỗi
        const receivedData = JSON.parse(text);
        setMessages((prevMessages) => [
          ...prevMessages,
          { username: receivedData.username, message: receivedData.message }
        ]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchUser = async () => {
    try {
      const result = await getUser();
      if (result.success === false) {
        notification.error({
          message: "Error when fetching",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        return;
      }
      
      const newUserList = result.data
        .filter(users => users.username !== user.username)
        .map(users => ({
          username: users.username, 
          id: users._id,
          avatar: users.img_url,
      }));
      setUserList(newUserList);
      if(user.conversations.length){
        const newConversationList = user.conversations.map(conversation => ({
          id: conversation._id,
          participants: conversation.participants.filter(participant => participant.userId !== user._id),
          img_url: result.data.find(user => user._id === conversation.participants.find(participant => participant.userId !== user._id).userId).img_url,
          lastMessage: conversation.lastMessage,
          createdAt: conversation.createdAt,
        }));
        setConversationList(newConversationList);
      }
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
      return;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSendMessage = () => {
    if (ws && message) {
      const messageData = JSON.stringify({
        username,
        message
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { username, message }
      ]);

      ws.send(messageData);
      setMessage('');
    }
  };

  const createConversion = async (id , name) =>{
    try{
      const conversation = {
        type: "private",
        participants: [{userId: user._id, username: user.username}, {userId: id, username: name}],
        lastMessage: {},
        createdAt: new Date().toISOString(),
      }
      const result = await addConversation(conversation);
      if(result.success === false){
        notification.error({
          message: "Error when creating conversation",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        return;
      }
      setCurrentConversationId(result.data._id);
      updateUserConversation(result.data._id);
    }catch(err){
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
  }
}

  const updateUserConversation = async (conversationId) => {
    try {
      if (!user.conversations.some(conversation => conversation._id === conversationId)) {
        user.conversations.push({ _id: conversationId });
      }
      
      const result = await updateUser(user._id, user);
      if (result.success === false) {
        notification.error({
          message: "Error when updating conversation",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        return;
      }
      setIsModalVisible(false);
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
    }
  }

  const handleClick = async (id, name) => {
   await createConversion(id, name);
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
    <div className='w-full h-full flex gap-5 px-8'>
        <div className='w-1/5 h-[75vh] flex flex-col p-4 outline rounded-lg outline-[#1677ff] overflow-y-scroll scroll-container'>
          <div className='text-right'><FormOutlined className='cursor-pointer' onClick={()=>setIsModalVisible(true)} /></div>
          <div className='container'>
            {conversationList.length ?
              conversationList.map((conversation) => (

              <div key={conversation.id} className={`flex gap-3 items-center hover:bg-gray-400 p-2 rounded-lg cursor-pointer ${conversation.id === currentConversationId ? 'bg-gray-400': ""}`} onClick={()=>setCurrentConversationId(conversation.id)}>
                {conversation.img_url ? (
                  <img className='w-10 h-10 rounded-full' src={conversation.img_url} alt="" />
                ) : (
                  <UserOutlined />
                )}
                <strong>{conversation.participants[0].username}</strong>
              </div>
              )) : (
                <div className='text-center'>No conversation</div>
              )}
          </div>
        </div>
        <div className='w-4/5 h-[75vh] pb-4 flex flex-col justify-between items-center '>
          {/* Khung hiển thị tin nhắn */}
          <div className='w-full h-full flex flex-col justify-end p-4 outline rounded-lg outline-[#1677ff] overflow-y-scroll scroll-container'>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.username !== username ? 'text-left' : 'text-right'}`}>
                {msg.username !== username ? (
                  <div className="flex gap-3 mt-5 items-center">
                    <img className='w-10 h-10 rounded-full' 
                      src="https://res.cloudinary.com/dvntykgtk/image/upload/v1736853642/ulgvf3obw6jhlfprm7hf.jpg" 
                      alt="" />
                    <strong>{msg.username}: </strong>{msg.message}
                  </div>
                ) : (
                  <div className="flex gap-3 mt-5 items-center justify-end">
                    {msg.message} <strong>{msg.username}</strong>
                    <img className='w-10 h-10 rounded-full'
                      src="https://res.cloudinary.com/dvntykgtk/image/upload/v1736853642/ulgvf3obw6jhlfprm7hf.jpg" 
                      alt="" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập tin nhắn */}
          <div className='w-full p-4'>
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              size='large'
              onKeyDown={handleKeyDown}
              addonAfter={<SendOutlined onClick={handleSendMessage} className='text-blue-600' />}
            />
          </div>
        </div>
    </div>
    <Modal open={isModalVisible} onCancel={() => setIsModalVisible(false)}>
      <Input className='mt-7 mb-2' placeholder='Search....'/>
      <div className='user_container'>
          {userList.map((user) => (
            <div key={user.id} className='flex gap-3 items-center  hover:bg-gray-400 p-2 rounded-lg cursor-pointer' onClick={()=>handleClick(user.id, user.username)}>
              {user.avatar ? (
                <img className='w-10 h-10 rounded-full' src={user.avatar} alt="" />
              ) : (
                <UserOutlined />
              )}
              <strong>{user.username}</strong>
            </div>
          ))}
      </div>
    </Modal>
    </>
  );
};

export default ChatApp;
