import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Input } from "@/components/ui/input";
import { TabsContent, TabsTrigger, Tabs, TabsList } from "@radix-ui/react-tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "../../utils/api-client.js";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { userAppStore } from "@/store/index.js";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = userAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // 👈 loader state

  function validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  }

  const validateSignup = () => {
    if (!email?.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!validateEmail(email)) {
      toast.error("Email is invalid.");
      return false;
    }
    if (!password?.length) {
      toast.error("Password is required.");
      return false;
    }
    if (confirmPassword && password !== confirmPassword) {
      toast.error("Password and confirm password should be same.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateSignup()) return;
    try {
      setLoading(true);
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );

      if (response?.data?.user?.id) {
        setUserInfo(response.data.user);
        toast.success("Login Successful!");
        if (response.data.user.profileSetup) navigate("/chat");
        else navigate("/profile");
      } else {
        toast.error(response?.data?.message || "User not found");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateSignup()) return;
    try {
      setLoading(true);
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );

      if (response?.status === 201) {
        toast.success("Signup Successful!");
        setUserInfo(response.data.user);
        navigate("/profile");
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(error?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] w-[100w] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="sm:text-5xl text-3xl font-bold md:text-6xl">
                Welcome
              </h1>
              <img
                src={Victory}
                alt="Victory emoji"
                className="md:h-[100px] sm:h-[80px] h-[60px]"
              />
            </div>
            <p className="md:text-[16px] sm:text-sm text-xs font-medium text-center px-2">
              Fill in the details to get started with the best chat app!
            </p>
          </div>

          <div className="flex items-center justify-center w-full">
            <Tabs className="sm:w-3/4 w-[90%]" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full flex sm:mb-6 mb-5">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              {/* LOGIN TAB */}
              <TabsContent
                className="flex flex-col md:gap-5 gap-4"
                value="login"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full md:p-6 sm:p-5 p-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full md:p-6 sm:p-5 p-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="rounded-full md:p-6 sm:p-5 p-4 mt-1"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </TabsContent>

              {/* SIGNUP TAB */}
              <TabsContent
                className="flex flex-col md:gap-5 gap-4"
                value="signup"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full md:p-6 sm:p-5 p-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full md:p-6 sm:p-5 p-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full md:p-6 sm:p-5 p-4"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-full md:p-6 sm:p-5 p-4 mt-1"
                  onClick={handleSignup}
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Signup"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* IMAGE */}
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="loginImg" className="h-[700px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
