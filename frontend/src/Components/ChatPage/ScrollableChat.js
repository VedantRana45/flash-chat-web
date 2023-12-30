import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from '../../ContextApi/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    // messages = all messages of user with one Friends 
    // m = last message 
    // i = index of last message 
    // userId = current login user's id

    const isSameSenderMargin = (messages, m, i, userId) => {
        // console.log(i === messages.length - 1);

        if (
            i < messages.length - 1 &&
            messages[i + 1].sender._id === m.sender._id &&
            messages[i].sender._id !== userId
        )
            return 33;
        else if (
            (i < messages.length - 1 &&
                messages[i + 1].sender._id !== m.sender._id &&
                messages[i].sender._id !== userId) ||
            (i === messages.length - 1 && messages[i].sender._id !== userId)
        )
            return 0;
        else return "auto";
    };

    const isSameSender = (messages, m, i, userId) => {
        return (
            i < messages.length - 1 &&
            (messages[i + 1].sender._id !== m.sender._id ||
                messages[i + 1].sender._id === undefined) &&
            messages[i].sender._id !== userId
        );
    };

    const isLastMessage = (messages, i, userId) => {
        return (
            i === messages.length - 1 &&
            messages[messages.length - 1].sender._id !== userId &&
            messages[messages.length - 1].sender._id
        );
    };

    const isSameUser = (messages, m, i) => {
        return i > 0 && messages[i - 1].sender._id === m.sender._id;
    };

    const getTimeStamp = (utcTime) => {
        const utcDate = new Date(utcTime);

        // Convert UTC time to IST (Indian Standard Time)
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const istDate = new Date(utcDate.getTime() + istOffset);

        // Format the date as 24-hour time in IST
        const istTime = istDate.toISOString().slice(11, 16);
        return istTime;
    }


    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip label={m.sender.firstName} placement="bottom-start" hasArrow>
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            )}
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#CCC8AA" : "#fefefe"}`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                            }}
                        >
                            {m.content}
                            <span
                                style={{ marginLeft: '0.7rem', fontSize: '0.7rem', color: "#191717", fontWeight: '500' }}
                            >{getTimeStamp(m.createdAt)}</span>
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat;