"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

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
                      <div className={"collapse " + (["/dashboard", "/profile", "/inventory", "/contact"].includes(pathname) ? "show" : "")} id="collapseAdmin">
                          <div className="bg-white py-2 collapse-inner rounded mx-2" style={{listStyle: "none"}}>
                              <Link className={`dropdown-item text-dark px-3 py-2 ${pathname === '/dashboard' ? 'active font-weight-bold bg-light' : ''}`} href="/dashboard" style={{fontSize: "13px"}}>
                                  <i className="fas fa-tachometer-alt me-2"></i> Bảng điều khiển
                              </Link>
                              <Link className={`dropdown-item text-dark px-3 py-2 ${pathname === '/inventory' ? 'active font-weight-bold bg-light' : ''}`} href="/inventory" style={{fontSize: "13px"}}>
                                  <i className="fas fa-box me-2"></i> Kho proxy
                              </Link>
                              <Link className={`dropdown-item text-dark px-3 py-2 ${pathname === '/profile' ? 'active font-weight-bold bg-light' : ''}`} href="/profile" style={{fontSize: "13px"}}>
                                  <i className="fas fa-user-circle me-2"></i> Hồ sơ
                              </Link>
                              <Link className={`dropdown-item text-dark px-3 py-2 ${pathname === '/contact' ? 'active font-weight-bold bg-light' : ''}`} href="/contact" style={{fontSize: "13px"}}>
                                  <i className="fas fa-headset me-2"></i> Liên hệ & Trợ giúp
                              </Link>
                              <div className="dropdown-divider"></div>
                              <a className="dropdown-item text-danger px-3 py-2" onClick={() => signOut()} style={{fontSize: "13px", cursor: "pointer"}}>
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
                                      <span className="d-none d-lg-inline me-2 text-gray-600 small">Xin chào, {session?.user?.name || "Thành Viên"}</span>
                                      <img className="border rounded-circle img-profile" src="/assets/img/avatars/avatar1.jpeg" alt="Profile" />
                                  </a>
                              </div>
                          </li>
                      </ul>
                  </div>
              </nav>

              {/* Page Content */}
              <div className="container-fluid">
                  {children}
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
