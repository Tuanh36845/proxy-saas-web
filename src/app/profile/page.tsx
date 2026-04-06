"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";

// Function xác định hệ thống Rank
const calculateRank = (deposit: number) => {
    if (deposit >= 70_000_000) {
        return {
            name: "Thành Viên Kim Cương",
            color: "#00d2ff",
            icon: "fas fa-gem",
            nextTierText: "Cấp độ cao nhất",
            progress: 100,
            missing: 0,
            benefits: [
                "Giảm 15% giá trị hóa đơn",
                "Xoay IP tự động mỗi 10p/lần",
                "Phân đội hỗ trợ kênh riêng trực tiếp 24/7"
            ]
        };
    } else if (deposit >= 10_000_000) {
        return {
            name: "Thành Viên Vàng",
            color: "#FFD700",
            icon: "fas fa-crown",
            nextTierText: "Tiến trình lên Kim Cương",
            progress: Math.min(100, (deposit / 70_000_000) * 100),
            missing: 70_000_000 - deposit,
            benefits: [
                "Giảm 7% giá trị hóa đơn",
                "Được xoay IP tự động 1h/1 lần",
                "Ưu tiên hỗ trợ (Ticket VIP)"
            ]
        };
    } else if (deposit >= 1_000_000) {
        return {
            name: "Thành Viên Bạc",
            color: "#C0C0C0",
            icon: "fas fa-medal",
            nextTierText: "Tiến trình lên Vàng",
            progress: Math.min(100, (deposit / 10_000_000) * 100),
            missing: 10_000_000 - deposit,
            benefits: [
                "Giảm 2% khi mua Proxy",
                "Được phép sử dụng nút xoay IP tự động",
                "Giới hạn 6h xoay 1 lần"
            ]
        };
    } else {
        return {
            name: "Thành Viên Đồng",
            color: "#cd7f32",
            icon: "fas fa-star",
            nextTierText: "Tiến trình lên Bạc",
            progress: Math.min(100, (deposit / 1_000_000) * 100),
            missing: 1_000_000 - deposit,
            benefits: [
                "Chưa có ưu đãi hệ thống giảm giá",
                "Mua proxy mặc định",
                "Hỗ trợ kênh thường"
            ]
        };
    }
};

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

  // Call logic Rank calculation
  const totalDeposit = userInfo?.totalDeposit || 0;
  const rankInfo = calculateRank(totalDeposit);

  return (
    <DashboardLayout>
      <h3 className="text-dark mb-4">Hồ Sơ Của Bạn</h3>
      
      <div className="row mb-3">
          <div className="col-lg-4 col-xxl-4">
              <div className="card mb-3 pb-3">
                  <div className="card-body text-center shadow">
                      <img 
                        src={avatarPreview} 
                        width="156" height="156" 
                        alt="Avatar" 
                        className="rounded-circle mb-3" 
                        style={{objectFit: "cover", border: "4px solid #fff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)"}}
                      />
                      
                      <div className="mb-3">
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

                      {/* Thông tin cấu hình hệ thống */}
                      <div className="mt-4 pt-3 border-top text-start px-2">
                        <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-id-card text-muted me-2" style={{width: "20px"}}></i>
                            <span className="fw-bold me-2 text-dark">ID:</span>
                            <span className="text-primary font-monospace bg-light px-2 py-1 rounded border">
                                {userInfo?.userId || "Đang lấy mã..."}
                            </span>
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="fas fa-shield-alt text-muted me-2" style={{width: "20px"}}></i>
                            <span className="fw-bold me-2 text-dark">Trạng thái:</span>
                            {userInfo?.isVerified ? (
                                <span className="badge bg-success">Đã Xác Thực</span>
                            ) : (
                                <span className="badge bg-secondary">Chưa Verry</span>
                            )}
                        </div>
                      </div>

                  </div>
              </div>
          </div>
          
          <div className="col-lg-8">
              <div className="card shadow border-start-primary py-2 mb-3">
                  <div className="card-body">
                      <div className="rank-card text-center" style={{padding: "15px"}}>
                          <div className="rank-icon" style={{color: rankInfo.color, textShadow: `0 0 5px ${rankInfo.color}40`, fontSize: "3rem", marginBottom: "10px"}}>
                              <i className={rankInfo.icon}></i>
                          </div>
                          
                          <h4 className="fw-bold mb-1" style={{color: rankInfo.color}}>{rankInfo.name}</h4>
                          <p className="text-muted small mb-3">Tổng nạp tích lũy: {totalDeposit.toLocaleString()} VNĐ</p>

                          <div className="rank-progress-container mb-3 text-start">
                              <div className="d-flex justify-content-between font-weight-bold" style={{fontSize: "0.8rem", marginBottom: "5px"}}>
                                  <span>{rankInfo.nextTierText}</span>
                                  <span>{Math.floor(rankInfo.progress)}%</span>
                              </div>
                              <div className="progress" style={{height: "10px"}}>
                                  <div className="progress-bar progress-bar-striped progress-bar-animated" 
                                       role="progressbar" style={{width: `${rankInfo.progress}%`, backgroundColor: rankInfo.color}} 
                                       aria-valuenow={rankInfo.progress} aria-valuemin={0} aria-valuemax={100}>
                                  </div>
                              </div>
                              {rankInfo.missing > 0 && (
                                  <div className="mt-2 small text-muted">Còn thiếu {rankInfo.missing.toLocaleString()} VNĐ để lên hạng</div>
                              )}
                          </div>

                          <hr />

                          <ul className="text-start" style={{fontSize: "0.85rem", marginTop: "15px", paddingLeft: 0, listStyle: "none"}}>
                              {rankInfo.benefits.map((benefit: string, index: number) => (
                                  <li className="mb-1" key={index}><i className="fas fa-check-circle text-success me-1"></i> {benefit}</li>
                              ))}
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
                          <input type="text" name="name" className="form-control form-control-sm" placeholder="Họ và Tên" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="col-md-3 mt-3 mt-md-0">
                          <input type="number" name="age" className="form-control form-control-sm" placeholder="Tuổi" value={formData.age} onChange={handleChange} />
                      </div>
                  </div>

                  <div className="row mb-3">
                      <div className="col-md-6">
                          <select name="gender" className="form-select form-select-sm text-secondary" value={formData.gender} onChange={handleChange}>
                              <option value="" disabled>Chọn Giới tính</option>
                              <option value="male">Nam</option>
                              <option value="female">Nữ</option>
                          </select>
                      </div>
                      <div className="col-md-6 mt-3 mt-md-0">
                          <input type="tel" name="phone" className="form-control form-control-sm" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} />
                      </div>
                  </div>

                  <div className="row mb-3">
                      <div className="col-md-6">
                          <input type="email" className="form-control form-control-sm bg-light" placeholder="Địa chỉ Email (Không thể thay đổi)" value={session?.user?.email || ""} disabled />
                      </div>
                      <div className="col-md-6 mt-3 mt-md-0">
                          <div className="input-group input-group-sm">
                              <span className="input-group-text bg-white"><i className="fab fa-facebook-f text-primary" style={{fontSize: "12px"}}></i></span>
                              <input type="url" name="facebook" className="form-control" placeholder="Link Facebook" value={formData.facebook} onChange={handleChange} />
                          </div>
                      </div>
                  </div>

                  <div className="row mb-1">
                      <div className="col-12">
                          <input type="text" name="address" className="form-control form-control-sm" placeholder="Địa chỉ liên hệ (Số nhà, Tên đường, Quận/Huyện, Tỉnh/TP)" value={formData.address} onChange={handleChange} />
                      </div>
                  </div>
              </div>
          </form>
      </div>
    </DashboardLayout>
  );
}
