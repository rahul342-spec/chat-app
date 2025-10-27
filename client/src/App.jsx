import { BrowserRouter, Route, Routes } from "react-router-dom"
import Chat from "./pages/chat"
import Profile from "./pages/profile"
import Auth from "./pages/auth"
import { Navigate } from "react-router-dom"
import { userAppStore } from "./store"
import { useEffect, useState } from "react"
import { apiClient } from "./utils/api-client"
import { GET_USER_INFO } from "./utils/constants"

const PrivateRoute = ({ children }) => {
  const { userInfo } = userAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoute = ({ children }) => {
  const { userInfo } = userAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

const App = () => {
  const { userInfo, setUserInfo } = userAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        })
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data)
        } else {
          setUserInfo(undefined)
        }

      } catch (error) {
        setUserInfo(undefined)
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    if (!userInfo) {
      getUserData()
    } else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo])

  if (loading) {
    return <h2>Loading...</h2>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App