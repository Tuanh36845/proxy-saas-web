"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface Proxy {
  _id: string;
  type: string;
  assignedPort: number;
  currentIp: string;
  proxyUser: string;
  proxyPass: string;
  status: string;
  expiresAt: string;
  rotateEnabled: boolean;
  autoRotateEnabled: boolean;
  lastRotatedAt: string;
}

export default function InventoryPage() {
  const [proxies, setProxies] = useState<Proxy[]>([]);

  useEffect(() => {
    fetchProxies();
  }, []);

  const fetchProxies = async () => {
    try {
      const res = await fetch("/api/proxies");
      const data = await res.json();
      if (data.proxies) setProxies(data.proxies);
    } catch (error) {
      console.error("Lỗi tải proxy", error);
    }
  };

  const handleAction = async (proxyId: string, action: "rotate" | "toggleAutoRotate") => {
    try {
      const res = await fetch("/api/proxies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proxyId, action }),
      });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      else {
        alert(data.message);
        fetchProxies();
      }
    } catch (error) {
      alert("Đã xảy ra lỗi hệ thống");
    }
  };

  return (
    <DashboardLayout>
      <h3 className="text-dark mb-4">Kho proxy cá nhân</h3>
      <div className="card shadow mb-5">
        <div className="card-body p-0">
          {proxies.length === 0 ? (
            <div className="p-4 text-center text-muted">
              Bạn chưa có proxy nào đang hoạt động. Vui lòng mua tại Bảng Điều Khiển.
            </div>
          ) : (
            <div className="row g-0">
              {proxies.map((p, index) => {
                const isActive = p.status === 'active';
                const isRotatingType = p.type === 'ROTATING';
                
                return (
                  <div key={p._id} className="col-md-6 border-end border-bottom proxy-container p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span className="me-2 fw-bold text-secondary small">{(index + 1).toString().padStart(2, '0')}.</span>
                        <div className="me-3">
                            <div className="fw-bold mb-0" style={{fontSize: "0.9rem"}}>{p.currentIp || 'Đang chờ cấp IP'}:{p.assignedPort}</div>
                            <small className="text-muted" style={{fontSize: "0.75rem"}}>
                              SOCKS5/HTTP | <img src="https://flagcdn.com/w20/vn.png" width="16" alt="VN" /> VN
                            </small>
                        </div>
                        {isRotatingType ? 
                            <span className="badge bg-light text-dark border small me-2" title="Xoay IP">Động</span> 
                            : <span className="badge bg-light text-dark border small me-2" title="IP Tĩnh">Tĩnh</span>
                        }
                        
                        <div className="text-danger fw-bold small countdown me-2" title="Hết hạn">{new Date(p.expiresAt).toLocaleDateString()}</div>
                        
                        <span className={`badge ${isActive ? 'bg-success' : 'bg-warning text-dark'} small`} style={{fontSize: "0.7rem"}}>
                              {isActive ? 'Live' : 'Pending'}
                        </span>
                      </div>
                      
                      {isRotatingType && (
                        <div className="d-flex align-items-center">
                            <button 
                              className="btn btn-outline-primary btn-sm me-2 btn-rotate" 
                              style={{fontSize: "0.75rem", padding: "2px 8px"}}
                              onClick={() => handleAction(p._id, "rotate")}
                              title="Đổi IP Ngay Mới"
                            >
                                <i className="fas fa-sync-alt"></i>
                            </button>
                            <div className="form-check form-switch m-0" title="Tự động xoay 10 phút/lần">
                                <input 
                                  className="form-check-input cur-pointer" 
                                  type="checkbox" 
                                  role="switch" 
                                  style={{width: "30px", height: "15px", cursor: "pointer"}}
                                  checked={p.autoRotateEnabled}
                                  onChange={() => handleAction(p._id, "toggleAutoRotate")}
                                />
                            </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .proxy-expired { opacity: 0.6; filter: grayscale(1); cursor: not-allowed; }
        .proxy-expired .countdown { color: #6c757d !important; }
        .proxy-container { transition: all 0.3s ease; }
        .proxy-container:hover { background-color: #f8f9fc; }
      `}} />
    </DashboardLayout>
  );
}
