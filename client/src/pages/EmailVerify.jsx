import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {

	const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContent)
	const navigate = useNavigate()
	axios.defaults.withCredentials = true;
	const inputRefs = React.useRef([]);
	

	const handleInput = (e, index) =>{
		if(e.target.value.length > 0 && index < inputRefs.current.length -1){
			inputRefs.current[index + 1].focus();
		}
	}

	const handleKeyDown = (e, index) => {
		if(e.key === 'Backspace' && e.target.value === '' && index > 0){
			inputRefs.current[index - 1].focus();
		}
	}

	const handlePaste = (e) => {
		const paste = e.clipboardData.getData('text')
		const pasteArray = paste.split('');
		pasteArray.forEach((char, index)=>{
			if(inputRefs.current[index]){
				inputRefs.current[index].value = char;
		}
		}
	)}

	const onSubmitHandler = async (e) => {
		try {
			e.preventDefault();
			const otpArray = inputRefs.current.map(e => e.value);
			const otp = otpArray.join('');
	
			// Ensure backendUrl is valid
			if (!backendUrl) {
				throw new Error('Backend URL is not defined.');
			}
	
			const response = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });
			const data = response.data; // Ensure data is extracted properly
	
			if (data.success) {
				toast.success(data.message);
				getUserData();
				navigate('/');
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			// Handle errors properly
			const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
			toast.error(errorMessage);
		}
	};
	useEffect(()=>{
		isLoggedin && userData && userData.isAccountVerified && navigate('/')
	},[isLoggedin, userData])

  return (
	<div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
		<img onClick={()=>navigate('/')} src={assets.logo} alt=""  className='absolute left-5 sm: left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
		<form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
			<h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
			<p className='text-indigo-300 mb-6'>
				Enter the 6 digit code sent to your email-id.
			</p>
			<div className='flex justify-between mb-8' onPaste={handlePaste}>
  			{Array(6).fill(0).map((_, index) => (
    			<input
      			type='text'
      			maxLength='1'
      			key={index}
      			required
      			className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
      			ref={(el) => (inputRefs.current[index] = el)} // Assign the input element to the array
      			onInput={(e) => handleInput(e, index)} // Add the onInput handler separately
				onKeyDown={(e) => handleKeyDown(e, index)}
    			/>
  				))}
			</div>

				<button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
					Verify Email
				</button>
		</form>
		
	</div>
  )
}

export default Login