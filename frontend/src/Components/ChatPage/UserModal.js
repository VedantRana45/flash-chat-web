import { Avatar, Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import UpdateUser from './UpdateUser';

const UserModal = ({ user }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const userName = user.firstName + " " + user.lastName;

    return (
        <>
            <Avatar
                size="md"
                cursor="pointer"
                name={userName}
                src={user.pic}
                onClick={onOpen} />

            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='2rem'
                        textTransform="capitalize"
                        display="flex"
                        justifyContent='center'
                    >
                        {userName}
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
                            src={user.pic}
                            name={userName}
                        />
                        <Text
                            fontSize="1.2rem"
                            margin="3% 0"
                        >
                            Email : {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>

                        <UpdateUser />

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
        </>
    )
}

export default UserModal