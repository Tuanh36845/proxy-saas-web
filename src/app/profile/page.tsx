"use client";

import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <DashboardLayout>
      <h3 className="text-dark mb-4">Hồ Sơ</h3>
      
      <div className="row mb-3">
          <div className="col-lg-4 col-xxl-4">
              <div className="card mb-3">
                  <div className="card-body text-center shadow">
                      <img src="/assets/img/autoproxy_avatar%20(1).png" width="156" height="157" alt="Avatar" />
                      <div className="mb-3"></div>
                      <button className="btn btn-primary btn-sm" type="button" onClick={() => alert('Chức năng đang phát triển')}>Tải Ảnh</button>
                  </div>
              </div>
          </div>
          
          <div className="col-lg-8">
              <div className="card shadow border-start-primary py-2 mb-3">
                  <div className="card-body">
                      <div className="rank-card text-center" style={{padding: "15px"}}>
                          <div className="rank-icon" style={{color: "#FFD700", textShadow: "0 0 5px rgba(255,215,0,0.3)", fontSize: "3rem", marginBottom: "10px"}}>
                              <i className="fas fa-crown"></i>
                          </div>
                          
                          <h4 className="fw-bold mb-1">Thành Viên Vàng</h4>
                          <p className="text-muted small mb-3">Tổng nạp: 1,500,000 VNĐ</p>

                          <div className="rank-progress-container mb-3 text-start">
                              <div className="d-flex justify-content-between font-weight-bold" style={{fontSize: "0.8rem", marginBottom: "5px"}}>
                                  <span>Tiến trình lên Kim Cương</span>
                                  <span>75%</span>
                              </div>
                              <div className="progress" style={{height: "10px"}}>
                                  <div className="progress-bar bg-warning progress-bar-striped progress-bar-animated" 
                                       role="progressbar" style={{width: "75%"}} aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
                                  </div>
                              </div>
                              <div className="mt-2 small text-muted">Còn thiếu 500,000 VNĐ để lên hạng</div>
                          </div>

                          <hr />

                          <ul className="text-start" style={{fontSize: "0.85rem", marginTop: "15px", paddingLeft: 0, listStyle: "none"}}>
                              <li className="mb-1"><i className="fas fa-check-circle text-success me-1"></i> Giảm 10% khi mua Proxy dân cư</li>
                              <li className="mb-1"><i className="fas fa-check-circle text-success me-1"></i> Tốc độ xoay IP nhanh hơn 20%</li>
                              <li className="mb-1"><i className="fas fa-check-circle text-success me-1"></i> Hỗ trợ ưu tiên (Ticket VIP)</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="card shadow-sm border-0 mb-5">
          <div className="card-header bg-light d-flex justify-content-between align-items-center" style={{padding: "8px 15px", borderBottom: "1px solid #e0e0e0"}}>
              <h6 className="fw-bold text-secondary m-0" style={{fontSize: "14px"}}>
                  <i className="fas fa-user-edit me-2"></i>CẬP NHẬT THÔNG TIN
              </h6>
              <button className="btn btn-primary btn-sm px-3 m-0" type="button" onClick={() => alert("Thông tin đã được cập nhật!")} style={{fontSize: "12px", borderRadius: "4px", padding: "4px 12px"}}>
                  <i className="fas fa-save me-1"></i> Lưu Thay Đổi
              </button>
          </div>

          <div className="card-body p-3">
              <form onSubmit={(e) => { e.preventDefault(); alert("Đã lưu!"); }}>
                  <div className="row mb-3">
                      <div className="col-md-9">
                          <input type="text" className="form-control form-control-sm" placeholder="Họ và Tên" defaultValue={session?.user?.name || ""} />
                      </div>
                      <div className="col-md-3 mt-3 mt-md-0">
                          <input type="number" className="form-control form-control-sm" placeholder="Tuổi" />
                      </div>
                  </div>

                  <div className="row mb-3">
                      <div className="col-md-6">
                          <select className="form-select form-select-sm text-secondary" defaultValue="">
                              <option value="" disabled>Chọn Giới tính</option>
                              <option value="male">Nam</option>
                              <option value="female">Nữ</option>
                          </select>
                      </div>
                      <div className="col-md-6 mt-3 mt-md-0">
                          <input type="tel" className="form-control form-control-sm" placeholder="Số điện thoại" />
                      </div>
                  </div>

                  <div className="row mb-3">
                      <div className="col-md-6">
                          <input type="email" className="form-control form-control-sm" placeholder="Địa chỉ Email" defaultValue={session?.user?.email || ""} disabled />
                      </div>
                      <div className="col-md-6 mt-3 mt-md-0">
                          <div className="input-group input-group-sm">
                              <span className="input-group-text bg-white"><i className="fab fa-facebook-f text-primary" style={{fontSize: "12px"}}></i></span>
                              <input type="url" className="form-control" placeholder="Link Facebook" />
                          </div>
                      </div>
                  </div>

                  <div className="row mb-1">
                      <div className="col-12">
                          <input type="text" className="form-control form-control-sm" placeholder="Địa chỉ liên hệ (Số nhà, Tên đường, Quận/Huyện, Tỉnh/TP)" />
                      </div>
                  </div>
              </form>
          </div>
      </div>
    </DashboardLayout>
  );
}
