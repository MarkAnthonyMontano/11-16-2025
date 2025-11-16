import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const API_URL = "http://localhost:5000";

const TOSF = () => {
  const [tosfData, setTosfData] = useState([]);
  const [formData, setFormData] = useState({
    athletic_fee: "",
    cultural_fee: "",
    developmental_fee: "",
    guidance_fee: "",
    library_fee: "",
    medical_and_dental_fee: "",
    registration_fee: "",
    computer_fee: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Fetch all TOSF data
  const fetchTosf = async () => {
    try {
      const res = await axios.get(`${API_URL}/tosf`);
      setTosfData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Error fetching data", "error");
    }
  };

  useEffect(() => {
    fetchTosf();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle submit for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/update_tosf/${editingId}`, formData);
        showSnackbar("Data successfully updated!");
      } else {
        await axios.post(`${API_URL}/insert_tosf`, formData);
        showSnackbar("Data successfully inserted!");
      }
      setFormData({
        athletic_fee: "",
        cultural_fee: "",
        developmental_fee: "",
        guidance_fee: "",
        library_fee: "",
        medical_and_dental_fee: "",
        registration_fee: "",
        computer_fee: "",
      });
      setEditingId(null);
      fetchTosf();
    } catch (error) {
      console.error("Error submitting data:", error);
      showSnackbar("Error while saving data", "error");
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.tosf_id);
  };

  // Open delete dialog
  const handleDeleteDialog = (tosf_id) => {
    setSelectedId(tosf_id);
    setDialogOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/delete_tosf/${selectedId}`);
      showSnackbar("Data successfully deleted!");
      fetchTosf();
    } catch (error) {
      console.error("Error deleting data:", error);
      showSnackbar("Error while deleting data", "error");
    } finally {
      setDialogOpen(false);
      setSelectedId(null);
    }
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setDialogOpen(false);
    setSelectedId(null);
  };

  return (
    <Box sx={{ padding: "0rem 2rem" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "maroon", fontSize: "36px" }}
      >
        TOSF MANAGEMENT
      </Typography>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      {/* Form Section */}
      <Paper sx={{ padding: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {Object.keys(formData).map((key) => (
              <TextField
                key={key}
                label={key.replace(/_/g, " ").toUpperCase()}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                variant="outlined"
                size="small"
                required
              />
            ))}
          </Box>

          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button
              type="submit"
              variant="contained"
              color={editingId ? "warning" : "primary"}
            >
              {editingId ? "Update Record" : "Add Record"}
            </Button>
            {editingId && (
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    athletic_fee: "",
                    cultural_fee: "",
                    developmental_fee: "",
                    guidance_fee: "",
                    library_fee: "",
                    medical_and_dental_fee: "",
                    registration_fee: "",
                    computer_fee: "",
                  });
                }}
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* Table Section */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Athletic Fee</b></TableCell>
              <TableCell><b>Cultural Fee</b></TableCell>
              <TableCell><b>Developmental Fee</b></TableCell>
              <TableCell><b>Guidance Fee</b></TableCell>
              <TableCell><b>Library Fee</b></TableCell>
              <TableCell><b>Medical & Dental</b></TableCell>
              <TableCell><b>Registration Fee</b></TableCell>
              <TableCell><b>Computer Fee</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tosfData.map((item) => (
              <TableRow key={item.tosf_id}>
                <TableCell>{item.tosf_id}</TableCell>
                <TableCell>{item.athletic_fee}</TableCell>
                <TableCell>{item.cultural_fee}</TableCell>
                <TableCell>{item.developmental_fee}</TableCell>
                <TableCell>{item.guidance_fee}</TableCell>
                <TableCell>{item.library_fee}</TableCell>
                <TableCell>{item.medical_and_dental_fee}</TableCell>
                <TableCell>{item.registration_fee}</TableCell>
                <TableCell>{item.computer_fee}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(item)}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteDialog(item.tosf_id)}
                    variant="contained"
                    color="error"
                    size="small"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TOSF;
