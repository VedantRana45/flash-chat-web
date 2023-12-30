import { Box, Button, Center, Tooltip } from '@chakra-ui/react'
import React from 'react';
import { ChatState } from '../../ContextApi/ChatProvider';
import LogoutIcon from '@mui/icons-material/Logout';
import UserModal from './UserModal';
import { useNavigate } from 'react-router-dom';
import SideDrawer from './SideDrawer';
import GroupGenerate from './GroupGenerate';

const SideBar = () => {
    const { user, selectedChat } = ChatState();
    const navigate = useNavigate();

    const logOutUser = () => {
        localStorage.removeItem("userInfo");
        navigate('/');
    }

    return (
        <>
            <Box
                display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
                width={{ base: "10%", md: "5%" }}
                backgroundColor="#191717"
                flexDirection="column"
                justifyContent="space-between"
                paddingBottom="0.8%"
                borderRadius="0.4rem"
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Center backgroundColor='#7D7C7C' padding="10% 0" width='100%' borderRadius='0.4rem'>
                        <UserModal user={user} />
                    </Center>

                    <SideDrawer />

                    <GroupGenerate />
                </Box>

                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Tooltip label="Log out" hasArrow placement="top">
                        <Button
                            _hover={{ bg: "#7D7C7C", color: "white" }}
                            variant='ghost'
                            borderRadius="50%"
                            width="50%"
                            onClick={logOutUser}
                        >
                            <LogoutIcon style={{ color: '#F1EFEF' }} />
                        </Button>
                    </Tooltip>
                </Box>
            </Box>
        </>
    )
}

export default SideBar