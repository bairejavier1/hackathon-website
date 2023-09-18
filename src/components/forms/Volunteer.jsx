"use client";

import { useState } from "react";
import Form from "@/app/forms/Form.jsx";
import { FIELDS } from "../../data/forms/Volunteers.js";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

const volunteer = () => {
  const { data: session } = useSession();
  const [volunteer, setVolunteer] = useState({
    name: session.user.name,
    email: session.user.email,
  });

  const handleSubmit = () => {
    console.log(volunteer);
    const data = {
      ...volunteer,
      availability: Object.entries(volunteer.availability)
        .filter(([_, value]) => value.state === true)
        .map(([key]) => key),
    };

    axios
      .post("/api/forms/volunteer", data)
      .then(() => toast(`✅ Submitted successfully!`));
  };
  return (
    <Form
      fields={FIELDS}
      object={volunteer}
      setObject={setVolunteer}
      header="VOLUNTEER APPLICATION"
      submit={handleSubmit}
    />
  );
};

export default volunteer;
