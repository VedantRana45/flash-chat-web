import React, { useState } from 'react'
import { ChatState } from '../../ContextApi/ChatProvider'
import SideBar from './SideBar';
import MyChats from './MyChats';
import ChatBox from './ChatBox';
import { Box } from '@chakra-ui/react';

const ChatPage = () => {
    const { user } = ChatState();

    //for updating the messages in realtime in chat box as well as mychats
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            {
                user &&
                <Box
                    display='flex'
                    justifyContent='space-between'
                    w="100%"
                    h="100%"
                    padding='1%'
                >
                    <SideBar />
                    <MyChats fetchAgain={fetchAgain} />
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </Box>
            }
        </div>
    )
}

export default ChatPage