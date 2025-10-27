export const createChatSlice = (set,get) =>({
selectedChatType:undefined,
selectedChatData:undefined,
selectedChatMessages:[],
directMessagesContact:[],
isUploading:false,
isDownloading:false,
fileUploadProgress:0,
fileDownloadProgress:0,
setIsUploading:(isUploading)=>set({isUploading}),
setFileUploadProgress:(fileUploadProgress)=>set({fileUploadProgress}),
setFileDownloadProgress:(fileDownloadProgress)=>set({fileDownloadProgress}),
setIsDownloading:(isDownloading)=>set({isDownloading}),
setSelectedChatType:(selectedChatType)=>set({selectedChatType}),
setSelectedChatData:(selectedChatData)=>set({selectedChatData}),
setSelectedChatMessages:(selectedChatMessages)=>set({selectedChatMessages}),
setDirectMessagesContacts:(directMessagesContact)=>set({directMessagesContact}),
closeChat:()=>set({selectedChatData:undefined,selectedChatType:undefined,selectedChatMessages:[],
}),
addMessage:(message)=>{
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
        selectedChatMessages:[
            ...selectedChatMessages,{
                ...message,
                recipient: selectedChatType === "channel"? message.recipient : message.recipient._id,
                sender: selectedChatType === "channel"? message.sender : message.sender._id,
            }
        ]
    })
}
})