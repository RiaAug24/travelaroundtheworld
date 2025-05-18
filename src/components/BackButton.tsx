import React, { FormEvent } from "react";
import { useNavigate } from "react-router";
import Button from "./Button";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="back"
      onClick={(e: FormEvent) => {
        e.preventDefault();
        navigate(-1);
      }}
    >
      &larr; back
    </Button>
  );
}
