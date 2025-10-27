import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { userAppStore } from "@/store"
import { HOST, LOGOUT_ROUTE } from "@/utils/constants"
import { getColor } from "@/utils/utils"
import { FiEdit2 } from "react-icons/fi"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useNavigate } from "react-router-dom"
import { IoPowerSharp } from "react-icons/io5"
import { LogOut } from "lucide-react"
import { apiClient } from "@/utils/api-client"
import { toast } from "sonner"


const ProfileInfo = () => {
  const navigate = useNavigate();
  const { userInfo,setUserInfo } = userAppStore()
const logOut = async ()=>{
try{
  const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true});
  if(response.status === 200){
    setUserInfo(null)
    navigate("/auth");
  }
}catch(err){
console.log(err)
toast.error("Something went wrong.")
}
}
  return (
    <div className='absolute bottom-0 h-16 flex justify-between items-center md:px-10 sm:px-7 px-5 w-full bg-[#2a2b33]'>
      <div className='flex gap-3 items-center justify-center'>
        <div className="w-12 h-12 relative flex items-center justify-center">
          <Avatar className="sm:h-9 sm:w-9 w-6 h-6 md:w-12 md:h-12 rounded-full overflow-hidden">
            {
              userInfo.image ?
                <AvatarImage src={`${HOST}/${userInfo.image}`} alt="profile" className="object-cover w-full h-full bg-black" />
                :
                <div className={`uppercase sm:h-9 sm:w-9 w-6 h-6 md:w-12 md:h-12  md:text-lg sm:text-[16px] text-sm border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                  {userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift()}
                </div>
            }
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <Tooltip>
          <TooltipTrigger>
            <FiEdit2 onClick={() => navigate("/profile")} className="text-purple-500 text-xl font-medium" />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white">
            Edit Profile
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <IoPowerSharp onClick={logOut} className="text-red-500 text-xl font-medium" />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white">
           Logout
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export default ProfileInfo