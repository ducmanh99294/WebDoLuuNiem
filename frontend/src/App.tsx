// src/App.tsx
import React from 'react';
import AppRouter from './components/route/routes';

const App: React.FC = () => {
  return <AppRouter />;
};

export default App;
import './App.css'
import Header from './components/header'
import Home from './components/pages/homepage'
import Footer from './components/Fotter'

function App() {
  return (
    <>
      <Header />
      <br></br>
      <Home />
      <Footer />
    </>
  )
}

export default App
