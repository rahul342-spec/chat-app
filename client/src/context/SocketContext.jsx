import { userAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { useEffect, useContext, useRef, createContext, } from "react";
import { io } from "socket.io-client"

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext)
}
export const SocketProvide = ({ children }) => {
    const socket = useRef();
    const { userInfo } = userAppStore();
    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            });
            socket.current.on("connect", () => {
                console.log("Connect to socket server client")
            })

            const handleRecieveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage } = userAppStore.getState();

                if (selectedChatType !== undefined && selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id) {
                    console.log(message)
                    addMessage(message)
                }

            }

            socket.current.on("recieveMessage", handleRecieveMessage)

            return () => {
                socket.current.disconnect()
            }
        }

    }, [userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )

}