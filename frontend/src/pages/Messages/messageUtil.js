import websocketService from "../../service/WebsocketService";

export const isContainChat = (chatList, recipient) => {
    const index = chatList.findIndex(
        (c) => c.recipient?.email === recipient?.email
    );
    return index !== -1;
};

export const isContainChatUser = (email, listChat) => {
    const index = listChat.findIndex((c) => c.recipient?.email === email);
    return index !== -1;
};

export const pushUpChatAndSetToUnread = (
    chatList,
    chatId,
    setUnread = false
) => {
    const chatIndex = chatList.findIndex((c) => c.id === chatId);
    if (chatIndex === -1) return chatList;

    const updatedChatList = [...chatList];
    if (setUnread) {
        updatedChatList[chatIndex] = {
            ...updatedChatList[chatIndex],
            read: false,
        };
    }
    const updateList = [
        updatedChatList[chatIndex],
        ...updatedChatList.slice(0, chatIndex),
        ...updatedChatList.slice(chatIndex + 1),
    ];
    return updateList;
};

export const SendMessage = async (
    recipientEmail,
    message,
    chatId,
    senderEmail
) => {
    if (!recipientEmail || !message) return;
    websocketService.sendMessage(`/app/chats/${recipientEmail}/messages`, {
        content: message,
        chatId,
        sender: {
            email: senderEmail,
        },
    });
};

export const updateReadChat = (chatList, chatId) => {
    const chatIndex = chatList.findIndex((c) => c.id === chatId);
    chatList[chatIndex].read = true;
    return chatList;
};
