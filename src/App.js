import React, { useState, useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
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
  Download,
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

// --- Constants ---
const AUTHORIZED_USERS = [
  { id: "7512352", name: "นายดนัยภัทร สมใจเพ็ง", position: "หัวหน้าแผนกวิเคราะห์ Call" },
  { id: "7512319", name: "นายนรา ผาสุพงษ์", position: "หัวหน้าฝ่ายวิเคราะห์ Call" },
  { id: "7839858", name: "นายสิทธิกร แย้มเงิน", position: "วิศวกรวิเคราะห์ Call" },
  { id: "7878736", name: "นายชนทัตน์ สันติลินนท์", position: "วิศวกรวิเคราะห์ Call" },
  { id: "7906720", name: "นายอภิสิทธิ์ ถามะพันธ์", position: "วิศวกรวิเคราะห์ Call" },
];

const AREA_DATA = {
  REL: ["REL1", "REL2", "REL3", "REL4", "REL5", "REL6"],
  BS: ["BS1", "BS2", "BS3", "BS4", "BS5", "BS6", "BS7", "BS8", "BS9SA", "BS10SA"],
  BE: ["BE1", "BE2", "BE3", "BE4", "BE5", "BE6", "BE7", "BE8", "BE9SA"],
  BW: ["BW1", "BW2", "BW3", "BW4", "BW5", "BW6", "BW7", "BW8SA", "BW9SA", "BW10"],
  BN: ["BN1", "BN2", "BN3", "BN4", "BN5SA", "BN6SA", "BN7SA", "BN8SA", "BN9", "BN11SA"],
  RC: ["RC1", "RC2", "RC4", "RC5SA", "RC6SA", "RC7SA", "RC8SA", "RC9SA", "RC10SA"],
  RSL: ["RSL1", "RSL2", "RSL3", "RSL4", "RSL5SA", "RSL6SA", "RSL8SA", "RSL9SA", "RSL10SA", "RSL11SA", "RSL12SA", "RSL13"],
  REU: ["REU1", "REU2", "REU3", "REU4", "REU5SA", "REU6SA"],
  BG: ["BG1", "BG2", "BG3", "BG4", "BG5SA", "BG6SA", "BG7SA", "BG8SA", "BG9"],
  NEL: ["NEL1", "NEL2", "NEL3", "NEL4", "NEL5", "NEL6", "NEL8SA"],
  RN: ["RN1", "RN2", "RN3", "RN4", "RN5", "RN6", "RN7", "RN8", "RN9"],
  RSU: ["RSU1", "RSU2", "RSU3", "RSU4", "RSU5", "RSU6", "RSU7", "RSU8"],
  NEU: ["NEU1", "NEU2", "NEU3", "NEU4SA", "NEU5SA", "NEU6SA"],
};

const PROJECT_TYPES = {
  REPAIR: "project1_repair",
  REPLACE: "project2_replace",
};

// --- Helper Functions ---
const safeDate = (dateObj) => {
  if (!dateObj) return "-";
  try {
    if (dateObj.toDate) return dateObj.toDate().toLocaleDateString("th-TH");
    if (dateObj instanceof Date && !isNaN(dateObj)) return dateObj.toLocaleDateString("th-TH");
    const d = new Date(dateObj);
    if (!isNaN(d)) return d.toLocaleDateString("th-TH");
    return "-";
  } catch (e) {
    return "-";
  }
};

const uploadToDrive = async (files) => {
  if (!files || files.length === 0) return [];
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
          resolve({ base64: event.target.result, fileName: file.name, mimeType: file.type });
        }
      };
    });
  };
  const processed = await Promise.all(files.map((f) => processFileImg(f.file)));
  const res = await fetch(IMAGE_UPLOAD_URL, {
    method: "POST",
    body: JSON.stringify({ action: "uploadOnly", files: processed }),
  });
  const result = await res.json();
  return result.urls || [];
};

// --- MAIN COMPONENT ---
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

  // UI States
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null); // { title, msg, onConfirm, showInput }
  
  // Modals & Edits
  const [editingBranch, setEditingBranch] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showInternalModal, setShowInternalModal] = useState(false);
  const [selectedReportFiles, setSelectedReportFiles] = useState(null);

  // Filters
  const [trackerSearch, setTrackerSearch] = useState("");
  const [trackerArea, setTrackerArea] = useState("All");
  const [trackerTeam, setTrackerTeam] = useState("All");
  const [trackerProject, setTrackerProject] = useState(PROJECT_TYPES.REPAIR);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminFilterArea, setAdminFilterArea] = useState("All");
  const [adminFilterTeam, setAdminFilterTeam] = useState("All");
  const [internalView, setInternalView] = useState("board");

  // --- Auth & Listeners ---
  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
    const unsubReports = onSnapshot(query(collection(db, "reports"), orderBy("createdAt", "desc")), (snap) => {
      setReports(snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() || new Date() })));
    });
    const unsubBranches = onSnapshot(collection(db, "branches"), (snap) => {
      setBranchData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubTasks = onSnapshot(query(collection(db, "internal_tasks"), orderBy("createdAt", "desc")), (snap) => {
      setInternalTasks(snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          dueDate: data.dueDate ? (data.dueDate.toDate ? data.dueDate.toDate() : new Date(data.dueDate)) : null,
          startDate: data.startDate ? (data.startDate.toDate ? data.startDate.toDate() : new Date(data.startDate)) : null,
        };
      }));
    });
    return () => { unsubReports(); unsubBranches(); unsubTasks(); };
  }, []);

  // --- Derived State ---
  const filteredBranches = useMemo(() => {
    return branchData.filter((b) => {
      const mProject = b.projectType === trackerProject;
      const mSearch = (b.storeCode || "").toLowerCase().includes(trackerSearch.toLowerCase()) || (b.asset || "").toLowerCase().includes(trackerSearch.toLowerCase());
      const mArea = trackerArea === "All" || b.area === trackerArea;
      const mTeam = trackerTeam === "All" || b.team === trackerTeam;
      return mProject && mSearch && mArea && mTeam;
    });
  }, [branchData, trackerSearch, trackerArea, trackerTeam, trackerProject]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const mSearch = (r.employeeName || "").toLowerCase().includes(adminSearch.toLowerCase()) || (r.employeeId || "").toLowerCase().includes(adminSearch.toLowerCase());
      const mArea = adminFilterArea === "All" || (r.department && r.department.includes(adminFilterArea));
      return mSearch && mArea;
    });
  }, [reports, adminSearch, adminFilterArea]);

  // --- Actions ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginForm.username.toLowerCase() !== "admin") return setMessage({ type: "error", text: "ชื่อผู้ใช้ต้องเป็น 'admin'" });
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

  const requestDeleteReport = (id) => {
    setConfirmModal({
      title: "ยืนยันการลบ",
      msg: "คุณต้องการลบรายงานนี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "reports", id));
          setConfirmModal(null); // Close modal IMMEDIATELY on success
          setMessage({ type: "success", text: "ลบข้อมูลเรียบร้อย" });
          setTimeout(() => setMessage(null), 2000);
        } catch (e) {
          alert("เกิดข้อผิดพลาดในการลบ: " + e.message);
        }
      }
    });
  };

  const exportTrackerCSV = () => {
    const headers = ["Store Code", "Area", "Team", "Asset", "Status", "Project Type", "Remarks"];
    const rows = filteredBranches.map(b => [
      b.storeCode, b.area, b.team, b.asset, b.status, 
      b.projectType === PROJECT_TYPES.REPAIR ? "Repair" : "Replace",
      `"${(b.remarks || "").replace(/"/g, '""')}"`
    ]);
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }));
    link.download = `Tracker_Data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // --- Render ---
  if (!role) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4 tracking-tight">ระบบบริหารงานวิศวกรรม</h1>
          <h2 className="text-xl md:text-2xl font-bold text-blue-600 uppercase tracking-widest">หน่วยงานวิเคราะห์ CALL</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          <MenuCard onClick={() => setRole("reporter")} icon={<PlusCircle size={56} />} title="แจ้งปัญหา" desc="แจ้งปัญหาหน้างานเพื่อวิเคราะห์หาแนวทางการแก้ไข" color="bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700" />
          <MenuCard onClick={() => setRole("admin")} icon={<LayoutDashboard size={56} />} title="แดชบอร์ด" desc="บริหารจัดการงานวิเคราะห์และงานภายใน" color="bg-slate-800 text-white shadow-slate-300 hover:bg-slate-900" />
          <MenuCard onClick={() => setRole("tracker")} icon={<MapPin size={56} />} title="ติดตามงานสาขา" desc="ติดตามงานซ่อมและเสนอราคา (Elite/Replace)" color="bg-orange-500 text-white shadow-orange-200 hover:bg-orange-600" />
        </div>
        <footer className="mt-20"><p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">ENGINEERING ANALYSIS SYSTEM • CP RETAILINK</p></footer>
      </div>
    );
  }

  if (role === "admin" && !isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 mx-auto text-slate-900 mb-4" />
            <h2 className="text-2xl font-black uppercase text-slate-900">พื้นที่เจ้าหน้าที่</h2>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {message && message.type === "error" && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold text-center">{message.text}</div>}
            <input className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-blue-600" placeholder="ชื่อผู้ใช้ (admin)" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} />
            <input type="password" className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-blue-600" placeholder="รหัสผ่าน (รหัสพนักงาน)" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-[2] bg-slate-900 text-white p-4 rounded-xl font-black uppercase hover:bg-slate-800 transition-all shadow-lg order-1">ล็อกอิน</button>
              <button type="button" onClick={() => setRole(null)} className="flex-1 bg-slate-100 text-slate-500 p-4 rounded-xl font-black uppercase hover:bg-slate-200 transition-all order-2">กลับ</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <Header role={role} isAdmin={isAdminLoggedIn} user={currentUser} onLogout={() => { setIsAdminLoggedIn(false); setCurrentUser(null); setRole(null); }} onBack={() => { setRole(null); setIsAdminLoggedIn(false); }} onImport={() => setShowImportModal(true)} loading={loading} />
      
      {submitting && <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50"><div className="h-full bg-green-500 transition-all duration-300" style={{ width: "100%" }}></div></div>}
      {message && !showSuccessModal && <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-lg ${message.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-800 text-white'}`}>{message.text}</div>}

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {role === "reporter" && <ReporterView onSubmit={setSubmitting} onResult={setMessage} onSuccess={() => setShowSuccessModal(true)} />}
        
        {role === "tracker" && (
          <TrackerView 
            branches={branchData} 
            filteredBranches={filteredBranches}
            projectType={trackerProject}
            setProjectType={setTrackerProject}
            search={trackerSearch}
            setSearch={setTrackerSearch}
            area={trackerArea}
            setArea={setTrackerArea}
            team={trackerTeam}
            setTeam={setTrackerTeam}
            onEdit={setEditingBranch}
            onExport={exportTrackerCSV}
          />
        )}

        {role === "admin" && isAdminLoggedIn && (
          <div className="space-y-8">
            <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border w-fit mx-auto md:mx-0">
              <TabBtn active={activeTab === "reports"} icon={<ClipboardList size={16} />} label="แจ้งปัญหาหน้างาน" onClick={() => setActiveTab("reports")} color="bg-slate-900" />
              <TabBtn active={activeTab === "internal"} icon={<Briefcase size={16} />} label="งานภายใน" onClick={() => setActiveTab("internal")} color="bg-indigo-600" />
            </div>

            {activeTab === "reports" && (
              <ReportsDashboard 
                reports={filteredReports} 
                allReportsCount={reports.length}
                search={adminSearch} 
                setSearch={setAdminSearch}
                area={adminFilterArea}
                setArea={setAdminFilterArea}
                team={adminFilterTeam}
                setTeam={setAdminFilterTeam}
                onViewFiles={setSelectedReportFiles}
                onDelete={requestDeleteReport}
              />
            )}

            {activeTab === "internal" && (
              <InternalTaskDashboard 
                tasks={internalTasks} 
                view={internalView} 
                setView={setInternalView} 
                onNew={() => setShowInternalModal(true)} 
                onEdit={setEditingTask} 
                authorizedUsers={AUTHORIZED_USERS}
              />
            )}
          </div>
        )}
      </main>

      {/* --- MODALS (Lean & Extracted) --- */}
      {confirmModal && <ConfirmationModal {...confirmModal} onClose={() => setConfirmModal(null)} />}
      {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} onProcess={setMessage} setSubmitting={setSubmitting} db={db} />}
      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}
      {editingTask && <TaskDetailModal task={editingTask} onClose={() => setEditingTask(null)} currentUser={currentUser} setConfirmModal={setConfirmModal} />}
      {showInternalModal && <NewTaskModal onClose={() => setShowInternalModal(false)} onSubmit={setSubmitting} onResult={setMessage} />}
      {editingBranch && <BranchEditModal branch={editingBranch} onClose={() => setEditingBranch(null)} onSubmit={setSubmitting} onResult={setMessage} setConfirmModal={setConfirmModal} />}
      {selectedReportFiles && <FileViewer files={selectedReportFiles} onClose={() => setSelectedReportFiles(null)} />}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const Header = ({ role, isAdmin, user, onLogout, onBack, onImport, loading }) => (
  <header className={`${role === "admin" ? "bg-slate-900" : role === "tracker" ? "bg-orange-600" : "bg-blue-700"} text-white p-4 shadow-lg sticky top-0 z-40`}>
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black uppercase tracking-tight">{role === "admin" ? "Dashboard" : role === "tracker" ? "Branch Tracking" : "Reporting"}</h1>
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && user && <div className="hidden md:flex flex-col items-end mr-2"><span className="text-xs font-bold text-white">{user.name}</span><span className="text-[10px] text-slate-400">{user.position}</span></div>}
        {isAdmin && <button onClick={onImport} className="hidden md:flex bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-black uppercase items-center gap-2 border border-white/10"><UploadCloud size={14} /> Import</button>}
        {isAdmin && <button onClick={onLogout} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl text-red-200"><LogOut size={20} /></button>}
        <RefreshCw className={loading ? "animate-spin" : ""} size={20} />
      </div>
    </div>
  </header>
);

const TrackerView = ({ branches, filteredBranches, projectType, setProjectType, search, setSearch, area, setArea, team, setTeam, onEdit, onExport }) => {
  const totalRepair = branches.filter(b => b.projectType === PROJECT_TYPES.REPAIR).length;
  const totalReplace = branches.filter(b => b.projectType === PROJECT_TYPES.REPLACE).length;
  
  const stats = useMemo(() => {
    const relevant = branches.filter(b => b.projectType === projectType);
    const remByArea = {};
    Object.keys(AREA_DATA).forEach(a => remByArea[a] = 0);
    relevant.forEach(b => {
      const activeStatus = projectType === PROJECT_TYPES.REPAIR ? "ยังไม่ดำเนินการ" : "ยังไม่เสนอราคา";
      if (!b.status || b.status === activeStatus || b.status === "On process") {
        if (AREA_DATA[b.area]) remByArea[b.area] += 1;
      }
    });
    return {
      remaining: Object.values(remByArea).reduce((a, b) => a + b, 0),
      breakdown: Object.entries(remByArea).sort((a, b) => b[1] - a[1]),
    };
  }, [branches, projectType]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border w-fit">
          <button onClick={() => setProjectType(PROJECT_TYPES.REPAIR)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${projectType === PROJECT_TYPES.REPAIR ? "bg-orange-500 text-white" : "text-slate-400"}`}>🛠️ ซ่อมท่อ (Elite v.3)</button>
          <button onClick={() => setProjectType(PROJECT_TYPES.REPLACE)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${projectType === PROJECT_TYPES.REPLACE ? "bg-orange-500 text-white" : "text-slate-400"}`}>📄 เสนอราคา (เปลี่ยน)</button>
        </div>
        <button onClick={onExport} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all text-sm"><Download size={16}/> Export CSV</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="งานซ่อมท่อ (Elite v.3)" value={totalRepair} color="bg-blue-600" icon={<Wrench size={24} />} />
        <StatCard label="งานเสนอราคา (เปลี่ยน)" value={totalReplace} color="bg-indigo-600" icon={<FileText size={24} />} />
        <StatCard label="คงเหลือ (Current View)" value={stats.remaining} color="bg-orange-500" icon={<Clock size={24} />} />
        <StatCard label="รายการที่แสดงผล" value={filteredBranches.length} color="bg-slate-900" icon={<Store size={24} />} />
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <h3 className="font-black text-slate-400 text-[10px] uppercase mb-6 tracking-widest flex items-center gap-2"><BarChart3 size={16} /> งานคงเหลือรายพื้นที่ (Current Project)</h3>
        <div className="flex flex-wrap gap-3">
          {stats.breakdown.map(([a, c]) => (
            <div key={a} className={`px-4 py-2 rounded-xl border-2 flex items-center gap-3 ${c > 0 ? "border-orange-100 bg-orange-50" : "border-slate-50 bg-slate-50 opacity-50"}`}>
              <span className="font-black text-xs text-slate-500">{a}</span><span className={`text-lg font-black ${c > 0 ? "text-orange-600" : "text-slate-300"}`}>{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-lg flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-xl font-bold outline-none" placeholder="ค้นหารหัสสาขา..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="flex-1 md:w-40 p-4 bg-slate-50 rounded-xl font-bold outline-none" value={area} onChange={(e) => { setArea(e.target.value); setTeam("All"); }}><option value="All">ทุกพื้นที่</option>{Object.keys(AREA_DATA).sort().map(a => <option key={a} value={a}>{a}</option>)}</select>
          <select className="flex-1 md:w-40 p-4 bg-slate-50 rounded-xl font-bold outline-none" value={team} onChange={(e) => setTeam(e.target.value)} disabled={area === "All"}><option value="All">ทุกทีม</option>{area !== "All" && AREA_DATA[area].map(t => <option key={t} value={t}>{t}</option>)}</select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredBranches.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-wrap md:flex-nowrap justify-between items-center hover:shadow-md transition-all border-l-8 border-l-slate-100 hover:border-l-orange-500">
            <div>
              <h4 className="font-black text-xl text-slate-800 tracking-tight">{b.storeCode}</h4>
              <div className="flex gap-2 mt-1 uppercase font-black text-[10px] text-slate-400"><span>{b.area}</span>•<span>{b.team}</span></div>
              <p className="text-sm font-bold text-slate-500 mt-2">{b.asset}</p>
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border-2 ${b.status && (b.status.includes("แล้ว") || b.status.includes("Completed")) ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-orange-50 border-orange-100 text-orange-600"}`}>{b.status}</span>
              <button onClick={() => onEdit(b)} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-all"><Edit3 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReportsDashboard = ({ reports, allReportsCount, search, setSearch, area, setArea, team, setTeam, onViewFiles, onDelete }) => (
  <>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="เคสทั้งหมด" value={allReportsCount} color="bg-slate-900" icon={<ClipboardList size={24} />} />
      <StatCard label="รอรับเรื่อง" value={reports.filter(r => r.status === "Pending").length} color="bg-amber-500" icon={<Clock size={24} />} />
      <StatCard label="วิเคราะห์" value={reports.filter(r => r.status === "Analyzing").length} color="bg-blue-600" icon={<Wrench size={24} />} />
      <StatCard label="เสร็จสิ้น" value={reports.filter(r => r.status === "Resolved").length} color="bg-emerald-600" icon={<CheckCircle2 size={24} />} />
    </div>
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-xl font-bold outline-none" placeholder="ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="flex gap-3 w-full md:w-auto">
        <select className="flex-1 md:w-40 p-4 bg-slate-50 rounded-xl font-bold outline-none" value={area} onChange={(e) => { setArea(e.target.value); setTeam("All"); }}><option value="All">ทุกพื้นที่</option>{Object.keys(AREA_DATA).map(a => <option key={a} value={a}>{a}</option>)}</select>
        <select className="flex-1 md:w-40 p-4 bg-slate-50 rounded-xl font-bold outline-none" value={team} onChange={(e) => setTeam(e.target.value)} disabled={area === "All"}><option value="All">ทุกทีม</option>{area !== "All" && AREA_DATA[area].map(t => <option key={t} value={t}>{t}</option>)}</select>
      </div>
    </div>
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest"><tr><th className="p-6">พนักงาน / แผนก</th><th className="p-6">รายละเอียด</th><th className="p-6">สถานะ</th><th className="p-6 text-center">จัดการ</th></tr></thead>
          <tbody className="divide-y text-sm">
            {reports.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-6"><div className="font-black text-slate-800">{r.employeeName}</div><div className="text-[10px] text-blue-600 font-black uppercase mt-1">{r.employeeId} • {r.department}</div></td>
                <td className="p-6 max-w-md"><p className="font-bold text-slate-600 line-clamp-2">{r.description}</p>{r.fileLinks?.length > 0 && <button onClick={() => onViewFiles(r.fileLinks)} className="mt-2 text-[10px] font-black uppercase text-blue-600 flex items-center gap-1 hover:underline"><Eye size={12} /> หลักฐาน ({r.fileLinks.length})</button>}</td>
                <td className="p-6">
                  <select value={r.status} onChange={(e) => updateDoc(doc(db, "reports", r.id), { status: e.target.value })} className={`p-2 rounded-lg text-[11px] font-black border-2 outline-none uppercase tracking-widest ${r.status === "Resolved" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-orange-50 border-orange-200 text-orange-700"}`}>
                    <option value="Pending">รอรับเรื่อง</option><option value="Analyzing">วิเคราะห์</option><option value="Resolved">เสร็จสิ้น</option>
                  </select>
                </td>
                <td className="p-6 text-center text-slate-300">
                  <button onClick={() => onDelete(r.id)} className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

const InternalTaskDashboard = ({ tasks, view, setView, onNew, onEdit, authorizedUsers }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center"><h3 className="text-xl font-black text-slate-800 flex items-center gap-2">Internal Tasks</h3><button onClick={onNew} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95"><PlusCircle size={16} /> เพิ่มงานใหม่</button></div>
    <div className="flex gap-2 mb-4">
      {["board", "timeline", "stats"].map(v => <button key={v} onClick={() => setView(v)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${view === v ? "bg-slate-800 text-white" : "bg-white text-slate-500"}`}>{v}</button>)}
    </div>
    {view === "board" && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto pb-4">
        {["To Do", "In Progress", "Review/QC", "Done"].map(status => (
          <div key={status} className="bg-slate-100 p-6 rounded-[2rem] border border-slate-200 min-h-[400px] min-w-[280px]">
            <h4 className="font-black text-slate-500 mb-4 uppercase text-xs tracking-widest flex justify-between">{status} <span className="bg-white px-2 py-0.5 rounded text-slate-400 shadow-sm">{tasks.filter(t => t.status === status).length}</span></h4>
            <div className="space-y-3">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} onClick={() => onEdit(task)} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2"><PriorityBadge p={task.priority} />{task.dueDate && <span className={`text-[10px] font-bold flex items-center gap-1 ${new Date(task.dueDate) < new Date() && task.status !== "Done" ? "text-red-500" : "text-slate-400"}`}><Clock size={12} /> {safeDate(task.dueDate)}</span>}</div>
                  <h5 className="font-bold text-slate-800 text-sm mb-1">{task.title}</h5>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50"><div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg"><User size={12} /> {task.assignee ? task.assignee.split(" ")[0] : "?"}</div></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
    {view === "timeline" && (
      <div className="bg-white p-6 rounded-[2rem] border shadow-sm space-y-4">
        {tasks.sort((a, b) => (a.startDate || 0) - (b.startDate || 0)).map((task) => (
          <div key={task.id} onClick={() => onEdit(task)} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-2xl hover:bg-slate-50 cursor-pointer">
            <div className="w-32 text-xs font-bold text-slate-400">{safeDate(task.startDate)}</div>
            <div className="flex-1">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div className={`h-full ${task.status === "Done" ? "bg-green-500" : "bg-indigo-500"}`} style={{ width: task.status === "Done" ? "100%" : "50%" }}></div>
              </div>
              <h5 className="font-bold text-slate-800">{task.title}</h5>
            </div>
            <div className="flex items-center gap-2"><PriorityBadge p={task.priority} /><div className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-lg">{task.status}</div></div>
          </div>
        ))}
      </div>
    )}
    {view === "stats" && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
          <h4 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">Team Workload</h4>
          <div className="space-y-4">
            {Object.entries(authorizedUsers.reduce((acc, u) => ({ ...acc, [u.name]: 0 }), {})).map(([name, _]) => {
              const count = tasks.filter((t) => (t.status === "In Progress" || t.status === "To Do") && (t.assignee === name || t.assignee?.includes(name))).length;
              return (
                <div key={name} className="flex items-center gap-4">
                  <div className="w-32 text-xs font-bold text-slate-500 truncate">{name}</div>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min((count / 10) * 100, 100)}%` }}></div></div>
                  <div className="text-sm font-black text-slate-800">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}
  </div>
);

// --- MODAL COMPONENTS ---

const ConfirmationModal = ({ title, msg, onConfirm, onClose, showInput }) => {
  const [inputVal, setInputVal] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm(inputVal);
    setIsDeleting(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm text-center animate-in zoom-in-95">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle size={32}/></div>
        <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 font-medium mb-6 text-sm">{msg}</p>
        {showInput && <input className="w-full p-3 border-2 border-red-100 rounded-xl mb-4 font-bold text-center outline-none focus:border-red-500" placeholder="ระบุรหัส Admin (Employee ID)" value={inputVal} onChange={e => setInputVal(e.target.value)} type="password" />}
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isDeleting} className="flex-1 p-3 bg-slate-100 rounded-xl font-bold text-slate-500 hover:bg-slate-200">ยกเลิก</button>
          <button onClick={handleConfirm} disabled={isDeleting} className="flex-1 p-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg flex justify-center items-center gap-2">
            {isDeleting ? <Loader2 className="animate-spin" size={16}/> : null}
            {isDeleting ? "กำลังลบ..." : "ยืนยันลบ"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskDetailModal = ({ task, onClose, currentUser, setConfirmModal }) => {
  const [updateText, setUpdateText] = useState("");
  const [status, setStatus] = useState(task.status);

  const handleUpdate = async () => {
    if (!updateText.trim()) return;
    await updateDoc(doc(db, "internal_tasks", task.id), { updates: arrayUnion({ text: updateText, user: currentUser?.name || "Admin", timestamp: new Date() }) });
    setUpdateText("");
  };

  const requestDelete = () => {
    setConfirmModal({
      title: "ลบงานนี้?",
      msg: "คุณแน่ใจหรือไม่ที่จะลบงานนี้ถาวร?",
      onConfirm: async () => {
        await deleteDoc(doc(db, "internal_tasks", task.id));
        setConfirmModal(null);
        onClose();
      }
    });
  };

  const handleStatusChange = async (e) => {
    const newS = e.target.value;
    setStatus(newS);
    await updateDoc(doc(db, "internal_tasks", task.id), { status: newS });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 h-[80vh] flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div><span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">Task Details</span><h3 className="text-xl font-black text-slate-800">{task.title}</h3></div>
          <button onClick={onClose}><XCircle className="text-slate-300 hover:text-slate-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          <div className="grid grid-cols-2 gap-4">
            <InfoBlock label="ผู้รับผิดชอบ" val={task.assignee} /><InfoBlock label="กำหนดส่ง" val={safeDate(task.dueDate)} />
            <InfoBlock label="ความสำคัญ" val={<PriorityBadge p={task.priority} />} />
            <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะ</label><select value={status} onChange={handleStatusChange} className="w-full p-2 border-2 rounded-xl font-bold bg-white text-sm"><option value="To Do">To Do</option><option value="In Progress">In Progress</option><option value="Review/QC">Review/QC</option><option value="Done">Done</option></select></div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><p className="text-sm text-slate-600 font-medium leading-relaxed">{task.description}</p></div>
          <div>
            <h4 className="font-black text-slate-700 text-sm mb-4 flex items-center gap-2"><MessageSquare size={16} /> อัปเดตความคืบหน้า</h4>
            <div className="space-y-3 mb-4">{task.updates?.map((u, i) => <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 text-xs"><div className="flex justify-between text-slate-400 mb-1 font-bold"><span>{u.user}</span><span>{safeDate(u.timestamp)}</span></div><p className="text-slate-600">{u.text}</p></div>)}</div>
            <div className="flex gap-2"><input className="flex-1 p-3 border-2 rounded-xl text-sm font-bold outline-none" placeholder="พิมพ์อัปเดต..." value={updateText} onChange={(e) => setUpdateText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleUpdate()} /><button onClick={handleUpdate} className="p-3 bg-indigo-600 text-white rounded-xl font-bold"><ArrowLeft size={16} className="rotate-90" /></button></div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
           <button onClick={requestDelete} className="text-red-500 font-bold text-xs flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"><Trash2 size={16}/> ลบงานนี้</button>
        </div>
      </div>
    </div>
  );
};

const BranchEditModal = ({ branch, onClose, onSubmit, onResult, setConfirmModal }) => {
  const [formData, setFormData] = useState({ ...branch });
  const [repairCabs, setRepairCabs] = useState(branch.cabinets || []);
  const [replaceData, setReplaceData] = useState({ 
    callNo: branch.callNo || "", quotationNo: branch.quotationNo || "", 
    assessmentImg: null, frontImg: null 
  });
  const [newFiles, setNewFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(true);
    try {
      const updates = { 
        status: formData.status, 
        remarks: formData.remarks || "",
        lastUpdated: serverTimestamp() 
      };

      if (formData.projectType === PROJECT_TYPES.REPAIR) {
        let frontUrl = branch.shopFrontImage;
        const frontFile = newFiles.find(f => f.type === 'front');
        if (frontFile) {
           const res = await uploadToDrive([{ file: frontFile.file }]);
           frontUrl = res[0];
        }
        updates.shopFrontImage = frontUrl;
        
        // Handle Cabinets
        const updatedCabs = await Promise.all(repairCabs.map(async (cab) => {
           let bUrl = cab.beforeUrl || "";
           let aUrl = cab.afterUrl || "";
           if(cab.beforeFile) { const res = await uploadToDrive([{file: cab.beforeFile}]); bUrl = res[0]; }
           if(cab.afterFile) { const res = await uploadToDrive([{file: cab.afterFile}]); aUrl = res[0]; }
           return { assetNo: cab.assetNo, beforeUrl: bUrl, afterUrl: aUrl };
        }));
        updates.cabinets = updatedCabs;

      } else { // REPLACE
        updates.callNo = replaceData.callNo;
        updates.quotationNo = replaceData.quotationNo;
        if(replaceData.assessmentImg) {
           const res = await uploadToDrive([{ file: replaceData.assessmentImg }]);
           updates.assessmentImage = res[0];
        }
        if(replaceData.frontImg) {
           const res = await uploadToDrive([{ file: replaceData.frontImg }]);
           updates.shopFrontImage = res[0];
        }
      }

      await updateDoc(doc(db, "branches", branch.id), updates);
      onResult({ type: "success", text: "บันทึกเรียบร้อย" });
      setTimeout(() => { onResult(null); onClose(); }, 1500);
    } catch (err) {
      onResult({ type: "error", text: err.message });
    } finally {
      onSubmit(false);
    }
  };

  const requestDelete = () => {
    setConfirmModal({
      title: "Admin Verification",
      msg: "กรุณาระบุรหัสพนักงาน (Admin) เพื่อยืนยันการลบ",
      showInput: true,
      onConfirm: async (code) => {
        // Trim code to avoid accidental spaces
        const trimmedCode = code.trim();
        const isAdmin = AUTHORIZED_USERS.some(u => u.id === trimmedCode);
        if (!isAdmin) {
          alert("รหัสไม่ถูกต้อง! ไม่อนุญาตให้ลบ");
          return;
        }
        try {
          await deleteDoc(doc(db, "branches", branch.id));
          setConfirmModal(null);
          onClose(); // Close the edit modal as well
        } catch(e) {
          alert("เกิดข้อผิดพลาดในการลบ: " + e.message);
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between">
            <h3 className="text-2xl font-black mb-1">อัปเดตงาน: {branch.storeCode}</h3>
            <button onClick={requestDelete} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100"><Trash2 size={20}/></button>
        </div>
        <p className="text-slate-400 font-bold text-xs mb-6 uppercase tracking-widest">{formData.projectType === PROJECT_TYPES.REPAIR ? "Project: Repair" : "Project: Replacement"}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">สถานะ *</label>
            <select className="w-full p-3 rounded-xl border font-bold" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
              {formData.projectType === PROJECT_TYPES.REPAIR ? <><option value="ยังไม่ดำเนินการ">ยังไม่ดำเนินการ</option><option value="มีการดำเนินการแล้ว">มีการดำเนินการแล้ว</option></> : <><option value="ยังไม่เสนอราคา">ยังไม่เสนอราคา</option><option value="เสนอราคาแล้ว">เสนอราคาแล้ว</option></>}
            </select>
          </div>
          
          {formData.projectType === PROJECT_TYPES.REPAIR ? (
             <>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">รูปหน้าร้าน (1 รูป)</label><input type="file" accept="image/*" onChange={(e) => setNewFiles([...newFiles, {file: e.target.files[0], type: 'front'}])} /></div>
               <div>
                 <div className="flex justify-between items-center mb-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">รายการตู้ที่แก้ไข</label><button type="button" onClick={() => setRepairCabs([...repairCabs, {assetNo:"", beforeFile:null, afterFile:null}])} className="text-blue-600 text-xs font-bold flex items-center gap-1"><PlusCircle size={14}/> เพิ่มตู้</button></div>
                 {repairCabs.map((c, i) => (
                   <div key={i} className="mb-4 p-4 border rounded-2xl relative">
                     <button type="button" onClick={() => setRepairCabs(repairCabs.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400"><Trash2 size={16}/></button>
                     <input className="w-full p-2 border rounded-lg mb-2 text-sm font-bold" placeholder="Asset No." value={c.assetNo} onChange={(e) => { const n = [...repairCabs]; n[i].assetNo = e.target.value; setRepairCabs(n); }} required />
                     <div className="grid grid-cols-2 gap-2">
                       <div><p className="text-[10px]">Before</p><input type="file" accept="image/*" className="text-xs" onChange={(e)=>{ const n = [...repairCabs]; n[i].beforeFile = e.target.files[0]; setRepairCabs(n); }} /></div>
                       <div><p className="text-[10px]">After</p><input type="file" accept="image/*" className="text-xs" onChange={(e)=>{ const n = [...repairCabs]; n[i].afterFile = e.target.files[0]; setRepairCabs(n); }} /></div>
                     </div>
                   </div>
                 ))}
               </div>
             </>
          ) : (
             <>
                <div className="grid grid-cols-2 gap-4">
                  <input required className="p-4 border rounded-xl font-bold text-sm" placeholder="เลขที่ Call" value={replaceData.callNo} onChange={(e) => setReplaceData({...replaceData, callNo: e.target.value})} />
                  <input required className="p-4 border rounded-xl font-bold text-sm" placeholder="เลขที่ใบเสนอราคา" value={replaceData.quotationNo} onChange={(e) => setReplaceData({...replaceData, quotationNo: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 border-2 border-dashed rounded-xl text-center"><p className="text-[10px] font-bold text-slate-400 mb-2">รูปใบประเมิน</p><input type="file" accept="image/*" className="text-xs" onChange={(e) => setReplaceData({...replaceData, assessmentImg: e.target.files[0]})} /></div>
                   <div className="p-4 border-2 border-dashed rounded-xl text-center"><p className="text-[10px] font-bold text-slate-400 mb-2">รูปหน้าร้าน</p><input type="file" accept="image/*" className="text-xs" onChange={(e) => setReplaceData({...replaceData, frontImg: e.target.files[0]})} /></div>
                </div>
             </>
          )}
          <textarea className="w-full p-4 border rounded-xl font-bold text-sm" placeholder="หมายเหตุ..." rows="2" value={formData.remarks || ""} onChange={(e) => setFormData({...formData, remarks: e.target.value})} />
          <div className="flex gap-3 pt-4"><button type="button" onClick={onClose} className="flex-1 p-4 bg-slate-100 rounded-xl font-bold text-slate-500">ยกเลิก</button><button type="submit" className="flex-2 p-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg">บันทึก</button></div>
        </form>
      </div>
    </div>
  );
};

const NewTaskModal = ({ onClose, onSubmit, onResult }) => {
  const [form, setForm] = useState({ title: "", assignee: "", priority: "Medium", startDate: new Date().toISOString().split('T')[0], dueDate: "", description: "" });
  
  const submit = async (e) => {
    e.preventDefault();
    onSubmit(true);
    try {
      await addDoc(collection(db, "internal_tasks"), { ...form, startDate: new Date(form.startDate), dueDate: form.dueDate ? new Date(form.dueDate) : null, status: "To Do", updates: [], createdAt: serverTimestamp() });
      onResult({ type: "success", text: "เพิ่มงานสำเร็จ" });
      setTimeout(() => { onResult(null); onClose(); }, 1500);
    } catch (e) { onResult({ type: "error", text: e.message }); } finally { onSubmit(false); }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95">
        <h3 className="text-xl font-black mb-6 flex items-center gap-2"><PlusCircle className="text-indigo-600" /> เพิ่มงานใหม่</h3>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full p-4 border-2 rounded-xl font-bold outline-none" placeholder="หัวข้อ" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <select className="w-full p-4 border-2 rounded-xl font-bold bg-white" value={form.assignee} onChange={(e) => setForm({...form, assignee: e.target.value})}><option value="">ผู้รับผิดชอบ...</option>{AUTHORIZED_USERS.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}</select>
            <select className="w-full p-4 border-2 rounded-xl font-bold bg-white outline-none" value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})}><option value="High">ด่วนมาก</option><option value="Medium">ปกติ</option><option value="Low">ไม่ด่วน</option></select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">เริ่ม</label><input type="date" className="w-full p-4 border-2 rounded-xl font-bold outline-none" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} /></div>
             <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">กำหนดส่ง</label><input type="date" className="w-full p-4 border-2 rounded-xl font-bold outline-none" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} /></div>
          </div>
          <textarea className="w-full p-4 border-2 rounded-xl font-bold outline-none" placeholder="รายละเอียด..." rows="3" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="flex-1 p-4 bg-slate-100 rounded-xl font-black text-slate-500">ยกเลิก</button><button type="submit" className="flex-1 p-4 bg-indigo-600 text-white rounded-xl font-black">บันทึก</button></div>
        </form>
      </div>
    </div>
  );
};

// --- Reporter View ---
const ReporterView = ({ onSubmit, onResult, onSuccess }) => {
  const [form, setForm] = useState({ employeeId: "", employeeName: "", area: "", team: "", category: "กระบวนการ (Process)", description: "" });
  const [files, setFiles] = useState([]);

  const submit = async (e) => {
    e.preventDefault();
    onSubmit(true);
    try {
      const urls = await uploadToDrive(files);
      await addDoc(collection(db, "reports"), { ...form, department: `${form.area} - ${form.team}`, fileLinks: urls, status: "Pending", createdAt: serverTimestamp() });
      setForm({ employeeId: "", employeeName: "", area: "", team: "", category: "กระบวนการ (Process)", description: "" });
      setFiles([]);
      onSuccess();
    } catch (e) { onResult({ type: "error", text: e.message }); } finally { onSubmit(false); }
  };

  const handleFile = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({ file, preview: URL.createObjectURL(file) }));
    setFiles([...files, ...newFiles]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2rem] shadow-xl border border-slate-200 animate-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-black text-center text-blue-600 uppercase mb-8">แบบฟอร์มแจ้งปัญหา</h2>
      <form onSubmit={submit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">รหัสพนักงาน</label><input required className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-blue-600" placeholder="รหัสพนักงาน" value={form.employeeId} onChange={(e) => setForm({...form, employeeId: e.target.value})} /></div>
          <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อ-นามสกุล</label><input required className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-blue-600" placeholder="ชื่อพนักงาน" value={form.employeeName} onChange={(e) => setForm({...form, employeeName: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">เลือกพื้นที่</label><select required className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold bg-white outline-none focus:border-blue-600" value={form.area} onChange={(e) => setForm({...form, area: e.target.value, team: ""})}><option value="">--- เลือกพื้นที่ ---</option>{Object.keys(AREA_DATA).sort().map(a => <option key={a} value={a}>{a}</option>)}</select></div>
          <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">เลือกทีม</label><select required className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold bg-white outline-none focus:border-blue-600" value={form.team} onChange={(e) => setForm({...form, team: e.target.value})} disabled={!form.area}><option value="">--- เลือกทีม ---</option>{form.area && AREA_DATA[form.area].sort().map(t => <option key={t} value={t}>{t}</option>)}</select></div>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">หมวดหมู่ปัญหา</label>
          <div className="grid grid-cols-2 gap-3 mt-2">{[{ v: "กระบวนการ (Process)" }, { v: "อุปกรณ์ (Equipment)" }, { v: "อะไหล่ (Spare Parts)" }, { v: "อื่นๆ (Others)" }].map(c => <button key={c.v} type="button" onClick={() => setForm({...form, category: c.v})} className={`p-4 rounded-xl font-bold text-sm border-2 transition-all ${form.category === c.v ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400"}`}>{c.v}</button>)}</div>
        </div>
        <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">รายละเอียดปัญหา</label><textarea required rows="4" className="w-full p-4 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-blue-600" placeholder="ระบุรายละเอียด..." value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></div>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center relative hover:bg-slate-50 transition-all cursor-pointer group">
          <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFile} accept="image/*,video/*" />
          <Camera size={40} className="mx-auto text-slate-300 group-hover:text-blue-500 transition-colors mb-2" />
          <p className="font-bold text-slate-400 text-xs">คลิกเพื่อแนบไฟล์หลักฐาน (เลือกได้หลายไฟล์)</p>
          {files.length > 0 && <p className="text-blue-600 font-black mt-3 bg-blue-50 px-4 py-2 rounded-full inline-block">เลือกแล้ว {files.length} ไฟล์</p>}
        </div>
        <button className="w-full p-5 bg-blue-600 text-white rounded-xl font-black text-lg shadow-lg active:scale-95 transition-all uppercase">ส่งข้อมูลแจ้งปัญหา</button>
      </form>
    </div>
  );
};

// --- Import Modal (Restored) ---
const ImportModal = ({ onClose, onProcess, setSubmitting, db }) => {
  const [pasteData, setPasteData] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [targetProject, setTargetProject] = useState(PROJECT_TYPES.REPAIR);

  const parseCSVLine = (line) => {
    const delimiter = line.includes("\t") ? "\t" : ",";
    const regex = new RegExp(`(?:${delimiter}|^)(?:"([^"]*)"|([^"${delimiter}]*))`, "g");
    const cols = [];
    let match;
    if (delimiter === "\t") return line.split("\t").map(s => s.trim().replace(/^"|"$/g, ""));
    while ((match = regex.exec(line)) !== null) {
      let val = match[1] ? match[1] : match[2];
      if (val === undefined) val = "";
      cols.push(val.trim());
    }
    if (cols.length === 0) return line.split(",").map(s => s.trim());
    return cols;
  };

  const handlePasteChange = (e) => {
    const text = e.target.value;
    setPasteData(text);
    if (text) {
      const allLines = text.split(/\r\n|\n|\r/).filter(l => l.trim() !== "");
      const parsed = allLines.map(parseCSVLine).filter(row => row.length >= 4);
      setPreviewData(parsed);
    } else {
      setPreviewData([]);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const allLines = text.split(/\r\n|\n|\r/).filter(l => l.trim() !== "");
      const dataRows = allLines[0] && (allLines[0].toLowerCase().includes("store") || allLines[0].includes("สาขา")) ? allLines.slice(1) : allLines;
      const parsed = dataRows.map(parseCSVLine).filter(row => row.length >= 4);
      setPreviewData(parsed);
      setPasteData("");
      event.target.value = null;
    };
    reader.readAsText(file);
  };

  const processImport = async () => {
    if (previewData.length === 0) return alert("ไม่มีข้อมูล");
    setSubmitting(true);
    onProcess({ type: "info", text: "Processing..." });
    try {
      const batch = writeBatch(db);
      previewData.forEach((cols) => {
        if(cols.length >= 4 && cols[0].toUpperCase() !== "STORE CODE") {
          const docRef = doc(collection(db, "branches"));
          batch.set(docRef, {
            storeCode: cols[0], area: cols[1]||"-", team: cols[2]||"-", asset: cols[3]||"-",
            projectType: targetProject,
            status: targetProject === PROJECT_TYPES.REPAIR ? "ยังไม่ดำเนินการ" : "ยังไม่เสนอราคา",
            remarks: "", fileLinks: [], createdAt: serverTimestamp()
          });
        }
      });
      await batch.commit();
      onProcess({ type: "success", text: "Import สำเร็จ!" });
      setTimeout(() => { onProcess(null); onClose(); }, 2000);
    } catch(e) {
      onProcess({ type: "error", text: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Database size={24} className="text-blue-500" /> Import Data</h3>
          <button onClick={onClose}><XCircle className="text-slate-400 hover:text-red-500" /></button>
        </div>
        <div className="mb-6 flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
          <button onClick={() => setTargetProject(PROJECT_TYPES.REPAIR)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${targetProject === PROJECT_TYPES.REPAIR ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}>🛠️ ซ่อมท่อ</button>
          <button onClick={() => setTargetProject(PROJECT_TYPES.REPLACE)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${targetProject === PROJECT_TYPES.REPLACE ? "bg-white shadow-sm text-orange-600" : "text-slate-400"}`}>📄 เสนอราคา</button>
        </div>
        {previewData.length === 0 ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-blue-50 transition-colors cursor-pointer relative">
              <input type="file" accept=".csv,.txt" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileSelect} />
              <FileSpreadsheet className="mx-auto text-slate-300 mb-2" size={40} />
              <p className="font-bold text-slate-500">เลือกไฟล์ CSV</p>
            </div>
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">หรือ</span></div></div>
            <textarea className="w-full h-32 p-4 border-2 rounded-xl font-mono text-xs bg-slate-50 focus:border-blue-500 outline-none" placeholder="วางข้อมูลจาก Excel ที่นี่ (Copy & Paste)..." value={pasteData} onChange={handlePasteChange} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-2"><span>พบ {previewData.length} รายการ</span><button onClick={() => { setPreviewData([]); setPasteData(""); }} className="text-red-500 hover:underline">เคลียร์ค่า</button></div>
            <div className="bg-slate-50 rounded-xl p-4 h-64 overflow-auto border border-slate-200">
              <table className="w-full text-left text-[10px]">
                <thead><tr className="border-b border-slate-200 text-slate-400 font-bold"><th className="p-2">#</th><th className="p-2">Store Code</th><th className="p-2">Area</th><th className="p-2">Team</th><th className="p-2">Asset</th></tr></thead>
                <tbody>{previewData.slice(0, 50).map((row, i) => <tr key={i} className="border-b border-slate-100 hover:bg-slate-100"><td className="p-2 text-slate-400">{i + 1}</td><td className="p-2 font-mono text-slate-600 truncate max-w-[100px]">{row[0]}</td><td className="p-2 font-mono text-slate-600 truncate max-w-[100px]">{row[1]}</td><td className="p-2 font-mono text-slate-600 truncate max-w-[100px]">{row[2]}</td><td className="p-2 font-mono text-slate-600 truncate max-w-[100px]">{row[3]}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="flex gap-2"><button onClick={() => { setPreviewData([]); setPasteData(""); }} className="flex-1 p-4 bg-slate-100 rounded-xl font-bold text-slate-500 hover:bg-slate-200">ยกเลิก</button><button onClick={processImport} className="flex-2 p-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700">ยืนยันนำเข้า</button></div>
          </div>
        )}
      </div>
    </div>
  );
};

const SuccessModal = ({ onClose }) => <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"><div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center max-w-sm w-full animate-in zoom-in-95"><div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-bounce"><CheckCircle2 size={48} /></div><h3 className="text-2xl font-black text-slate-800 mb-2">เรียบร้อยแล้ว!</h3><button onClick={onClose} className="w-full p-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">ตกลง</button></div></div>;
const FileViewer = ({ files, onClose }) => <div className="fixed inset-0 bg-black/95 z-[100] p-6 flex flex-col items-center justify-center backdrop-blur-xl" onClick={onClose}><button onClick={onClose} className="absolute top-6 right-6 text-white hover:scale-110 transition-all"><XCircle size={40} /></button><div className="w-full max-w-6xl h-[85vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4" onClick={(e) => e.stopPropagation()}>{files.map((link, i) => <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col group h-fit"><iframe src={link.replace("/view", "/preview")} className="w-full border-0 min-h-[400px] bg-slate-100" allow="autoplay" title={`preview-${i}`} /><div className="p-5 bg-slate-900 flex justify-between items-center border-t border-slate-800"><span className="text-white font-black uppercase text-[10px] tracking-widest">Evidence {i + 1}</span><a href={link} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Download / Open</a></div></div>)}</div></div>;

// --- Basic UI Components ---
const MenuCard = ({ icon, title, desc, onClick, color }) => <button onClick={onClick} className={`group p-12 rounded-[2.5rem] shadow-xl border border-slate-100 transition-all flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl ${color}`}><div className="bg-white/20 p-6 rounded-3xl mb-8 shadow-lg backdrop-blur-sm">{icon}</div><h3 className="text-2xl font-black mb-4">{title}</h3><p className="font-medium leading-relaxed text-sm opacity-90">{desc}</p></button>;
const StatCard = ({ label, value, color, icon }) => <div className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow"><div className={`${color} text-white p-5 rounded-[1.5rem] shadow-xl`}>{icon}</div><div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p><p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p></div></div>;
const TabBtn = ({ active, icon, label, onClick, color }) => <button onClick={onClick} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${active ? `${color} text-white shadow-lg` : "text-slate-400 hover:bg-slate-50"}`}>{icon} {label}</button>;
const InfoBlock = ({ label, val }) => <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label><div className="font-bold text-slate-800 text-sm">{val}</div></div>;
const PriorityBadge = ({ p }) => <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${p === "High" ? "bg-red-100 text-red-700 border-red-200" : p === "Medium" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-green-100 text-green-700 border-green-200"}`}>{p}</span>;

export default App;