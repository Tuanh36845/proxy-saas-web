"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";

interface Proxy {
  _id: string;
  type: string;
  assignedPort: number;
  currentIp: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [balance, setBalance] = useState<number>(0);
  
  // Purchase State
  const [purchaseQty, setPurchaseQty] = useState<number>(1);
  const [purchaseType, setPurchaseType] = useState<string>("ipv4");
  const [purchaseCountry, setPurchaseCountry] = useState<string>("vn");
  const [purchaseMonths, setPurchaseMonths] = useState<number>(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    fetchProxies();
  }, []);

  const fetchProxies = async () => {
    try {
      const [proxyRes, profileRes] = await Promise.all([
        fetch("/api/proxies"),
        fetch("/api/users/profile")
      ]);
      const proxyData = await proxyRes.json();
      const profileData = await profileRes.json();
      
      if (proxyData.proxies) setProxies(proxyData.proxies);
      if (profileData.user) setBalance(profileData.user.balance || 0);
    } catch (error) {
      console.error("Lỗi tải proxy", error);
    }
  };

  // Tính giá tiền
  const getPricePerMonth = (type: string) => {
    if (type === "ipv4") return 40000;
    if (type === "ipv6") return 20000;
    if (type === "rotate") return 149000;
    return 0;
  };

  const totalPrice = purchaseQty * getPricePerMonth(purchaseType) * purchaseMonths;

  const handlePurchase = async () => {
    if (!purchaseQty || purchaseQty < 1) return alert("Vui lòng chọn số lượng hợp lệ!");
    
    setIsPurchasing(true);
    try {
        const res = await fetch("/api/proxies/purchase", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                type: purchaseType,
                country: purchaseCountry,
                months: purchaseMonths,
                qty: purchaseQty,
                totalPrice: totalPrice
            })
        });
        const data = await res.json();
        if (!res.ok) {
            alert(data.error || "Lỗi giao dịch!");
            setIsPurchasing(false);
        } else {
            alert("Thanh toán thành công! Đã thêm proxy vào kho.");
            router.push("/inventory");
        }
    } catch (error) {
        alert("Có lỗi kết nối hệ thống!");
        setIsPurchasing(false);
    }
  };

  return (
    <DashboardLayout>
        <div className="d-sm-flex justify-content-between align-items-center mb-4">
            <h3 className="text-dark mb-0">Bảng Điều Khiển AutoProxy</h3>
            <a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#">
                <i className="fas fa-download fa-sm text-white-50"></i> Tạo báo cáo
            </a>
        </div>

        {/* Dashboard Cards */}
        <div className="row">
            <div className="col-md-6 col-xl-3 mb-4">
                <div className="card shadow py-2 border-left-primary">
                    <div className="card-body">
                        <div className="row g-0 align-items-center">
                            <div className="col me-2">
                                <div className="text-uppercase text-primary mb-1 fw-bold text-xs"><span>số dư của bạn</span></div>
                                <div className="text-dark mb-0 fw-bold h5"><span>{balance.toLocaleString()} VNĐ</span></div>
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
                <div className="card shadow py-2 border-left-info">
                    <div className="card-body">
                        <div className="row g-0 align-items-center">
                            <div className="col me-2">
                                <div className="text-uppercase text-info mb-1 fw-bold text-xs"><span>Tỷ lệ live</span></div>
                                <div className="row g-0 align-items-center">
                                    <div className="col-auto">
                                        <div className="text-dark me-3 mb-0 fw-bold h5"><span>50%</span></div>
                                    </div>
                                    <div className="col">
                                        <div className="progress progress-sm">
                                            <div className="progress-bar bg-info" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ width: "50%" }}><span className="visually-hidden">50%</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-auto"><i className="fas fa-clipboard-list fa-2x text-gray-300"></i></div>
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
                            <button className="btn btn-outline-primary d-block text-uppercase w-100" type="button" onClick={() => setPurchaseType("ipv4")}>Chọn Gói</button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title text-muted text-uppercase text-center">IPv6 Datacenter</h5>
                            <h6 className="card-price text-center">20.000đ<span className="period">/tháng</span></h6>
                            <hr />
                            <ul className="fa-ul">
                                <li><span className="fa-li"><i className="fa fa-check text-success"></i></span>Single User</li>
                                <li><span className="fa-li"><i className="fa fa-check text-success"></i></span>5GB Storage</li>
                                <li><span className="fa-li"><i className="fa fa-check text-success"></i></span>Unlimited Public Projects</li>
                                <li><span className="fa-li"><i className="fa fa-check text-success"></i></span>Community Access</li>
                            </ul>
                            <button className="btn btn-outline-primary d-block text-uppercase w-100" type="button" onClick={() => setPurchaseType("ipv6")}>Chọn Gói</button>
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
                            <button className="btn btn-outline-primary d-block text-uppercase w-100" type="button" onClick={() => setPurchaseType("rotate")}>Chọn Gói</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Purchasing Table that matches original index.html */}
            <div className="row mt-4">
                <div className="col col-md-12 search-table-col"><span className="counter pull-right"></span>
                    <div className="table-responsive table table-hover table-bordered results bg-white shadow-sm rounded">
                        <table className="table table-hover table-bordered mb-0">
                            <thead className="bill-header cs bg-light">
                                <tr>
                                    <th id="trs-hd-1" className="col-lg-1 text-center">Số Lượng</th>
                                    <th id="trs-hd-2" className="col-lg-2">Loại Proxy</th>
                                    <th id="trs-hd-3" className="col-lg-3">Quốc Gia (Đồng giá)</th>
                                    <th id="trs-hd-4" className="col-lg-2">Thời Gian</th>
                                    <th id="trs-hd-5" className="col-lg-2">Thành Tiền</th>
                                    <th id="trs-hd-6" className="col-lg-2 text-center">Xác Nhận</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="proxy-row align-middle">
                                    <td className="text-center">
                                      <input type="number" className="form-control form-control-sm qty-input mx-auto" 
                                             value={purchaseQty} onChange={(e) => setPurchaseQty(Number(e.target.value))} 
                                             min="1" style={{width: "65px", textAlign: "center"}} />
                                    </td>
                                    <td>
                                      <div>
                                        <select className="form-select form-select-sm" value={purchaseType} onChange={(e) => setPurchaseType(e.target.value)}>
                                            <option value="ipv4">IPv4 Datacenter (40.000đ)</option>
                                            <option value="ipv6">IPv6 Datacenter (20.000đ)</option>
                                            <option value="rotate">IPv4 Xoay (149.000đ)</option>
                                        </select>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <select className="form-select form-select-sm" value={purchaseCountry} onChange={(e) => setPurchaseCountry(e.target.value)}>
                                            <option value="vn">Việt Nam (VN)</option>
                                            <option value="us">United States (US)</option>
                                            <option value="sg">Singapore (SG)</option>
                                        </select>
                                      </div>
                                    </td>
                                    <td>
                                        <select className="form-select form-select-sm" value={purchaseMonths} onChange={(e) => setPurchaseMonths(Number(e.target.value))}>
                                            <option value="1">1 Tháng</option>
                                            <option value="2">2 Tháng</option>
                                            <option value="3">3 Tháng</option>
                                            <option value="6">6 Tháng</option>
                                            <option value="12">12 Tháng</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="fw-bold text-primary text-nowrap" style={{fontSize: "1.1rem"}}>
                                            <span className="total-price">{totalPrice.toLocaleString()}</span> VNĐ
                                        </div>
                                    </td>
                                    <td className="text-center">
                                      <button disabled={isPurchasing} className="btn btn-success btn-sm w-100 fw-bold shadow-sm" type="button" onClick={handlePurchase}>
                                        {isPurchasing ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-shopping-cart me-1"></i> MUA NGAY</>}
                                      </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </DashboardLayout>
  );
}
