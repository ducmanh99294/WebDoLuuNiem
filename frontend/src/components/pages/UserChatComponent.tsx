import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
interface Chat {
  _id: string;
  product: { _id: string; name: string; price: number; discount?: number; images?: { image: string }[] };
  messages: { sender: { _id: string; name: string }; content: string; timestamp: string; is_read: boolean }[];
  user: { _id: string; name: string }[];
}

interface UserChatComponentProps {
  productId: string;
  product: { _id: string; name: string; price: number; discount?: number; images?: { image: string }[] };
  onClose: () => void;
  userId: string;
}

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error('Please log in to continue');
    throw new Error('No token found');
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };
  const response = await fetch(`http://localhost:3000${url}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.message || `HTTP error! status: ${response.status}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
};

const UserChatComponent: React.FC<UserChatComponentProps> = ({ productId, product, onClose, userId }) => {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);
  const token = localStorage.getItem('token')


  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      auth: { token: localStorage.getItem('token') },
    });

    socketRef.current.emit('user_connected', userId);

    socketRef.current.on('receive-message', (newMessage) => {
      if (newMessage.session_id === selectedChat?._id) {
        setSelectedChat((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, newMessage],
              }
            : prev
        );
      }
      setChatList((prev) =>
        prev.map((chat) =>
          chat._id === newMessage.session_id
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      );
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error.message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, selectedChat?._id]);

  useEffect(() => {
  const fetchChats = async () => {
    try {
      const response = await fetchWithAuth(`/api/v1/chats?productId=${productId}&userId=${userId}&page=1&limit=10`);
      const data = await response.json();
      if (data.success) {
        setChatList(data.chats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats.');
    }
  };
  fetchChats();
}, [productId, userId]);

  useEffect(() => {
    if (selectedChat?._id) {
      socketRef.current?.emit('join-session', selectedChat._id);
    }
  }, [selectedChat?._id]);

  const sendMessage = async () => {
  if (!message.trim() || !selectedChat) return;

  try {
    const response = await fetchWithAuth('http://localhost:3000/api/v1/chats/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        chatId: selectedChat._id,
        content: message,
      }),
    });
    const data = await response.json();
    if (data.success) {
      // Lấy tin nhắn mới nhất từ response và cập nhật vào state
      const newMsg = data.chat.messages[data.chat.messages.length - 1];
      setSelectedChat((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMsg],
            }
          : prev
      );
      setChatList((prev) =>
        prev.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, newMsg] }
            : chat
        )
      );
      setMessage('');
    } else {
      toast.error(data.message || 'Gửi tin nhắn thất bại.');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Gửi tin nhắn thất bại. Vui lòng thử lại.');
  }
};

  const startNewChat = async () => {
  if (!userId || !productId) {
    toast.error('User ID or Product ID is missing');
    return;
  }
  try {
    const adminId = import.meta.env.VITE_ADMIN_ID;
    if (!adminId) {
      toast.error('Admin ID is not configured. Please contact support.');
      return;
    }
    const response = await fetchWithAuth('/api/v1/chats', {
      method: 'POST',
      headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
      body: JSON.stringify({ senderId: userId, recipientId: adminId, productId }),
    });
    const data = await response.json();
    if (data.success) {
      setChatList([...chatList, data.data]);
      setSelectedChat(data.data);
      toast.success('Chat created successfully!');
    } else {
      toast.error(data.message || 'Failed to create chat.');
    }
  } catch (error) {
    console.error('Error creating chat:', error);
    toast.error('Failed to create chat. Please try again.');
  }
};

  const finalPrice = product ? product.price - (product.price * (product.discount || 0)) / 100 : 0;
  const productImage = product?.images?.length > 0 ? product.images[0].image : 'https://via.placeholder.com/50';

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px',
      right: '20px',
      width: '600px',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
      display: 'flex',
      height: '400px',
    }}>
      <div style={{ width: '200px', borderRight: '1px solid #eee', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px' }}>
          <h4>Chat với Cửa hàng</h4>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>
            ×
          </button>
        </div>
        {chatList.length > 0 ? (
          chatList.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                backgroundColor: selectedChat?._id === chat._id ? '#f0f0f0' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
           
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  {chat.user.find((u) => u._id !== userId)?.name || 'Admin'}
                </div>
                <div>{chat.messages[chat.messages.length - 1]?.content || 'No messages'}</div>
                <div style={{ color: '#888' }}>
                  {new Date(chat.messages[chat.messages.length - 1]?.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '10px' }}>
            <p>Bắt đầu trò chuyện ngay!</p>
            <button onClick={startNewChat} style={{ padding: '5px 10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '5px' }}>
              Tạo chat mới
            </button>
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {selectedChat ? (
          <>
            <div style={{ padding: '10px', border: '1px solid #eee', borderRadius: '5px', marginBottom: '10px' }}>
              <img
                src={productImage}
                alt={product?.name || 'Sản phẩm'}
                style={{ width: '50px', height: '50px', verticalAlign: 'middle', marginRight: '10px' }}
              />
              <span style={{ verticalAlign: 'middle' }}>{product?.name || 'Sản phẩm không xác định'}</span>
              <br />
              <span style={{ color: '#888' }}>Hiển thị: {finalPrice.toLocaleString()} VND</span>
              <br />
              <span style={{ color: '#888' }}>ID Sản phẩm: {productId}</span>
            </div>
            <div style={{ height: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedChat.messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    margin: '5px 0',
                    padding: '5px 10px',
                    background: msg.sender._id === userId ? '#e0f7fa' : '#f0f0f0',
                    borderRadius: '5px',
                    maxWidth: '70%',
                    alignSelf: msg.sender._id === userId ? 'flex-end' : 'flex-start',
                    wordWrap: 'break-word',
                  }}
                >
                  <strong>{msg.sender.name}: </strong>
                  {msg.content}
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                    {msg.is_read && msg.sender._id !== userId && ' (Đã đọc)'}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                style={{ flex: 1, padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
              />
              <button
                onClick={sendMessage}
                style={{ padding: '5px 10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '5px' }}
              >
                Gửi
              </button>
            </div>
          </>
        ) : (
          <p style={{ padding: '10px' }}>Chọn một cuộc trò chuyện để bắt đầu.</p>
        )}
      </div>
    </div>
  );
};

export default UserChatComponent;