import React, { useState, useEffect } from 'react';

// Default logo as a simple SVG placeholder
const DefaultLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#4CAF50" />
    <text x="50%" y="50%" fontSize="16" fill="#fff" textAnchor="middle" dominantBaseline="middle">S</text>
  </svg>
);

const ChatComponent: React.FC<{ productId: string; product: any; onClose: () => void }> = ({ productId, product, onClose }) => {
  const [chatList, setChatList] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);

  useEffect(() => {
    // Mock data for chat list (replace with API call in real scenario)
    const mockChats = [
      { id: '1', productId: productId, sender: 'SweetieMe_VN', message: 'Bạn nhắn _k4_th...', time: '21/03', messages: ['Xin chào!', 'Bạn cần hỗ trợ gì?'] },
      { id: '2', productId: productId, sender: 'Topick Global', message: '6.6 Good Price Fe...', time: '05/06', messages: ['Chào bạn!', 'Bạn cần hỗ trợ gì thêm?'] },
      { id: '3', productId: productId, sender: 'topic_fashion', message: 'Xin chào! Cảm ơn...', time: '21/03', messages: ['Cảm ơn bạn!', 'Đơn hàng đã giao.'] },
      { id: '4', productId: productId, sender: 'O_TW_O_Official', message: 'Kính chào quý kh...', time: '21/03', messages: ['Chào bạn!', 'Chúng tôi hỗ trợ 24/7.'] },
      { id: '5', productId: 'other-id', sender: 'khnhluypmh', message: 'shopee chat http...', time: '02/09/24', messages: ['Test message'] },
    ];
    const filteredChats = mockChats.filter(chat => chat.productId === productId);
    setChatList(filteredChats);
  }, [productId]);

  // Tính giá cuối cùng dựa trên product từ API
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
      height: '400px'
    }}>
      <div style={{
        width: '200px',
        borderRight: '1px solid #eee',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px' }}>
          <h4>Chat với Shopee Chat</h4>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
        </div>
        {chatList.length > 0 ? (
          chatList.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                backgroundColor: selectedChat?.id === chat.id ? '#f0f0f0' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <DefaultLogo />
              <div>
                <div style={{ fontWeight: 'bold' }}>{chat.sender}</div>
                <div>{chat.message}</div>
                <div style={{ color: '#888' }}>{chat.time}</div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ padding: '10px' }}>Bắt đầu trò chuyện ngay!</p>
        )}
      </div>
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {selectedChat ? (
          <>
            <div style={{ padding: '10px', border: '1px solid #eee', borderRadius: '5px', marginBottom: '10px' }}>
              <img src={productImage} alt={product?.name || 'Sản phẩm'} style={{ width: '50px', height: '50px', verticalAlign: 'middle', marginRight: '10px' }} />
              <span style={{ verticalAlign: 'middle' }}>{product?.name || 'Sản phẩm không xác định'}</span><br />
              <span style={{ color: '#888' }}>Hiển thị: {finalPrice.toLocaleString()} VND</span><br />
              <span style={{ color: '#888' }}>ID Đơn hàng: {productId}</span>
            </div>
            <div style={{ height: '250px', overflowY: 'auto' }}>
              {selectedChat.messages.map((msg: string, index: number) => (
                <div key={index} style={{ margin: '10px 0', padding: '5px 10px', background: '#e0f7fa', borderRadius: '5px', maxWidth: '70%', wordWrap: 'break-word' }}>
                  {msg}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
              <input type="text" placeholder="Nhập tin nhắn..." style={{ flex: 1, padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }} />
              <button style={{ padding: '5px 10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '5px' }}>Gửi</button>
            </div>
          </>
        ) : (
          <p style={{ padding: '10px' }}>Chọn một cuộc trò chuyện để bắt đầu.</p>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;

// import React, { useState, useEffect } from 'react';

// const DefaultLogo = () => (
//   <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <circle cx="20" cy="20" r="18" fill="#4CAF50" />
//     <text x="50%" y="50%" fontSize="16" fill="#fff" textAnchor="middle" dominantBaseline="middle">S</text>
//   </svg>
// );

// const ChatComponent: React.FC<{ productId: string; product: any; onClose: () => void }> = ({ productId, product, onClose }) => {
//   const [chatList, setChatList] = useState<any[]>([]);
//   const [selectedChat, setSelectedChat] = useState<any>(null);

//   useEffect(() => {
//     const mockChats = [
//       { id: '1', productId: productId, sender: 'SweetieMe_VN', message: 'Bạn nhắn _k4_th...', time: '21/03', messages: ['Xin chào!', 'Bạn cần hỗ trợ gì?'] },
//       { id: '2', productId: productId, sender: 'Topick Global', message: '6.6 Good Price Fe...', time: '05/06', messages: ['Chào bạn!', 'Bạn cần hỗ trợ gì thêm?'] },
//       { id: '3', productId: productId, sender: 'topic_fashion', message: 'Xin chào! Cảm ơn...', time: '21/03', messages: ['Cảm ơn bạn!', 'Đơn hàng đã giao.'] },
//       { id: '4', productId: productId, sender: 'O_TW_O_Official', message: 'Kính chào quý kh...', time: '21/03', messages: ['Chào bạn!', 'Chúng tôi hỗ trợ 24/7.'] },
//     ];
//     const filteredChats = mockChats.filter(chat => chat.productId === productId);
//     setChatList(filteredChats);
//   }, [productId]);

//   const finalPrice = product ? product.price - (product.price * (product.discount || 0)) / 100 : 0;
//   const productImage = product?.images?.length > 0 ? product.images[0].image : 'https://via.placeholder.com/50';

//   return (
//     <div style={{
//       fontFamily: 'Segoe UI, sans-serif',
//       position: 'fixed',
//       bottom: '90px',
//       right: '20px',
//       width: '620px',
//       backgroundColor: '#fff',
//       border: '1px solid #ddd',
//       borderRadius: '10px',
//       boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
//       zIndex: 1000,
//       display: 'flex',
//       height: '440px',
//       overflow: 'hidden'
//     }}>
//       {/* Sidebar */}
//       <div style={{
//         width: '220px',
//         borderRight: '1px solid #eee',
//         backgroundColor: '#fafafa',
//         overflowY: 'auto'
//       }}>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           borderBottom: '1px solid #eee',
//           padding: '15px 10px',
//           fontWeight: 'bold',
//           fontSize: '16px'
//         }}>
//           <span>Chat với Cửa hàng</span>
//           <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#888' }}>×</button>
//         </div>
//         {chatList.length > 0 ? (
//           chatList.map(chat => (
//             <div
//               key={chat.id}
//               onClick={() => setSelectedChat(chat)}
//               style={{
//                 padding: '12px 10px',
//                 borderBottom: '1px solid #eee',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 backgroundColor: selectedChat?.id === chat.id ? '#e6f7ff' : 'transparent',
//                 transition: 'background-color 0.3s'
//               }}
//               onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
//               onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedChat?.id === chat.id ? '#e6f7ff' : 'transparent'}
//             >
//               <DefaultLogo />
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontWeight: '600', fontSize: '14px' }}>{chat.sender}</div>
//                 <div style={{ fontSize: '13px', color: '#444' }}>{chat.message}</div>
//                 <div style={{ fontSize: '12px', color: '#888' }}>{chat.time}</div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p style={{ padding: '15px', fontSize: '14px' }}>Bắt đầu trò chuyện ngay!</p>
//         )}
//       </div>

//       {/* Chat Window */}
//       <div style={{ flex: 1, padding: '15px', display: 'flex', flexDirection: 'column' }}>
//         {selectedChat ? (
//           <>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               marginBottom: '15px',
//               padding: '10px',
//               border: '1px solid #ddd',
//               borderRadius: '8px',
//               backgroundColor: '#fafafa'
//             }}>
//               <img src={productImage} alt={product?.name || 'Sản phẩm'} style={{ width: '50px', height: '50px', borderRadius: '4px', marginRight: '10px' }} />
//               <div>
//                 <div style={{ fontWeight: 'bold' }}>{product?.name || 'Sản phẩm không xác định'}</div>
//                 <div style={{ fontSize: '13px', color: '#888' }}>Giá: {finalPrice.toLocaleString()} VND</div>
//                 <div style={{ fontSize: '12px', color: '#aaa' }}>ID sản phẩm: {productId}</div>
//               </div>
//             </div>
//             <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
//               {selectedChat.messages.map((msg: string, index: number) => (
//                 <div key={index} style={{
//                   margin: '8px 0',
//                   padding: '10px 14px',
//                   background: '#e0f7fa',
//                   borderRadius: '15px',
//                   maxWidth: '75%',
//                   fontSize: '14px',
//                   color: '#333',
//                   alignSelf: 'flex-start'
//                 }}>
//                   {msg}
//                 </div>
//               ))}
//             </div>
//             <div style={{ display: 'flex', marginTop: '10px', gap: '8px' }}>
//               <input type="text" placeholder="Nhập tin nhắn..." style={{
//                 flex: 1,
//                 padding: '10px',
//                 border: '1px solid #ccc',
//                 borderRadius: '20px',
//                 fontSize: '14px'
//               }} />
//               <button style={{
//                 padding: '10px 16px',
//                 background: '#ff4d4f',
//                 color: '#fff',
//                 border: 'none',
//                 borderRadius: '20px',
//                 fontWeight: 'bold',
//                 cursor: 'pointer'
//               }}>Gửi</button>
//             </div>
//           </>
//         ) : (
//           <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginTop: '40%' }}>Chọn một cuộc trò chuyện để bắt đầu.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatComponent;
