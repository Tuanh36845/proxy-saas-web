"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function ProfilePage() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    facebook: "",
    address: "",
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string>("/assets/img/autoproxy_logo.png");
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/users/profile");
      const data = await res.json();
      if (res.ok && data.user) {
        setUserInfo(data.user);
        setFormData({
            name: data.user.name || "",
            age: data.user.age || "",
            gender: data.user.gender || "",
            phone: data.user.phone || "",
            facebook: data.user.facebook || "",
            address: data.user.address || "",
        });
        if (data.user.avatar) setAvatarPreview(data.user.avatar);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi lấy thông tin", error);
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
        const payload = {
            ...formData,
            avatar: avatarPreview !== userInfo?.avatar && avatarPreview !== "/assets/img/autoproxy_logo.png" ? avatarPreview : undefined
        };

        const res = await fetch("/api/users/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            alert("Đã lưu thông tin hồ sơ thành công!");
            // Gọi hàm refresh nhẹ trang để topbar bắt được ảnh mới
            window.location.reload(); 
        } else {
            alert(data.error || "Có lỗi xảy ra");
        }
    } catch (error) {
        alert("Có lỗi mạng!");
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) return <DashboardLayout><div className="text-center py-5">Đang tải hồ sơ...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <h3 className="text-dark mb-4">Hồ Sơ Của Bạn</h3>
      
      <div className="row mb-3">
          <div className="col-lg-4 col-xxl-4">
              <div className="card mb-3">
                  <div className="card-body text-center shadow">
                      <img 
                        src={avatarPreview} 
                        width="156" height="156" 
                        alt="Avatar" 
                        className="rounded-circle mb-3" 
                        style={{objectFit: "cover", border: "4px solid #fff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)"}}
                      />
                      <div className="mb-3"></div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        style={{display: "none"}} 
                      />
                      <button className="btn btn-primary btn-sm" type="button" onClick={() => fileInputRef.current?.click()}>
                          <i className="fas fa-upload me-1"></i> Đổi Ảnh Đại Diện
                      </button>
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
                          <p className="text-muted small mb-3">Tổng nạp: {((userInfo?.balance || 0) + 1500000).toLocaleString()} VNĐ</p>

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
          <form onSubmit={handleSubmit}>
              <div className="card-header bg-light d-flex justify-content-between align-items-center" style={{padding: "8px 15px", borderBottom: "1px solid #e0e0e0"}}>
                  <h6 className="fw-bold text-secondary m-0" style={{fontSize: "14px"}}>
                      <i className="fas fa-user-edit me-2"></i>CẬP NHẬT THÔNG TIN
                  </h6>
                  <button disabled={isSaving} className="btn btn-primary btn-sm px-3 m-0 fw-bold" type="submit" style={{fontSize: "12px", borderRadius: "4px", padding: "4px 12px"}}>
                      {isSaving ? <i className="fas fa-spinner fa-spin me-1"></i> : <i className="fas fa-save me-1"></i>}
                      Lưu Thay Đổi
                  </button>
              </div>

              <div className="card-body p-3">
                  <div className="row mb-3">
                      <div className="col-md-9">
                          <label className="form-label small mb-1 text-muted">Họ và tên</label>
                          <input type="text" name="name" className="form-control form-control-sm" placeholder="Họ và Tên" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="col-md-3 mt-3 mt-md-0">
                          <label className="form-label small mb-1 text-muted">Tuổi</label>
                          <input type="number" name="age" className="form-control form-control-sm" placeholder="Tuổi" value={formData.age} onChange={handleChange} />
                      </div>
                  </div>

                  <div className="row mb-3">
                      <div className="col-md-6">
                          <label className="form-label small mb-1 text-muted">Giới tính</label>
                          <select name="gender" className="form-select form-select-sm text-secondary" value={formData.gender} onChange={handleChange}>
                              <option value="" disabled>Chọn Giới tính</option>
                              <option value="male">Nam</option>
                              <option value="female">Nữ</option>
                          </select>
                      </div>
                      <div className="col-md-6 mt-3 mt-md-0">
                          <label className="form-label small mb-1 text-muted">Số điện thoại</label>
                          <input type="tel" name="phone" className="form-control form-control-sm" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} />
                      </div>
                  </div>

                  <div className="row mb-3">
                      <div className="col-md-6">
                          <label className="form-label small mb-1 text-muted">Email (Không thể đổi)</label>
                          <input type="email" className="form-control form-control-sm bg-light" placeholder="Địa chỉ Email" value={session?.user?.email || ""} disabled />
                      </div>
                      <div className="col-md-6 mt-3 mt-md-0">
                          <label className="form-label small mb-1 text-muted">Liên kết Facebook</label>
                          <div className="input-group input-group-sm">
                              <span className="input-group-text bg-white"><i className="fab fa-facebook-f text-primary" style={{fontSize: "12px"}}></i></span>
                              <input type="url" name="facebook" className="form-control" placeholder="Link Facebook" value={formData.facebook} onChange={handleChange} />
                          </div>
                      </div>
                  </div>

                  <div className="row mb-1">
                      <div className="col-12">
                          <label className="form-label small mb-1 text-muted">Địa chỉ liên hệ</label>
                          <input type="text" name="address" className="form-control form-control-sm" placeholder="Địa chỉ liên hệ (Số nhà, Tên đường, Quận/Huyện, Tỉnh/TP)" value={formData.address} onChange={handleChange} />
                      </div>
                  </div>
              </div>
          </form>
      </div>
    </DashboardLayout>
  );
}
