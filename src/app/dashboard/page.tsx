"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [proxies, setProxies] = useState<Proxy[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProxies();
    }
  }, [status]);

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

  if (status === "loading" || status === "unauthenticated") {
        return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
  }

  return (
    <div id="wrapper">
      {/* Sidebar */}
      <nav className="navbar align-items-start p-0 sidebar sidebar-dark accordion bg-gradient-primary navbar-dark">
          <div className="container-fluid d-flex flex-column p-0">
              <hr className="my-0 sidebar-divider" />
              <img src="/assets/img/autoproxy_logo.png" width="216" height="64" alt="Logo" />
              <ul className="navbar-nav text-light" id="accordionSidebar">
                  <li className="nav-item">
                      <a className="nav-link active collapsed" data-bs-toggle="collapse" href="#collapseAdmin" role="button" aria-expanded="false" aria-controls="collapseAdmin" style={{display: "flex", alignItems: "center"}}>
                          <i className="fas fa-tachometer-alt"></i>
                          <span style={{marginLeft: "10px"}}>Bảng Điều Khiển</span>
                          <i className="fas fa-chevron-down" style={{marginLeft: "auto", fontSize: "10px"}}></i>
                      </a>
                      <div className="collapse show" id="collapseAdmin">
                          <div className="bg-white py-2 collapse-inner rounded mx-2" style={{listStyle: "none"}}>
                              <Link className="dropdown-item text-dark px-3 py-2" href="#" style={{fontSize: "13px"}}>
                                  <i className="fas fa-user-circle me-2"></i> Hồ sơ
                              </Link>
                              <a className="dropdown-item text-dark px-3 py-2" onClick={() => signOut()} style={{fontSize: "13px", cursor: "pointer"}}>
                                  <i className="fas fa-sign-out-alt me-2"></i> Đăng Xuất
                              </a>
                          </div>
                      </div>
                  </li>
              </ul>
              <div className="text-center d-none d-md-inline"><button className="btn rounded-circle border-0" id="sidebarToggle" type="button"></button></div>
          </div>
      </nav>

      {/* Main Content */}
      <div className="d-flex flex-column" id="content-wrapper">
          <div id="content">
              {/* Topbar */}
              <nav className="navbar navbar-expand bg-white shadow mb-4 topbar">
                  <div className="container-fluid">
                      <button className="btn btn-link d-md-none me-3 rounded-circle" id="sidebarToggleTop" type="button"><i className="fas fa-bars"></i></button>
                      <ul className="navbar-nav flex-nowrap ms-auto">
                          <li className="nav-item dropdown no-arrow">
                              <div className="nav-item dropdown no-arrow">
                                  <a className="dropdown-toggle nav-link" data-bs-toggle="dropdown" aria-expanded="false" href="#">
                                      <span className="d-none d-lg-inline me-2 text-gray-600 small">Xin chào, {session?.user?.name}</span>
                                      <img className="border rounded-circle img-profile" src="/assets/img/avatars/avatar1.jpeg" alt="Profile" />
                                  </a>
                              </div>
                          </li>
                      </ul>
                  </div>
              </nav>

              <div className="container-fluid">
                  <div className="d-sm-flex justify-content-between align-items-center mb-4">
                      <h3 className="text-dark mb-0">Bảng Điều Khiển AutoProxy</h3>
                  </div>

                  {/* Dashboard Cards */}
                  <div className="row">
                      <div className="col-md-6 col-xl-3 mb-4">
                          <div className="card shadow py-2 border-left-primary">
                              <div className="card-body">
                                  <div className="row g-0 align-items-center">
                                      <div className="col me-2">
                                          <div className="text-uppercase text-primary mb-1 fw-bold text-xs"><span>số dư của bạn</span></div>
                                          <div className="text-dark mb-0 fw-bold h5"><span>$0</span></div>
                                      </div>
                                      <div className="col-auto"><i className="fas fa-database fa-2x text-gray-300"></i></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="col-md-6 col-xl-3 mb-4">
                          <div className="card shadow py-2 border-left-success">
                              <div className="card-body">
                                  <div className="row g-0 align-items-center">
                                      <div className="col me-2">
                                          <div className="text-uppercase text-success mb-1 fw-bold text-xs"><span>Tổng nạp</span></div>
                                          <div className="text-dark mb-0 fw-bold h5"><span>$0</span></div>
                                      </div>
                                      <div className="col-auto"><i className="fas fa-dollar-sign fa-2x text-gray-300"></i></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="col-md-6 col-xl-3 mb-4">
                          <div className="card shadow py-2 border-left-warning">
                              <div className="card-body">
                                  <div className="row g-0 align-items-center">
                                      <div className="col me-2">
                                          <div className="text-uppercase text-warning mb-1 fw-bold text-xs"><span>Proxy Đang Hoạt Động</span></div>
                                          <div className="text-dark mb-0 fw-bold h5"><span>{proxies.length}</span></div>
                                      </div>
                                      <div className="col-auto"><i className="fas fa-seedling fa-2x text-gray-300"></i></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Pricing Plans */}
                  <section className="py-2 pricing">
                      <div className="row">
                          <div className="col-lg-4 mb-4">
                              <div className="card">
                                  <div className="card-body">
                                      <h5 className="card-title text-muted text-uppercase text-center">Proxy Tĩnh IPv4</h5>
                                      <h6 className="card-price text-center">40.000đ<span className="period">/tháng</span></h6>
                                      <hr />
                                      <ul className="fa-ul">
                                          <li><span className="fa-li"><i className="fa fa-check text-success"></i></span>IP Cố định Dài hạn</li>
                                          <li><span className="fa-li"><i className="fa fa-check text-success"></i></span>SOCKS5 / HTTP</li>
                                      </ul>
                                      <button className="btn btn-outline-primary d-block text-uppercase w-100" type="button">MUA NGAY</button>
                                  </div>
                              </div>
                          </div>
                          <div className="col-lg-4 mb-4">
                              <div className="card">
                                  <div className="card-body">
                                      <h5 className="card-title text-muted text-uppercase text-center">Proxy Động (Xoay IP)</h5>
                                      <h6 className="card-price text-center">149.000đ<span className="period">/tháng</span></h6>
                                      <hr />
                                      <ul className="fa-ul">
                                          <li><span className="fa-li"><i className="fa fa-check text-success"></i></span>Xoay IP Liên tục (10p)</li>
                                          <li><span className="fa-li"><i className="fa fa-check text-success"></i></span>SOCKS5 Private Mượt mà</li>
                                          <li><span className="fa-li"><i className="fa fa-check text-success"></i></span>Auto Xoay 30p</li>
                                      </ul>
                                      <button className="btn btn-outline-primary d-block text-uppercase w-100" type="button">MUA NGAY</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </section>

                  {/* Proxy Table */}
                  <div className="card shadow mb-4">
                      <div className="card-header py-3">
                          <h6 className="m-0 font-weight-bold text-primary">Kho Proxy Của Bạn</h6>
                      </div>
                      <div className="card-body">
                          <div className="table-responsive">
                              <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
                                  <thead>
                                      <tr>
                                          <th>Trạng Thái</th>
                                          <th>Cổng Nối (Port)</th>
                                          <th>Tài khoản / Mật khẩu</th>
                                          <th>Địa Chỉ IP Thật</th>
                                          <th>Hạn Sử Dụng</th>
                                          <th>Thao Tác</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {proxies.length === 0 && (
                                        <tr>
                                          <td colSpan={6} className="text-center">Chưa có proxy nào. Hãy mua ở trên!</td>
                                        </tr>
                                      )}
                                      {proxies.map(p => (
                                          <tr key={p._id}>
                                              <td>
                                                  {p.status === 'active' ? 
                                                    <span className="badge bg-success">Hoạt động</span> : 
                                                    <span className="badge bg-warning">Đang xoay/xử lý</span>}
                                              </td>
                                              <td className="font-monospace">proxy.autoproxy.app:<span className="fw-bold text-primary">{p.assignedPort}</span></td>
                                              <td className="font-monospace">{p.proxyUser} / {p.proxyPass}</td>
                                              <td className="font-monospace">{p.currentIp || 'Đang chờ cấp IP...'}</td>
                                              <td>{new Date(p.expiresAt).toLocaleDateString()}</td>
                                              <td>
                                                  {p.type === "ROTATING" && (
                                                      <div className="btn-group" role="group">
                                                          <button onClick={() => handleAction(p._id, "rotate")} className="btn btn-primary btn-sm mx-1">
                                                              <i className="fas fa-sync-alt me-1"></i>Xoay (10p)
                                                          </button>
                                                          <button onClick={() => handleAction(p._id, "toggleAutoRotate")} className={\`btn btn-sm mx-1 \${p.autoRotateEnabled ? 'btn-success' : 'btn-outline-secondary'}\`}>
                                                              <i className="fas fa-clock me-1"></i>Auto
                                                          </button>
                                                      </div>
                                                  )}
                                                  {p.type === "STATIC" && <span className="text-muted small">Proxy Cố Định</span>}
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <footer className="bg-white sticky-footer">
              <div className="container my-auto">
                  <div className="text-center my-auto copyright"><span>Copyright © AutoProxy 2026</span></div>
              </div>
          </footer>
      </div>
      <a className="border rounded d-inline scroll-to-top" href="#page-top"><i className="fas fa-angle-up"></i></a>
    </div>
  );
}
