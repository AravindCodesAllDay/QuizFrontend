import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

export default function Login() {
  const [teamName, setTeamName] = useState("");
  const nav = useNavigate();

  const handleSubmission = async (e) => {
    e.preventDefault();
    console.log(import.meta.env.VITE_API);
    try {
      const addTeam = await fetch(`${import.meta.env.VITE_API}/team`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ teamName }),
      });

      if (addTeam.status === 301) {
        toast.warning("Team name already Exists...!!");
      } else if (addTeam.status === 201) {
        const data = await addTeam.json();
        nav(`/quiz/${data.convertedCase}`);
        setTeamName("");
      } else {
        toast.error("Server Error...!!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network Error...!!");
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmission}>
        <h1>TECHBIZ 24</h1>
        <p>ALGOVISTA</p>
        <div class="teamname">
          <div class="tablerow">
            <div class="tablecol">
              <label id="teamnamelabel" htmlFor="teamName">
                Team Name:
              </label>
            </div>
            <div class="tablecol">
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <input type="submit" id="nextbutton" value="Next" />
          </div>
        </div>
      </form>
    </>
  );
}
