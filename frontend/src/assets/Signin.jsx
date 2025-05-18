import { useState } from "react";
import axios from 'axios';

function Signin()
{
    const [email, setEmail] = useState('');
    const [password, setPassWord] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        
        //basic validation
        if(!email|| !password)
        {
            setError('All fields are required');
            setMessage('');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email))
        {
            setError('Invalid email address');
            setMessage('');
            return;
        }

        if(password.length<8)
        {
            setError('Password must be atleast 8 characters long');
            setMessage('');
            return;
        }
        
        const userData = { email, password };
        async function userLogin(userData) {
        try{
            const responce = await axios.post("http://localhost:3000/user/signin",userData);
            setMessage(responce.data.message);
            setEmail('');
            setPassWord('');
        }catch(error) {
            console.log(error);
            if (error.response) {
              setError(error.response.data.message || 'Signup failed');
            } else {
              setError('Network error. Please try again.');
            }
            setMessage('');
            }
        }   

        userLogin(userData);
    }



    // email,password,firstName,lastName
    return <div>
        welcome to the course buying application
        <br/><br/>
        <form onSubmit={handleSubmit}>
            <lable>
                Email: <input input="text" value={email} placeholder="username@gmail.com"  onChange={(e)=>setEmail(e.target.value)}/>
            </lable><br/><br/>
            <lable>
                Password: <input type="password" value={password} placeholder="*********" onChange={(e)=>setPassWord(e.target.value)}/> 
            </lable><br/><br/>
            <button type="submit">
                Sign-In
            </button>
        </form> 
        {error && <p style={{color:'red'}}>{error} </p>}
        {message && <p style={{color: 'green'}}>{message}</p>}
    </div>
}

export default   Signin