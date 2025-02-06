import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createproject,
  getProject,
  updateProject,
  deleteProject,
} from "../services/operations/projectApi";
import { useDispatch, useSelector } from "react-redux";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const [projectData, setProjectData] = useState({
    _id: "", // Include ID for updates
    title: "",
    description: "",
    image: "",
    github_url: "",
    project_url: "",
    techstack: [],
  });
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  // Fetch all projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await dispatch(getProject(user.apikey));
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, [dispatch, user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  // Handle adding or updating a project
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update the project
        const response = await dispatch(updateProject(projectData));
      } else {
        // Create a new project
        const response = await dispatch(createproject(projectData));
      }
      setIsEditing(false);
      setProjectData({
        _id: "",
        title: "",
        description: "",
        image: "",
        github_url: "",
        project_url: "",
        techstack: [],
      });
      // Refresh projects after an operation
      const updatedProjects = await dispatch(getProject(user.apikey));
      setProjects(updatedProjects);
    } catch (error) {
    }
  };

  // Handle editing an existing project
  const handleEdit = (project) => {
    setProjectData({
      ...project,
      techstack: project.techstack || [], // Ensure techstack is always an array
    });
    setIsEditing(true);
  };

  // Handle deleting a project
  const handleDelete = async (projectId) => {
    try {
      await dispatch(deleteProject(projectId));
      // Refresh projects after deletion
      const updatedProjects = await dispatch(getProject(user.apikey));
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen px-6 py-4">
      <h2 className="text-3xl font-bold mb-4">
        {isEditing ? "Edit Project" : "Create Project"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={projectData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg"
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={projectData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={projectData.image}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg"
        />
        <input
          type="text"
          name="github_url"
          placeholder="GitHub URL"
          value={projectData.github_url}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg"
        />
        <input
          type="text"
          name="project_url"
          placeholder="Project URL"
          value={projectData.project_url}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg"
        />
        <input
          type="text"
          name="techstack"
          placeholder="Tech Stack (comma separated)"
          value={projectData.techstack.join(", ")}
          onChange={(e) =>
            setProjectData({
              ...projectData,
              techstack: e.target.value.split(",").map((item) => item.trim()),
            })
          }
          className="w-full px-4 py-2 bg-gray-800 rounded-lg"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg"
        >
          {isEditing ? "Update Project" : "Create Project"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-6">Your Projects</h3>
      <div className="space-y-4 mt-4">
        {projects &&
          projects.map((project) => (
            <div key={project._id} className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold">Project Title: {project.title}</h4>
              <p className="text-sm">Project Description: {project.description}</p>
              <p className="text-sm">Project ID: {project._id}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-yellow-500 hover:text-yellow-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectPage;
