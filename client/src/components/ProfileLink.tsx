import React from "react";
import { Link } from "react-router-dom";

interface ProfileLinkProps {
  id: string;
  children: React.ReactNode;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ id, children }) => {
  return (
    <Link
      to={`/user/details/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {children}
    </Link>
  );
};

export default ProfileLink;
