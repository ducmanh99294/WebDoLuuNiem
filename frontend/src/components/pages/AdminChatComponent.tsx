import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

const DefaultLogo = () => (
  <img
    src="/images/default-avatar.png"
    alt="avatar"
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
    }}
  />
);

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface Message {
  _id: string;
  sender: { _id: string; name: string; email: string };
  content: string;
  timestamp: string;
  is_read: boolean;
}

interface Chat {
  _id: string;
  user: User[];
  product: { _id: string; name: string; price: number; discount?: number; images?: { image: string }[] } | null;
  messages: Message[];
}

interface AdminChatComponentProps {
  adminId: string;
  onClose: () => void;
}

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  const response = await fetch(`http://localhost:3001${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

const AdminChatComponent: React.FC<AdminChatComponentProps> = ({ adminId, onClose }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await fetchWithAuth('/api/v1/chats');
        if (data.success) {
          setChats(data.chats.filter(chat => chat.user.some(u => u._id === adminId)));
        }
      } catch (err) {
        console.error('Error fetching chats:', err);
      }
    };

    fetchChats();
  }, [adminId]);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001', {
      auth: { token: localStorage.getItem('token') },
    });

    socketRef.current.emit('user_connected', adminId);

    socketRef.current.on('receive-message', (msg: Message) => {
      if (selectedChat && selectedChat._id === msg._id) {
        setSelectedChat((prev) => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
      }
      setChats((prev) =>
        prev.map(chat =>
          chat._id === msg._id ? { ...chat, messages: [...chat.messages, msg] } : chat
        )
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedChat?._id]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    socketRef.current?.emit('join-session', chat._id);
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      const response = await fetchWithAuth(`/api/v1/chats/messages`, {
        method: 'POST',
        body: JSON.stringify({ chatId: selectedChat._id, content: message }),
      });
      const data = await response;
      if (data.success) {
        const newMsg = data.chat.messages[data.chat.messages.length - 1];
        setSelectedChat((prev) => prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev);
        setChats((prev) =>
          prev.map(chat =>
            chat._id === selectedChat._id ? { ...chat, messages: [...chat.messages, newMsg] } : chat
          )
        );
        setMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '50px',
        right: '20px',
        width: '800px',
        height: '500px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        display: 'flex',
        overflow: 'hidden',
        zIndex: 1000,
        fontFamily: 'sans-serif',
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: '250px',
          background: '#f5f5f5',
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            background: '#ff4d4f',
            color: '#fff',
            padding: '15px',
            fontWeight: 'bold',
            fontSize: '18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Cuộc trò chuyện</span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {chats.map((chat) => {
            const user = chat.user.find(u => u._id !== adminId);
            return (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  padding: '12px 15px',
                  cursor: 'pointer',
                  backgroundColor: selectedChat?._id === chat._id ? '#e6f7ff' : 'transparent',
                  borderBottom: '1px solid #eee',
                  transition: 'background 0.2s',
                }}
              >
                <DefaultLogo />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                    {user?.name || 'Người dùng'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content : 'Chưa có tin nhắn'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#fafafa',
        }}
      >
        {selectedChat ? (
          <>
            <div
              style={{
                padding: '15px',
                background: '#fff',
                borderBottom: '1px solid #ddd',
                fontWeight: 'bold',
                fontSize: '17px',
              }}
            >
              Chat với: {selectedChat.user.find(u => u._id !== adminId)?.name || 'Người dùng'}
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {selectedChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender._id === adminId ? 'flex-end' : 'flex-start',
                    maxWidth: '65%',
                    background: msg.sender._id === adminId ? '#d2f7e2' : '#ffffff',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    fontSize: '14px',
                  }}
                >
                  <strong>{msg.sender.name}:</strong> {msg.content}
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#999',
                      marginTop: '5px',
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                padding: '10px 15px',
                borderTop: '1px solid #ddd',
                background: '#fff',
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  marginLeft: '10px',
                  background: '#ff4d4f',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Gửi
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#666',
              fontSize: '16px',
            }}
          >
            Chọn cuộc trò chuyện để bắt đầu
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatComponent;