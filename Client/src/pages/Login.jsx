import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // <-- added for create account
  const [name, setName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect if already logged in
useEffect(() => {
  if (user) {
    navigate("/dashboard", { replace: true });
  }
}, [user, navigate]);
  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      // artificial delay for UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isRegister) {
       
        // Create Account 
        const res = await fetch("http://localhost:5000/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
  name: data.name,
  email: data.email,
  password: data.password,
}),
        });

        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message || "Failed to create account");

        alert("Account created successfully! You can now log in.");
        setIsRegister(false);
        setName("");
      } else {
        // Login
        await login(data.email, data.password);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || (isRegister ? "Create account failed" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? "Create Account" : "SmartAnalytics Login"}
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
 {/* add validation for sanittization of  ,name and pass, email */}
        <form onSubmit={handleSubmit(onSubmit)}>
 {isRegister && (
  <input
    type="text"
    placeholder="Name"
    className="w-full mb-2 p-3 border rounded-lg"
    {...register("name", {
      required: "Name is required",
      pattern: {
        value: /^[A-Za-z\s]+$/,
        message: "Name can only contain letters and spaces",
      },
      minLength: {
        value: 3,
        message: "Name must be at least 3 characters",
      },
    })}
  />
)}
  {errors.name && (
      <p className="text-red-500 text-sm mb-2">
        {errors.name.message}
      </p>
    )}
  


        <input
  type="email"
  placeholder="Email"
  className="w-full mb-1 p-3 border rounded-lg"
  {...register("email", {
    required: "Email is required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@(gmail\.com|rediffmail\.com|yahoo\.com)$/,
      message: "Only gmail.com, rediffmail.com, or yahoo.com allowed",
    },
  })}
/>

{errors.email && (
  <p className="text-red-500 text-sm mb-2">
    {errors.email.message}
  </p>
)}

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-2 p-3 border rounded-lg"
            {...register("password", {
              required: { value: true, message: "This field is required" },
              minLength: { value: 5, message: "Password should be minimum of 5 letters" },
            })}
          />
          {errors.password && <p className="text-red-500 text-sm mb-3">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition flex items-center justify-center cursor-pointer
              ${loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-black hover:bg-blue-950"
              }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin cursor-pointer"></div>
            ) : (
              isRegister ? "Create Account" : "Login"
            )}
          </button>
        </form>

        {/* Toggle between Login and Create Account */}
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {isRegister ? "Login" : "Create Account"}
          </span>
        </p>
      </div>
    </div>
  );
}