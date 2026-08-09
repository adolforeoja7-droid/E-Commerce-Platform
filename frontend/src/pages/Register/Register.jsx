import { useState } from "react";
import "./Register.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../services/api";
 
function Register(){

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState (false);
  const [showConfirmPassword, setShowConfirmPassword] = useState (false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (firstname ==="") {
      alert ("Please Enter Your First Name");
      return;
    }

    if (lastname ==="") {
      alert ("Please Enter Your Last name");
      return;
    }

    if (username ===""){
      alert ("Please Put Your Username");
      return;
    }

    if (username.length < 3) {
      alert ("Username must be at least 3 characters");
      return;
    }

    if (email ===""){
      alert ("Please Enter Your Email");
      return;
    }

    if (!email.includes("@")){
      alert ("Please Include @");
      return;
    }

    if (password ==="") {
      alert ("Please Enter Your Password");
      return;
    }

    if (password.length < 8 ) {
      alert ("Password Must be atleast 8 Characters");
      return;
    }

    if (!/[0-9]/.test(password)) {
      alert ("Password Must Contain atleast one Number");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      alert ("Password Must Contain atleast one Upper Case Letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      alert ("Password Must Contain atleast one Lower Case Letter");
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      alert ("Password Must Contain atleast One Special Character");
      return;
    }

    if (confirmPassword ==="") {
      alert ("Please Confirm Your Password");
      return;
    }


    if (password !== confirmPassword) {
      alert ("Password Do not matched");
      return;
    }
    try {
  const response = await api.post("/register", {
    username,
    email,
    password,
  });

  alert(response.data.message);

  setUsername("");
  setEmail("");
  setPassword("");
  setConfirmPassword("");
  setFirstName("");
  setLastname("");

} catch (error) {
  console.error("Registration error:", error);

  alert(
    error.response?.data?.message ||
    "Registration failed. Please try again."
  );
}
  }

  return(
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>

      <div className="title">

      <h1>WELCOME TO</h1>
      <h2>SHOPSHERE</h2>
      <p>Create Your Account Now</p>

      </div>
      
      <div className="form-group"> 
            <label htmlFor="firstname">
            Firstname:
            </label>
           
           <input 
           type="text"
           id="firstname"
           placeholder="Put the Firstname"
           value={firstname} 
           onChange={(e) => setFirstName (e.target.value)}/>
           </div>

           <div className="form-group">
            <label htmlFor="lastname">
              Lastname:
              </label>

              <input 
              type="text"
              id="lastname"
              placeholder="Put the Lastname"
              value={lastname}
              onChange={(e) => setLastname (e.target.value)}/>
           </div>

      <div className="form-group">
        <label htmlFor="username">
        Username:
        </label>
        
        <input 
        type="text"
        id="username"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername (e.target.value)}/>
        </div>

      <div className="form-group">
        <label htmlFor="email">
          Email:
          </label>
      
      <input 
      type="email" 
      id="email"
      placeholder="Enter your Email"
      value={email}
      onChange={(e) => setEmail (e.target.value)}/>
      </div>

      <div className="form-group">
        <label htmlFor="password">
          Password:
          </label>

          <div className="password-container">
          
          <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword (e.target.value)}/>

          <button type="button"
          onClick={() => setShowPassword (!showPassword)}>
            {showPassword ? <FiEyeOff/> : <FiEye/>}
          </button>
           </div>
           </div>

           <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password:
              </label>

              <div className="password-container">

              <input 
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword (e.target.value)}/>

               <button type="button"
           onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FiEyeOff/> : <FiEye/> }
           </button>
           </div>
           </div>

           <button type="submit">
            Register
           </button>
    </form>
  
  );
}

export default Register;