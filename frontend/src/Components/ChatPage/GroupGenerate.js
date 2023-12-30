import React, { useState } from 'react'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { ChatState } from '../../ContextApi/ChatProvider';
import SearchListItems from './SearchListItems';
import axios from 'axios';
import SelectedUserBadge from './SelectedUserBadge';


const GroupGenerate = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, chats, setChats } = ChatState();
    const [groupName, setGroupName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();


    const handleSearch = async (searchQuery) => {
        setSearch(searchQuery);

        if (!searchQuery) {
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(`/api/user?search=${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });

            setLoading(false);
            setSearchResults(data);

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

    const createGroup = async () => {
        if (!groupName || !selectedUsers) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `/api/chat/group`,
                {
                    name: groupName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setGroupName('');
            setSelectedUsers([]);
            setSearchResults([]);
        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        }
    }

    const addUserToGroupList = (userId) => {
        if (selectedUsers.includes(userId)) {
            toast({
                title: "User Already Selected!",
                status: 'info',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userId])
    }

    const deleteUser = (user) => {
        setSelectedUsers(
            selectedUsers.filter((sel) => sel._id !== user._id)
        )
    }


    return (
        <>
            <Tooltip label="Create Group" hasArrow placement="right">
                <Button onClick={onOpen} colorScheme='teal' variant='ghost' borderRadius="50%" width="50%" _hover={{ bg: "#7D7C7C", color: "white" }}>
                    <GroupAddIcon style={{ color: '#F1EFEF' }} />
                </Button>
            </Tooltip>

            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='2rem'
                        textTransform="capitalize"
                        display="flex"
                        justifyContent='center'
                    >
                        Create Group
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        width='100%'
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection="column"
                    >
                        <FormControl>
                            <Input
                                placeholder='Enter Group Name'
                                mb={3}
                                onChange={(e) => setGroupName(e.target.value)}
                                value={groupName}
                            />
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder='Enter Users for Group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {/* //rendering(showing) the already selected users names */}
                        <Box width="100%" display="flex" flexWrap="wrap">

                            {selectedUsers.map((user) => (
                                <SelectedUserBadge
                                    key={user._id}
                                    user={user}
                                    handleDelete={() => deleteUser(user)}
                                />
                            ))}
                        </Box>

                        {/* //searching users for including in group  */}
                        {
                            loading ? <div>loading</div> : (
                                searchResults?.slice(0, 4).map(searchUser => (
                                    <SearchListItems
                                        key={searchUser._id}
                                        searchUser={searchUser}
                                        handleClick={() => addUserToGroupList(searchUser)}
                                    />
                                ))
                            )
                        }

                    </ModalBody>

                    <ModalFooter>
                        <Button
                            backgroundColor='#191717'
                            color='#ffffff'
                            _hover={{ bg: '#7D7C7C', color: '#000000' }}
                            mr={3}
                            onClick={createGroup}
                        >
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupGenerate