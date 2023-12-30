import React, { useEffect, useState } from 'react'
import { ChatState } from '../../ContextApi/ChatProvider'
import axios from 'axios';
import { Avatar, Box, Spinner, Stack, Text, useToast } from '@chakra-ui/react';

const MyChats = ({ fetchAgain }) => {

    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        // console.log(user._id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);
            setChats(data);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        }
    };

    const getSender = (loggedUser, users) => {
        const userName = users[0]._id === loggedUser._id ? users[1] : users[0];
        return `${userName.firstName} ${userName.lastName}`;
    }

    const getSenderFull = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain])


    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            width={{ base: "90%", md: "30%" }}
            borderRadius="lg"
            borderWidth="1px"
            height="100%"
            border='1px solid #7D7C7C'
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                textAlign="center"
            >
                {`${user.firstName} ${user.lastName}`}
            </Box>
            <Box
                d="flex"
                flexDirection="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chatResult) => (
                            <Box
                                onClick={() => {
                                    setSelectedChat(chatResult)
                                }}
                                cursor="pointer"
                                bg={selectedChat === chatResult ? "#7D7C7C" : "#E8E8E8"}
                                color={selectedChat === chatResult ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chatResult._id}
                                display='flex'
                                alignItems='center'
                            >
                                <Avatar
                                    mr={3}
                                    size="md"
                                    cursor="pointer"
                                    name={chatResult.isGroup ? chatResult.chatName : getSender(loggedUser, chatResult.users)}
                                    src={chatResult.isGroup ?
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSawI0Uke3X9AvXTQm40-CxJJuqt363Efv-QPdH2jv-89LHv9L4AYj_rldWi0nHj6Fub_s&usqp=CAU"
                                        :
                                        getSenderFull(loggedUser, chatResult.users).pic
                                    }
                                />

                                <Box>
                                    <Text fontSize='1.2rem' fontWeight='600'>
                                        {chatResult.isGroup
                                            ? chatResult.chatName : getSender(loggedUser, chatResult.users)
                                        }
                                    </Text>
                                    {chatResult.latestMessage && (
                                        <Text fontSize="xs">
                                            <b>{chatResult.latestMessage.sender.firstName} : </b>
                                            {chatResult.latestMessage.content.length > 50
                                                ? chatResult.latestMessage.content.substring(0, 51) + "..."
                                                : chatResult.latestMessage.content}
                                        </Text>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    // <ChatLoading />
                    <Spinner size='xl' />
                )}
            </Box>
        </Box>
    )
}

export default MyChats