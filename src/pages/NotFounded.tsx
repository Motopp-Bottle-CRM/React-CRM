import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFounded() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
        bgcolor: "#f5f5f5",
        p: 3,
      }}
    >
      <Typography variant="h2" sx={{ mb: 2, color: "#1A3353" }}>
        Sorry but this page is not found
      </Typography>
      <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
        
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/app/dashboard")}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}