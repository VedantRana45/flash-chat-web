import React, { useState } from 'react'
import { ChatState } from '../../ContextApi/ChatProvider'
import { Avatar, Box, Button, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import SelectedUserBadge from './SelectedUserBadge';
import axios from 'axios';
import SearchListItems from './SearchListItems';


const GroupProfile = ({ fetchAgain, setFetchAgain, fetchAllMessages }) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();


    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/addUserGroup`,
                {
                    chatId: selectedChat._id,
                    userId: userToAdd._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    }

    const removeUser = async (userToremove) => {
        if (selectedChat.groupAdmin._id !== user._id && userToremove._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/removeGroupUser`,
                {
                    chatId: selectedChat._id,
                    userId: userToremove._id,
                },
                config
            );

            //if user who removing user is himself then previous chat should be displayed to him
            userToremove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchAllMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    }

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(
                `/api/chat/group`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            toast({
                title: "Group Name Updated Successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-left',
            });

        } catch (error) {

            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    }

    return (
        <>
            <Avatar
                size="md"
                cursor="pointer"
                name={selectedChat.chatName}
                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSawI0Uke3X9AvXTQm40-CxJJuqt363Efv-QPdH2jv-89LHv9L4AYj_rldWi0nHj6Fub_s&usqp=CAU"}
                onClick={onOpen}
                margin="0 2%"
                border="black"
            />
            <Text>{selectedChat.chatName.toUpperCase()}</Text>

            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='2rem'
                        textTransform="capitalize"
                        display="flex"
                        justifyContent='center'
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        width='100%'
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection="column"
                    >
                        <Image
                            borderRadius="50%"
                            boxSize="100px"
                            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSawI0Uke3X9AvXTQm40-CxJJuqt363Efv-QPdH2jv-89LHv9L4AYj_rldWi0nHj6Fub_s&usqp=CAU"}
                            name={selectedChat.chatName}
                        />

                        <Box
                            display='flex'
                            width='100%'
                            flexWrap='wrap'
                            pb={3}
                        >
                            {selectedChat.users.map((user) => (
                                <SelectedUserBadge
                                    key={user._id}
                                    user={user}
                                    handleDelete={() => removeUser(user)}
                                />
                            ))}
                        </Box>

                        <FormControl display='flex'>
                            <Input
                                placeholder='Enter new Group Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                value={groupChatName}
                            />
                            <Button
                                variant="solid"
                                backgroundColor='#191717'
                                color='#ffffff'
                                _hover={{ bg: '#7D7C7C', color: '#000000' }}
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder='Enter Users for Group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((user) => (
                                <SearchListItems
                                    key={user._id}
                                    searchUser={user}
                                    handleClick={() => handleAddUser(user)}
                                    value={search}
                                />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => removeUser(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupProfile