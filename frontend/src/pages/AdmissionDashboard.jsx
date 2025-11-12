import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// ✅ Import only the icons you actually use
import {
  ListAltOutlined,
  AccountCircle,
  FamilyRestroom,
  School,
  LocalHospital,
  Info,
  Description,
  MeetingRoom,
  EditCalendar,
  Badge,
  People,
  Score,
  Assessment,
  FormatListNumbered,
  Class,
  Search,
  Numbers,
  MedicalServices,
  HealthAndSafety,
  FolderCopy,
  HistoryEdu,
  Psychology,
  FactCheck,
  ListAlt,
  ContactEmergency,
} from "@mui/icons-material";

const AdmissionDashboardPanel = () => {
  const settings = useContext(SettingsContext);

  // 🌈 Theme Colors
  const [titleColor, setTitleColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");

  // 🏫 School Info
  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [campusAddress, setCampusAddress] = useState("");

  useEffect(() => {
    if (!settings) return;

    setTitleColor(settings.title_color || "#000000");
    setBorderColor(settings.border_color || "#000000");
    setMainButtonColor(settings.main_button_color || "#1976d2");

    setFetchedLogo(settings.logo_url ? `http://localhost:5000${settings.logo_url}` : null);
    setCompanyName(settings.company_name || "");
    setShortTerm(settings.short_term || "");
    setCampusAddress(settings.campus_address || "");
  }, [settings]);

  // 👤 User & Access Control
  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userAccessList, setUserAccessList] = useState({});


  const pageId = 93;

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");
    const storedEmployeeID = localStorage.getItem("employee_id");

    if (storedUser && storedRole && storedID && storedEmployeeID) {
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole === "registrar") {
        checkAccess(storedEmployeeID);      // ✅ Check if user can access THIS dashboard
        fetchUserAccessList(storedEmployeeID);    // ✅ Load all allowed pages for filtering
      } else {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);


  const checkAccess = async (employeeID) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/page_access/${employeeID}/${pageId}`);
      setHasAccess(response.data?.page_privilege === 1);
    } catch (error) {
      console.error("Error checking access:", error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAccessList = async (employeeID) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/page_access/${employeeID}`);

      const accessMap = data.reduce((acc, item) => {
        acc[item.page_id] = item.page_privilege === 1;
        return acc;
      }, {});

      setUserAccessList(accessMap);
    } catch (err) {
      console.error("Error loading user access list:", err);
    }
  };



  const groupedMenu = [
    {
      label: "ADMISSION OFFICE",
      items: [
        { title: "APPLICANT LIST", link: "/applicant_list_admin", icon: ListAltOutlined, page_id: 7 },
        { title: "PERSONAL INFORMATION", link: "/admin_dashboard1", icon: AccountCircle, page_id: 1 },
        { title: "FAMILY BACKGROUND", link: "/admin_dashboard2", icon: FamilyRestroom, page_id: 2 },
        { title: "EDUCATIONAL ATTAINMENT", link: "/admin_dashboard3", icon: School, page_id: 3 },
        { title: "HEALTH MEDICAL RECORDS", link: "/admin_dashboard4", icon: LocalHospital, page_id: 4 },
        { title: "OTHER INFORMATION", link: "/admin_dashboard5", icon: Info, page_id: 5 },
        { title: "DOCUMENTS SUBMITTED", link: "/student_requirements", icon: Description, page_id: 64 },
        { title: "ROOM REGISTRATION", link: "/room_registration", icon: MeetingRoom, page_id: 55 },
        { title: "ENTRANCE EXAM ROOM ASSIGNMENT", link: "/assign_entrance_exam", icon: MeetingRoom, page_id: 9 },
        { title: "ENTRANCE EXAM SCHEDULE MANAGEMENT", link: "/assign_schedule_applicant", icon: EditCalendar, page_id: 11 },
        { title: "EXAMINATION PERMIT", link: "/registrar_examination_profile", icon: Badge, page_id: 51 },
        { title: "PROCTOR'S APPLICANT LIST", link: "/proctor_applicant_list", icon: People, page_id: 37 },
        { title: "ENTRANCE EXAMINATION SCORES", link: "/applicant_scoring", icon: Score, page_id: 8 },

      ],
    },

    {
      label: "ENROLLMENT OFFICER",
      items: [
        { title: "APPLICANT LIST", link: "/applicant_list", icon: ListAlt, page_id: 6 },
        { title: "PERSONAL INFORMATION", link: "/registrar_dashboard1", icon: AccountCircle, page_id: 46 },
        { title: "FAMILY BACKGROUND", link: "/registrar_dashboard2", icon: FamilyRestroom, page_id: 47 },
        { title: "EDUCATIONAL ATTAINMENT", link: "/registrar_dashboard3", icon: School, page_id: 48 },
        { title: "HEALTH MEDICAL RECORDS", link: "/registrar_dashboard4", icon: MedicalServices, page_id: 49 },
        { title: "OTHER INFORMATION", link: "/registrar_dashboard5", icon: Info, page_id: 50 },
        { title: "DOCUMENTS SUBMITTED", link: "/registrar_requirements", icon: FolderCopy, page_id: 52 },
        { title: "INTERVIEW ROOM MANAGEMENT", link: "/assign_interview_exam", icon: MeetingRoom, page_id: 10 },
        { title: "INTERVIEW SCHEDULE MANAGEMENT", link: "/assign_schedule_applicants_interview", icon: EditCalendar, page_id: 12 },
        { title: "INTERVIEWER APPLICANT LIST", link: "/interviewer_applicant_list", icon: People, page_id: 26 },
        { title: "QUALIFYING / INTERVIEW EXAM SCORES", link: "/qualifying_exam_scores", icon: Assessment, page_id: 40 },
        { title: "STUDENT NUMBERING FOR COLLEGE", link: "/student_numbering_per_college", icon: FormatListNumbered, page_id: 63 },
        { title: "COURSE TAGGING", link: "/course_tagging", icon: Class, page_id: 17 },
      ],
    },

    {
      label: "MEDICAL AND DENTAL SERVICES",
      items: [
        { title: "APPLICANT LIST", link: "/medical_applicant_list", icon: ListAltOutlined, page_id: 27 },
        { title: "PERSONAL INFORMATION", link: "/medical_dashboard1", icon: AccountCircle, page_id: 29 },
        { title: "FAMILY BACKGROUND", link: "/medical_dashboard2", icon: FamilyRestroom, page_id: 30 },
        { title: "EDUCATIONAL ATTAINMENT", link: "/medical_dashboard3", icon: School, page_id: 31 },
        { title: "HEALTH MEDICAL RECORDS", link: "/medical_dashboard4", icon: HealthAndSafety, page_id: 32 },
        { title: "OTHER INFORMATION", link: "/medical_dashboard5", icon: Info, page_id: 33 },
        { title: "DOCUMENTS SUBMITTED", link: "/medical_requirements", icon: Description, page_id: 34 },
        { title: "MEDICAL REQUIREMENTS", link: "/medical_requirements_form", icon: MedicalServices, page_id: 35 },
        { title: "DENTAL ASSESSMENT", link: "/dental_assessment", icon: HealthAndSafety, page_id: 19 },
        { title: "PHYSICAL AND NEUROLOGICAL EXAMINATION", link: "/physical_neuro_exam", icon: Psychology, page_id: 36 },
        { title: "HEALTH RECORDS CERTIFICATE", link: "/health_record", icon: FactCheck, page_id: 25 },
        { title: "MEDICAL CERTIFICATE", link: "/medical_certificate", icon: ContactEmergency, page_id: 28 },
      ],
    },

    {
      label: "REGISTRAR'S OFFICE",
      items: [
        { title: "APPLICANT LIST", link: "/super_admin_applicant_list", icon: ListAltOutlined, page_id: 83 },
        { title: "PERSONAL INFORMATION", link: "/readmission_dashboard1", icon: AccountCircle, page_id: 41 },
        { title: "FAMILY BACKGROUND", link: "/readmission_dashboard2", icon: FamilyRestroom, page_id: 42 },
        { title: "EDUCATIONAL ATTAINMENT", link: "/readmission_dashboard3", icon: School, page_id: 43 },
        { title: "HEALTH MEDICAL RECORDS", link: "/readmission_dashboard4", icon: HealthAndSafety, page_id: 44 },
        { title: "OTHER INFORMATION", link: "/readmission_dashboard5", icon: Info, page_id: 45 },
        { title: "CLASS LIST", link: "/class_roster", icon: Class, page_id: 15 },
        { title: "SEARCH CERTIFICATE OF REGISTRATION", link: "/search_cor", icon: Search, page_id: 59 },
        { title: "STUDENT NUMBERING PANEL", link: "/student_numbering", icon: Numbers, page_id: 62 },
        { title: "REPORT OF GRADES", link: "/report_of_grades", icon: Assessment, page_id: 53 },
        { title: "TRANSCRIPT OF RECORDS", link: "/transcript_of_records", icon: HistoryEdu, page_id: 65 },
      ],
    },
  ];


  if (loading || hasAccess === null) return <LoadingOverlay open={loading} message="Checking Access..." />;
  if (!hasAccess) return <Unauthorized />;

  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        paddingRight: 1,
        backgroundColor: "transparent",
      }}
    >
      {groupedMenu
        .map(group => ({
          ...group,
          items: group.items.filter(item => userAccessList[item.page_id]), // keep only accessible items
        }))
        .filter(group => group.items.length > 0) // remove groups with no accessible items
        .map((group, idx) => (
          <Box key={idx} sx={{ mb: 5 }}>
            {/* Group Title */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                borderBottom: `4px solid ${borderColor}`,
                width: "100%",
                pb: 1,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: titleColor,
                  textTransform: "uppercase",
                  fontSize: "34px",
                }}
              >
                {group.label}
              </Typography>
            </Box>

            {/* Group Items */}
            <div className="p-2 px-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div className="relative" key={i}>
                    <Link to={item.link}>
                      {/* ICON BOX */}
                      <div
                        className="bg-white p-4 rounded-lg absolute left-16 top-12"
                        style={{
                          border: `5px solid ${borderColor}`,
                          color: titleColor,
                          transition: "0.2s ease-in-out",
                        }}
                      >
                        <Icon sx={{ fontSize: 36, color: titleColor }} />
                      </div>

                      {/* HOVERABLE BUTTON */}
                      <button
                        className="bg-white rounded-lg p-4 w-80 h-36 font-medium mt-20 ml-8 flex items-end justify-center"
                        style={{
                          border: `5px solid ${borderColor}`,
                          color: titleColor,
                          transition: "0.2s ease-in-out",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = mainButtonColor;
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.border = `5px solid ${borderColor}`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                          e.currentTarget.style.color = titleColor;
                          e.currentTarget.style.border = `5px solid ${borderColor}`;
                        }}
                      >
                        {item.title}
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </Box>
        ))}
    </Box>
  );


};

export default AdmissionDashboardPanel;
