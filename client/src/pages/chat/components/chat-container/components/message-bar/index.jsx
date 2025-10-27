import { useSocket } from "@/context/SocketContext";
import { userAppStore } from "@/store";
import { apiClient } from "@/utils/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr"
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = userAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  useEffect(() => {
    function handleClickOutSide(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    }
  }, [emojiRef])

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {
    if (!socket) {
      console.error("Socket is not connected");
      return;
    }
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      })
    }
       setMessage("");
  }

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, { withCredentials: true,onUploadProgress:data=>{
          setFileUploadProgress(Math.round((100*data.loaded) / data.total));
        } });
        console.log("response", response)
        if (response.status === 200 && response.data) {
          setIsUploading(false)
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            })
          }
        }

      }

    } catch (err) {
      setIsUploading(false)
      console.log(err)
    }
  }

  return (
    <div className='md:h-[10vh] sm:h-[8vh] h-[7vh] bg-[#1c1d25] flex justify-center items-center md:px-8 sm:px-5 px-2 md:mb-6 sm:mb-5 mb-3 md:gap-6 sm:gap-5 gap-3'>
      <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center md:gap-5 sm:gap-3 gap-2 md:pr-5 sm:pr-3 pr-2 '>
        <input type='text' className='flex-1 md:p-5 sm:p-4 p-[10px] bg-transparent rounded-md focus:border-none focus:outline-none' placeholder='Enter Message'
          value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={handleAttachmentClick} className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="md:text-2xl sm:text-xl text-lg" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
        <div className="relative">
          <button onClick={() => setEmojiPickerOpen(true)} className="text-neutral-500 mt-1 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
            <RiEmojiStickerLine className="md:text-2xl sm:text-xl text-lg" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker theme="dark" open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
          </div>
        </div>
      </div>
      <button onClick={handleSendMessage} className="bg-[#8417ff] rounded-md flex items-center justify-center md:p-5 sm:p-3 p-2 sm:py-0 py-3 hover:bg-[#741bda] focus:hover:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
        <IoSend className="md:text-2xl sm:text-xl text-lg" />
      </button>
    </div>
  )
}

export default MessageBar