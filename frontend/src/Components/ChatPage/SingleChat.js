import React, { useEffect, useState } from 'react'
import { ChatState } from '../../ContextApi/ChatProvider'
import { Box, FormControl, IconButton, Image, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FriendsProfile from './FriendsProfile';
import GroupProfile from './GroupProfile';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import ChatLogo from '../../images/ChatLogo.png';

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat } = ChatState();
    // console.log(selectedChat);

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const toast = useToast();

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
    }, []);

    useEffect(() => {
        fetchAllMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                //sent notfication
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        })
    })

    const fetchAllMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {

            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");

                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                socket.emit('new message', data);
                setMessages([...messages, data]);

            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }

    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    }

    return (
        <>
            {selectedChat ? (
                <>
                    {/* chat title */}
                    <Box
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        width="100%"
                        display="flex"
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroup ? (
                            <>{/* // write see chat friends profile logic */}
                                <FriendsProfile />
                            </>
                        ) : (
                            // write Group chat Update functionality
                            <><GroupProfile fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchAllMessages={fetchAllMessages} /></>
                        )}
                    </Box>

                    {/* messages box */}
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        padding={3}
                        bg="#E8E8E8"
                        width="100%"
                        height="92%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size='xl'
                                width='20'
                                height='20'
                                alignSelf='center'
                                margin='auto'
                            />
                        ) : (
                            <Box
                                display='flex'
                                flexDirection='column'
                                overflowY='scroll'
                                style={{ scrollbarWidth: 'none' }}

                            >
                                <ScrollableChat messages={messages} />
                            </Box>
                        )}
                        <FormControl
                            onKeyDown={sendMessage}
                            id="first-name"
                            isRequired
                            mt={3}
                        >
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={typingHandler}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%" w='100%' backgroundColor='#F1EFEF' >

                    <Image
                        borderRadius="5%"
                        boxSize="350px"
                        src={ChatLogo}
                    />
                </Box>
            )}
        </>
    )
}

export default SingleChat