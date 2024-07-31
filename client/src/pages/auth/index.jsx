import React, { useState } from 'react';
import Background from '../../assets/login2.png';
import Victory from '../../assets/victory.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '../../lib/api-client'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/contants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const Auth = () => {

    const navigate = useNavigate();

    const { setUserInfo } = useAppStore()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("");

    const validateUser = () => {
        if (!email.length) {
            toast.info("Email is requires!");
            return false;
        }
        if (!password.length) {
            toast.info("Password is requires!");
            return false;
        }

        if (password !== confirmPassword) {
            toast.info("Both Password doesn't match!");
            return false;
        }

        return true;
    }

    const handleLogIn = async () => {
        const toastId = toast.info('Logging in...', { duration: Infinity }); // Show info toast

        try {
            const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
            setUserInfo(response.data.user);

            if (response.data.user.profileSetup) {
                toast.success('Login successful!');
                navigate('/chat');
            } else {
                toast.success('Login successful!');
                navigate('/profile');
            }
        } catch (error) {

            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }

            toast.error(`Error: ${error.message}`);
        } finally {
            toast.dismiss(toastId); // Dismiss the info toast
        }
    }

    const handleSignUp = async () => {
        if (!validateUser()) return false;

        const toast = useToast(); // Initialize Sunner toast
        const toastId = toast.info('Signing up...', { duration: Infinity }); // Show info toast

        try {
            const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
            toast.success('Signup successful!');
            setUserInfo(response.data.user);

            if (response.status === 201) navigate('/profile');
        } catch (error) {

            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }

            toast.error(`Error: ${error.message}`);
        } finally {
            toast.dismiss(toastId); // Dismiss the info toast
        }
    }

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center">
            <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] ld:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome </h1>
                            <img src={Victory} alt='Victory Emoji' className='h-[100px]' />
                        </div>
                        <p className="font-medium text-center">
                            Fill in the details to get started with the best chat app!
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4" defaultValue="login">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger value="login"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                                >LogIn</TabsTrigger>
                                <TabsTrigger value="signup"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                                >SignUp</TabsTrigger>
                            </TabsList>
                            <TabsContent
                                className="flex flex-col  gap-5 mt-10"
                                value="login">
                                <Input placeholder="Email" type="email" className="rounded-full" p-6 value={email} onChange={(e) => setEmail(e.target.value)} />

                                <Input placeholder="Password" type="password" className="rounded-full" p-6 value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Button className="rounded-full p-6" onClick={handleLogIn}>LogIn</Button>
                            </TabsContent>

                            <TabsContent
                                className="flex flex-col  gap-5"
                                value="signup">
                                <Input placeholder="Email" type="email" className="rounded-full" p-6 value={email} onChange={(e) => setEmail(e.target.value)} />

                                <Input placeholder="Password" type="password" className="rounded-full" p-6 value={password} onChange={(e) => setPassword(e.target.value)} />

                                <Input placeholder="Confirm Password" type="password" className="rounded-full" p-6 value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)} />

                                <Button className="rounded-full p-6" onClick={handleSignUp}>SignUp</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex justify-center items-center">
                    <img src={Background} alt="backgroung" className="h-[700px]" />
                </div>
            </div>
        </div>
    )
}

export default Auth