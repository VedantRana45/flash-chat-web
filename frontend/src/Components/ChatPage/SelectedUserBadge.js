import { Badge, Tooltip } from '@chakra-ui/react'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';

const SelectedUserBadge = ({ user, handleDelete }) => {
    return (
        <Tooltip
            label="Tap to Delete"
            hasArrow
            placement='top'
        >
            <Badge
                px={1.5}
                py={0.5}
                borderRadius="lg"
                m={1}
                mb={2}
                variant="solid"
                fontSize={11}
                colorScheme="purple"
                backgroundColor='#CCC8AA'
                color='black'
                cursor="pointer"
                onClick={handleDelete}
                display='flex'
                alignItems='center'
            >
                {`${user.firstName} ${user.lastName}`}
                {/* {admin === user._id && <span> (Admin)</span>} */}
                <CloseIcon style={{ height: "1.2rem", padding: "0" }} />
            </Badge>
        </Tooltip>
    )
}

export default SelectedUserBadge