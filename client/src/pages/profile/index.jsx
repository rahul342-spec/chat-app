import { userAppStore } from "@/store"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor, colors } from "@/utils/utils";
import { FaTrash, FaPlus } from "react-icons/fa"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/utils/api-client";
import { toast } from "sonner";
import { ADD_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE,HOST, REMOVE_PROFILE_IMAGE } from "@/utils/constants";

function Profile() {
  const { userInfo, setUserInfo } = userAppStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null)
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    image: null,
    hovered: false,
    color: 0,
  })

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFields({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
         image: userInfo.image ? `${HOST}/${userInfo.image}`:null,
        color: userInfo.color,
      })
    }

  }, [userInfo])

  const validateProfile = () => {
    if (!fields.firstName) {
      toast.error("First Name is required.");
      return false
    }
    if (!fields.lastName) {
      toast.error("Last Name is required.");
      return false
    }
    return true;
  }

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE, { firstName: fields.firstName, lastName: fields.lastName, color: fields.color }, { withCredentials: true });
        console.log(response)
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile update successfully.")
          navigate("/chat")
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleBackBtn = () => {
    if (userInfo.profileSetup) {
      navigate("/chat")
    } else {
      toast.error("Please setup profile.")
    }
  }

  const handleImageClick = () => {
    fileInputRef.current.click();
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });
      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image })
         toast.success("image updated successfully.")
      }
      // const reader = new FileReader();
      // reader.onload = ()=>{
      //   setFields({...fields,image:reader.result})
      // }
      // reader.readAsDataURL(file)
    }
  }

  const handleImageDelete = async (e) => {
      try{
 const response = await apiClient.delete(REMOVE_PROFILE_IMAGE,{ withCredentials: true });
 if(response.status === 200){
  setUserInfo({...userInfo,image:null})
   toast.success("image remove successfully.")
   setFields({...fields,image:null})
 }
      }catch(err){
         console.log(err)
      }
  }

  console.log(fields)
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleBackBtn}>
          <IoArrowBack className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-0 gap-5">
          <div className="h-full sm:w-32 w-20 md:w-48 md:h-48 relative flex items-center justify-center" onMouseEnter={() => setFields((pre) => ({ ...pre, ["hovered"]: true }))}
            onMouseLeave={() => setFields((pre) => ({ ...pre, ["hovered"]: false }))}>
            <Avatar className="sm:h-32 sm:w-32 w-20 h-20 md:w-48 md:h-48 rounded-full overflow-hidden">
              {
                fields.image ?
                  <AvatarImage src={fields.image} alt="profile" className="object-cover w-full h-full bg-black" />
                  :
                  <div className={`uppercase sm:h-32 sm:w-32 w-20 h-20 md:w-48 md:h-48 md:text-5xl sm:text-4xl text-3xl border-[1px] flex items-center justify-center rounded-full ${getColor(fields.color)}`}>
                    {fields.firstName ? fields.firstName.split("").shift() : userInfo.email.split("").shift()}
                  </div>
              }
            </Avatar>
            {
              fields.hovered &&
              <div onClick={fields.image ? handleImageDelete : handleImageClick} className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"> {
                fields.image ?
                  <FaTrash className="text-white md:text-3xl sm:text-2xl text-xl cursor-pointer" /> : <FaPlus className="text-white md:text-3xl sm:text-2xl text-xl cursor-pointer" />
              }
              </div>
            }
            {/* input file */}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .svg, .webp" />

          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col sm:gap-5 gap-4 text-white items-center justify-center">
            <div className="w-full">
              <Input placeholder="Email" type="email" disabled value={userInfo.email} className={"rounded-lg p-6 bg-[#2c2e3b] border-none"} />
            </div>
            <div className="w-full">
              <Input placeholder="First Name" type="text" value={fields.firstName} onChange={(e) => setFields((pre) => ({ ...pre, ["firstName"]: e.target.value }))} className={"rounded-lg p-6 bg-[#2c2e3b] border-none"} />
            </div>
            <div className="w-full">
              <Input placeholder="Last Name" type="text" value={fields.lastName} onChange={(e) => setFields((pre) => ({ ...pre, ["lastName"]: e.target.value }))} className={"rounded-lg p-6 bg-[#2c2e3b] border-none"} />
            </div>
            <div className="w-full flex md:gap-5 sm:gap-4 gap-3">
              {
                colors.map((color, ind) => (
                  <div className={`${color} md:h-8 md:w-8 sm:h-7 sm:w-7 h-6 w-6 rounded-full cursor-pointer transition-all duration-300 
                ${fields.color === ind ? "outline-white/80 outline-2" : ""}`} key={ind} onClick={() => setFields((pre) => ({ ...pre, ["color"]: ind }))}>

                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button className={'md:h-16 sm:h-13 h-11 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'} onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
      </div>

    </div>
  )
}

export default Profile