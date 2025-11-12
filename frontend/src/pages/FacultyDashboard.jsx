import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import '../styles/TempStyles.css';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Avatar,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import { Dialog } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const FacultyDashboard = ({ profileImage, setProfileImage }) => {

  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");
  const [subButtonColor, setSubButtonColor] = useState("#ffffff");   // ✅ NEW
  const [stepperColor, setStepperColor] = useState("#000000");       // ✅ NEW

  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [campusAddress, setCampusAddress] = useState("");

  useEffect(() => {
    if (!settings) return;

    // 🎨 Colors
    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
    if (settings.border_color) setBorderColor(settings.border_color);
    if (settings.main_button_color) setMainButtonColor(settings.main_button_color);
    if (settings.sub_button_color) setSubButtonColor(settings.sub_button_color);   // ✅ NEW
    if (settings.stepper_color) setStepperColor(settings.stepper_color);           // ✅ NEW

    // 🏫 Logo
    if (settings.logo_url) {
      setFetchedLogo(`http://localhost:5000${settings.logo_url}`);
    } else {
      setFetchedLogo(EaristLogo);
    }

    // 🏷️ School Information
    if (settings.company_name) setCompanyName(settings.company_name);
    if (settings.short_term) setShortTerm(settings.short_term);
    if (settings.campus_address) setCampusAddress(settings.campus_address);

  }, [settings]);


  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [personData, setPerson] = useState({
    prof_id: "",
    person_id: "",
    lname: "",
    fname: "",
    mname: "",
    profile_image: "",
  });
  const [openImage, setOpenImage] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole !== "faculty") {
        window.location.href = "/dashboard";
      } else {
        fetchPersonData(storedID);
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchPersonData = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/get_prof_data/${id}`)
      const first = res.data[0];
      const profInfo = {
        prof_id: first.prof_id,
        person_id: first.person_id,
        fname: first.fname,
        mname: first.mname,
        lname: first.lname,
        profile_image: first.profile_image,
      };
      setPerson(profInfo);
    } catch (err) {
      setMessage("Error Fetching Professor Personal Data");
    }
  }

  const [announcements, setAnnouncements] = useState([]);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const role = localStorage.getItem("role"); // ✅ get the current user role

        const res = await axios.get(
          `http://localhost:5000/api/announcements?role=${role}`
        );

        setAnnouncements(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements]);

  const [date, setDate] = useState(new Date());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  const year = date.getFullYear();
  const month = date.getMonth();

  const now = new Date();
  const manilaDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Manila" })
  );
  const today = manilaDate.getDate();
  const thisMonth = manilaDate.getMonth();
  const thisYear = manilaDate.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let currentDay = 1 - firstDay;

  while (currentDay <= totalDays) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay > 0 && currentDay <= totalDays) {
        week.push(currentDay);
      } else {
        week.push(null);
      }
      currentDay++;
    }
    weeks.push(week);
  }

  const handlePrevMonth = () => setDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setDate(new Date(year, month + 1, 1));


  const [holidays, setHolidays] = useState({});

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await axios.get(
          `https://date.nager.at/api/v3/PublicHolidays/${year}/PH`
        );
        const lookup = {};
        res.data.forEach((h) => {
          lookup[h.date] = h;
        });
        setHolidays(lookup);
      } catch (err) {
        console.error("❌ Failed to fetch PH holidays:", err);
        setHolidays({});
      }
    };
    fetchHolidays();
  }, [year]);


  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const person_id = localStorage.getItem("person_id");
      const role = localStorage.getItem("role");

      // ✅ Get user_account_id
      const res = await axios.get(
        `http://localhost:5000/api/get_prof_account_id/${person_id}`
      );

      const user_account_id = res.data.user_account_id;

      const formData = new FormData();

      formData.append("profile_picture", file);

      // ✅ Upload image using same backend API
      await axios.post(
        `http://localhost:5000/update_faculty/${user_account_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ Refresh profile info to display the new image
      const updated = await axios.get(
        `http://localhost:5000/api/person_data/${person_id}/${role}`
      );

      setPerson(updated.data);
      const baseUrl = `http://localhost:5000/uploads/${updated.data.profile_image}`;
      setProfileImage(`${baseUrl}?t=${Date.now()}`);
    } catch (error) {
      console.error("❌ Upload failed:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        marginLeft: "-2rem",
        paddingRight: 8,
        height: "calc(100vh - 150px)",
        overflowY: "auto",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{
            borderRadius: 1,
            boxShadow: 3,
            p: 2,
            border: `2px solid ${borderColor}`,
            height: "130px",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.01)",
              boxShadow: 6,

            },
            marginLeft: "10px"
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">

                {/* 👤 Left Section - Avatar + Welcome */}
                <Box display="flex" alignItems="center">

                  {/* Avatar */}
                  <Box
                    position="relative"
                    display="inline-block"
                    mr={2}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <Avatar
                      src={profileImage || `http://localhost:5000/uploads/${personData?.profile_image}`}
                      alt={personData?.fname}
                      sx={{
                        width: 90,
                        height: 90,
                        border: `2px solid ${borderColor}`,
                        cursor: "pointer",
                        mt: -1.5,
                      }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      {personData?.fname?.[0]}
                    </Avatar>

                    {hovered && (
                      <label
                        onClick={() => fileInputRef.current.click()}
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          right: "0px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          border: `2px solid ${borderColor}`,
                          width: "32px",
                          height: "32px",
                        }}
                      >
                        <AddCircleIcon
                          sx={{
                            color: settings?.header_color || "#1976d2",
                            fontSize: 28,
                            borderRadius: "50%",
                          }}
                        />
                      </label>
                    )}


                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </Box>

                  {/* Welcome text and Employee info */}
                  <Box sx={{ color: titleColor }}>
                    <Typography variant="h4" fontWeight="bold" mt={-1}>
                      Welcome back!  {personData
                        ? `${personData.lname}, ${personData.fname} ${personData.mname || ""}`
                        : ""}
                    </Typography>

                    <Typography variant="body1" color="black" fontSize={20}>
                      <b>Employee ID:</b> {personData?.person_id || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* 📅 Right Section - Date */}
                <Box textAlign="right" sx={{ color: "black" }}>
                  <Typography variant="body1" fontSize="20px">
                    {formattedDate}
                  </Typography>
                </Box>

              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Grid item xs="auto">
          <Card
            sx={{
              borderRadius: 3,
              marginLeft: "10px",
              boxShadow: 3,
              p: 2,
              width: "100%",
              minWidth: "66rem",
              height: "612px", // ✅ keep original height
              border: `2px solid ${borderColor}`,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ width: "100%", height: "100%" }}>

              {/* ✅ Header same as top version */}
              <Typography sx={{ textAlign: "center" }} variant="h6" gutterBottom>
                Announcements
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* ✅ No announcements */}
              {announcements.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  No active announcements.
                </Typography>
              ) : (

                /* ✅ EXACT SAME LAYOUT AS TOP VERSION */
                <Box sx={{ maxHeight: "460px", overflowY: "auto" }}>
                  {announcements.map((a) => (
                    <Box
                      key={a.id}
                      sx={{
                        mb: 2,
                        p: 1,
                        width: "100%",
                        borderRadius: 2,
                        border: `2px solid ${borderColor}`,
                        backgroundColor: "#fff8f6",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "maroon", fontWeight: "bold" }}
                      >
                        {a.title}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {a.content}
                      </Typography>

                      {a.file_path && (
                        <>
                          <img
                            src={`http://localhost:5000/uploads/${a.file_path}`}
                            alt={a.title}
                            style={{
                              width: "100%",
                              maxHeight: "21rem",
                              objectFit: "cover",
                              borderRadius: "6px",
                              marginBottom: "6px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setOpenImage(`http://localhost:5000/uploads/${a.file_path}`)
                            }
                          />

                          {/* ✅ Dialog stays identical */}
                          <Dialog
                            open={Boolean(openImage)}
                            onClose={() => setOpenImage(null)}
                            fullScreen
                            PaperProps={{
                              style: {
                                backgroundColor: "transparent",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                                boxShadow: "none",
                                cursor: "pointer",
                              },
                            }}
                          >
                            <Box
                              onClick={() => setOpenImage(null)}
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                zIndex: 1,
                              }}
                            />

                            <IconButton
                              onClick={() => setOpenImage(null)}
                              sx={{
                                position: "absolute",
                                top: 20,
                                left: 20,
                                backgroundColor: "white",
                                width: 55,
                                height: 55,
                                padding: "5px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 2,
                                "&:hover": { backgroundColor: "#f5f5f5" },
                              }}
                            >
                              <KeyboardBackspaceIcon sx={{ fontSize: 40, color: "black" }} />
                            </IconButton>

                            <Box
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                position: "relative",
                                zIndex: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                maxWidth: "100%",
                                maxHeight: "100%",
                              }}
                            >
                              <img
                                src={openImage}
                                alt="Preview"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "90%",
                                  objectFit: "contain",
                                }}
                              />
                            </Box>
                          </Dialog>
                        </>
                      )}

                      <Typography variant="caption" color="text.secondary">
                        Expires: {new Date(a.expires_at).toLocaleDateString("en-US")}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
       <Box>
  <Grid item xs="auto">
    <Card
      sx={{
        border: `2px solid ${borderColor}`,
        marginLeft: "10px",
        boxShadow: 3,
        borderRadius: "10px",
        p: 2,
        width: "425px",
        height: "400px", // ✅ fixed height
        transition: "transform 0.2s ease",
        "&:hover": { transform: "scale(1.03)" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <CardContent sx={{ p: 0, width: "100%" }}>
        {/* Header with month + year + arrows */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            backgroundColor: settings?.header_color || "#1976d2",
            color: "white",
            border: `2px solid ${borderColor}`,
            borderBottom: "none",
            borderRadius: "8px 8px 0 0",
            padding: "10px 8px",
          }}
        >
          <Grid item>
            <IconButton size="small" onClick={handlePrevMonth} sx={{ color: "white" }}>
              <ArrowBackIos fontSize="small" />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {date.toLocaleString("default", { month: "long" })} {year}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={handleNextMonth} sx={{ color: "white" }}>
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>

        {/* ✅ Calendar Table */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            borderLeft: `2px solid ${borderColor}`,
            borderRight: `2px solid ${borderColor}`,
            borderBottom: `2px solid ${borderColor}`,
            borderTop: `2px solid ${borderColor}`,
            borderRadius: "0 0 8px 8px",
            overflow: "hidden",
          }}
        >
          {/* Days of the week */}
          {days.map((day, idx) => (
            <Box
              key={idx}
              sx={{
                backgroundColor: "#f3f3f3",
                textAlign: "center",
                py: 1,
                fontWeight: "bold",
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              {day}
            </Box>
          ))}

          {/* Dates */}
          {weeks.map((week, i) =>
            week.map((day, j) => {
              if (!day) {
                return (
                  <Box
                    key={`${i}-${j}`}
                    sx={{
                      height: 45,
                      backgroundColor: "#fff",
                    }}
                  />
                );
              }

              const isToday = day === today && month === thisMonth && year === thisYear;
              const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                day
              ).padStart(2, "0")}`;
              const isHoliday = holidays[dateKey];

              const dayCell = (
                <Box
                  sx={{
                    height: 45,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: isToday
                      ? settings?.header_color || "#1976d2"
                      : isHoliday
                        ? "#E8C999"
                        : "#fff",
                    color: isToday ? "white" : "black",
                    fontWeight: isHoliday ? "bold" : "500",
                    cursor: isHoliday ? "pointer" : "default",
                    "&:hover": {
                      backgroundColor: isHoliday ? "#F5DFA6" : "#000",
                      color: isHoliday ? "black" : "white",
                    },
                  }}
                >
                  {day}
                </Box>
              );

              return isHoliday ? (
                <Tooltip
                  key={`${i}-${j}`}
                  title={
                    <>
                      <Typography fontWeight="bold">{isHoliday.localName}</Typography>
                      <Typography variant="caption">{isHoliday.date}</Typography>
                    </>
                  }
                  arrow
                  placement="top"
                >
                  {dayCell}
                </Tooltip>
              ) : (
                <React.Fragment key={`${i}-${j}`}>{dayCell}</React.Fragment>
              );
            })
          )}
        </Box>
      </CardContent>
    </Card>
  </Grid>

  {/* Workload Card (unchanged) */}
  <Grid item xs="auto">
    <Card
      sx={{
        border: `2px solid ${borderColor}`,
        marginLeft: "10px",
        boxShadow: 3,
        p: 2,
        width: "425px",
        height: "196px",
        borderRadius: "10px",
        marginTop: "1rem",
        transition: "transform 0.2s ease",
        "&:hover": { transform: "scale(1.03)" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <CardContent sx={{ p: 0, width: "100%", height: "100%" }}>
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: settings?.header_color || "#1976d2",
            color: "white",
            borderRadius: "6px 6px 0 0",
            padding: "4px 8px",
            fontWeight: "bold",
            border: `2px solid ${borderColor}`,
          }}
        >
          Workload
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid black",
            borderRadius: "2px",
            height: "130px",
          }}
        >
          <Link to={"/faculty_workload"}>
            <Button
              style={{
                backgroundColor: mainButtonColor,
                color: "white",
                padding: "15px 20px",
              }}
            >
              Open My Workload
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  </Grid>
</Box>

      </Box>
    </Box>
  );
};

export default FacultyDashboard;
