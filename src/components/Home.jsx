import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useSelector } from "react-redux";

const projectApis = [
  {
    method: "POST",
    endpoint: "/api/v1/project/create",
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
    endpoint: "/api/v1/project/get",
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
    endpoint: "/api/v1/project/update",
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
    endpoint: "/api/v1/project/delete",
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
    endpoint: "/api/v1/user/register",
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
    endpoint: "/api/v1/user/login",
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
    endpoint: "/api/v1/user/logout",
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
    endpoint: "/api/v1/user/change-password",
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
    endpoint: "/api/v1/user/current-user",
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

const Home = () => {
  const [selectedApi, setSelectedApi] = useState("project");
  const [selectedApiDetails, setSelectedApiDetails] = useState(null);
  const [highlightedResponse, setHighlightedResponse] = useState(null); // Added state for highlighted response
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(async ()=>{
    if(user?.apikey)
    {
      navigate("/user")
    }
    const response = await fetch("https://project-api-xagp.onrender.com/api/v1/health-check")
  })

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
              <td className="md:py-2 hidden md:flex md:px-4">{api.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleResponseHighlight = (responseType) => {
    setHighlightedResponse(responseType); // Toggle between 'request' and 'response'
  };

  return (
    <div className="bg-gradient-to-r scroll-smooth  text-black min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <h1 className="text-3xl font-bold">Simply Project API</h1>
        {!user && (
          <div>
            <Link to="/login">Login</Link>
          </div>
        )}
      </header>

      <div className="flex flex-col mt-32 justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <p className="text-2xl font-semibold">What it does?</p>
          <p className="text-xl w-[80%] text-center">
            With our platform, managing projects is made effortless—simply call
            an API to create and update project details. There's no need to
            modify your website or redeploy it; just add or update project
            information without changing a single line of code.
          </p>
          <a href="#docs" className="mt-20">
            <button className="bg-blue-600 text-white px-4 py-4 rounded-xl text-xl font-semibold">
              Get Started
            </button>
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section id="docs" className="px-6 text-white md:px-20 mt-80 py-12">
        <h2 className="text-4xl text-black font-bold text-center mb-8">
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
          className="md:p-6 bg-gray-900 rounded-lg shadow-lg"
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

      {/* Footer */}
      <footer className="bg-gray-800 text-center text-white py-4">
        <p>&copy; 2025 API Documentation. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
