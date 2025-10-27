import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaPlus } from "react-icons/fa"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Lottie from "react-lottie"
import { animationDefaultOptions } from "@/utils/utils"
import { apiClient } from "@/utils/api-client"
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { HOST } from "@/utils/constants"
import { getColor } from "@/utils/utils"
import { userAppStore } from "@/store"


const NewDM = () => {
    const { setSelectedChatType, setSelectedChatData } = userAppStore();
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([])

    const searchContacts = async (value) => {
        try {
            if (value.length > 0) {
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTES, { searchTerm: value }, { withCredentials: true })

                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts)
                }
            } else {
                setSearchedContacts([])
            }

        } catch (err) {
            console.log(err)
        }
    }

    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact)
        setSearchedContacts([])
    }

    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                        onClick={() => setOpenNewContactModal(true)} />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                    Select New Contact
                </TooltipContent>
            </Tooltip>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search Contacts"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>
{searchedContacts.length > 0 &&
                    <div className="h-[250px]">
                        <div className="flex flex-col gap-5">   {searchedContacts.map((contact) => (
                            <div onClick={() => selectNewContact(contact)} key={contact._id} className="flex gap-3 items-center cursor-pointer">
                                <div className="w-12 h-12 relative">
                                    <Avatar className="sm:h-9 sm:w-9 w-6 h-6 md:w-12 md:h-12 rounded-full overflow-hidden">
                                        {
                                            contact.image ?
                                                <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full bg-black" />
                                                :
                                                <div className={`uppercase sm:h-9 sm:w-9 w-6 h-6 md:w-12 md:h-12  md:text-lg sm:text-[16px] text-sm border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                    {contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()}
                                                </div>
                                        }
                                    </Avatar>
                                </div>
                                <div className="flex flex-col">
                                    <span>{contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email}</span>
                                    <span className="text-xs">{contact.email}</span>
                                </div>
                            </div>
                        ))}</div>
                    </div>
                    }
                    {
                        searchedContacts.length <= 0 &&
                        <div className='flex-1 mt-4 md:mt-0 md:flex flex-col justify-center items-center  duration-1000 transition-all'>
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={60}
                                width={60}
                                options={animationDefaultOptions}
                            />
                            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-xl sm:text-lg text-sm transition-all duration-300 text-center">
                                <h3 className="poppins-medium">
                                    HI <span className="text-purple-500">!</span> Search new <span className="text-purple-500">Contact.</span>
                                </h3>
                            </div>
                        </div>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewDM