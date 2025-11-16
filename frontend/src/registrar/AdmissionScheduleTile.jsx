import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Tooltip,
    Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ScheduleHoverTile = () => {
    const navigate = useNavigate();
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

    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        fetchTiles();
    }, []);

    const fetchTiles = async () => {
        try {
            const res = await axios.get("http://localhost:5000/exam_schedules_with_count");
            setSchedules(res.data);
        } catch (err) {
            console.error("Error fetching schedule tiles:", err);
        }
    };


    const formatTime12 = (timeString) => {
        if (!timeString) return "";

        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };


    return (
        <Box
            sx={{
                height: "calc(100vh - 150px)",
                overflowY: "auto",
                paddingRight: 1,
                backgroundColor: "transparent",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexWrap: "wrap",
                    mb: 2,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        color: titleColor,
                        fontSize: "36px",
                        textAlign: "left",
                    }}
                >
                    ADMISSION ROOM MANAGEMENT
                </Typography>
            </Box>

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />
            <Grid container spacing={2}>
                {schedules.map((schedule) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={schedule.schedule_id}>

                        <Card
                            onClick={() => navigate(`/proctor_applicant_list?proctor=${encodeURIComponent(schedule.proctor)}&schedule=${schedule.schedule_id}`)}
                            sx={{
                                cursor: "pointer",
                                p: 2,
                                borderRadius: "12px",
                                transition: "0.2s ease",
                                border: `2px solid ${borderColor}`,
                                boxShadow: 3,
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: 6,
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                        >

                            <CardContent>

                                <Typography fontSize="16px" fontWeight="bold">
                                    Schedule #{schedule.schedule_id}
                                </Typography>

                                <Typography fontSize="14px" mt={1}>
                                    <strong>Proctor:</strong> {schedule.proctor}
                                </Typography>

                                <Typography fontSize="14px">
                                    <strong>Building:</strong> {schedule.building_description}
                                </Typography>

                                <Typography fontSize="14px">
                                    <strong>Room:</strong> {schedule.room_description}
                                </Typography>

                                <Typography fontSize="14px">
                                    <strong>Time:</strong> {formatTime12(schedule.start_time)} - {formatTime12(schedule.end_time)}

                                </Typography>

                                <Typography fontSize="14px" mt={1} fontWeight="bold">
                                    <strong>Applicants:</strong>{" "}
                                    {schedule.current_occupancy}/{schedule.room_quota}
                                </Typography>

                            </CardContent>
                        </Card>

                    </Grid>
                ))}
            </Grid>

        </Box>
    );
};

export default ScheduleHoverTile;
