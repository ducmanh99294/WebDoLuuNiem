import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './components/route/routes';

// Khởi tạo QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Thời gian cache dữ liệu (5 phút)
      staleTime: 5 * 60 * 1000,
      // Tự động refetch khi window focus
      refetchOnWindowFocus: false,
      // Số lần thử lại khi query thất bại
      retry: 1,
    },
    mutations: {
      // Số lần thử lại khi mutation thất bại
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
};

export default App;