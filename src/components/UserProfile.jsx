// // import React, { useEffect, useState } from "react";
// // // import { getUserDetails } from "../api/user"; // Assuming an API function to get user details

// // const UserProfile = () => {
// //   const [user, setUser] = useState(null);
// // let getUserDetails ={}
// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       const data = await getUserDetails(); // Fetch user details (email & API key)
// //       setUser(data);
// //     };
// //     fetchUserData();
// //   }, []);

// //   return (
// //     <div className="bg-gray-900 min-h-screen text-white px-6 py-4">
// //       <h2 className="text-3xl font-bold mb-4">User Profile</h2>
// //       {user ? (
// //         <div>
// //           <div className="mb-4">
// //             <strong>Email:</strong> {user.email}
// //           </div>
// //           <div className="mb-4">
// //             <strong>API Key:</strong> {user.apikey}
// //             <button
// //               className="ml-4 text-blue-500"
// //               onClick={() => navigator.clipboard.writeText(user.apikey)}
// //             >
// //               Copy API Key
// //             </button>
// //           </div>
// //         </div>
// //       ) : (
// //         <p>Loading...</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserProfile;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { logout } from "../services/operations/authApi";

const UserPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    oldPassword: "",
    newPassword: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [apikey, setApikey] = useState(""); // Store API key (fetched after login)
  const [copied, setCopied] = useState(false); // Track copy state
  const { user,token } = useSelector((state) => state.profile);
  const [selectedApi, setSelectedApi] = useState("project");
  const [selectedApiDetails, setSelectedApiDetails] = useState(null);
  const [highlightedResponse, setHighlightedResponse] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const projectApis = [
  {
    method: "POST",
    endpoint: "https://project-api-1sks.onrender.com/api/v1/project/create",
    description: "Create a new project",
    requestBody: `{
      "title": "New Project",
      "description": "Project description",
      "image": "image_url",
      "github_url": "github_url",
      "project_url": "project_url",
      "techstack": ["tech1", "tech2"]
    }`,
    responseBody: `{
      "status": 201,
      "data": {
          "title": "New Project",
          "description": "Project description",
          "image": "image_url",
          "github_url": "github_url",
          "project_url": "project_url",
          "techstack": ["tech1", "tech2"],
          "userId": "user_id"
      },
      "message": "Project created successfully"
    }`,
  },
  {
    method: "GET",
    endpoint: `https://project-api-1sks.onrender.com/api/v1/project/get/${user.apikey}`,
    description: "Get all projects",
    requestBody: `{
      "apikey": "user_api_key"
    }`,
    responseBody: `{
      "status": 200,
      "data": [
          {
              "title": "Project 1",
              "description": "Description 1",
              "image": "image_url_1",
              "github_url": "github_url_1",
              "project_url": "project_url_1",
              "techstack": ["tech1", "tech2"],
              "userId": "user_id"
          },
          {
              "title": "Project 2",
              "description": "Description 2",
              "image": "image_url_2",
              "github_url": "github_url_2",
              "project_url": "project_url_2",
              "techstack": ["tech3", "tech4"],
              "userId": "user_id"
          }
      ],
      "message": "Projects fetched successfully"
    }`,
  },
  {
    method: "PATCH",
    endpoint: "https://project-api-1sks.onrender.com/api/v1/project/update",
    description: "Update project details",
    requestBody: `{
      "projectId": "project_id",
      "title": "Updated Project",
      "description": "Updated description",
      "image": "updated_image_url",
      "github_url": "updated_github_url",
      "project_url": "updated_project_url",
      "techstack": ["updated_tech1", "updated_tech2"]
    }`,
    responseBody: `{
      "status": 200,
      "data": {
          "title": "Updated Project",
          "description": "Updated description",
          "image": "updated_image_url",
          "github_url": "updated_github_url",
          "project_url": "updated_project_url",
          "techstack": ["updated_tech1", "updated_tech2"],
          "userId": "user_id"
      },
      "message": "Project updated successfully"
    }`,
  },
  {
    method: "DELETE",
    endpoint: "https://project-api-1sks.onrender.com/api/v1/project/delete",
    description: "Delete a project",
    requestBody: `{
      "projectId": "project_id"
    }`,
    responseBody: `{
      "status": 200,
      "data": {},
      "message": "Project deleted successfully"
    }`,
  },
];

const userApis = [
  {
    method: "POST",
    endpoint: "https://project-api-1sks.onrender.com/api/v1/user/register",
    description: "Register a new user",
    requestBody: `{
      "email": "user@example.com",
      "password": "user_password"
    }`,
    responseBody: `{
      "status": 201,
      "data": {
          "email": "user@example.com",
          "apikey": "generated_api_key"
      },
      "message": "User created successfully"
    }`,
  },
  {
    method: "POST",
    endpoint: "https://project-api-1sks.onrender.com/api/v1/user/login",
    description: "Login a user",
    requestBody: `{
      "email": "user@example.com",
      "password": "user_password"
    }`,
    responseBody: `{
      "status": 200,
      "data": {
          "user": {
              "email": "user@example.com"
          },
          "accessToken": "generated_access_token",
          "refreshToken": "generated_refresh_token"
      },
      "message": "User logged in successfully"
    }`,
  },
  {
    method: "POST",
    endpoint: "https://project-api-1sks.onrender.com/api/v1/user/logout",
    description: "Logout a user",
    requestBody: `{
      "apikey": "user_api_key"
    }`,
    responseBody: `{
      "status": 200,
      "data": {},
      "message": "User logged out"
    }`,
  },
  {
    method: "POST",
    endpoint: "https://project-api-1sks.onrender.com/api/v1/user/change-password",
    description: "Change user password",
    requestBody: `{
      "oldPassword": "old_password",
      "newPassword": "new_password"
    }`,
    responseBody: `{
      "status": 200,
      "data": {},
      "message": "Password changed successfully"
    }`,
  },
  {
    method: "GET",
    endpoint: "https://project-api-1sks.onrender.com/api/v1/user/current-user",
    description: "Get current user details",
    requestBody: `{
      "apikey": "user_api_key"
    }`,
    responseBody: `{
      "status": 200,
      "data": {
          "email": "user@example.com",
          "apikey": "user_api_key"
      },
      "message": "User details fetched successfully"
    }`,
  },
];


  const handleResponseHighlight = (responseType) => {
    setHighlightedResponse(responseType); // Toggle between 'request' and 'response'
  };

  // Copy API key to clipboard
  const copyApiKey = () => {
    navigator.clipboard.writeText(user.apikey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  const renderTable = (apis) => {
    return (
      <table className="min-w-full cursor-pointer text-white text-center table-auto border-separate border-spacing-2">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="py-2 px-4">Method</th>
            <th className="py-2 px-4">Endpoint</th>
            <th className="py-2 px-4 hidden md:flex justify-center">Description</th>
          </tr>
        </thead>
        <tbody>
          {apis.map((api, index) => (
            <tr
              key={index}
              className={`bg-gray-${index % 2 === 0 ? "800" : "700"}`}
              onClick={() => setSelectedApiDetails(api)}
            >
              <td className="py-2 px-1 md:px-4">{api.method}</td>
              <td className="py-2 px-1 md:px-4">{api.endpoint}</td>
              <td className="md:py-2 hidden md:flex justify-center md:px-4">{api.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="flex justify-center flex-col items-center bg-gray-900 text-white min-h-screen px-6 py-4">
      <h2 className="text-3xl font-bold mb-4 mt-10">User Management</h2>
      <button className="bg-gray-800 rounded-lg px-2 py-2" onClick={()=>{
        dispatch(logout(token,navigate))
      }}>Logout User</button>
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-xl font-semibold mt-5">
          Current User: {user?.email}
        </h3>

        <div className="mt-6">
          <h4 className="text-lg font-semibold">API Key:</h4>
          <div className="flex items-center space-x-2">
            <p className="px-4 py-2 bg-gray-800 text-white rounded-lg">
              {user.apikey}
            </p>
            <button
              onClick={copyApiKey}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              {copied ? "Copied!" : "Copy Key"}
            </button>
          </div>
        </div>
        <button
            onClick={()=>{
                navigate("/add-project")
            }}
          className="px-4 py-2 mt-10 bg-green-600 text-white rounded-lg"
        >
            Project Management
        </button>
      </div>
      {/* Hero Section */}
      <section
        id="docs"
        className=" w-full text-white md:px-20 mt-32 py-12"
      >
        <h2 className="text-4xl text-white font-bold text-center mb-8">
          Easily Integrate Our APIs
        </h2>
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setSelectedApi("project")}
            className={`px-6 py-2 rounded-lg font-semibold ${
              selectedApi === "project"
                ? "bg-white border-2 border-gray-600 hover:bg-slate-100 text-blue-600"
                : "bg-blue-700 hover:bg-blue-600"
            }`}
          >
            Project APIs
          </button>
          <button
            onClick={() => setSelectedApi("user")}
            className={`px-6 py-2 rounded-lg font-semibold ${
              selectedApi === "user"
                ? "bg-white border-2 border-gray-600 hover:bg-slate-100 text-blue-600"
                : "bg-blue-700 hover:bg-blue-600"
            }`}
          >
            User APIs
          </button>
        </div>

        <motion.div
          className="md:p-6 p-2 bg-gray-800 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {selectedApi === "project"
            ? renderTable(projectApis)
            : renderTable(userApis)}
        </motion.div>

        {/* API Details */}
        {selectedApiDetails && (
          <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Request Body</h3>
            <SyntaxHighlighter
              language="json"
              style={atomOneDark}
              className={highlightedResponse === "request" ? "bg-blue-800" : ""}
              onClick={() => handleResponseHighlight("request")}
            >
              {selectedApiDetails.requestBody}
            </SyntaxHighlighter>
            <h3 className="text-xl font-bold mt-6">Response Body</h3>
            <SyntaxHighlighter
              language="json"
              style={atomOneDark}
              className={
                highlightedResponse === "response" ? "bg-blue-800" : ""
              }
              onClick={() => handleResponseHighlight("response")}
            >
              {selectedApiDetails.responseBody}
            </SyntaxHighlighter>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserPage;
