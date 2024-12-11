import React, { createContext, useContext, useState, ReactNode } from "react";
import CustomSnackbar from "../components/customSnackbar";

// Define the types for the context
interface CommunityContextType {
  deleteService: (id: string) => void;
  updateService: (updatedService: Service) => void;
  completed: boolean; // To track the completion of actions
  openSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  closeSnackbar: () => void;
  setCompleted: (status: boolean) => void; // Method to update completed status
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [completed, setCompleted] = useState(false); // Track if the operation is completed

  const openSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Method to update the 'completed' state
  const handleCompleted = (status: boolean) => {
    setCompleted(status);
  };

  const deleteService = (id: string) => {
    // Call the API or perform logic to delete the service
    openSnackbar("Service deleted successfully", "success");
    handleCompleted(true); // Set completed to true after action
  };

  const updateService = (updatedService: Service) => {
    // Call the API or perform logic to update the service
    openSnackbar("Service updated successfully", "success");
    handleCompleted(true); // Set completed to true after action
  };

  return (
    <CommunityContext.Provider value={{ 
      deleteService, 
      updateService, 
      openSnackbar, 
      closeSnackbar, 
      completed, 
      setCompleted: handleCompleted 
    }}>
      {children}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
    </CommunityContext.Provider>
  );
};

export const useCommunityContext = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunityContext must be used within a CommunityProvider");
  }
  return context;
};
