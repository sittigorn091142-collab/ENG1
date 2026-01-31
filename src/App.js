import React, { useState, useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Settings,
  CheckCircle2,
  Clock,
  Wrench,
  ImagePlus,
  XCircle,
  Eye,
  ArrowLeft,
  Search,
  Lock,
  Calendar,
  RefreshCw,
  Trash2,
  Briefcase,
  User,
  MapPin,
  Store,
  Edit3,
  BarChart3,
  ChevronDown,
  Camera,
  Database,
  LogOut,
  MessageSquare,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Loader2,
  AlertTriangle,
  Check,
  Plus,
  Minus,
} from "lucide-react";

// --- 🔴 CONFIGURATION 🔴 ---
const firebaseConfig = {
  apiKey: "AIzaSyDb5Cn1VZoc1XDA8RwmBvJzPY7zHKRjVtQ",
  authDomain: "cpretailink-eng.firebaseapp.com",
  projectId: "cpretailink-eng",
  storageBucket: "cpretailink-eng.firebasestorage.app",
  messagingSenderId: "375453355677",
  appId: "1:375453355677:web:5f48fc5c052fe87037ce74",
};

const IMAGE_UPLOAD_URL =
  "https://script.google.com/macros/s/AKfycbyciF6AisHbLhIlt9a3VYWByXyC341-zhNzR_Ou4Bqlp8CwYsIl9NinYSLb2TzoEAjV/exec";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ข้อมูลพนักงาน
const AUTHORIZED_USERS = [
  {
    id: "7512352",
    name: "นายดนัยภัทร สมใจเพ็ง",
    position: "หัวหน้าแผนกวิเคราะห์ Call",
  },
  {
    id: "7512319",
    name: "นายนรา ผาสุพงษ์",
    position: "หัวหน้าฝ่ายวิเคราะห์ Call",
  },
  {
    id: "7839858",
    name: "นายสิทธิกร แย้มเงิน",
    position: "วิศวกรวิเคราะห์ Call",
  },
  {
    id: "7878736",
    name: "นายชนทัตน์ สันติลินนท์",
    position: "วิศวกรวิเคราะห์ Call",
  },
  {
    id: "7906720",
    name: "นายอภิสิทธิ์ ถามะพันธ์",
    position: "วิศวกรวิเคราะห์ Call",
  },
];

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

// Project Types Constants
const PROJECT_TYPES = {
  REPAIR: "project1_repair",
  REPLACE: "project2_replace",
};

// --- Helper Functions ---
const safeDate = (dateObj) => {
  if (!dateObj) return "-";
  try {
    if (dateObj.toDate) return dateObj.toDate().toLocaleDateString("th-TH");
    if (dateObj instanceof Date && !isNaN(dateObj))
      return dateObj.toLocaleDateString("th-TH");
    const d = new Date(dateObj);
    if (!isNaN(d)) return d.toLocaleDateString("th-TH");
    return "-";
  } catch (e) {
    return "-";
  }
};

const t = {
  app_title: "ระบบบริหารงานวิศวกรรม",
  app_subtitle: "หน่วยงานวิเคราะห์ Call",
  footer: "Engineering Analysis System • CP RETAILINK",
  login_title: "พื้นที่เจ้าหน้าที่วิเคราะห์",
  login_subtitle: "เข้าสู่ระบบเพื่อดูข้อมูล",
  tracker_search_placeholder: "ค้นหารหัสสาขา, Asset...",
  tracker_breakdown_title: "งานคงเหลือรายพื้นที่ (เรียงจากมากไปน้อย)",
};

const App = () => {
  const [role, setRole] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [activeTab, setActiveTab] = useState("reports");

  // Data States
  const [reports, setReports] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [internalTasks, setInternalTasks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Filters & UI
  const [internalView, setInternalView] = useState("board");
  const [trackerSearch, setTrackerSearch] = useState("");
  const [trackerArea, setTrackerArea] = useState("All");
  const [trackerTeam, setTrackerTeam] = useState("All");
  const [trackerProject, setTrackerProject] = useState(PROJECT_TYPES.REPAIR); // Default to Repair

  const [adminSearch, setAdminSearch] = useState("");
  const [adminFilterArea, setAdminFilterArea] = useState("All");
  const [adminFilterTeam, setAdminFilterTeam] = useState("All");

  const [editingBranch, setEditingBranch] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskUpdateText, setTaskUpdateText] = useState("");

  // Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [pasteData, setPasteData] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [importTargetProject, setImportTargetProject] = useState(
    PROJECT_TYPES.REPAIR
  );

  const [attachments, setAttachments] = useState([]);
  const [selectedReportFiles, setSelectedReportFiles] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    area: "",
    team: "",
    category: "กระบวนการ (Process)",
    description: "",
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const [internalForm, setInternalForm] = useState({
    title: "",
    assignee: "",
    priority: "Medium",
    startDate: todayStr,
    dueDate: todayStr,
    description: "",
  });
  const [showInternalModal, setShowInternalModal] = useState(false);

  // --- Dynamic Forms State ---
  // Project 1: Repair Cabinets (Array of objects)
  const [repairCabinets, setRepairCabinets] = useState([
    { assetNo: "", beforeFile: null, afterFile: null },
  ]);
  // Project 2: Replace Data
  const [replaceData, setReplaceData] = useState({
    callNo: "",
    quotationNo: "",
    assessmentImg: null,
    frontImg: null,
  });

  // --- Auth & Listeners ---
  useEffect(() => {
    signInAnonymously(auth).catch(console.error);

    // Reports
    const unsubReports = onSnapshot(
      query(collection(db, "reports"), orderBy("createdAt", "desc")),
      (snap) => {
        setReports(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toDate() || new Date(),
          }))
        );
      }
    );

    // Branches
    const unsubBranches = onSnapshot(collection(db, "branches"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setBranchData(data);
    });

    // Tasks
    const unsubTasks = onSnapshot(
      query(collection(db, "internal_tasks"), orderBy("createdAt", "desc")),
      (snap) => {
        setInternalTasks(
          snap.docs.map((d) => {
            const data = d.data();
            let dueDate = null;
            if (data.dueDate) {
              dueDate = data.dueDate.toDate
                ? data.dueDate.toDate()
                : new Date(data.dueDate);
            }
            let startDate = null;
            if (data.startDate) {
              startDate = data.startDate.toDate
                ? data.startDate.toDate()
                : new Date(data.startDate);
            }
            return {
              id: d.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              dueDate,
              startDate,
            };
          })
        );
      }
    );
    return () => {
      unsubReports();
      unsubBranches();
      unsubTasks();
    };
  }, []);

  // --- CSV / Paste Import Logic ---
  const parseCSVLine = (line) => {
    const isTab = line.includes("\t");
    const delimiter = isTab ? "\t" : ",";
    // Regex to split by comma but ignore commas inside quotes
    const regex = new RegExp(
      `(?:${delimiter}|^)(?:"([^"]*)"|([^"${delimiter}]*))`,
      "g"
    );
    const cols = [];
    let match;

    if (delimiter === "\t") {
      return line.split("\t").map((s) => s.trim().replace(/^"|"$/g, ""));
    }

    while ((match = regex.exec(line)) !== null) {
      let val = match[1] ? match[1] : match[2];
      if (val === undefined) val = "";
      cols.push(val.trim());
    }
    if (cols.length === 0) return line.split(",").map((s) => s.trim());
    return cols;
  };

  const processImportData = async (rows) => {
    setSubmitting(true);
    setImportProgress(1);
    setMessage({ type: "info", text: "กำลังประมวลผลข้อมูล..." });

    try {
      const total = rows.length;
      if (total === 0) throw new Error("ไม่พบข้อมูล");

      const chunkSize = 400;
      let processed = 0;

      for (let i = 0; i < total; i += chunkSize) {
        const batch = writeBatch(db);
        const chunk = rows.slice(i, i + chunkSize);
        let opsCount = 0;

        chunk.forEach((rowStr) => {
          let cols = typeof rowStr === "string" ? parseCSVLine(rowStr) : rowStr;

          // Expecting structure: Store Code, Area, Team, Asset
          // If importing for Project 2, asset might be empty but Store Code is mandatory
          if (
            cols.length >= 4 &&
            cols[0] &&
            cols[0].toUpperCase() !== "STORE CODE"
          ) {
            const docRef = doc(collection(db, "branches"));
            batch.set(docRef, {
              storeCode: cols[0],
              area: cols[1] || "-",
              team: cols[2] || "-",
              asset: cols[3] || "-",
              projectType: importTargetProject,
              status:
                importTargetProject === PROJECT_TYPES.REPAIR
                  ? "ยังไม่ดำเนินการ"
                  : "ยังไม่เสนอราคา",
              ticket: "",
              remarks: "",
              fileLinks: [],
              createdAt: serverTimestamp(),
            });
            opsCount++;
          }
        });

        if (opsCount > 0) {
          await batch.commit();
          processed += chunk.length;
          setImportProgress(
            Math.min(Math.round((processed / total) * 100), 100)
          );
        }
      }

      setMessage({ type: "success", text: `นำเข้าสำเร็จ!` });
      setPasteData("");
      setPreviewData([]);
      setTimeout(() => {
        setMessage(null);
        setShowImportModal(false);
        setImportProgress(0);
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "เกิดข้อผิดพลาด: " + err.message });
      setImportProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const allLines = text.split(/\r\n|\n|\r/).filter((l) => l.trim() !== "");
      const dataRows =
        allLines[0] &&
        (allLines[0].toLowerCase().includes("store") ||
          allLines[0].includes("สาขา"))
          ? allLines.slice(1)
          : allLines;

      const parsed = dataRows
        .map(parseCSVLine)
        .filter((row) => row.length >= 4);
      setPreviewData(parsed);
      setPasteData("");
      event.target.value = null;
    };
    reader.readAsText(file);
  };

  const handlePasteChange = (e) => {
    const text = e.target.value;
    setPasteData(text);
    if (text) {
      const allLines = text.split(/\r\n|\n|\r/).filter((l) => l.trim() !== "");
      const parsed = allLines
        .map(parseCSVLine)
        .filter((row) => row.length >= 4);
      setPreviewData(parsed);
    } else {
      setPreviewData([]);
    }
  };

  const confirmImport = () => {
    if (previewData.length === 0) return alert("ไม่มีข้อมูลที่จะนำเข้า");
    const rowsForProcess = previewData;
    processImportData(rowsForProcess);
  };

  // --- SUBMIT HANDLERS ---
  const processFileImg = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        if (file.type.startsWith("image/")) {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 1024;
            const scale = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * (scale > 1 ? 1 : scale);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve({
              base64: canvas.toDataURL("image/jpeg", 0.7),
              fileName: file.name,
              mimeType: "image/jpeg",
            });
          };
        } else {
          resolve({
            base64: event.target.result,
            fileName: file.name,
            mimeType: file.type,
          });
        }
      };
    });
  };

  const uploadToDrive = async (files) => {
    if (!files || files.length === 0) return [];
    const processed = await Promise.all(
      files.map((f) => processFileImg(f.file))
    );
    const res = await fetch(IMAGE_UPLOAD_URL, {
      method: "POST",
      body: JSON.stringify({ action: "uploadOnly", files: processed }),
    });
    const result = await res.json();
    return result.urls || [];
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const urls = await uploadToDrive(attachments);
      await addDoc(collection(db, "reports"), {
        ...formData,
        department: `${formData.area} - ${formData.team}`,
        fileLinks: urls,
        status: "Pending",
        createdAt: serverTimestamp(),
      });
      setFormData({
        employeeId: "",
        employeeName: "",
        area: "",
        team: "",
        category: "กระบวนการ (Process)",
        description: "",
      });
      setAttachments([]);
      setShowSuccessModal(true);
    } catch (err) {
      setMessage({ type: "error", text: "ผิดพลาด: " + err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // --- PROJECT 1: REPAIR SUBMIT ---
  const handleRepairSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "info", text: "กำลังอัปโหลดรูปและบันทึกข้อมูล..." });

    try {
      // 1. Shop Front Image
      let frontUrl = "";
      if (attachments.length > 0 && attachments[0].file) {
        const res = await uploadToDrive([attachments[0]]);
        frontUrl = res[0];
      } else if (editingBranch.shopFrontImage) {
        frontUrl = editingBranch.shopFrontImage; // Keep existing if not changed
      }

      // 2. Cabinet Images (Before/After for each)
      const updatedCabinets = await Promise.all(
        repairCabinets.map(async (cab) => {
          let beforeUrl = cab.beforeUrl || "";
          let afterUrl = cab.afterUrl || "";

          if (cab.beforeFile) {
            const res = await uploadToDrive([{ file: cab.beforeFile }]);
            beforeUrl = res[0];
          }
          if (cab.afterFile) {
            const res = await uploadToDrive([{ file: cab.afterFile }]);
            afterUrl = res[0];
          }

          return {
            assetNo: cab.assetNo,
            beforeUrl: beforeUrl,
            afterUrl: afterUrl,
          };
        })
      );

      await updateDoc(doc(db, "branches", editingBranch.id), {
        status: editingBranch.status,
        remarks: editingBranch.remarks || "",
        shopFrontImage: frontUrl,
        cabinets: updatedCabinets,
        lastUpdated: serverTimestamp(),
      });

      setEditingBranch(null);
      setRepairCabinets([]);
      setAttachments([]);
      setMessage({ type: "success", text: "บันทึกข้อมูลเรียบร้อย!" });
    } catch (err) {
      setMessage({ type: "error", text: "Error: " + err.message });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // --- PROJECT 2: REPLACE SUBMIT ---
  const handleReplaceSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "info", text: "กำลังอัปโหลดเอกสาร..." });

    try {
      let assessmentUrl = replaceData.assessmentUrl || "";
      let frontUrl = replaceData.frontUrl || "";

      if (replaceData.assessmentImg) {
        const res = await uploadToDrive([{ file: replaceData.assessmentImg }]);
        assessmentUrl = res[0];
      }
      if (replaceData.frontImg) {
        const res = await uploadToDrive([{ file: replaceData.frontImg }]);
        frontUrl = res[0];
      }

      await updateDoc(doc(db, "branches", editingBranch.id), {
        status: editingBranch.status,
        callNo: replaceData.callNo,
        quotationNo: replaceData.quotationNo,
        assessmentImage: assessmentUrl,
        shopFrontImage: frontUrl,
        lastUpdated: serverTimestamp(),
      });

      setEditingBranch(null);
      setReplaceData({
        callNo: "",
        quotationNo: "",
        assessmentImg: null,
        frontImg: null,
      });
      setMessage({ type: "success", text: "บันทึกข้อมูลเรียบร้อย!" });
    } catch (err) {
      setMessage({ type: "error", text: "Error: " + err.message });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const submitInternalTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const start = internalForm.startDate
        ? new Date(internalForm.startDate)
        : new Date();
      const due = internalForm.dueDate ? new Date(internalForm.dueDate) : null;

      await addDoc(collection(db, "internal_tasks"), {
        ...internalForm,
        startDate: start,
        dueDate: due,
        status: "To Do",
        updates: [],
        createdAt: serverTimestamp(),
      });
      setMessage({ type: "success", text: "เพิ่มงานใหม่เรียบร้อย!" });
      setShowInternalModal(false);
      setInternalForm({
        title: "",
        assignee: "",
        priority: "Medium",
        startDate: todayStr,
        dueDate: todayStr,
        description: "",
      });
    } catch (err) {
      setMessage({ type: "error", text: "ผิดพลาด: " + err.message });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleTaskUpdate = async () => {
    if (!taskUpdateText.trim()) return;
    try {
      const updateRef = doc(db, "internal_tasks", editingTask.id);
      const newUpdate = {
        text: taskUpdateText,
        user: currentUser?.name || "Admin",
        timestamp: new Date(),
      };
      await updateDoc(updateRef, { updates: arrayUnion(newUpdate) });
      setTaskUpdateText("");
      setEditingTask((prev) => ({
        ...prev,
        updates: [...(prev.updates || []), newUpdate],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, newStatus, isTask = false) => {
    await updateDoc(doc(db, isTask ? "internal_tasks" : "reports", id), {
      status: newStatus,
    });
  };

  const updateReportStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "reports", id), { status: newStatus });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));
    setAttachments((prev) => [...prev, ...files]);
  };
  const removeAttachment = (index) =>
    setAttachments((prev) => prev.filter((_, i) => i !== index));

  const filteredBranches = useMemo(() => {
    return branchData.filter((b) => {
      const mProject = b.projectType === trackerProject;
      const mSearch = (b.storeCode || "")
        .toLowerCase()
        .includes(trackerSearch.toLowerCase());
      const mArea = trackerArea === "All" || b.area === trackerArea;
      const mTeam = trackerTeam === "All" || b.team === trackerTeam;
      return mProject && mSearch && mArea && mTeam;
    });
  }, [branchData, trackerSearch, trackerArea, trackerTeam, trackerProject]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const mSearch =
        (r.employeeName || "")
          .toLowerCase()
          .includes(adminSearch.toLowerCase()) ||
        (r.employeeId || "").toLowerCase().includes(adminSearch.toLowerCase());
      return mSearch;
    });
  }, [reports, adminSearch]);

  const trackerStats = useMemo(() => {
    const activeStatus =
      trackerProject === PROJECT_TYPES.REPAIR
        ? "ยังไม่ดำเนินการ"
        : "ยังไม่เสนอราคา";
    const doneStatus =
      trackerProject === PROJECT_TYPES.REPAIR
        ? "มีการดำเนินการแล้ว"
        : "เสนอราคาแล้ว";
    const relevantBranches = branchData.filter(
      (b) => b.projectType === trackerProject
    );
    const remByArea = {};
    Object.keys(AREA_DATA).forEach((a) => (remByArea[a] = 0));
    relevantBranches.forEach((b) => {
      if (!b.status || b.status === activeStatus || b.status === "On process") {
        if (AREA_DATA[b.area]) remByArea[b.area] += 1;
      }
    });
    return {
      total: relevantBranches.length,
      remaining: Object.values(remByArea).reduce((a, b) => a + b, 0),
      completed: relevantBranches.filter((b) => b.status === doneStatus).length,
      breakdown: Object.entries(remByArea).sort((a, b) => b[1] - a[1]),
    };
  }, [branchData, trackerProject]);

  const taskWorkload = useMemo(() => {
    const workload = {};
    AUTHORIZED_USERS.forEach((u) => (workload[u.name] = 0));
    internalTasks
      .filter((t) => t.status === "In Progress" || t.status === "To Do")
      .forEach((t) => {
        const user = AUTHORIZED_USERS.find(
          (u) => u.name === t.assignee || t.assignee.includes(u.name)
        );
        if (user) workload[user.name] = (workload[user.name] || 0) + 1;
        else if (t.assignee)
          workload[t.assignee] = (workload[t.assignee] || 0) + 1;
      });
    return Object.entries(workload).sort((a, b) => b[1] - a[1]);
  }, [internalTasks]);

  const exportToCSV = () => {
    if (activeTab === "reports" && filteredReports.length > 0) {
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
        r.createdAt ? safeDate(r.createdAt) : "",
        r.employeeId,
        r.employeeName,
        r.department,
        r.category,
        `"${r.description.replace(/"/g, '""')}"`,
        r.status,
        `"${r.fileLinks ? r.fileLinks.join("\n") : ""}"`,
      ]);
      const csvContent =
        "\uFEFF" + [headers, ...rows].map((e) => e.join(",")).join("\n");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      );
      link.download = `Reports_Filtered_${new Date().toLocaleDateString()}.csv`;
      link.click();
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginForm.username.toLowerCase() !== "admin") {
      setMessage({ type: "error", text: "ชื่อผู้ใช้ต้องเป็น 'admin'" });
      return;
    }
    const user = AUTHORIZED_USERS.find((u) => u.id === loginForm.password);
    if (user) {
      setIsAdminLoggedIn(true);
      setCurrentUser(user);
      setMessage({ type: "success", text: `ยินดีต้อนรับ ${user.name}` });
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage({ type: "error", text: "รหัสพนักงานไม่ถูกต้อง" });
    }
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    // Initialize state based on existing data
    if (branch.projectType === PROJECT_TYPES.REPAIR) {
      setRepairCabinets(
        branch.cabinets || [{ assetNo: "", beforeFile: null, afterFile: null }]
      );
      setAttachments([]); // Clear main attachment, use existing shopFrontImage if not changed
    } else if (branch.projectType === PROJECT_TYPES.REPLACE) {
      setReplaceData({
        callNo: branch.callNo || "",
        quotationNo: branch.quotationNo || "",
        assessmentUrl: branch.assessmentImage || "",
        frontUrl: branch.shopFrontImage || "",
      });
    }
  };

  // --- RENDER ---
  if (!role)
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4 tracking-tight">
            ระบบบริหารงานวิศวกรรม
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-blue-600 uppercase tracking-widest">
            หน่วยงานวิเคราะห์ CALL
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          <MenuCard
            onClick={() => setRole("reporter")}
            icon={<PlusCircle size={56} />}
            title="แจ้งปัญหา"
            desc="แจ้งปัญหาหน้างานเพื่อวิเคราะห์หาแนวทางการแก้ไข"
            color="bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
          />
          <MenuCard
            onClick={() => setRole("admin")}
            icon={<LayoutDashboard size={56} />}
            title="แดชบอร์ด"
            desc="บริหารจัดการงานวิเคราะห์และงานภายใน"
            color="bg-slate-800 text-white shadow-slate-300 hover:bg-slate-900"
          />
          <MenuCard
            onClick={() => setRole("tracker")}
            icon={<MapPin size={56} />}
            title="ติดตามงานสาขา"
            desc="ติดตามงานซ่อมและเสนอราคา (Elite/Replace)"
            color="bg-orange-500 text-white shadow-orange-200 hover:bg-orange-600"
          />
        </div>
        <footer className="mt-20">
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">
            ENGINEERING ANALYSIS SYSTEM • CP RETAILINK
          </p>
        </footer>
      </div>
    );

  if (role === "admin" && !isAdminLoggedIn)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 mx-auto text-slate-900 mb-4" />
            <h2 className="text-2xl font-black uppercase text-slate-900">
              พื้นที่เจ้าหน้าที่
            </h2>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {message && message.type === "error" && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold text-center">
                {message.text}
              </div>
            )}
            <input
              className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-blue-600"
              placeholder="ชื่อผู้ใช้ (admin)"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm({ ...loginForm, username: e.target.value })
              }
            />
            <input
              type="password"
              className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-blue-600"
              placeholder="รหัสผ่าน (รหัสพนักงาน)"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-[2] bg-slate-900 text-white p-4 rounded-xl font-black uppercase hover:bg-slate-800 transition-all shadow-lg order-1"
              >
                ล็อกอิน
              </button>
              <button
                type="button"
                onClick={() => setRole(null)}
                className="flex-1 bg-slate-100 text-slate-500 p-4 rounded-xl font-black uppercase hover:bg-slate-200 transition-all order-2"
              >
                กลับ
              </button>
            </div>
          </form>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <header
        className={`${
          role === "admin"
            ? "bg-slate-900"
            : role === "tracker"
            ? "bg-orange-600"
            : "bg-blue-700"
        } text-white p-4 shadow-lg sticky top-0 z-40`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setRole(null);
                setIsAdminLoggedIn(false);
                setCurrentUser(null);
              }}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-black uppercase tracking-tight">
              {role === "admin"
                ? "Dashboard"
                : role === "tracker"
                ? "Branch Tracking"
                : "Reporting"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {role === "admin" && isAdminLoggedIn && currentUser && (
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-white">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {currentUser.position}
                </span>
              </div>
            )}
            {role === "admin" && isAdminLoggedIn && (
              <>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="hidden md:flex bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-black uppercase items-center gap-2 border border-white/10 transition-all cursor-pointer"
                >
                  <UploadCloud size={14} /> Import Data
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="md:hidden bg-white/10 hover:bg-white/20 p-2 rounded-lg"
                >
                  <UploadCloud size={20} />
                </button>
              </>
            )}
            {role === "admin" && isAdminLoggedIn && (
              <button
                onClick={() => {
                  setIsAdminLoggedIn(false);
                  setCurrentUser(null);
                  setRole(null);
                }}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-all text-red-200"
              >
                <LogOut size={20} />
              </button>
            )}
            <RefreshCw className={loading ? "animate-spin" : ""} size={20} />
          </div>
        </div>
      </header>

      {submitting && importProgress > 0 && (
        <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${importProgress}%` }}
          ></div>
        </div>
      )}
      {submitting && message && message.type === "info" && (
        <div className="fixed top-16 left-0 w-full bg-blue-500 text-white text-center py-2 z-50 font-bold text-sm shadow-md animate-pulse">
          {message.text}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {message &&
          !showSuccessModal &&
          message.type !== "error" &&
          message.type !== "info" && (
            <div
              className={`p-4 rounded-xl mb-8 font-black text-center border-2 shadow-sm ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                  : "bg-blue-50 border-blue-100 text-blue-800"
              }`}
            >
              {message.text}
            </div>
          )}
        {message && message.type === "error" && (
          <div className="p-4 rounded-xl mb-8 font-black text-center border-2 shadow-sm bg-red-50 border-red-100 text-red-800">
            {message.text}
          </div>
        )}

        {/* REPORTER VIEW */}
        {role === "reporter" && (
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2rem] shadow-xl border border-slate-200 animate-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black text-center text-blue-600 uppercase mb-8">
              แบบฟอร์มแจ้งปัญหา
            </h2>
            <form onSubmit={handleReportSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    รหัสพนักงาน
                  </label>
                  <input
                    required
                    className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-blue-600"
                    placeholder="รหัสพนักงาน"
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    required
                    className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-blue-600"
                    placeholder="ชื่อพนักงาน"
                    value={formData.employeeName}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    เลือกพื้นที่
                  </label>
                  <select
                    required
                    className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold bg-white outline-none focus:border-blue-600"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        area: e.target.value,
                        team: "",
                      })
                    }
                  >
                    <option value="">--- เลือกพื้นที่ ---</option>
                    {Object.keys(AREA_DATA)
                      .sort()
                      .map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    เลือกทีม
                  </label>
                  <select
                    required
                    className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold bg-white outline-none focus:border-blue-600"
                    value={formData.team}
                    onChange={(e) =>
                      setFormData({ ...formData, team: e.target.value })
                    }
                    disabled={!formData.area}
                  >
                    <option value="">--- เลือกทีม ---</option>
                    {formData.area &&
                      AREA_DATA[formData.area].sort().map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  หมวดหมู่ปัญหา
                </label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { v: "กระบวนการ (Process)", l: "กระบวนการ (Process)" },
                    { v: "อุปกรณ์ (Equipment)", l: "อุปกรณ์ (Equipment)" },
                    { v: "อะไหล่ (Spare Parts)", l: "อะไหล่ (Spare Parts)" },
                    { v: "อื่นๆ (Others)", l: "อื่นๆ (Others)" },
                  ].map((c) => (
                    <button
                      key={c.v}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: c.v })
                      }
                      className={`p-4 rounded-xl font-bold text-sm border-2 transition-all ${
                        formData.category === c.v
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                          : "bg-white border-slate-100 text-slate-400 hover:border-blue-200"
                      }`}
                    >
                      {c.l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  รายละเอียดปัญหา
                </label>
                <textarea
                  required
                  rows="4"
                  className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-blue-600"
                  placeholder="ระบุรายละเอียดปัญหาที่พบหน้างาน..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  แนบรูปภาพหรือวีดีโอ
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center relative hover:bg-slate-50 transition-all cursor-pointer group">
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                  />
                  <Camera
                    size={40}
                    className="mx-auto text-slate-300 group-hover:text-blue-500 transition-colors mb-2"
                  />
                  <p className="font-bold text-slate-400 text-xs">
                    คลิกเพื่อแนบไฟล์หลักฐาน (เลือกได้หลายไฟล์)
                  </p>
                  {attachments.length > 0 && (
                    <p className="text-blue-600 font-black mt-3 bg-blue-50 px-4 py-2 rounded-full inline-block">
                      เลือกแล้ว {attachments.length} ไฟล์
                    </p>
                  )}
                </div>
              </div>
              <button
                disabled={submitting}
                className="w-full p-5 bg-blue-600 text-white rounded-xl font-black text-lg shadow-lg active:scale-95 transition-all uppercase"
              >
                {submitting ? "กำลังส่งข้อมูล..." : "ส่งข้อมูลแจ้งปัญหา"}
              </button>
            </form>
          </div>
        )}

        {/* TRACKER VIEW */}
        {role === "tracker" && (
          <div className="space-y-8">
            <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border w-fit mx-auto">
              <button
                onClick={() => setTrackerProject(PROJECT_TYPES.REPAIR)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  trackerProject === PROJECT_TYPES.REPAIR
                    ? "bg-orange-500 text-white"
                    : "text-slate-400"
                }`}
              >
                🛠️ ซ่อมท่อเสียดสี (Elite v.3)
              </button>
              <button
                onClick={() => setTrackerProject(PROJECT_TYPES.REPLACE)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  trackerProject === PROJECT_TYPES.REPLACE
                    ? "bg-orange-500 text-white"
                    : "text-slate-400"
                }`}
              >
                📄 เสนอราคา (เปลี่ยนอุปกรณ์)
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="เคสทั้งหมด"
                value={branchData.length}
                color="bg-slate-900"
                icon={<Store size={24} />}
              />
              <StatCard
                label="แก้ไขแล้ว"
                value={
                  branchData.filter(
                    (b) =>
                      b.status &&
                      (b.status.includes("แล้ว") ||
                        b.status.includes("Completed"))
                  ).length
                }
                color="bg-emerald-600"
                icon={<CheckCircle2 size={24} />}
              />
              <StatCard
                label="คงเหลือ"
                value={trackerStats.remaining}
                color="bg-orange-500"
                icon={<Clock size={24} />}
              />
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-400 text-[10px] uppercase mb-6 tracking-widest flex items-center gap-2">
                <BarChart3 size={16} /> งานคงเหลือรายพื้นที่ (เรียงจากมากไปน้อย)
              </h3>
              <div className="flex flex-wrap gap-3">
                {trackerStats.breakdown.map(([area, count]) => (
                  <div
                    key={area}
                    className={`px-4 py-2 rounded-xl border-2 flex items-center gap-3 transition-all ${
                      count > 0
                        ? "border-orange-100 bg-orange-50 shadow-sm"
                        : "border-slate-50 bg-slate-50 opacity-50"
                    }`}
                  >
                    <span className="font-black text-xs text-slate-500">
                      {area}
                    </span>
                    <span
                      className={`text-lg font-black ${
                        count > 0 ? "text-orange-600" : "text-slate-300"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-lg flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-xl font-bold outline-none border border-transparent focus:border-orange-500 transition-all"
                  placeholder="ค้นหารหัสสาขา..."
                  value={trackerSearch}
                  onChange={(e) => setTrackerSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <select
                  className="flex-1 md:w-40 p-4 bg-slate-50 rounded-xl font-bold outline-none border border-transparent"
                  value={trackerArea}
                  onChange={(e) => {
                    setTrackerArea(e.target.value);
                    setTrackerTeam("All");
                  }}
                >
                  <option value="All">ทุกพื้นที่</option>
                  {Object.keys(AREA_DATA)
                    .sort()
                    .map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                </select>
                <select
                  className="flex-1 md:w-40 p-4 bg-slate-50 rounded-xl font-bold outline-none border border-transparent"
                  value={trackerTeam}
                  onChange={(e) => setTrackerTeam(e.target.value)}
                  disabled={trackerArea === "All"}
                >
                  <option value="All">ทุกทีม</option>
                  {trackerArea !== "All" &&
                    AREA_DATA[trackerArea].map((tm) => (
                      <option key={tm} value={tm}>
                        {tm}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredBranches.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-wrap md:flex-nowrap justify-between items-center hover:shadow-md transition-all border-l-8 border-l-slate-100 hover:border-l-orange-500"
                >
                  <div>
                    <h4 className="font-black text-xl text-slate-800 tracking-tight">
                      {b.storeCode}
                    </h4>
                    <div className="flex gap-2 mt-1 uppercase font-black text-[10px] text-slate-400">
                      <span>{b.area}</span>•<span>{b.team}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 mt-2">
                      {b.asset}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border-2 ${
                        b.status &&
                        (b.status.includes("แล้ว") ||
                          b.status.includes("Completed"))
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                          : "bg-orange-50 border-orange-100 text-orange-600"
                      }`}
                    >
                      {b.status}
                    </span>
                    <button
                      onClick={() => {
                        openEditModal(b);
                      }}
                      className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-all"
                    >
                      <Edit3 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ADMIN --- */}
        {role === "admin" && isAdminLoggedIn && (
          <div className="space-y-8">
            <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border w-fit mx-auto md:mx-0">
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === "reports"
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <ClipboardList size={16} /> แจ้งปัญหาหน้างาน
              </button>
              <button
                onClick={() => setActiveTab("internal")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === "internal"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <Briefcase size={16} /> งานภายใน
              </button>
            </div>
            {activeTab === "reports" && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    label="เคสทั้งหมด"
                    value={reports.length}
                    color="bg-slate-900"
                    icon={<ClipboardList size={24} />}
                  />
                  <StatCard
                    label="รอรับเรื่อง"
                    value={reports.filter((r) => r.status === "Pending").length}
                    color="bg-amber-500"
                    icon={<Clock size={24} />}
                  />
                  <StatCard
                    label="วิเคราะห์"
                    value={
                      reports.filter((r) => r.status === "Analyzing").length
                    }
                    color="bg-blue-600"
                    icon={<Wrench size={24} />}
                  />
                  <StatCard
                    label="เสร็จสิ้น"
                    value={
                      reports.filter((r) => r.status === "Resolved").length
                    }
                    color="bg-emerald-600"
                    icon={<CheckCircle2 size={24} />}
                  />
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative flex-1 w-full">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-xl font-bold outline-none border border-transparent focus:border-slate-800 transition-all"
                      placeholder="ค้นหาชื่อ, รหัส, รายละเอียด..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <select
                      className="flex-1 md:w-40 p-4 bg-slate-50 rounded-xl font-bold outline-none border border-transparent"
                      value={adminFilterArea}
                      onChange={(e) => {
                        setAdminFilterArea(e.target.value);
                        setAdminFilterTeam("All");
                      }}
                    >
                      <option value="All">ทุกพื้นที่</option>
                      {Object.keys(AREA_DATA).map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                    <select
                      className="flex-1 md:w-40 p-4 bg-slate-50 rounded-xl font-bold outline-none border border-transparent"
                      value={adminFilterTeam}
                      onChange={(e) => setAdminFilterTeam(e.target.value)}
                      disabled={adminFilterArea === "All"}
                    >
                      <option value="All">ทุกทีม</option>
                      {adminFilterArea !== "All" &&
                        AREA_DATA[adminFilterArea].map((tm) => (
                          <option key={tm} value={tm}>
                            {tm}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={exportToCSV}
                      className="p-4 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100"
                    >
                      <span className="hidden md:inline font-bold">Export</span>{" "}
                      <FileSpreadsheet size={20} className="md:hidden" />
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                          <th className="p-6">พนักงาน / แผนก</th>
                          <th className="p-6">รายละเอียดปัญหา</th>
                          <th className="p-6">สถานะงาน</th>
                          <th className="p-6 text-center">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-sm">
                        {filteredReports.map((r) => (
                          <tr
                            key={r.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-6">
                              <div className="font-black text-slate-800">
                                {r.employeeName}
                              </div>
                              <div className="text-[10px] text-blue-600 font-black uppercase mt-1">
                                {r.employeeId} • {r.department}
                              </div>
                            </td>
                            <td className="p-6 max-w-md">
                              <p className="font-bold text-slate-600 line-clamp-2">
                                {r.description}
                              </p>
                              {r.fileLinks?.length > 0 && (
                                <button
                                  onClick={() =>
                                    setSelectedReportFiles(r.fileLinks)
                                  }
                                  className="mt-2 text-[10px] font-black uppercase text-blue-600 flex items-center gap-1 hover:underline"
                                >
                                  <Eye size={12} /> ดูรูปหลักฐาน (
                                  {r.fileLinks.length})
                                </button>
                              )}
                            </td>
                            <td className="p-6">
                              <select
                                value={r.status}
                                onChange={(e) =>
                                  updateReportStatus(r.id, e.target.value)
                                }
                                className={`p-2 rounded-lg text-[11px] font-black border-2 outline-none uppercase tracking-widest ${
                                  r.status === "Resolved"
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                    : "bg-orange-50 border-orange-200 text-orange-700"
                                }`}
                              >
                                <option value="Pending">รอรับเรื่อง</option>
                                <option value="Analyzing">วิเคราะห์</option>
                                <option value="Resolved">เสร็จสิ้น</option>
                              </select>
                            </td>
                            <td className="p-6 text-center text-slate-300">
                              <Settings size={18} className="mx-auto" />
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
              /* ... (Internal Tasks View) ... */
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    Internal Tasks
                  </h3>
                  <button
                    onClick={() => setShowInternalModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    <PlusCircle size={16} /> เพิ่มงานใหม่
                  </button>
                </div>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setInternalView("board")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      internalView === "board"
                        ? "bg-slate-800 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    Board
                  </button>
                  <button
                    onClick={() => setInternalView("timeline")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      internalView === "timeline"
                        ? "bg-slate-800 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    Timeline
                  </button>
                  <button
                    onClick={() => setInternalView("stats")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      internalView === "stats"
                        ? "bg-slate-800 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    Workload
                  </button>
                </div>
                {internalView === "board" && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto pb-4">
                    {["To Do", "In Progress", "Review/QC", "Done"].map(
                      (status) => (
                        <div
                          key={status}
                          className="bg-slate-100 p-6 rounded-[2rem] border border-slate-200 min-h-[400px] min-w-[280px]"
                        >
                          <h4 className="font-black text-slate-500 mb-4 uppercase text-xs tracking-widest flex justify-between">
                            {status}{" "}
                            <span className="bg-white px-2 py-0.5 rounded text-slate-400 shadow-sm">
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
                                  onClick={() => setEditingTask(task)}
                                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group relative cursor-pointer"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <PriorityBadge p={task.priority} />
                                    {task.dueDate && (
                                      <span
                                        className={`text-[10px] font-bold flex items-center gap-1 ${
                                          new Date(task.dueDate) < new Date() &&
                                          task.status !== "Done"
                                            ? "text-red-500"
                                            : "text-slate-400"
                                        }`}
                                      >
                                        <Clock size={12} />{" "}
                                        {safeDate(task.dueDate)}
                                      </span>
                                    )}
                                  </div>
                                  <h5 className="font-bold text-slate-800 text-sm mb-1">
                                    {task.title}
                                  </h5>
                                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                      <User size={12} />{" "}
                                      {task.assignee
                                        ? task.assignee.split(" ")[0]
                                        : "?"}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
                {internalView === "timeline" && (
                  <div className="bg-white p-6 rounded-[2rem] border shadow-sm space-y-4">
                    {internalTasks
                      .sort((a, b) => (a.startDate || 0) - (b.startDate || 0))
                      .map((task) => (
                        <div
                          key={task.id}
                          onClick={() => setEditingTask(task)}
                          className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-2xl hover:bg-slate-50 cursor-pointer"
                        >
                          <div className="w-32 text-xs font-bold text-slate-400">
                            {safeDate(task.startDate)}
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                              <div
                                className={`h-full ${
                                  task.status === "Done"
                                    ? "bg-green-500"
                                    : "bg-indigo-500"
                                }`}
                                style={{
                                  width:
                                    task.status === "Done" ? "100%" : "50%",
                                }}
                              ></div>
                            </div>
                            <h5 className="font-bold text-slate-800">
                              {task.title}
                            </h5>
                          </div>
                          <div className="flex items-center gap-2">
                            <PriorityBadge p={task.priority} />
                            <div className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-lg">
                              {task.status}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                {internalView === "stats" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
                      <h4 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                        Team Workload
                      </h4>
                      <div className="space-y-4">
                        {Object.entries(
                          AUTHORIZED_USERS.reduce(
                            (acc, u) => ({ ...acc, [u.name]: 0 }),
                            {}
                          )
                        ).map(([name, _]) => {
                          const count = internalTasks.filter(
                            (t) =>
                              (t.status === "In Progress" ||
                                t.status === "To Do") &&
                              (t.assignee === name ||
                                t.assignee?.includes(name))
                          ).length;
                          return (
                            <div key={name} className="flex items-center gap-4">
                              <div className="w-32 text-xs font-bold text-slate-500 truncate">
                                {name}
                              </div>
                              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-500 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      (count / 10) * 100,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="text-sm font-black text-slate-800">
                                {count}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODALS --- */}

      {/* Import Modal - NEW Paste Style */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Database size={24} className="text-blue-500" /> นำเข้าข้อมูล
                (Import)
              </h3>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setPreviewData([]);
                  setPasteData("");
                }}
              >
                <XCircle className="text-slate-400 hover:text-red-500" />
              </button>
            </div>

            <div className="mb-6 flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
              <button
                onClick={() => setImportTargetProject(PROJECT_TYPES.REPAIR)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  importTargetProject === PROJECT_TYPES.REPAIR
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-slate-400"
                }`}
              >
                🛠️ ซ่อมท่อ
              </button>
              <button
                onClick={() => setImportTargetProject(PROJECT_TYPES.REPLACE)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  importTargetProject === PROJECT_TYPES.REPLACE
                    ? "bg-white shadow-sm text-orange-600"
                    : "text-slate-400"
                }`}
              >
                📄 เสนอราคา
              </button>
            </div>

            {previewData.length === 0 ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-blue-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                  />
                  <FileSpreadsheet
                    className="mx-auto text-slate-300 mb-2"
                    size={40}
                  />
                  <p className="font-bold text-slate-500">เลือกไฟล์ CSV</p>
                  <p className="text-[10px] text-slate-400">
                    รองรับภาษาไทย (UTF-8)
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">หรือ</span>
                  </div>
                </div>
                <textarea
                  className="w-full h-32 p-4 border-2 rounded-xl font-mono text-xs bg-slate-50 focus:border-blue-500 outline-none"
                  placeholder="วางข้อมูลจาก Excel ที่นี่ (Copy & Paste)..."
                  value={pasteData}
                  onChange={handlePasteChange}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-2">
                  <span>พบ {previewData.length} รายการ</span>
                  <button
                    onClick={() => {
                      setPreviewData([]);
                      setPasteData("");
                    }}
                    className="text-red-500 hover:underline"
                  >
                    เคลียร์ค่า
                  </button>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 h-64 overflow-auto border border-slate-200">
                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold">
                        <th className="p-2">#</th>
                        <th className="p-2">Store Code</th>
                        <th className="p-2">Area</th>
                        <th className="p-2">Team</th>
                        <th className="p-2">Asset</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 50).map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-100 hover:bg-slate-100"
                        >
                          <td className="p-2 text-slate-400">{i + 1}</td>
                          <td className="p-2 font-mono text-slate-600 truncate max-w-[100px]">
                            {row[0]}
                          </td>
                          <td className="p-2 font-mono text-slate-600 truncate max-w-[100px]">
                            {row[1]}
                          </td>
                          <td className="p-2 font-mono text-slate-600 truncate max-w-[100px]">
                            {row[2]}
                          </td>
                          <td className="p-2 font-mono text-slate-600 truncate max-w-[100px]">
                            {row[3]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {previewData.length > 50 && (
                    <p className="text-center text-[10px] text-slate-400 mt-2">
                      ... แสดง 50 รายการแรกจาก {previewData.length}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setPreviewData([]);
                      setPasteData("");
                    }}
                    className="flex-1 p-4 bg-slate-100 rounded-xl font-bold text-slate-500 hover:bg-slate-200"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={confirmImport}
                    disabled={submitting}
                    className="flex-2 p-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting && (
                      <Loader2 className="animate-spin" size={16} />
                    )}
                    {submitting ? "กำลังบันทึก..." : `ยืนยันนำเข้า`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center max-w-sm w-full animate-in zoom-in-95">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">
              เรียบร้อยแล้ว!
            </h3>
            <p className="text-slate-500 font-medium mb-8">
              บันทึกข้อมูลสำเร็จ
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full p-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 h-[80vh] flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">
                  Task Details
                </span>
                <h3 className="text-xl font-black text-slate-800">
                  {editingTask.title}
                </h3>
              </div>
              <button onClick={() => setEditingTask(null)}>
                <XCircle className="text-slate-300 hover:text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              <div className="grid grid-cols-2 gap-4">
                <InfoBlock label="ผู้รับผิดชอบ" val={editingTask.assignee} />
                <InfoBlock
                  label="กำหนดส่ง"
                  val={safeDate(editingTask.dueDate)}
                />
                <InfoBlock
                  label="ความสำคัญ"
                  val={<PriorityBadge p={editingTask.priority} />}
                />
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    สถานะ
                  </label>
                  <select
                    value={editingTask.status}
                    onChange={(e) =>
                      updateStatus(editingTask.id, e.target.value, true)
                    }
                    className="w-full p-2 border-2 rounded-xl font-bold bg-white text-sm"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review/QC">Review/QC</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {editingTask.description}
                </p>
              </div>

              {/* Updates Section */}
              <div>
                <h4 className="font-black text-slate-700 text-sm mb-4 flex items-center gap-2">
                  <MessageSquare size={16} /> อัปเดตความคืบหน้า
                </h4>
                <div className="space-y-3 mb-4">
                  {editingTask.updates?.map((u, i) => (
                    <div
                      key={i}
                      className="bg-white p-3 rounded-xl border border-slate-100 text-xs"
                    >
                      <div className="flex justify-between text-slate-400 mb-1 font-bold">
                        <span>{u.user}</span>
                        <span>{safeDate(u.timestamp)}</span>
                      </div>
                      <p className="text-slate-600">{u.text}</p>
                    </div>
                  ))}
                  {(!editingTask.updates ||
                    editingTask.updates.length === 0) && (
                    <p className="text-center text-slate-300 text-xs italic">
                      ยังไม่มีอัปเดต
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 p-3 border-2 rounded-xl text-sm font-bold outline-none"
                    placeholder="พิมพ์อัปเดต..."
                    value={taskUpdateText}
                    onChange={(e) => setTaskUpdateText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTaskUpdate();
                    }}
                  />
                  <button
                    onClick={handleTaskUpdate}
                    className="p-3 bg-indigo-600 text-white rounded-xl font-bold"
                  >
                    <ArrowLeft size={16} className="rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Internal Task Modal (Add New) */}
      {showInternalModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <PlusCircle className="text-indigo-600" /> เพิ่มงานใหม่
            </h3>
            <form onSubmit={submitInternalTask} className="space-y-4">
              <input
                className="w-full p-4 border-2 rounded-xl font-bold outline-none"
                placeholder="หัวข้อ"
                value={internalForm.title}
                onChange={(e) =>
                  setInternalForm({ ...internalForm, title: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="w-full p-4 border-2 rounded-xl font-bold bg-white"
                  value={internalForm.assignee}
                  onChange={(e) =>
                    setInternalForm({
                      ...internalForm,
                      assignee: e.target.value,
                    })
                  }
                >
                  <option value="">เลือกผู้รับผิดชอบ...</option>
                  {AUTHORIZED_USERS.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full p-4 border-2 rounded-xl font-bold bg-white outline-none"
                  value={internalForm.priority}
                  onChange={(e) =>
                    setInternalForm({
                      ...internalForm,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="High">ด่วนมาก</option>
                  <option value="Medium">ปกติ</option>
                  <option value="Low">ไม่ด่วน</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    วันที่เริ่ม
                  </label>
                  <input
                    type="date"
                    className="w-full p-4 border-2 rounded-xl font-bold outline-none"
                    value={internalForm.startDate}
                    onChange={(e) =>
                      setInternalForm({
                        ...internalForm,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <input
                type="date"
                className="w-full p-4 border-2 rounded-xl font-bold outline-none"
                value={internalForm.dueDate}
                onChange={(e) =>
                  setInternalForm({ ...internalForm, dueDate: e.target.value })
                }
              />
              <textarea
                className="w-full p-4 border-2 rounded-xl font-bold outline-none"
                placeholder="รายละเอียด..."
                rows="3"
                value={internalForm.description}
                onChange={(e) =>
                  setInternalForm({
                    ...internalForm,
                    description: e.target.value,
                  })
                }
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInternalModal(false)}
                  className="flex-1 p-4 bg-slate-100 rounded-xl font-black text-slate-500"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 p-4 bg-indigo-600 text-white rounded-xl font-black"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingBranch && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black mb-1">
              อัปเดตงาน: {editingBranch.storeCode}
            </h3>
            <p className="text-slate-400 font-bold text-xs mb-6 uppercase tracking-widest">
              {editingBranch.projectType === PROJECT_TYPES.REPAIR
                ? "Project: Repair"
                : "Project: Replacement"}
            </p>

            {/* FORM FOR PROJECT 1: REPAIR */}
            {editingBranch.projectType === PROJECT_TYPES.REPAIR && (
              <form onSubmit={handleRepairSubmit} className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    สถานะการแก้ไข *
                  </label>
                  <select
                    className="w-full p-3 rounded-xl border font-bold"
                    value={editingBranch.status}
                    onChange={(e) =>
                      setEditingBranch({
                        ...editingBranch,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="ยังไม่ดำเนินการ">ยังไม่ดำเนินการ</option>
                    <option value="มีการดำเนินการแล้ว">
                      มีการดำเนินการแล้ว
                    </option>
                  </select>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    รูปภาพหน้าร้าน (1 รูป) *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setAttachments([
                        ...attachments,
                        { file: e.target.files[0], type: "front" },
                      ])
                    }
                  />
                </div>

                {/* Dynamic Cabinets */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      รายการตู้ที่แก้ไข
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setRepairCabinets([
                          ...repairCabinets,
                          { assetNo: "", beforeFile: null, afterFile: null },
                        ])
                      }
                      className="text-blue-600 text-xs font-bold flex items-center gap-1"
                    >
                      <PlusCircle size={14} /> เพิ่มตู้
                    </button>
                  </div>
                  {repairCabinets.map((cab, idx) => (
                    <div
                      key={idx}
                      className="mb-4 p-4 border rounded-2xl relative"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setRepairCabinets(
                            repairCabinets.filter((_, i) => i !== idx)
                          )
                        }
                        className="absolute top-2 right-2 text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                      <input
                        className="w-full p-2 border rounded-lg mb-2 text-sm font-bold"
                        placeholder="เลข Asset ตู้"
                        value={cab.assetNo}
                        onChange={(e) => {
                          const newCabs = [...repairCabinets];
                          newCabs[idx].assetNo = e.target.value;
                          setRepairCabinets(newCabs);
                        }}
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] mb-1">ก่อนทำ</p>
                          <input
                            type="file"
                            accept="image/*"
                            className="text-xs"
                            onChange={(e) => {
                              const newCabs = [...repairCabinets];
                              newCabs[idx].beforeFile = e.target.files[0];
                              setRepairCabinets(newCabs);
                            }}
                            required
                          />
                        </div>
                        <div>
                          <p className="text-[10px] mb-1">หลังทำ</p>
                          <input
                            type="file"
                            accept="image/*"
                            className="text-xs"
                            onChange={(e) => {
                              const newCabs = [...repairCabinets];
                              newCabs[idx].afterFile = e.target.files[0];
                              setRepairCabinets(newCabs);
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {repairCabinets.length === 0 && (
                    <p className="text-center text-xs text-slate-400 italic p-4 border-2 border-dashed rounded-xl">
                      ยังไม่ได้เพิ่มข้อมูลตู้
                    </p>
                  )}
                </div>

                <textarea
                  className="w-full p-4 border rounded-xl font-bold text-sm"
                  placeholder="หมายเหตุเพิ่มเติม..."
                  rows="2"
                  value={editingBranch.remarks || ""}
                  onChange={(e) =>
                    setEditingBranch({
                      ...editingBranch,
                      remarks: e.target.value,
                    })
                  }
                />

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingBranch(null)}
                    className="flex-1 p-4 bg-slate-100 rounded-xl font-bold text-slate-500"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-2 p-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg"
                  >
                    {submitting ? "กำลังบันทึก..." : "บันทึกการซ่อม"}
                  </button>
                </div>
              </form>
            )}

            {/* FORM FOR PROJECT 2: REPLACEMENT */}
            {editingBranch.projectType === PROJECT_TYPES.REPLACE && (
              <form onSubmit={handleReplaceSubmit} className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    สถานะการเสนอราคา *
                  </label>
                  <select
                    className="w-full p-3 rounded-xl border font-bold"
                    value={editingBranch.status}
                    onChange={(e) =>
                      setEditingBranch({
                        ...editingBranch,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="ยังไม่เสนอราคา">ยังไม่เสนอราคา</option>
                    <option value="เสนอราคาแล้ว">เสนอราคาแล้ว</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    className="p-4 border rounded-xl font-bold text-sm"
                    placeholder="เลขที่ Call *"
                    value={replaceData.callNo}
                    onChange={(e) =>
                      setReplaceData({ ...replaceData, callNo: e.target.value })
                    }
                  />
                  <input
                    required
                    className="p-4 border rounded-xl font-bold text-sm"
                    placeholder="เลขที่ใบเสนอราคา (วศ.) *"
                    value={replaceData.quotationNo}
                    onChange={(e) =>
                      setReplaceData({
                        ...replaceData,
                        quotationNo: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-dashed rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 mb-2">
                      รูปใบประเมิน *
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="text-xs"
                      onChange={(e) =>
                        setReplaceData({
                          ...replaceData,
                          assessmentImg: e.target.files[0],
                        })
                      }
                      required
                    />
                  </div>
                  <div className="p-4 border-2 border-dashed rounded-xl text-center">
                    <p className="text-[10px] font-bold text-slate-400 mb-2">
                      รูปหน้าร้าน *
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="text-xs"
                      onChange={(e) =>
                        setReplaceData({
                          ...replaceData,
                          frontImg: e.target.files[0],
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingBranch(null)}
                    className="flex-1 p-4 bg-slate-100 rounded-xl font-bold text-slate-500"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-2 p-4 bg-orange-500 text-white rounded-xl font-bold shadow-lg"
                  >
                    {submitting ? "กำลังบันทึก..." : "บันทึกการเสนอราคา"}
                  </button>
                </div>
              </form>
            )}

            {/* Fallback for undefined project type (Old data) */}
            {!editingBranch.projectType && (
              <div className="text-center py-10">
                <p className="text-red-500 font-bold">
                  ไม่ระบุประเภทโปรเจกต์ (ข้อมูลเก่า)
                </p>
                <button
                  onClick={() =>
                    setEditingBranch({
                      ...editingBranch,
                      projectType: PROJECT_TYPES.REPAIR,
                    })
                  }
                  className="mt-4 px-4 py-2 bg-slate-200 rounded-lg text-xs font-bold"
                >
                  แก้ไขเป็นซ่อมท่อ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedReportFiles && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] p-6 flex flex-col items-center justify-center backdrop-blur-xl"
          onClick={() => setSelectedReportFiles(null)}
        >
          <button
            onClick={() => setSelectedReportFiles(null)}
            className="absolute top-6 right-6 text-white hover:scale-110 transition-all"
          >
            <XCircle size={40} />
          </button>
          <div
            className="w-full max-w-6xl h-[85vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedReportFiles.map((link, i) => (
              <div
                key={i}
                className="bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col group h-fit"
              >
                <iframe
                  src={link.replace("/view", "/preview")}
                  className="w-full border-0 min-h-[400px] bg-slate-100"
                  allow="autoplay"
                  title={`preview-${i}`}
                />
                <div className="p-5 bg-slate-900 flex justify-between items-center border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-black text-white text-[10px]">
                      {i + 1}
                    </div>
                    <span className="text-white font-black uppercase text-[10px] tracking-widest">
                      Evidence
                    </span>
                  </div>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Download / Open
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

// --- Helper Components ---
const MenuCard = ({ icon, title, desc, onClick, color }) => (
  <button
    onClick={onClick}
    className={`group p-12 rounded-[2.5rem] shadow-xl border border-slate-100 transition-all flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl ${color}`}
  >
    <div className="bg-white/20 p-6 rounded-3xl mb-8 shadow-lg backdrop-blur-sm">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4">{title}</h3>
    <p className="font-medium leading-relaxed text-sm opacity-90">{desc}</p>
  </button>
);

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
    <div className={`${color} text-white p-5 rounded-[1.5rem] shadow-xl`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-4xl font-black text-slate-900 tracking-tighter">
        {value}
      </p>
    </div>
  </div>
);

const TabBtn = ({ active, icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
      active
        ? `${color} text-white shadow-lg`
        : "text-slate-400 hover:bg-slate-50"
    }`}
  >
    {icon} {label}
  </button>
);

const InfoBlock = ({ label, val }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {label}
    </label>
    <div className="font-bold text-slate-800 text-sm">{val}</div>
  </div>
);

const PriorityBadge = ({ p }) => {
  const color =
    p === "High"
      ? "bg-red-100 text-red-700 border-red-200"
      : p === "Medium"
      ? "bg-orange-100 text-orange-700 border-orange-200"
      : "bg-green-100 text-green-700 border-green-200";
  return (
    <span
      className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${color}`}
    >
      {p}
    </span>
  );
};

export default App;
