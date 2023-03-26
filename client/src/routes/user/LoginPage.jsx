import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// My components
import { LoginForm } from "../../components/common/LoginForm";

// My css
import "../../css/common/login-page.css";

import logo from "../../assets/images/yuva_logo.png";
import { SERVER_ORIGIN } from "../../utilities/constants";

// todo: validation of creds on frontend side

///////////////////////////////////////////////////////////////////////////////////////////////////////////
const LoginPage = () => {
  const [creds, setCreds] = useState({ userId: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${SERVER_ORIGIN}/api/user/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creds),
      });

      const result = await response.json();
      console.log(response);

      setIsLoading(false);

      if (response.status >= 400 && response.status < 600) {
        if (response.status === 401) {
          if (
            !("areCredsInvalid" in result) ||
            result.areCredsInvalid === true
          ) {
            toast.error(result.statusText);
          }
        } else {
          toast.error(result.statusText);
        }
      } else if (response.ok && response.status === 200) {
        if ("token" in result) {
          const token = result.token;
          localStorage.setItem("token", token);
          navigate("/");
        }
      } else {
        // for future
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateCreds = (e) => {
    setCreds((prevCreds) => {
      const newCreds = { ...prevCreds, [e.target.name]: e.target.value };
      // console.log(newCreds);

      return newCreds;
    });
  };

  return (
    <div className="login-page-outer-div">
      <img src={logo} alt="yuva-big-logo" className="login-page-yuva-img"></img>

      <LoginForm
        role="user"
        userId={creds.userId}
        password={creds.password}
        onChange={updateCreds}
        onClick={handleSubmit}
        isBtnDisabled={isLoading}
      />
    </div>
  );
};

export default LoginPage;
