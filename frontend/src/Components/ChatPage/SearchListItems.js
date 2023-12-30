import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const SearchListItems = ({ searchUser, handleClick }) => {

    return (
        <Box
            onClick={handleClick}
            cursor="pointer"
            bg="#E8E8E8"
            _hover={{
                background: "#7D7C7C",
                color: "white",
            }}
            width="100%"
            display="flex"
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
        >
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={`${searchUser.firstName} ${searchUser.lastName}`}
                src={searchUser.pic}
            />
            <Box>
                <Text>{`${searchUser.firstName} ${searchUser.lastName}`}</Text>
                <Text fontSize="xs">
                    <b>Email : </b>
                    {searchUser.email}
                </Text>
            </Box>
        </Box>
    )
}

export default SearchListItems