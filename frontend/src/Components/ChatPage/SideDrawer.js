import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Spinner, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { ChatState } from '../../ContextApi/ChatProvider';
import SearchListItems from './SearchListItems';


const SideDrawer = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()
    const toast = useToast();
    const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const searchUsers = async () => {
        if (!searchQuery) {
            toast({
                title: "Please Enter Search Query",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(`/api/user?search=${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });

            setSearchResults(data);
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error Occured, Try Again !",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
            return;
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);

            //to append new chat in ChatState's Chats
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);

            onClose();
            setSearchQuery('');
            setSearchResults([]);
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    return (
        <>
            <Tooltip label="Add User" hasArrow placement="right">
                <Button ref={btnRef} onClick={onOpen} m='0.8rem 0' colorScheme='teal' variant='ghost' borderRadius="50%" width="50%" _hover={{ bg: "#7D7C7C", color: "white" }} >
                    <PersonSearchIcon style={{ color: '#F1EFEF' }} />
                </Button>
            </Tooltip>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search Friends</DrawerHeader>

                    <DrawerBody >
                        <Box display="flex">
                            <Input
                                placeholder='Search Name or Email ...'
                                borderTopRightRadius="0"
                                borderBottomRightRadius="0"
                                outline="0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                isLoading={loading}
                                // colorScheme='blue'
                                borderTopLeftRadius="0"
                                borderBottomLeftRadius="0"
                                onClick={searchUsers}
                                backgroundColor='#191717'
                                color='#ffffff'
                                _hover={{ bg: '#7D7C7C', color: '#000000' }}
                            >
                                <SearchIcon />
                            </Button>
                        </Box>
                        <Box margin="5% 0">
                            {searchResults && searchResults.map((searchUser) => (
                                <SearchListItems
                                    key={searchUser._id}
                                    searchUser={searchUser}
                                    handleClick={() => accessChat(searchUser._id)}
                                />
                            ))}
                        </Box>
                    </DrawerBody>
                    <DrawerFooter display="flex" justifyContent="center">
                        {loadingChat &&
                            <Spinner
                                size='xl'
                                width='20'
                                height='20'
                                alignSelf='center'
                                margin='auto'
                            />
                        }
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer;