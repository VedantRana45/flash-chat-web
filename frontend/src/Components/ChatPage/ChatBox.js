import { Box } from '@chakra-ui/react'
import React from 'react'
import SingleChat from './SingleChat'
import { ChatState } from '../../ContextApi/ChatProvider'

const ChatBox = ({ fetchAgain, setFetchAgain }) => {

    const { selectedChat } = ChatState();

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            width={{ base: "100%", md: "65%" }}
            borderRadius="lg"
            border="1px solid #7D7C7C"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default ChatBox