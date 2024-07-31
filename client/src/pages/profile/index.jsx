import { useAppStore } from '@/store';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { colors, getColor } from '@/lib/utils';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { DELETE_USER_PROFILE_IMAGE, UPDARE_USER_PROFILE, UPDATE_USER_PROFILE_IMAGE } from '@/utils/contants';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [image, setImage] = useState(userInfo.image || null);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

  // Local state for form fields
  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");
  const [email] = useState(userInfo.email || "");
  const [selectedColor, setSelectedColor] = useState(userInfo.color || 0);

  // Update local state when userInfo changes
  useEffect(() => {
    setFirstName(userInfo.firstName || "");
    setLastName(userInfo.lastName || "");
    setSelectedColor(userInfo.color || 0);
    setImage(userInfo.image || null);

  }, [userInfo]);

  const validateInput = () => {
    if (!firstName.length) {
      toast.info("Enter First Name");
      return false;
    }
    if (!lastName.length) {
      toast.info("Enter Last Name");
      return false;
    }

    // Check for leading spaces
    if (firstName.startsWith(' ') || lastName.startsWith(' ')) {
      toast.error("Name fields cannot start with a space.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (!validateInput()) return; // Do not proceed if validation fails

    const toastId = toast.info("Updating profile...", { duration: Infinity }); // Show info toast

    try {
      const response = await apiClient.post(UPDARE_USER_PROFILE, {
        firstName, lastName, color: selectedColor, email
      }, { withCredentials: true });

      if (response.status === 200 && response.data) {
        toast.success(response.data.message);
        setUserInfo({
          ...response.data.user
        });
        navigate("/chat");
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      toast.dismiss(toastId); // Dismiss the info toast
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append("profile-image", imageFile);

      const toastId = toast.info("Updating profile image...", { duration: Infinity }); // Show info toast

      try {
        const response = await apiClient.post(UPDATE_USER_PROFILE_IMAGE, formData, { withCredentials: true });

        if (response.status === 201 && response.data.image) {
          setUserInfo({ ...userInfo, image: response.data.image });
          toast.success(response.data.message);
          setImage(response.data.image); // Update image URL from server response
        }
      } catch (error) {
        console.error('Error updating profile image:', error);
        toast.error('Failed to update profile image.');
      } finally {
        toast.dismiss(toastId); // Dismiss the info toast
      }
    }
  };

  const handleDeleteImage = async () => {
    const toastId = toast.info("Deleting profile image...", { duration: Infinity }); // Show info toast

    try {
      const response = await apiClient.delete(DELETE_USER_PROFILE_IMAGE, { withCredentials: true });

      if (response.status === 200) {
        setImage(null);
        setUserInfo({ ...userInfo, image: null });
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting profile image:', error);
      toast.error(error.message);
    } finally {
      toast.dismiss(toastId); // Dismiss the info toast
    }
  };

  const getInitial = () => {
    if (image) return null; // If image is present, no need to show initials
    const nameInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const emailInitial = email ? email.charAt(0).toUpperCase() : '';
    return nameInitial || emailInitial;
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) navigate("/chat");
    else toast.error("Please setup profile.");
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:v-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl tl:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage src={image} alt="Profile" className="object-cover w-full h-full bg-black" />
              ) : (
                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                  {getInitial()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full ring-fuchsia-50"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? <FaTrash className="text-white text-3xl cursor-pointer" />
                  : <FaPlus className="text-white text-3xl cursor-pointer" />}
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .webp" />
          </div>

          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                readOnly
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
                  ${selectedColor === index ? "outline outline-white/20 outline-1" : ""}`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
