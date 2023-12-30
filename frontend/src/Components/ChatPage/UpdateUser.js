import { Box, Button, Image, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { ChatState } from '../../ContextApi/ChatProvider'
import axios from 'axios'

const UpdateUser = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, setUser } = ChatState();
    const profilePicRef = useRef(null);
    const toast = useToast();

    const [updateData, setUpdateData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        pic: user.pic,
    })

    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [fileName, setFileName] = useState();
    const [displayImgUrl, setDisplayImgUrl] = useState(user.pic);

    const handleFileChange = (image) => {
        console.log(image.type);
        if (image === undefined) {
            toast({
                title: "Image is not Selected !",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            return;
        }

        setLoading(true);

        if (image.type === "image/jpeg" || image.type === "image/png") {
            setFileName(image.name);
            const data = new FormData();
            const uploadPreset = "chat-app";
            data.append("file", image);
            data.append("upload_preset", uploadPreset);
            data.append("cloud_name", "vedantrana");

            axios.post("https://api.cloudinary.com/v1_1/vedantrana/upload", data)
                .then(response => {
                    // setImgUrl(response.data.url.toString());
                    setUpdateData({
                        ...updateData,
                        pic: response.data.url.toString(),
                    });
                    setDisplayImgUrl(response.data.url.toString())
                    setLoading(false);
                })
                .catch((err) => {
                    // console.log(err);
                    toast({
                        title: "Image uploading Error !",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top-right",
                    });
                    setLoading(false);
                })
        } else {
            toast({
                title: "select jpeg/png only !",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setLoading(false);
            return;
        }
    }


    // function get click on Input fil through button click
    const handleButtonClick = () => {
        profilePicRef.current.click();
    }

    const handleUpdatedData = (e) => {
        const { name, value } = e.target;
        setUpdateData({
            ...updateData,
            [name]: value,
        })
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);

        try {

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.put('/api/user/', updateData, config);

            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setUpdateLoading(false);

            toast({
                title: "Profile updated successfully !",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            })

        } catch (error) {
            toast({
                title: "failed to update Profile",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            })
        }
    }

    return (
        <>
            <Button
                backgroundColor='#191717'
                color='#ffffff'
                _hover={{ bg: '#7D7C7C', color: '#000000' }}
                mr={3}
                onClick={onOpen}
            >
                Update Profile
            </Button>


            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='2rem'
                        textTransform="capitalize"
                        display="flex"
                        justifyContent='center'
                    >
                        Update Profile
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
                            boxSize="150px"
                            src={displayImgUrl}
                            name={`${user.firstName} ${user.lastName}`}
                            mb="1.5rem"
                        />
                        <Box>
                            <InputGroup>
                                <InputLeftAddon w='7rem'>First Name</InputLeftAddon>
                                <Input
                                    type='text'
                                    name='firstName'
                                    onChange={handleUpdatedData}
                                    value={updateData.firstName}
                                />
                            </InputGroup>
                            <InputGroup>
                                <InputLeftAddon w='7rem'>Last Name</InputLeftAddon>
                                <Input
                                    type='text'
                                    name='lastName'
                                    value={updateData.lastName}
                                    onChange={handleUpdatedData}
                                />
                            </InputGroup>
                            <InputGroup>
                                <InputLeftAddon w='7rem'>Email</InputLeftAddon>
                                <Input
                                    type='email'
                                    name='email'
                                    id='email'
                                    value={updateData.email}
                                    onChange={handleUpdatedData}
                                />
                            </InputGroup>

                            <InputGroup>
                                <InputLeftAddon w='7rem'>Profile Pic</InputLeftAddon>
                                <Button
                                    onClick={handleButtonClick}
                                    size="md"
                                    w='18rem'
                                    borderTopLeftRadius='0'
                                    borderBottomLeftRadius='0'
                                    isLoading={loading}
                                >
                                    {fileName ? (fileName.substring(0, 24) + '...') : 'Click to Select New Pic'}
                                </Button>
                                <input
                                    type="file"
                                    ref={profilePicRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileChange(e.target.files[0])}
                                />
                            </InputGroup>
                        </Box>

                    </ModalBody>

                    <ModalFooter>
                        <Button
                            backgroundColor='#191717'
                            color='#ffffff'
                            _hover={{ bg: '#7D7C7C', color: '#000000' }}
                            mr={3}
                            isLoading={updateLoading}
                            onClick={handleUpdateProfile}
                        >
                            Update
                        </Button>
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

export default UpdateUser;