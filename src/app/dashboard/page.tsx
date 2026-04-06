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

export default function DashboardPage() {
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
                            <button className="btn btn-outline-primary d-block text-uppercase w-100" type="button">Mua Gói</button>
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
                            <button className="btn btn-outline-primary d-block text-uppercase w-100" type="button">Mua Gói</button>
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
                            <button className="btn btn-outline-primary d-block text-uppercase w-100" type="button">Mua Gói</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Purchasing Table that matches original index.html */}
            <div className="row">
                <div className="col col-md-12 search-table-col"><span className="counter pull-right"></span>
                    <div className="table-responsive table table-hover table-bordered results">
                        <table className="table table-hover table-bordered">
                            <thead className="bill-header cs">
                                <tr>
                                    <th id="trs-hd-1" className="col-lg-1">Số Lượng</th>
                                    <th id="trs-hd-2" className="col-lg-2">Loại Proxy</th>
                                    <th id="trs-hd-3" className="col-lg-3">Quốc Gia</th>
                                    <th id="trs-hd-4" className="col-lg-2">Mua Đến Ngày</th>
                                    <th id="trs-hd-5" className="col-lg-2">Thành Tiền</th>
                                    <th id="trs-hd-6" className="col-lg-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="proxy-row">
                                    <td>
                                      <input type="number" className="form-control form-control-sm qty-input" defaultValue="1" min="1" style={{width: "65px", textAlign: "center", margin: "auto"}} />
                                    </td>
                                    <td>
                                      <div>
                                        <select className="form-select form-select-sm">
                                            <option value="ipv4">IPv4 Datacenter</option>
                                            <option value="ipv6">IPv6 Datacenter</option>
                                            <option value="rotate">IPv4 Xoay (Động)</option>
                                        </select>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <select className="form-select form-select-sm">
                                            <option value="vn">Việt Nam (VN)</option>
                                            <option value="us">United States (US)</option>
                                            <option value="sg">Singapore (SG)</option>
                                        </select>
                                      </div>
                                    </td>
                                    <td>
                                        <select className="form-select form-select-sm">
                                            <option value="1">1 Tháng</option>
                                            <option value="2">2 Tháng</option>
                                            <option value="3">3 Tháng</option>
                                            <option value="6">6 Tháng</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="fw-bold text-primary text-nowrap" style={{paddingTop: "5px"}}>
                                            <span className="total-price">50,000</span> VNĐ
                                        </div>
                                    </td>
                                    <td className="text-center">
                                      <button className="btn btn-success btn-sm m-1" type="button" onClick={() => alert('Chức năng mua giỏ hàng đang được tích hợp')}><i className="fa fa-shopping-cart" style={{fontSize: "15px"}}></i></button>
                                      <button className="btn btn-danger btn-sm m-1" type="button" onClick={() => alert('Chức năng xóa giỏ hàng đang được tích hợp')}><i className="fa fa-trash" style={{fontSize: "15px"}}></i></button>
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
