import { userAppStore } from "@/store"
import { RiCloseFill } from "react-icons/ri"
import { Avatar,AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/utils/utils";

const ChatHeader = () => {
    const {closeChat,selectedChatData,selectedChatType} = userAppStore();
    return (
        <div className='md:h-[10vh] sm:h-[8vh] h-[7vh] border-b-2 border-[#2f303b] flex items-center justify-between md:px-20 sm:px-10 px-3 '>
            <div className='flex md:gap-5 sm:gap-3 items-center justify-between  w-full'>
                <div className='flex gap-3 items-center justify-center '>
                      <div className="w-12 h-12 flex justify-center items-center">
                                    <Avatar className="sm:h-9 sm:w-9 w-6 h-6 md:w-12 md:h-12 rounded-full overflow-hidden">
                                        {
                                            selectedChatData.image ?
                                                <AvatarImage src={`${HOST}/${selectedChatData.image}`} alt="profile" className="object-cover w-full h-full bg-black" />
                                                :
                                                <div className={`uppercase sm:h-9 sm:w-9 w-6 h-6 md:w-12 md:h-12  md:text-lg sm:text-[16px] text-sm border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                                                    {selectedChatData.firstName ? selectedChatData.firstName.split("").shift() : selectedChatData.email.split("").shift()}
                                                </div>
                                        }
                                    </Avatar>
                                </div>
                                <div>
                                    {
                                        selectedChatType ==="contact"  && selectedChatData.firstName?`${selectedChatData.firstName} ${selectedChatData.lastName}`
        : selectedChatData.email                            }
                                </div>
                </div>
                <div className='flex items-center justify-center gap-5'>
                    <button onClick={closeChat} className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
                    <RiCloseFill className="md:text-3xl text-2xl"/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader