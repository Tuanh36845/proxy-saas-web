"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function DepositPage() {
  return (
    <DashboardLayout>
        <div className="d-sm-flex justify-content-between align-items-center mb-4">
            <h3 className="text-dark mb-0">Nạp Tiền Vào Tài Khoản</h3>
        </div>

        <div className="row">
            <div className="col-lg-6 offset-lg-3">
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-wallet me-2"></i>Thanh Toán Tự Động</h6>
                    </div>
                    <div className="card-body text-center p-5">
                        <div className="mb-4">
                            <i className="fas fa-tools fa-4x text-gray-300 mb-3" style={{ opacity: 0.5 }}></i>
                            <h5 className="text-muted">Hệ thống thanh toán đang được tích hợp</h5>
                            <p className="text-muted small">Cổng thanh toán tự động qua Momo và Ngân hàng sẽ sớm ra mắt trong thời gian tới.</p>
                        </div>
                        
                        <div className="alert alert-info small text-start border-left-info shadow-sm">
                            <strong>Tiến độ tích hợp dự kiến:</strong>
                            <ul className="mb-0 mt-2 ps-3">
                                <li>Tạo mã giao dịch tự động.</li>
                                <li>Sinh QR Code riêng theo đơn.</li>
                                <li>Cảm biến tự cộng tiền qua Webhook API.</li>
                            </ul>
                        </div>
                        
                        <button className="btn btn-secondary mt-3 w-100" disabled>
                            <i className="fas fa-lock me-2"></i> Đang Bảo Trì
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
  );
}
