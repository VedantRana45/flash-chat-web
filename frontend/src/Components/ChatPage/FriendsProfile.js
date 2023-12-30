import { Box, Avatar, Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../ContextApi/ChatProvider'

const FriendsProfile = () => {
    const { user, selectedChat } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const friendUser = selectedChat.users[0]._id === user._id ? selectedChat.users[1] : selectedChat.users[0];
    const friendName = `${friendUser.firstName} ${friendUser.lastName}`;

    return (
        <Box display="flex" width="100%">
            <Avatar
                size="md"
                cursor="pointer"
                name={friendName}
                src={friendUser.pic}
                onClick={onOpen}
                margin="0 2%"
            />
            <Text >
                {friendName}
            </Text>

            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='2rem'
                        textTransform="capitalize"
                        display="flex"
                        justifyContent='center'
                    >
                        {friendName}
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
                            boxSize="180px"
                            src={friendUser.pic}
                            name={friendName}
                        />
                        <Text
                            fontSize="1.2rem"
                            margin="3% 0"
                        >
                            Email : {friendUser.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            backgroundColor='#191717'
                            color='#ffffff'
                            _hover={{ bg: '#7D7C7C', color: '#000000' }}
                            mr={3}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default FriendsProfile