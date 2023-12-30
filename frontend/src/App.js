import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import WelcomeUser from './Components/UserComponents/WelcomeUser';
import { Route, Routes } from 'react-router-dom';
import ChatPage from './Components/ChatPage/ChatPage';

function App() {

  return (
    <>

      <ChakraProvider>
        <Routes>
          <Route exact path='/chat' element={<ChatPage />} />
        </Routes>
      </ChakraProvider>

      <Routes>
        <Route exact path='/' element={<WelcomeUser />} />
      </Routes>

    </>
  );
}

export default App;
