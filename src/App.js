import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wrench,
  Cpu,
  Package,
  ImagePlus,
  XCircle,
  Eye,
  Download,
  ArrowLeft,
  Search,
  Lock,
  LogIn,
  LogOut,
  Calendar,
  RefreshCw,
  Globe,
  FileVideo,
  FileImage,
  Trash2,
  Briefcase,
  User,
  Flag,
  MapPin,
  Store,
  Edit3,
  BarChart3,
  ChevronDown,
} from "lucide-react";

// --- CONFIGURATION ---
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyPwjcXwPZnssSKtwRJnILSj1emC0BycFZXZhX7LKvlziO4h4IrjUAAPOFODcB2-W78oA/exec";

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "7839858",
};

// --- DATA STRUCTURE FOR DROPDOWNS ---
const AREA_DATA = {
  REL: ["REL1", "REL2", "REL3", "REL4", "REL5", "REL6"],
  BS: [
    "BS1",
    "BS2",
    "BS3",
    "BS4",
    "BS5",
    "BS6",
    "BS7",
    "BS8",
    "BS9SA",
    "BS10SA",
  ],
  BE: ["BE1", "BE2", "BE3", "BE4", "BE5", "BE6", "BE7", "BE8", "BE9SA"],
  BW: [
    "BW1",
    "BW2",
    "BW3",
    "BW4",
    "BW5",
    "BW6",
    "BW7",
    "BW8SA",
    "BW9SA",
    "BW10",
  ],
  BN: [
    "BN1",
    "BN2",
    "BN3",
    "BN4",
    "BN5SA",
    "BN6SA",
    "BN7SA",
    "BN8SA",
    "BN9",
    "BN11SA",
  ],
  RC: [
    "RC1",
    "RC2",
    "RC4",
    "RC5SA",
    "RC6SA",
    "RC7SA",
    "RC8SA",
    "RC9SA",
    "RC10SA",
  ],
  RSL: [
    "RSL1",
    "RSL2",
    "RSL3",
    "RSL4",
    "RSL5SA",
    "RSL6SA",
    "RSL8SA",
    "RSL9SA",
    "RSL10SA",
    "RSL11SA",
    "RSL12SA",
    "RSL13",
  ],
  REU: ["REU1", "REU2", "REU3", "REU4", "REU5SA", "REU6SA"],
  BG: ["BG1", "BG2", "BG3", "BG4", "BG5SA", "BG6SA", "BG7SA", "BG8SA", "BG9"],
  NEL: ["NEL1", "NEL2", "NEL3", "NEL4", "NEL5", "NEL6", "NEL8SA"],
  RN: ["RN1", "RN2", "RN3", "RN4", "RN5", "RN6", "RN7", "RN8", "RN9"],
  RSU: ["RSU1", "RSU2", "RSU3", "RSU4", "RSU5", "RSU6", "RSU7", "RSU8"],
  NEU: ["NEU1", "NEU2", "NEU3", "NEU4SA", "NEU5SA", "NEU6SA"],
};

// HARDCODED THAI TRANSLATIONS
const t = {
  app_title: "ระบบบริหารงานวิศวกรรม",
  app_subtitle: "หน่วยงานวิเคราะห์ Call",
  role_reporter: "แจ้งปัญหา",
  role_reporter_desc: "แจ้งปัญหาหน้างานเพื่อวิเคราะห์หาแนวทางการแก้ไข",
  role_admin: "แดชบอร์ด",
  role_admin_desc: "บริหารจัดการงานวิเคราะห์และงานภายใน",
  role_tracker: "ติดตามงานสาขา",
  role_tracker_desc: "อัปเดตสถานะงานติดตามสาขารายพื้นที่",

  footer: "Engineering Analysis System • CP RETAILINK",
  login_title: "พื้นที่เจ้าหน้าที่วิเคราะห์",
  login_subtitle: "เข้าสู่ระบบเพื่อดูข้อมูล",
  login_user: "ชื่อผู้ใช้",
  login_pass: "รหัสผ่าน",
  btn_login: "เข้าสู่ระบบ",
  btn_back: "กลับหน้าหลัก",

  // Tracker
  tracker_title: "ติดตามงาน Open Showcase Elite",
  tracker_filter_area: "เลือกพื้นที่ (Area)",
  tracker_filter_team: "เลือกทีม (Team)",
  tracker_search_placeholder: "ค้นหารหัสสาขา...",
  tracker_stat_total: "ทั้งหมด",
  tracker_stat_completed: "แก้ไขแล้ว",
  tracker_stat_remaining: "คงเหลือ (On process)",
  tracker_breakdown_title: "งานคงเหลือรายพื้นที่ (เรียงจากมากไปน้อย)",

  col_store: "สาขา",
  col_asset: "อุปกรณ์",
  col_status_fix: "สถานะการแก้ไข",
  col_ticket: "Ticket No.",
  col_remark: "หมายเหตุ",
  col_img_proof: "รูปภาพหลักฐาน",

  status_onprocess: "On process",
  status_fixed: "เข้าทำการแก้แล้ว",

  // Common
  btn_save: "บันทึกข้อมูล",
  btn_cancel: "ยกเลิก",
  msg_success: "บันทึกข้อมูลเรียบร้อยแล้ว!",
  msg_error: "เกิดข้อผิดพลาด: ",
  label_img_upload: "แนบรูปภาพ/วีดีโอ ประกอบการแก้ไข",
  holder_img_upload: "คลิกเพื่อเลือกไฟล์",
  file_count: "เลือกแล้ว",
  file_unit: "ไฟล์",

  // Admin Tabs
  tab_reports: "รายการแจ้งปัญหาจากหน้างาน",
  tab_internal: "งานบริหารภายใน (Internal)",

  // Internal Task
  task_title: "หัวข้อ",
  task_assignee: "ผู้รับผิดชอบ",
  task_priority: "ความสำคัญ",
  task_duedate: "กำหนดส่ง",
  task_status: "สถานะ",
  task_desc: "รายละเอียดงาน",
  btn_add_task: "เพิ่มงานใหม่",

  prio_high: "ด่วนมาก",
  prio_med: "ปกติ",
  prio_low: "ไม่ด่วน",

  // Common Form
  header_admin: "แดชบอร์ด",
  header_report: "ศูนย์รับแจ้งปัญหา",
  btn_export: "ส่งออก Excel",
  btn_refresh: "รีเฟรชข้อมูล",
  form_title: "ฟอร์มส่งข้อมูลปัญหา",
  form_subtitle: "Engineering Report Form",
  label_emp_id: "รหัสพนักงาน",
  holder_emp_id: "เช่น 123XXXX",
  label_name: "ชื่อ-นามสกุล",
  holder_name: "ชื่อพนักงาน",
  label_area: "เลือกพื้นที่ (Section)",
  holder_area: "เลือกพื้นที่...",
  label_team: "เลือกทีม (Team)",
  holder_team: "เลือกทีม...",
  label_cat: "หมวดหมู่ปัญหา",
  label_desc: "รายละเอียด",
  holder_desc: "อธิบายปัญหาที่พบ...",
  label_img: "รูปภาพ/วีดีโอ (เลือกได้หลายไฟล์)",
  holder_img: "คลิกเพื่อเลือกไฟล์ (รูปภาพหรือวีดีโอ)",
  btn_submit: "ส่งข้อมูล",
  btn_sending: "กำลังอัปโหลด...",

  // Categories (Added back)
  cat_process: "กระบวนการ (Process)",
  cat_equip: "อุปกรณ์ (Equipment)",
  cat_spare: "อะไหล่ (Spare Parts)",
  cat_other: "อื่นๆ (Others)",

  // Status
  status_pending: "รอรับเรื่อง",
  status_analyzing: "กำลังวิเคราะห์",
  status_resolved: "เสร็จสิ้น",
  status_todo: "ต้องทำ (To Do)",
  status_doing: "กำลังทำ (Doing)",
  status_done: "เสร็จแล้ว (Done)",

  stat_total: "เคสทั้งหมด",
  stat_pending: "รอรับเรื่อง",
  stat_analyzing: "กำลังวิเคราะห์",
  stat_resolved: "เสร็จสิ้น",

  col_date: "วัน-เวลา",
  col_emp: "พนักงาน",
  col_detail: "รายละเอียด",
  col_img: "ไฟล์แนบ",
  col_status: "สถานะ",
  col_action: "จัดการ",

  filter_search: "ค้นหา...",
  filter_all: "ทุกหมวดหมู่",

  sys_img_error: "ขนาดไฟล์รวมต้องไม่เกิน 25MB ต่อการส่ง 1 ครั้ง",
};

const App = () => {
  const [role, setRole] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const [activeTab, setActiveTab] = useState("reports");

  // Data States
  const [reports, setReports] = useState([]);
  const [internalTasks, setInternalTasks] = useState([]);
  const [branchData, setBranchData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Tracker Filters
  const [trackerArea, setTrackerArea] = useState("All");
  const [trackerTeam, setTrackerTeam] = useState("All");
  const [trackerSearch, setTrackerSearch] = useState(""); // New: Search for branch
  const [editingBranch, setEditingBranch] = useState(null);

  // Files
  const [attachments, setAttachments] = useState([]);
  const [selectedReportFiles, setSelectedReportFiles] = useState(null);

  // Forms
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    area: "",
    team: "",
    category: "กระบวนการ (Process)",
    description: "",
  });

  const [internalForm, setInternalForm] = useState({
    title: "",
    assignee: "",
    priority: "Medium",
    dueDate: "",
    description: "",
  });
  const [showInternalModal, setShowInternalModal] = useState(false);

  // --- API Functions ---
  const fetchData = async () => {
    if (!WEB_APP_URL.startsWith("http")) return;
    setLoading(true);
    try {
      const response = await fetch(WEB_APP_URL);
      const data = await response.json();

      // 1. Reports
      if (data.reports) {
        const formattedReports = data.reports.map((item) => ({
          id: item.ID,
          createdAt: new Date(item.Date),
          employeeId: item.EmployeeID,
          employeeName: item.Name,
          department: item.Department,
          category: item.Category,
          description: item.Description,
          status: item.Status || "Pending",
          fileLinks: item.FileLinks ? item.FileLinks.split(", ") : [],
        }));
        setReports(formattedReports.sort((a, b) => b.createdAt - a.createdAt));
      }

      // 2. Internal Tasks
      if (data.internalTasks) {
        const formattedTasks = data.internalTasks.map((item) => ({
          id: item.ID,
          createdAt: new Date(item.Date),
          title: item.Title,
          assignee: item.Assignee,
          priority: item.Priority,
          dueDate: item.DueDate ? new Date(item.DueDate) : null,
          description: item.Description,
          status: item.Status || "To Do",
        }));
        setInternalTasks(
          formattedTasks.sort((a, b) => b.createdAt - a.createdAt)
        );
      }

      // 3. Branch Tracking (ปรับปรุงการดึงข้อมูลตามหัวข้อภาษาไทย)
      if (data.branchTracking) {
        const formattedBranches = data.branchTracking.map((item) => ({
          storeCode: item["Store Code"],
          area: item["พื้นที่"],
          team: item["ทีม"],
          asset: item["Asset Description"],
          status: item["สถานะการแก้ไข"] || "On process",
          ticket: item["เลขที่ Call (Ticket number)"] || "",
          remarks: item["หมายเหตุ"] || "",
          fileLinks: item["รูปภาพประกอบ"]
            ? item["รูปภาพประกอบ"].split(", ")
            : [],
        }));
        setBranchData(formattedBranches);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessage({ type: "error", text: "ไม่สามารถดึงข้อมูลได้" });
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const submitReport = async (e) => {
    e.preventDefault();
    const totalSize = attachments.reduce(
      (acc, curr) => acc + curr.file.size,
      0
    );
    if (totalSize > 25 * 1024 * 1024) {
      setMessage({ type: "error", text: t.sys_img_error });
      return;
    }
    setSubmitting(true);
    try {
      const processedAttachments = await Promise.all(
        attachments.map(async (att) => {
          const base64 = await convertToBase64(att.file);
          return {
            base64: base64,
            mimeType: att.file.type,
            fileName: `file_${Date.now()}_${att.file.name}`,
          };
        })
      );

      const payload = {
        action: "create",
        employeeId: formData.employeeId,
        employeeName: formData.employeeName,
        department: `${formData.area} - ${formData.team}`,
        category: formData.category,
        description: formData.description,
        attachments: processedAttachments,
      };

      await fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMessage({ type: "success", text: t.msg_success });
      setFormData({
        employeeId: "",
        employeeName: "",
        area: "",
        team: "",
        category: "กระบวนการ (Process)",
        description: "",
      });
      setAttachments([]);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "success", text: t.msg_success });
      setFormData({
        employeeId: "",
        employeeName: "",
        area: "",
        team: "",
        category: "กระบวนการ (Process)",
        description: "",
      });
      setAttachments([]);
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const submitInternalTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { action: "createInternal", ...internalForm };
      await fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMessage({ type: "success", text: t.msg_success });
      setShowInternalModal(false);
      setInternalForm({
        title: "",
        assignee: "",
        priority: "Medium",
        dueDate: "",
        description: "",
      });
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "success", text: t.msg_success });
      setShowInternalModal(false);
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const updateBranchStatus = async (e) => {
    e.preventDefault();
    const totalSize = attachments.reduce(
      (acc, curr) => acc + curr.file.size,
      0
    );
    if (totalSize > 25 * 1024 * 1024) {
      setMessage({ type: "error", text: t.sys_img_error });
      return;
    }

    setSubmitting(true);

    // Optimistic Update
    const updatedBranches = branchData.map((b) =>
      b.storeCode === editingBranch.storeCode
        ? { ...editingBranch, status: editingBranch.status }
        : b
    );
    setBranchData(updatedBranches);

    try {
      const processedAttachments = await Promise.all(
        attachments.map(async (att) => {
          const base64 = await convertToBase64(att.file);
          return {
            base64: base64,
            mimeType: att.file.type,
            fileName: `branch_${editingBranch.storeCode}_${Date.now()}.jpg`,
          };
        })
      );

      const payload = {
        action: "updateBranch",
        storeCode: editingBranch.storeCode,
        status: editingBranch.status,
        ticket: editingBranch.ticket,
        remarks: editingBranch.remarks,
        attachments: processedAttachments,
      };
      await fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMessage({ type: "success", text: t.msg_success });
      setEditingBranch(null);
      setAttachments([]); // Clear files
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({ type: "error", text: "Update failed" });
      fetchData(); // Revert
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, newStatus, isInternal = false) => {
    if (isInternal) {
      setInternalTasks(
        internalTasks.map((t) =>
          t.id === id ? { ...t, status: newStatus } : t
        )
      );
      try {
        await fetch(WEB_APP_URL, {
          method: "POST",
          body: JSON.stringify({
            action: "updateInternalStatus",
            id,
            status: newStatus,
          }),
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      setReports(
        reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      try {
        await fetch(WEB_APP_URL, {
          method: "POST",
          body: JSON.stringify({
            action: "updateStatus",
            id,
            status: newStatus,
          }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    // Auto fetch for admin and tracker roles
    if ((role === "admin" && isAdminLoggedIn) || role === "tracker") {
      fetchData();
    }
  }, [role, isAdminLoggedIn]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (
      loginForm.username === ADMIN_CREDENTIALS.username &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAdminLoggedIn(true);
      setMessage({ type: "success", text: t.login_success });
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage({ type: "error", text: t.login_fail });
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;
    const newAttachments = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        (r.employeeName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (r.employeeId || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || (r.category || "").includes(filterCategory);
      return matchesSearch && matchesCategory;
    });
  }, [reports, searchTerm, filterCategory]);

  const filteredBranches = useMemo(() => {
    return branchData.filter((b) => {
      const matchArea = trackerArea === "All" || b.area === trackerArea;
      const matchTeam = trackerTeam === "All" || b.team === trackerTeam;
      // Add Search Filter
      const matchSearch =
        trackerSearch === "" ||
        (b.storeCode || "")
          .toLowerCase()
          .includes(trackerSearch.toLowerCase()) ||
        (b.asset || "").toLowerCase().includes(trackerSearch.toLowerCase());
      return matchArea && matchTeam && matchSearch;
    });
  }, [branchData, trackerArea, trackerTeam, trackerSearch]);

  // Calculate Tracker Stats with Sorting
  const trackerStats = useMemo(() => {
    const total = branchData.length;
    const remaining = branchData.filter(
      (b) => b.status === "On process"
    ).length;
    const completed = total - remaining;

    // Group remaining by Area
    const remainingByArea = {};
    // Initialize all areas with 0
    Object.keys(AREA_DATA).forEach((area) => (remainingByArea[area] = 0));
    // Count
    branchData.forEach((b) => {
      if (b.status === "On process" && AREA_DATA[b.area]) {
        remainingByArea[b.area] = (remainingByArea[b.area] || 0) + 1;
      }
    });

    return { total, remaining, completed, remainingByArea };
  }, [branchData]);

  const exportToCSV = () => {
    if (activeTab === "reports") {
      if (reports.length === 0) return;
      const headers = [
        "ID",
        "Date",
        "Employee ID",
        "Name",
        "Department",
        "Category",
        "Description",
        "Status",
        "File Links",
      ];
      const rows = filteredReports.map((r) => [
        r.id,
        r.createdAt.toLocaleString("th-TH"),
        r.employeeId,
        r.employeeName,
        r.department,
        r.category,
        `"${r.description.replace(/"/g, '""')}"`,
        r.status,
        `"${r.fileLinks.join("\n")}"`,
      ]);
      const csvContent =
        "\uFEFF" + [headers, ...rows].map((e) => e.join(",")).join("\n");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      );
      link.download = `Reports.csv`;
      link.click();
    }
  };

  const StatusBadge = ({ status }) => {
    const config = {
      Pending: {
        label: t.status_pending,
        cls: "bg-amber-100 text-amber-800 border-amber-200",
      },
      Analyzing: {
        label: t.status_analyzing,
        cls: "bg-blue-100 text-blue-700 border-blue-200",
      },
      Resolved: {
        label: t.status_resolved,
        cls: "bg-emerald-100 text-emerald-700 border-emerald-200",
      },
      "To Do": {
        label: t.status_todo,
        cls: "bg-slate-100 text-slate-600 border-slate-300",
      },
      "In Progress": {
        label: t.status_doing,
        cls: "bg-indigo-100 text-indigo-700 border-indigo-200",
      },
      Done: {
        label: t.status_done,
        cls: "bg-emerald-100 text-emerald-700 border-emerald-200",
      },
    };
    // Fix: Fallback to showing raw status if config key missing, or default to Pending only if null
    const current = config[status] || {
      label: status || t.status_pending,
      cls: "bg-slate-100 text-slate-700 border-slate-200",
    };
    // Fix: Increased text size to text-xs (was 9px) and removed uppercase for Thai readability
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-bold border ${current.cls}`}
      >
        {current.label}
      </span>
    );
  };

  const PriorityBadge = ({ p }) => {
    const color =
      p === "High"
        ? "bg-red-100 text-red-700 border-red-200"
        : p === "Medium"
        ? "bg-orange-100 text-orange-700 border-orange-200"
        : "bg-green-100 text-green-700 border-green-200";
    const label =
      p === "High" ? t.prio_high : p === "Medium" ? t.prio_med : t.prio_low;
    return (
      <span
        className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${color}`}
      >
        {label}
      </span>
    );
  };

  // 1. Homepage
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans relative">
        <div className="max-w-5xl w-full flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 text-center leading-tight">
            {t.app_title}
          </h1>
          <h2 className="text-2xl md:text-3xl font-black text-blue-600 mb-12 text-center uppercase tracking-wide">
            {t.app_subtitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <button
              onClick={() => setRole("reporter")}
              className="group relative bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all border-4 border-transparent hover:border-blue-600 overflow-hidden text-center flex flex-col items-center"
            >
              <PlusCircle className="w-16 h-16 text-blue-600 mb-4" />
              <h3 className="text-xl font-black text-slate-800 mb-2 uppercase">
                {t.role_reporter}
              </h3>
              <p className="text-sm text-slate-500">{t.role_reporter_desc}</p>
            </button>
            <button
              onClick={() => setRole("admin")}
              className="group relative bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all border-4 border-transparent hover:border-slate-900 overflow-hidden text-center flex flex-col items-center"
            >
              <LayoutDashboard className="w-16 h-16 text-slate-900 mb-4" />
              <h3 className="text-xl font-black text-slate-800 mb-2 uppercase">
                {t.role_admin}
              </h3>
              <p className="text-sm text-slate-500">{t.role_admin_desc}</p>
            </button>
            <button
              onClick={() => setRole("tracker")}
              className="group relative bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all border-4 border-transparent hover:border-orange-500 overflow-hidden text-center flex flex-col items-center"
            >
              <MapPin className="w-16 h-16 text-orange-500 mb-4" />
              <h3 className="text-xl font-black text-slate-800 mb-2 uppercase">
                {t.role_tracker}
              </h3>
              <p className="text-sm text-slate-500">{t.role_tracker_desc}</p>
            </button>
          </div>
          <p className="mt-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            {t.footer}
          </p>
        </div>
      </div>
    );
  }

  // 2. Login
  if (role === "admin" && !isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative">
        <div className="max-w-md w-full">
          <button
            onClick={() => setRole(null)}
            className="mb-6 text-slate-400 hover:text-white flex items-center gap-2 font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> {t.btn_back}
          </button>
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-slate-900 mx-auto mb-4" />
              <h2 className="text-xl font-black uppercase">{t.login_title}</h2>
              <p className="text-slate-500 text-sm font-bold">
                {t.login_subtitle}
              </p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {message && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold">
                  {message.text}
                </div>
              )}
              <input
                type="text"
                className="w-full p-4 rounded-xl border-2 border-slate-100 font-bold"
                placeholder={t.login_user}
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
              />
              <input
                type="password"
                className="w-full p-4 rounded-xl border-2 border-slate-100 font-bold"
                placeholder={t.login_pass}
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full bg-slate-900 text-white p-4 rounded-xl font-black hover:bg-slate-800"
              >
                {t.btn_login}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. Main Views
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10 relative">
      <header
        className={`${
          role === "admin"
            ? "bg-slate-900"
            : role === "tracker"
            ? "bg-orange-600"
            : "bg-blue-700"
        } text-white shadow-xl sticky top-0 z-40 pr-16`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setRole(null);
                setIsAdminLoggedIn(false);
              }}
              className="p-2 bg-white/10 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black uppercase">
              {role === "admin"
                ? t.header_admin
                : role === "tracker"
                ? t.tracker_title
                : t.header_report}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border-2 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                : "bg-red-50 border-red-100 text-red-800"
            }`}
          >
            <span className="text-sm font-bold">{message.text}</span>
          </div>
        )}

        {role === "reporter" && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-blue-600 p-8 text-white text-center">
                <h2 className="text-2xl font-black uppercase">
                  {t.form_title}
                </h2>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">
                  {t.form_subtitle}
                </p>
              </div>
              <form onSubmit={submitReport} className="p-8 md:p-12 space-y-6">
                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {t.label_emp_id}
                    </label>
                    <input
                      required
                      className="w-full p-4 rounded-xl border-2 border-slate-100 text-sm font-bold"
                      value={formData.employeeId}
                      onChange={(e) =>
                        setFormData({ ...formData, employeeId: e.target.value })
                      }
                      placeholder={t.holder_emp_id}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {t.label_name}
                    </label>
                    <input
                      required
                      className="w-full p-4 rounded-xl border-2 border-slate-100 text-sm font-bold"
                      value={formData.employeeName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employeeName: e.target.value,
                        })
                      }
                      placeholder={t.holder_name}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {t.label_area}
                    </label>
                    <select
                      required
                      className="w-full p-4 rounded-xl border-2 border-slate-100 text-sm font-bold bg-white"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          area: e.target.value,
                          team: "",
                        })
                      }
                    >
                      <option value="" disabled>
                        {t.holder_area}
                      </option>
                      {Object.keys(AREA_DATA).map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {t.label_team}
                    </label>
                    <select
                      required
                      disabled={!formData.area}
                      className="w-full p-4 rounded-xl border-2 border-slate-100 text-sm font-bold bg-white disabled:bg-slate-50 disabled:text-slate-300"
                      value={formData.team}
                      onChange={(e) =>
                        setFormData({ ...formData, team: e.target.value })
                      }
                    >
                      <option value="" disabled>
                        {t.holder_team}
                      </option>
                      {formData.area &&
                        AREA_DATA[formData.area].map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {t.label_cat}
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {[
                      { v: "กระบวนการ (Process)", l: t.cat_process },
                      { v: "อุปกรณ์ (Equipment)", l: t.cat_equip },
                      { v: "อะไหล่ (Spare Parts)", l: t.cat_spare },
                      { v: "อื่นๆ (Others)", l: t.cat_other },
                    ].map((c) => (
                      <button
                        key={c.v}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, category: c.v })
                        }
                        className={`p-3 rounded-xl border-2 text-[10px] font-black transition-all ${
                          formData.category === c.v
                            ? "bg-blue-50 border-blue-600 text-blue-700"
                            : "bg-white border-slate-100 text-slate-400"
                        }`}
                      >
                        {c.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {t.label_desc}
                  </label>
                  <textarea
                    required
                    rows="4"
                    className="w-full p-4 rounded-xl border-2 border-slate-100 text-sm font-bold"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder={t.holder_desc}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {t.label_img}
                  </label>
                  <label className="w-full border-4 border-dashed border-slate-100 p-8 flex flex-col items-center rounded-2xl cursor-pointer hover:bg-slate-50 transition-all hover:border-blue-200">
                    <div className="flex gap-2 mb-2">
                      <ImagePlus className="w-8 h-8 text-blue-600" />
                      <FileVideo className="w-8 h-8 text-purple-600" />
                    </div>
                    <span className="text-xs font-bold uppercase">
                      {t.holder_img}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {attachments.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {attachments.map((att, index) => (
                        <div
                          key={index}
                          className="relative rounded-xl overflow-hidden shadow-md border group"
                        >
                          {att.type === "video" ? (
                            <video
                              src={att.preview}
                              className="w-full h-32 object-cover bg-black"
                            />
                          ) : (
                            <img
                              src={att.preview}
                              className="w-full h-32 object-cover"
                              alt="preview"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  disabled={submitting}
                  type="submit"
                  className={`w-full py-4 rounded-xl text-white font-black text-lg shadow-xl active:scale-95 ${
                    submitting
                      ? "bg-slate-300"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {submitting ? t.btn_sending : t.btn_submit}
                </button>
              </form>
            </div>
          </div>
        )}

        {role === "admin" && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border w-fit mx-auto md:mx-0">
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === "reports"
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <ClipboardList className="w-4 h-4" /> {t.tab_reports}
              </button>
              <button
                onClick={() => setActiveTab("internal")}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === "internal"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <Briefcase className="w-4 h-4" /> {t.tab_internal}
              </button>
            </div>

            {activeTab === "reports" && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
                    <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">
                        {t.stat_total}
                      </p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">
                        {reports.length}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
                    <div className="bg-amber-500 text-white p-4 rounded-2xl shadow-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">
                        {t.stat_pending}
                      </p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">
                        {reports.filter((r) => r.status === "Pending").length}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
                    <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">
                        {t.stat_analyzing}
                      </p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">
                        {reports.filter((r) => r.status === "Analyzing").length}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
                    <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">
                        {t.stat_resolved}
                      </p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">
                        {reports.filter((r) => r.status === "Resolved").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                          <th className="px-6 py-4">{t.col_date}</th>
                          <th className="px-6 py-4">{t.col_emp}</th>
                          <th className="px-6 py-4">{t.col_detail}</th>
                          <th className="px-6 py-4 text-center">{t.col_img}</th>
                          <th className="px-6 py-4">{t.col_status}</th>
                          <th className="px-6 py-4">{t.col_action}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredReports.map((r) => (
                          <tr
                            key={r.id}
                            className="hover:bg-slate-50 transition-colors text-xs font-bold"
                          >
                            <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                              {r.createdAt.toLocaleDateString("th-TH")}
                              <br />
                              {r.createdAt.toLocaleTimeString("th-TH")}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-slate-800 uppercase">
                                {r.employeeName}
                              </div>
                              <div className="text-[10px] text-blue-600 font-black">
                                {r.employeeId} • {r.department}
                              </div>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <div className="text-[10px] text-slate-400 uppercase mb-0.5 tracking-tighter">
                                {r.category}
                              </div>
                              <p className="truncate text-slate-600 font-medium">
                                {r.description}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {r.fileLinks.length > 0 && (
                                <button
                                  onClick={() =>
                                    setSelectedReportFiles(r.fileLinks)
                                  }
                                  className="relative w-12 h-12 rounded-xl overflow-hidden border mx-auto bg-slate-100 flex items-center justify-center hover:ring-2 ring-blue-500 transition-all"
                                >
                                  {r.fileLinks[0].includes("video") ? (
                                    <FileVideo className="w-6 h-6 text-slate-400" />
                                  ) : (
                                    <img
                                      src={r.fileLinks[0]}
                                      alt="thumb"
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                  {r.fileLinks.length > 1 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black text-xs">
                                      +{r.fileLinks.length - 1}
                                    </div>
                                  )}
                                </button>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={r.status} />
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={r.status}
                                onChange={(e) =>
                                  updateStatus(r.id, e.target.value)
                                }
                                className="text-[10px] border rounded p-1.5 outline-none font-black bg-white focus:border-indigo-600 cursor-pointer"
                              >
                                <option value="Pending">
                                  {t.status_pending}
                                </option>
                                <option value="Analyzing">
                                  {t.status_analyzing}
                                </option>
                                <option value="Resolved">
                                  {t.status_resolved}
                                </option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === "internal" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-indigo-600" />{" "}
                    {t.tab_internal}
                  </h3>
                  <button
                    onClick={() => setShowInternalModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" /> {t.btn_add_task}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {["To Do", "In Progress", "Done"].map((status) => (
                    <div
                      key={status}
                      className="bg-slate-100 p-4 rounded-3xl border border-slate-200 min-h-[500px]"
                    >
                      <h4 className="font-black text-slate-600 mb-4 px-2 uppercase text-xs tracking-widest flex items-center justify-between">
                        {status}{" "}
                        <span className="bg-white px-2 py-0.5 rounded-md text-slate-400 shadow-sm">
                          {
                            internalTasks.filter((t) => t.status === status)
                              .length
                          }
                        </span>
                      </h4>
                      <div className="space-y-3">
                        {internalTasks
                          .filter((t) => t.status === status)
                          .map((task) => (
                            <div
                              key={task.id}
                              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group relative"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${
                                    task.priority === "High"
                                      ? "bg-red-100 text-red-700 border-red-200"
                                      : task.priority === "Medium"
                                      ? "bg-orange-100 text-orange-700 border-orange-200"
                                      : "bg-green-100 text-green-700 border-green-200"
                                  }`}
                                >
                                  {task.priority}
                                </span>
                                {task.dueDate && (
                                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />{" "}
                                    {task.dueDate.toLocaleDateString("th-TH")}
                                  </span>
                                )}
                              </div>
                              <h5 className="font-bold text-slate-800 text-sm mb-1">
                                {task.title}
                              </h5>
                              <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                                {task.description}
                              </p>
                              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                  <User className="w-3 h-3" /> {task.assignee}
                                </div>
                                <select
                                  value={task.status}
                                  onChange={(e) =>
                                    updateStatus(task.id, e.target.value, true)
                                  }
                                  className="text-[9px] border rounded p-1 outline-none font-bold bg-slate-50 cursor-pointer hover:bg-slate-100"
                                >
                                  <option value="To Do">To Do</option>
                                  <option value="In Progress">Doing</option>
                                  <option value="Done">Done</option>
                                </select>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {role === "tracker" && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
              <MapPin className="w-8 h-8 text-orange-500" /> {t.tracker_title}
            </h2>

            {/* REAL-TIME DASHBOARD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <StatCard
                label={t.tracker_stat_total}
                value={trackerStats.total}
                color="bg-blue-600"
                icon={<Store className="w-5 h-5" />}
              />
              <StatCard
                label={t.tracker_stat_completed}
                value={trackerStats.completed}
                color="bg-emerald-600"
                icon={<CheckCircle2 className="w-5 h-5" />}
              />
              <StatCard
                label={t.tracker_stat_remaining}
                value={trackerStats.remaining}
                color="bg-amber-500"
                icon={<Clock className="w-5 h-5" />}
              />
            </div>

            {/* AREA BREAKDOWN */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-2">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-400" />{" "}
                {t.tracker_breakdown_title}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                {Object.entries(trackerStats.remainingByArea)
                  .sort(([, countA], [, countB]) => countB - countA)
                  .map(([area, count]) => (
                    <div
                      key={area}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        count > 0
                          ? "bg-red-50 border-red-100 shadow-sm"
                          : "bg-slate-50 border-slate-100 opacity-60"
                      }`}
                    >
                      <div className="text-[10px] font-black text-slate-400 mb-1">
                        {area}
                      </div>
                      <div
                        className={`text-xl font-black ${
                          count > 0 ? "text-red-600" : "text-slate-300"
                        }`}
                      >
                        {count}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Filter & Search Section - Redesigned */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Search Bar - Takes up more space */}
                <div className="md:col-span-6 lg:col-span-5">
                  <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">
                    {t.tracker_search_placeholder}
                  </label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder={t.tracker_search_placeholder}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-slate-300"
                      value={trackerSearch}
                      onChange={(e) => setTrackerSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filters - Area & Team */}
                <div className="md:col-span-3 lg:col-span-3">
                  <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">
                    {t.tracker_filter_area}
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all appearance-none cursor-pointer bg-white"
                      value={trackerArea}
                      onChange={(e) => {
                        setTrackerArea(e.target.value);
                        setTrackerTeam("All");
                      }}
                    >
                      <option value="All">ทุกพื้นที่ (All Areas)</option>
                      {Object.keys(AREA_DATA).map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 lg:col-span-4">
                  <label className="block text-xs font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider">
                    {t.tracker_filter_team}
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all appearance-none cursor-pointer bg-white disabled:bg-slate-50 disabled:text-slate-300"
                      value={trackerTeam}
                      onChange={(e) => setTrackerTeam(e.target.value)}
                      disabled={trackerArea === "All"}
                    >
                      <option value="All">ทุกทีม (All Teams)</option>
                      {trackerArea !== "All" &&
                        AREA_DATA[trackerArea].map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-400 font-bold animate-pulse">
                Loading Branch Data...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredBranches.map((b, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg">
                          {b.storeCode}
                        </h4>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                          {b.area} • {b.team}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
                        {t.col_asset}
                      </p>
                      <p className="text-sm font-medium text-slate-600 truncate">
                        {b.asset}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 min-w-[150px]">
                      <div
                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase border ${
                          b.status === "On process"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-emerald-100 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {b.status === "On process"
                          ? t.status_onprocess
                          : t.status_fixed}
                      </div>
                      {b.ticket && (
                        <span className="text-[10px] font-bold text-slate-400">
                          Ref: {b.ticket}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setEditingBranch(b);
                        setAttachments([]);
                      }}
                      className="p-3 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {filteredBranches.length === 0 && (
                  <div className="text-center py-10 text-slate-400 font-bold italic">
                    No branches found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Internal Task Modal */}
      {showInternalModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-indigo-600" />{" "}
              {t.btn_add_task}
            </h3>
            <form onSubmit={submitInternalTask} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {t.task_title}
                </label>
                <input
                  required
                  className="w-full p-3 rounded-xl border-2 border-slate-100 text-sm font-bold"
                  value={internalForm.title}
                  onChange={(e) =>
                    setInternalForm({ ...internalForm, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {t.task_assignee}
                  </label>
                  <input
                    required
                    className="w-full p-3 rounded-xl border-2 border-slate-100 text-sm font-bold"
                    value={internalForm.assignee}
                    onChange={(e) =>
                      setInternalForm({
                        ...internalForm,
                        assignee: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {t.task_priority}
                  </label>
                  <select
                    className="w-full p-3 rounded-xl border-2 border-slate-100 text-sm font-bold bg-white"
                    value={internalForm.priority}
                    onChange={(e) =>
                      setInternalForm({
                        ...internalForm,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option value="High">{t.prio_high}</option>
                    <option value="Medium">{t.prio_med}</option>
                    <option value="Low">{t.prio_low}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {t.task_duedate}
                </label>
                <input
                  type="date"
                  className="w-full p-3 rounded-xl border-2 border-slate-100 text-sm font-bold font-sans"
                  value={internalForm.dueDate}
                  onChange={(e) =>
                    setInternalForm({
                      ...internalForm,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {t.task_desc}
                </label>
                <textarea
                  rows="3"
                  className="w-full p-3 rounded-xl border-2 border-slate-100 text-sm font-bold"
                  value={internalForm.description}
                  onChange={(e) =>
                    setInternalForm({
                      ...internalForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInternalModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                >
                  {t.btn_cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                >
                  {submitting ? "Saving..." : t.btn_save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch Edit Modal */}
      {editingBranch && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2 uppercase tracking-wide">
              Update:{" "}
              <span className="text-blue-600">{editingBranch.storeCode}</span>
            </h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              {editingBranch.asset}
            </p>

            <form onSubmit={updateBranchStatus} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {t.col_status_fix}
                </label>
                <select
                  className="w-full p-3 rounded-xl border-2 border-slate-100 text-sm font-bold bg-white"
                  value={editingBranch.status}
                  onChange={(e) =>
                    setEditingBranch({
                      ...editingBranch,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="On process">{t.status_onprocess}</option>
                  <option value="เข้าทำการแก้แล้ว">{t.status_fixed}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {t.col_ticket}
                </label>
                <input
                  className="w-full p-3 rounded-xl border-2 border-slate-100 text-sm font-bold"
                  value={editingBranch.ticket}
                  onChange={(e) =>
                    setEditingBranch({
                      ...editingBranch,
                      ticket: e.target.value,
                    })
                  }
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {t.col_remark}
                </label>
                <textarea
                  rows="3"
                  className="w-full p-3 rounded-xl border-2 border-slate-100 text-sm font-bold"
                  value={editingBranch.remarks}
                  onChange={(e) =>
                    setEditingBranch({
                      ...editingBranch,
                      remarks: e.target.value,
                    })
                  }
                />
              </div>

              {/* Image Upload in Modal */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {t.label_img_upload}
                </label>
                <label className="w-full border-4 border-dashed border-slate-100 p-6 flex flex-col items-center rounded-xl cursor-pointer hover:bg-slate-50 transition-all hover:border-blue-200">
                  <div className="flex gap-2 mb-2">
                    <ImagePlus className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {t.holder_img_upload}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {attachments.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {attachments.map((att, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden border group h-20"
                      >
                        {att.type === "video" ? (
                          <video
                            src={att.preview}
                            className="w-full h-full object-cover bg-black"
                          />
                        ) : (
                          <img
                            src={att.preview}
                            className="w-full h-full object-cover"
                            alt="preview"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full shadow-lg"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                >
                  {t.btn_cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 shadow-lg"
                >
                  {submitting ? "Saving..." : t.btn_save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Gallery Modal */}
      {selectedReportFiles && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-6 backdrop-blur-sm"
          onClick={() => setSelectedReportFiles(null)}
        >
          <button
            onClick={() => setSelectedReportFiles(null)}
            className="absolute top-4 right-4 bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-all"
          >
            <XCircle className="w-8 h-8" />
          </button>
          <div
            className="w-full max-w-5xl h-[80vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedReportFiles.map((link, idx) => (
              <div
                key={idx}
                className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-2xl"
              >
                <iframe
                  src={link.replace("/view", "/preview")}
                  className="w-full h-64 border-0"
                  allow="autoplay"
                ></iframe>
                <div className="p-3 flex justify-between items-center bg-slate-900">
                  <span className="text-white text-xs font-bold">
                    File {idx + 1}
                  </span>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 text-xs flex items-center gap-1 hover:underline"
                  >
                    Open <Eye className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`${color} text-white p-4 rounded-2xl shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-bold mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tight">
        {value}
      </p>
    </div>
  </div>
);

export default App;
