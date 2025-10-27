import { userAppStore } from "@/store"
import { apiClient } from "@/utils/api-client";
import { GET_ALL_MESSAGE_ROUTE } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { HOST } from "@/utils/constants";
import {MdFolderZip} from "react-icons/md";
import {IoMdArrowRoundDown} from "react-icons/io"
import { IoCloseSharp } from "react-icons/io5";


const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatData,
    selectedChatType,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading
  } = userAppStore();

  const [showImg,setShowImg] = useState(false);
  const [imgUrl,setImgUrl] = useState(null);

  useEffect(() => {

    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGE_ROUTE, { id: selectedChatData._id },
          { withCredentials: true }
        );

        if (response?.data?.message) {
          console.log(response)
          setSelectedChatMessages(response.data.message)
        }
      } catch (err) {
        console.log(err)
      }
    }

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages()
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChatMessages])


const checkIfImage = (filePath)=>{
   const imageRegex = /\.(jpg|jpeg|png|gif|tiff|tif|webp|svg|ico|heic|heif)$/i;
   return imageRegex.test(filePath)
}

  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages?.map(message => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {
            showDate && <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          }
          {
            selectedChatType === "contact" && renderDMMessage(message)
          }
        </div>
      )
    })
  }

  const downloadFile = async(url) =>{
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`,{
      responseType:"blob",
      onDownloadProgress:(progressEvent)=>{
        const {loaded,total} = progressEvent;
        const percentCompleted = Math.round((loaded*100)/total);
        setFileDownloadProgress(percentCompleted);
      }
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download",url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0)
  }


  const renderDMMessage = (message) => (
    <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
      {
        message.messageType === "text" && (
          <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 "}  inline-block md:p-4 sm:p-2 p-1 round my-1 max-w-[90%] w-fit break-words rounded`}>
            {message.content}
          </div>
        )}
        {
          message.messageType === "file" &&   <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 "}  inline-block md:p-4 sm:p-2 p-1 round my-1  max-w-[90%] w-fit break-words rounded`}>
            {
              checkIfImage(message.fileUrl)? 
              <div className="cursor-pointer" onClick={()=>{setShowImg(true);setImgUrl(message.fileUrl)}}>
                  <img src={`${HOST}/${message.fileUrl}`} height={300} width={300}/>
              </div>
              :
              <div className="flex items-center justify-center md:gap-4 sm:gap-3 gap-2">
                <span className="text-white/80 md:text-2xl sm:text-xl text-lg bg-black/20 rounded-full"><MdFolderZip className=""/></span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span className="bg-black/20 md:p-2 p-1 md:text-2xl sm:text-xl text-lg rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={()=>downloadFile(message.fileUrl)}><IoMdArrowRoundDown/></span>
              </div>
            }
          </div>
        }
      <div className="text-[10px] text-gray-600 mb-1">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  )
  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 md:px-8 sm:px-6 px-4 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full'>{renderMessage()}
      <div ref={scrollRef} />
      {
        showImg && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
              <div>
                <img src={`${HOST}/${imgUrl}`}  className="h-[90vh] w-full bg-cover"/>
              </div>
              <div className="flex gap-5 fixed top-0 mt-5">
                <button className="bg-black/20 p-2 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={()=>downloadFile(imgUrl)}>
                  <IoMdArrowRoundDown/>
                </button>
                <button className="bg-black/20 p-2 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={()=>{setShowImg(false);setImgUrl(null)}}>
                  <IoCloseSharp/>
                </button>
              </div>
        </div>
      }
    </div>
  )
}

export default MessageContainer