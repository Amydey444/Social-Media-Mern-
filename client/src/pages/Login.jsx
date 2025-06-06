

import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import {FaEye,FaEyeSlash} from 'react-icons/fa'
import axios from 'axios'
import { useDispatch } from 'react-redux';

import { userActions } from '../store/user-slice'

const Login = () => {
  const [userData,setUserData]=useState({email:"",password:""})
const[error,setError]=useState("")
const [showPassword,setShowPassword]=useState(false)
const navigate=useNavigate()
const dispatch=useDispatch()


//function to change user data
const changeInputHandler=(e)=>{
  setUserData(prevState => ({...prevState,[e.target.name]:e.target.value}))

}

//function to login user
const loginUser= async (e)=>{
  e.preventDefault();
  try{
     const response=await axios.post(`${import.meta.env.VITE_API_URL}/users/login`,userData);
     
     if (response.status === 200) {
        const user = response.data;  // ✅ clean reference
        dispatch(userActions.changeCurrentUser(user));
        localStorage.setItem("currentUser", JSON.stringify(user));  // ✅ use user, not response?.data
        navigate('/');
      }

  }catch(err){
    setError(err.response?.data?.message)
  }

}






  return (
    <section className="register">
      <div className="container register__container">
        <h2>Sign In</h2>
        <form onSubmit={loginUser}>
          {error && <p className="form__error-message">{error}</p>}
          <input type="text" name='email' placeholder='Email' onChange=
          {changeInputHandler} />
          <div className='password__controller'>
            <input type={showPassword ? "text":"password" } name='password' placeholder='Password'
            onChange={changeInputHandler}/>
            <span onClick={()=>setShowPassword(!showPassword)}>{showPassword ?<FaEyeSlash/> : <FaEye />}</span>
          </div>
          
          <p>Dont have an account? <Link to="/register">Sign up</Link></p>
          <button type="submit" className='btn primary'>Login</button>
        </form>
      </div>
    </section>

  )
}

export default Login

