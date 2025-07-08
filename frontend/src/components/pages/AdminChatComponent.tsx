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
  sender: { _id: string; name: string };
  content: string;
  timestamp: string;
  is_read: boolean;
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

  const response = await fetch(`http://localhost:3000${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response;
};

const AdminChatComponent: React.FC<AdminChatComponentProps> = ({
  adminId,
  onClose,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchWithAuth('/api/v1/users');
        const data = await res.json();
        const nonAdminUsers = data.data.filter(
          (user: User) => user._id !== adminId && user.role !== 'admin'
        );
        setUsers(nonAdminUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [adminId]);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      auth: { token: localStorage.getItem('token') },
    });

    socketRef.current.emit('user_connected', adminId);

    socketRef.current.on('receive-message', (msg: Message) => {
      if (
        msg.sender._id === selectedUser?._id ||
        msg.sender._id === adminId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedUser?._id]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    socketRef.current?.emit('join-session-direct', { userId: user._id });

    fetchWithAuth(`/api/v1/chats/history/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching message history:', err);
        setMessages([]);
      });
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const newMsg = {
      content: message,
      type: 'text',
      sender_id: adminId,
      receiver_id: selectedUser._id,
    };

    socketRef.current?.emit('send-message-direct', newMsg);
    setMessage('');
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
          <span>Người dùng</span>
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
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                padding: '12px 15px',
                cursor: 'pointer',
                backgroundColor:
                  selectedUser?._id === user._id ? '#e6f7ff' : 'transparent',
                borderBottom: '1px solid #eee',
                transition: 'background 0.2s',
              }}
            >
              <DefaultLogo />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  {user.email}
                </div>
              </div>
            </div>
          ))}
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
        {selectedUser ? (
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
              Chat với: {selectedUser.name}
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
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf:
                      msg.sender._id === adminId ? 'flex-end' : 'flex-start',
                    maxWidth: '65%',
                    background:
                      msg.sender._id === adminId
                        ? '#d2f7e2'
                        : '#ffffff',
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
            Chọn người dùng để bắt đầu chat
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatComponent;
