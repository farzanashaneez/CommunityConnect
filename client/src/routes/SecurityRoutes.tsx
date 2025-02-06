import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import PageNotFound from "../pages/PageNotFound";
import SecurityNavBar from "../components/security/SecurityNavBar";
import Home from "../pages/security/Home";
import ServiceRequest from "../pages/security/ServiceRequest";
import UserProfile from "../pages/security/UserProfile";
import UserVerificationPage from "../pages/security/UserVerificationPage";

const SecurityRoutes: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <SecurityNavBar />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto", // To ensure scrollable content if needed
          position: "relative",
          marginTop: 0,
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/residents" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/service-requests" element={<ServiceRequest />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/verifyQRCode/:id" element={<UserVerificationPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default SecurityRoutes;
