import toast from "react-hot-toast";
import { projectEndpoints } from "../api.js";
import { setLoading } from "../../Slices/Profile/profile.js";
import { apiConnector } from "../apiConnector";
import { Navigate } from "react-router-dom";
const { CREATE_PROJECT, GET_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } =
  projectEndpoints;

export function createproject(projectData, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    const { title, description, image, github_url, project_url, techstack } =
      projectData;
    dispatch(setLoading(true));
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    try {
      const response = await apiConnector(
        "POST",
        CREATE_PROJECT,
        {
          title,
          description,
          image,
          github_url,
          project_url,
          techstack,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );
      toast.success("Project Created Successfully");
    } catch (e) {
      toast.error("Error while creating project");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function getProject(apikey) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    try {
      const response = await apiConnector(
        "GET",
        `${GET_PROJECT}/${apikey}`,
        {
          apikey,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Project fetched successfully");
      toast.dismiss(toastId);
      return response.data.data;
    } catch (e) {
      console.log(e);
      toast.error("Error while deting project");
    }
    finally
    {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function updateProject(projectData, techstack) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    const {_id, title, description, image, github_url, project_url } = projectData;
    const projectId = _id;
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "PATCH",
        UPDATE_PROJECT,
        {
          projectId,
          title,
          description,
          image,
          github_url,
          project_url,
          techstack,
        },
        {
            Authorization: `Bearer ${accessToken}`,
        }
      );

      if (!response.data.data.success) {
        throw new Error(response.data.data.message);
      }

      toast.success("Updated project details");
    } catch (e) {
      console.log("Update project api error............", e);
      toast.error("Error while updating project details");
    }
    finally
    {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function deleteProject(projectId) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "DELETE",
        DELETE_PROJECT,
        {projectId},
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );

      if (!response.data.data.success) {
        throw new Error(response.data.data.message);
      }

      toast.success("Project deleted successfully");
    } catch (e) {
      console.log("Project API ERROR............", e);
      toast.error("Error while deleting project");
    }
    finally
    {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}
