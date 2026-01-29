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
} from "lucide-react";

// --- 🔴 CONFIGURATION 🔴 ---

// 1. รหัส Firebase ของคุณ (อัปเดตจากที่คุณให้มาล่าสุด)
const firebaseConfig = {
  apiKey: "AIzaSyDb5Cn1VZoc1XDA8RwmBvJzPY7zHKRjVtQ",
  authDomain: "cpretailink-eng.firebaseapp.com",
  projectId: "cpretailink-eng",
  storageBucket: "cpretailink-eng.firebasestorage.app",
  messagingSenderId: "375453355677",
  appId: "1:375453355677:web:5f48fc5c052fe87037ce74",
};

// 2. ลิงก์ Google Apps Script สำหรับเก็บรูปภาพ (Hybrid Mode)
const IMAGE_UPLOAD_URL =
  "https://script.google.com/macros/s/AKfycbwbKRP47ukTrfES5hrmSWXbHLRRUN_4_KlHOuSX4zgV7areWok9Q54TTBeSO_R6MsWpyg/exec";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const ADMIN_CREDENTIALS = { username: "admin", password: "7839858" };

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

// ข้อมูลสาขาตั้งต้น (สำหรับกดปุ่ม Import ครั้งแรก)
const INITIAL_BRANCH_DATA = [
  {
    storeCode: "B16198",
    area: "RSL",
    team: "RSL6SA",
    asset: "ตู้OPEN SHOWCASE ELITE 0.90ม.R404A",
  },
  {
    storeCode: "B16170",
    area: "NEL",
    team: "NEL4",
    asset: "ตู้OPEN SHOWCASE ELITE 0.90ม.R404A",
  },
  {
    storeCode: "B16180",
    area: "BW",
    team: "BW3",
    asset: "ตู้OPEN SHOWCASE ELITE 0.90ม.R404A",
  },
  {
    storeCode: "B00519",
    area: "BN",
    team: "BN3",
    asset: "ตู้OPEN SHOWCASE ELITE 0.90ม.R404A",
  },
  {
    storeCode: "B00903",
    area: "BE",
    team: "BE2",
    asset: "ตู้OPEN SHOWCASE ELITE 0.90ม.R404A",
  },
  {
    storeCode: "B04692",
    area: "BN",
    team: "BN2",
    asset: "ตู้OPEN SHOWCASE ELITE 0.90ม.R404A",
  },
  {
    storeCode: "B16259",
    area: "BE",
    team: "BE6",
    asset: "ตู้OPEN SHOWCASE ELITE 0.90ม.R404A",
  },
  {
    storeCode: "B15532",
    area: "RC",
    team: "RC5SA",
    asset: "ตู้OPEN SHOWCASE ELITE 0.90ม.R404A",
  },
];

const App = () => {
  const [role, setRole] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const [reports, setReports] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [trackerSearch, setTrackerSearch] = useState("");
  const [trackerArea, setTrackerArea] = useState("All");
  const [trackerTeam, setTrackerTeam] = useState("All");
  const [editingBranch, setEditingBranch] = useState(null);
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

  // --- Real-time Listeners ---
  useEffect(() => {
    // ล็อกอินอัตโนมัติแบบไม่ระบุตัวตน
    signInAnonymously(auth).catch(console.error);

    setLoading(true);
    // ฟังข้อมูลแจ้งปัญหา
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
        setLoading(false);
      }
    );

    // ฟังข้อมูลติดตามสาขา
    const unsubBranches = onSnapshot(collection(db, "branches"), (snap) => {
      setBranchData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubReports();
      unsubBranches();
    };
  }, []);

  // --- Functions ---
  const importInitialBranches = async () => {
    if (!window.confirm("ต้องการนำเข้าข้อมูลสาขาตั้งต้นใช่หรือไม่?")) return;
    setSubmitting(true);
    try {
      const batch = writeBatch(db);
      INITIAL_BRANCH_DATA.forEach((b) => {
        const d = doc(collection(db, "branches"));
        batch.set(d, {
          ...b,
          status: "On process",
          ticket: "",
          remarks: "",
          fileLinks: [],
        });
      });
      await batch.commit();
      setMessage({ type: "success", text: "นำเข้าข้อมูลสาขาสำเร็จ!" });
    } catch (e) {
      setMessage({ type: "error", text: "ผิดพลาด: " + e.message });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        resolve({ base64: null, file: file });
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
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
            fileName: `file_${Date.now()}_${file.name}`,
            mimeType: "image/jpeg",
          });
        };
      };
    });
  };

  const handleSubmission = async (e, type) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "info", text: "กำลังส่งข้อมูลและอัปโหลดไฟล์..." });
    try {
      // 1. จัดการไฟล์และส่งไป Google Drive
      const processed = await Promise.all(
        attachments.map((a) => compressImage(a.file))
      );
      const res = await fetch(IMAGE_UPLOAD_URL, {
        method: "POST",
        body: JSON.stringify({ action: "uploadOnly", files: processed }),
      });
      const result = await res.json();
      const urls = result.urls || [];

      // 2. บันทึกลง Firebase
      if (type === "report") {
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
      } else {
        await updateDoc(doc(db, "branches", editingBranch.id), {
          status: editingBranch.status,
          ticket: editingBranch.ticket,
          remarks: editingBranch.remarks,
          fileLinks: [...(editingBranch.fileLinks || []), ...urls],
        });
        setEditingBranch(null);
      }
      setAttachments([]);
      setMessage({ type: "success", text: "บันทึกข้อมูลเรียบร้อยแล้ว!" });
    } catch (err) {
      setMessage({ type: "error", text: "ผิดพลาด: " + err.message });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateReportStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "reports", id), { status: newStatus });
  };

  const filteredBranches = useMemo(() => {
    return branchData.filter((b) => {
      const mSearch = (b.storeCode || "")
        .toLowerCase()
        .includes(trackerSearch.toLowerCase());
      const mArea = trackerArea === "All" || b.area === trackerArea;
      const mTeam = trackerTeam === "All" || b.team === trackerTeam;
      return mSearch && mArea && mTeam;
    });
  }, [branchData, trackerSearch, trackerArea, trackerTeam]);

  const trackerStats = useMemo(() => {
    const remByArea = {};
    Object.keys(AREA_DATA).forEach((a) => (remByArea[a] = 0));
    branchData.forEach((b) => {
      if (b.status === "On process")
        remByArea[b.area] = (remByArea[b.area] || 0) + 1;
    });
    return {
      total: branchData.length,
      remaining: branchData.filter((b) => b.status === "On process").length,
      completed: branchData.filter((b) => b.status !== "On process").length,
      breakdown: Object.entries(remByArea).sort((a, b) => b[1] - a[1]),
    };
  }, [branchData]);

  // --- Views ---

  // หน้าหลัก (Role Selection)
  if (!role)
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4 tracking-tight">
            ระบบบริหารงานวิศวกรรม
          </h1>
          <h2 className="text-2xl md:text-3xl font-black text-[#2563eb] uppercase tracking-widest">
            หน่วยงานวิเคราะห์ CALL
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          {/* แจ้งปัญหา */}
          <button
            onClick={() => setRole("reporter")}
            className="group bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-blue-500 transition-all flex flex-col items-center text-center"
          >
            <div className="bg-blue-50 p-6 rounded-full mb-8 text-[#2563eb] group-hover:scale-110 transition-transform shadow-inner">
              <PlusCircle size={64} />
            </div>
            <h3 className="text-2xl font-black text-[#1e293b] mb-4">
              แจ้งปัญหา
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              แจ้งปัญหาหน้างานเพื่อวิเคราะห์หาแนวทางการแก้ไข
            </p>
          </button>

          {/* แดชบอร์ด */}
          <button
            onClick={() => setRole("admin")}
            className="group bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-slate-800 transition-all flex flex-col items-center text-center"
          >
            <div className="bg-slate-50 p-6 rounded-full mb-8 text-[#1e293b] group-hover:scale-110 transition-transform shadow-inner">
              <LayoutDashboard size={64} />
            </div>
            <h3 className="text-2xl font-black text-[#1e293b] mb-4">
              แดชบอร์ด
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              บริหารจัดการงานวิเคราะห์และงานภายใน
            </p>
          </button>

          {/* ติดตามงานสาขา */}
          <button
            onClick={() => setRole("tracker")}
            className="group bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-orange-500 transition-all flex flex-col items-center text-center"
          >
            <div className="bg-orange-50 p-6 rounded-full mb-8 text-[#f97316] group-hover:scale-110 transition-transform shadow-inner">
              <MapPin size={64} />
            </div>
            <h3 className="text-2xl font-black text-[#1e293b] mb-4">
              ติดตามงานสาขา
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              อัปเดตสถานะงานติดตามสาขารายพื้นที่
            </p>
          </button>
        </div>

        <footer className="mt-20">
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">
            ENGINEERING ANALYSIS SYSTEM • CP RETAILINK
          </p>
        </footer>
      </div>
    );

  // ล็อกอิน Admin
  if (role === "admin" && !isAdminLoggedIn)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 mx-auto text-[#0f172a] mb-4" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-[#0f172a]">
              พื้นที่เจ้าหน้าที่
            </h2>
            <p className="text-slate-400 font-bold text-sm">
              เข้าสู่ระบบเพื่อจัดการข้อมูล
            </p>
          </div>
          <div className="space-y-4">
            <input
              className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all"
              placeholder="ชื่อผู้ใช้"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm({ ...loginForm, username: e.target.value })
              }
            />
            <input
              type="password"
              className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all"
              placeholder="รหัสผ่าน"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setRole(null)}
                className="flex-1 bg-slate-100 text-slate-500 p-4 rounded-2xl font-black uppercase transition-all hover:bg-slate-200"
              >
                กลับ
              </button>
              <button
                onClick={() => {
                  if (
                    loginForm.username === ADMIN_CREDENTIALS.username &&
                    loginForm.password === ADMIN_CREDENTIALS.password
                  )
                    setIsAdminLoggedIn(true);
                  else alert("รหัสผ่านไม่ถูกต้อง");
                }}
                className="flex-2 bg-[#0f172a] text-white p-4 rounded-2xl font-black uppercase transition-all hover:bg-black"
              >
                ล็อกอิน
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  // ส่วนแสดงผลหลัก (หลังเลือกบทบาท)
  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans pb-12">
      <header
        className={`${
          role === "admin"
            ? "bg-[#0f172a]"
            : role === "tracker"
            ? "bg-[#c2410c]"
            : "bg-[#1d4ed8]"
        } text-white p-5 shadow-xl sticky top-0 z-40 transition-colors`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setRole(null);
                setIsAdminLoggedIn(false);
              }}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-black uppercase tracking-tight">
              {role === "admin"
                ? "แดชบอร์ดจัดการงาน"
                : role === "tracker"
                ? "ติดตามงานสาขา"
                : "ระบบแจ้งปัญหาหน้างาน"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {role === "admin" && (
              <button
                onClick={importInitialBranches}
                className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-2 border border-white/20 transition-all"
              >
                <Database size={14} /> Import Data
              </button>
            )}
            <RefreshCw
              className={loading ? "animate-spin" : "cursor-pointer"}
              onClick={() => window.location.reload()}
              size={20}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {message && (
          <div
            className={`p-4 rounded-2xl mb-8 font-black text-center border-2 shadow-lg animate-in slide-in-from-top-4 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                : message.type === "error"
                ? "bg-red-50 border-red-100 text-red-800"
                : "bg-blue-50 border-blue-100 text-blue-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* --- ROLE: REPORTER --- */}
        {role === "reporter" && (
          <form
            onSubmit={(e) => handleSubmission(e, "report")}
            className="bg-white p-10 rounded-[3rem] shadow-xl max-w-2xl mx-auto border border-slate-100 space-y-6 animate-in slide-in-from-bottom-4"
          >
            <h2 className="text-2xl font-black text-center text-blue-600 uppercase tracking-tighter">
              แบบฟอร์มแจ้งปัญหา
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  รหัสพนักงาน
                </label>
                <input
                  required
                  className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-600"
                  placeholder="เช่น 123XXXX"
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
                  className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-600"
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
                  className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold bg-white outline-none focus:border-blue-600"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value, team: "" })
                  }
                >
                  <option value="">--- เลือกพื้นที่ ---</option>
                  {Object.keys(AREA_DATA).map((a) => (
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
                  className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold bg-white outline-none focus:border-blue-600"
                  value={formData.team}
                  onChange={(e) =>
                    setFormData({ ...formData, team: e.target.value })
                  }
                  disabled={!formData.area}
                >
                  <option value="">--- เลือกทีม ---</option>
                  {formData.area &&
                    AREA_DATA[formData.area].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                รายละเอียดปัญหา
              </label>
              <textarea
                required
                rows="4"
                className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-600"
                placeholder="ระบุรายละเอียดปัญหาที่พบ..."
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
              <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-10 text-center relative hover:bg-slate-50 transition-all cursor-pointer group">
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) =>
                    setAttachments(
                      Array.from(e.target.files).map((file) => ({
                        file,
                        preview: URL.createObjectURL(file),
                        type: file.type.startsWith("video") ? "video" : "image",
                      }))
                    )
                  }
                  accept="image/*,video/*"
                />
                <Camera
                  size={56}
                  className="mx-auto text-slate-200 group-hover:text-blue-500 transition-colors mb-2"
                />
                <p className="font-black text-slate-300 uppercase text-[10px] tracking-widest">
                  กดเพื่อแนบไฟล์หลักฐาน (เลือกได้หลายไฟล์)
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
              className="w-full p-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-100 active:scale-95 transition-all uppercase tracking-widest"
            >
              {submitting ? "กำลังส่งข้อมูล..." : "ส่งข้อมูลแจ้งปัญหา"}
            </button>
          </form>
        )}

        {/* --- ROLE: TRACKER --- */}
        {role === "tracker" && (
          <div className="space-y-8 animate-in fade-in duration-500">
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
                  branchData.filter((b) => b.status !== "On process").length
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

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-400 text-xs uppercase mb-6 tracking-[0.3em] flex items-center gap-2">
                <BarChart3 size={16} /> งานคงเหลือรายพื้นที่ (เรียงจากมากไปน้อย)
              </h3>
              <div className="flex flex-wrap gap-3">
                {trackerStats.breakdown.map(([area, count]) => (
                  <div
                    key={area}
                    className={`px-6 py-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                      count > 0
                        ? "border-orange-100 bg-orange-50 shadow-sm"
                        : "border-slate-50 bg-slate-50 opacity-40"
                    }`}
                  >
                    <span className="font-black text-sm text-slate-500">
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

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full group">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors"
                  size={20}
                />
                <input
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-[1.5rem] font-bold outline-none focus:ring-4 ring-orange-50 transition-all border-2 border-transparent focus:border-orange-500"
                  placeholder="ค้นหารหัสสาขา..."
                  value={trackerSearch}
                  onChange={(e) => setTrackerSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-40">
                  <select
                    className="w-full p-5 bg-slate-50 rounded-[1.5rem] font-bold outline-none border-2 border-transparent focus:border-orange-500 appearance-none text-center"
                    value={trackerArea}
                    onChange={(e) => {
                      setTrackerArea(e.target.value);
                      setTrackerTeam("All");
                    }}
                  >
                    <option value="All">ทุกพื้นที่</option>
                    {Object.keys(AREA_DATA).map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
                <div className="relative flex-1 md:w-40">
                  <select
                    className="w-full p-5 bg-slate-50 rounded-[1.5rem] font-bold outline-none border-2 border-transparent focus:border-orange-500 appearance-none text-center"
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
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredBranches.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap md:flex-nowrap justify-between items-center hover:shadow-md transition-all border-l-8 border-l-slate-200 hover:border-l-orange-500"
                >
                  <div className="min-w-[250px]">
                    <h4 className="font-black text-2xl text-[#1e293b] tracking-tighter">
                      {b.storeCode}
                    </h4>
                    <div className="flex gap-2 mt-1 uppercase font-black text-[10px] text-slate-400 tracking-widest">
                      <span>{b.area}</span>•<span>{b.team}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 mt-2 bg-slate-50 px-3 py-1 rounded-lg inline-block">
                      {b.asset}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <span
                      className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 ${
                        b.status === "On process"
                          ? "bg-orange-50 border-orange-100 text-orange-600"
                          : "bg-emerald-50 border-emerald-100 text-emerald-600"
                      }`}
                    >
                      {b.status}
                    </span>
                    <button
                      onClick={() => {
                        setEditingBranch(b);
                        setAttachments([]);
                      }}
                      className="p-4 bg-slate-50 rounded-2xl text-slate-300 hover:bg-orange-100 hover:text-orange-600 transition-all hover:scale-110 active:scale-95"
                    >
                      <Edit3 size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ROLE: ADMIN --- */}
        {role === "admin" && isAdminLoggedIn && (
          <div className="space-y-8 animate-in fade-in duration-700">
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
                value={reports.filter((r) => r.status === "Analyzing").length}
                color="bg-blue-600"
                icon={<Wrench size={24} />}
              />
              <StatCard
                label="เสร็จสิ้น"
                value={reports.filter((r) => r.status === "Resolved").length}
                color="bg-emerald-600"
                icon={<CheckCircle2 size={24} />}
              />
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <tr>
                    <th className="p-8">พนักงาน / แผนก</th>
                    <th className="p-8">รายละเอียดปัญหา</th>
                    <th className="p-8">สถานะงาน</th>
                    <th className="p-8 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {reports.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-8">
                        <div className="font-black text-slate-800 text-base">
                          {r.employeeName}
                        </div>
                        <div className="text-[10px] text-blue-600 font-black uppercase mt-1 bg-blue-50 px-2 py-0.5 rounded w-fit">
                          {r.employeeId} • {r.department}
                        </div>
                      </td>
                      <td className="p-8">
                        <p className="font-bold text-slate-600 leading-relaxed line-clamp-2">
                          {r.description}
                        </p>
                        {r.fileLinks?.length > 0 && (
                          <button
                            onClick={() => setSelectedReportFiles(r.fileLinks)}
                            className="mt-3 text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 hover:bg-blue-100 w-fit p-1.5 rounded-lg transition-all"
                          >
                            <Eye size={14} /> ดูหลักฐาน ({r.fileLinks.length})
                          </button>
                        )}
                      </td>
                      <td className="p-8">
                        <select
                          value={r.status}
                          onChange={(e) =>
                            updateReportStatus(r.id, e.target.value)
                          }
                          className={`p-3 rounded-xl text-[11px] font-black border-2 outline-none uppercase tracking-widest transition-all ${
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
                      <td className="p-8 text-center text-slate-200">
                        <Settings size={20} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL: EDIT BRANCH --- */}
      {editingBranch && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95">
            <h3 className="text-3xl font-black mb-1 tracking-tighter">
              Update Status
            </h3>
            <p className="text-blue-600 font-black uppercase text-xs mb-8">
              {editingBranch.storeCode}
            </p>
            <form
              onSubmit={(e) => handleSubmission(e, "branch")}
              className="space-y-5"
            >
              <select
                className="w-full p-5 border-2 border-slate-100 rounded-[1.5rem] font-bold bg-white outline-none focus:border-orange-500"
                value={editingBranch.status}
                onChange={(e) =>
                  setEditingBranch({ ...editingBranch, status: e.target.value })
                }
              >
                <option value="On process">On process</option>
                <option value="เข้าทำการแก้แล้ว">เข้าทำการแก้แล้ว</option>
              </select>
              <input
                className="w-full p-5 border-2 border-slate-100 rounded-[1.5rem] font-bold outline-none focus:border-orange-500"
                placeholder="เลขที่ Call (Ticket Number)"
                value={editingBranch.ticket || ""}
                onChange={(e) =>
                  setEditingBranch({ ...editingBranch, ticket: e.target.value })
                }
              />
              <textarea
                className="w-full p-5 border-2 border-slate-100 rounded-[1.5rem] font-bold outline-none focus:border-orange-500"
                placeholder="หมายเหตุเพิ่มเติม..."
                rows="3"
                value={editingBranch.remarks || ""}
                onChange={(e) =>
                  setEditingBranch({
                    ...editingBranch,
                    remarks: e.target.value,
                  })
                }
              />
              <div className="border-4 border-dashed border-slate-100 rounded-3xl p-6 text-center relative hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) =>
                    setAttachments(
                      Array.from(e.target.files).map((file) => ({
                        file,
                        preview: URL.createObjectURL(file),
                        type: file.type.startsWith("video") ? "video" : "image",
                      }))
                    )
                  }
                  accept="image/*,video/*"
                />
                <Camera size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  กดเพื่อแนบรูปเพิ่มเติม
                </p>
                {attachments.length > 0 && (
                  <p className="text-orange-600 font-black mt-2">
                    เลือกแล้ว {attachments.length} ไฟล์
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="flex-1 p-5 bg-slate-100 rounded-[1.5rem] font-black uppercase text-xs tracking-widest text-slate-400"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-2 p-5 bg-orange-500 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-100"
                >
                  {submitting ? "รอสักครู่..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: GALLERY --- */}
      {selectedReportFiles && (
        <div
          className="fixed inset-0 bg-black/98 z-[100] p-6 flex flex-col items-center justify-center backdrop-blur-3xl"
          onClick={() => setSelectedReportFiles(null)}
        >
          <button
            onClick={() => setSelectedReportFiles(null)}
            className="absolute top-8 right-8 text-white hover:rotate-90 transition-all p-2 bg-white/10 rounded-full"
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
                className="bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-700 shadow-2xl flex flex-col group h-fit"
              >
                <iframe
                  src={link.replace("/view", "/preview")}
                  className="w-full border-0 min-h-[400px] bg-slate-900"
                  allow="autoplay"
                  title={`evidence-${i}`}
                />
                <div className="p-5 bg-slate-900 flex justify-between items-center border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-black text-white text-[10px]">
                      {i + 1}
                    </div>
                    <span className="text-white font-black uppercase text-[10px] tracking-widest">
                      หลักฐานประกอบ
                    </span>
                  </div>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    ดูไฟล์จริง / ดาวน์โหลด
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
const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
    <div className={`${color} text-white p-5 rounded-[1.5rem] shadow-xl`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-4xl font-black text-[#1e293b] tracking-tighter">
        {value}
      </p>
    </div>
  </div>
);

export default App;
