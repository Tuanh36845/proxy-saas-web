"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function ContactPage() {
  return (
    <DashboardLayout>
      <div className="container-fluid">
          <h3 className="text-dark mb-1">Thông Tin Liên Hệ Và Trợ Giúp</h3>
          
          <div className="contact-buttons-container d-flex flex-wrap gap-3 py-4">
              <a href="https://www.facebook.com/autoproxypro/" target="_blank" rel="noreferrer" className="btn btn-primary d-flex align-items-center justify-content-center contact-btn" style={{backgroundColor: "#1877F2", border: "none", width: "50px", height: "50px", borderRadius: "12px", transition: "0.3s"}} title="Facebook">
                  <i className="fab fa-facebook-f fs-4 text-white"></i>
              </a>

              <a href="https://zalo.me/090xxxxxxx" target="_blank" rel="noreferrer" className="btn btn-info d-flex align-items-center justify-content-center contact-btn" style={{backgroundColor: "#0068FF", border: "none", width: "50px", height: "50px", borderRadius: "12px", transition: "0.3s"}} title="Zalo">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" width="24" height="24" alt="Zalo" />
              </a>

              <a href="https://t.me/+sU4BxBn8ztQ2Y2E1" target="_blank" rel="noreferrer" className="btn btn-secondary d-flex align-items-center justify-content-center contact-btn" style={{backgroundColor: "#26A5E4", border: "none", width: "50px", height: "50px", borderRadius: "12px", transition: "0.3s"}} title="Telegram">
                  <i className="fab fa-telegram-plane fs-4 text-white"></i>
              </a>

              <a href="https://discord.gg/jrYTd9jm" target="_blank" rel="noreferrer" className="btn btn-dark d-flex align-items-center justify-content-center contact-btn" style={{backgroundColor: "#5865F2", border: "none", width: "50px", height: "50px", borderRadius: "12px", transition: "0.3s"}} title="Discord">
                  <i className="fab fa-discord fs-4 text-white"></i>
              </a>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
              .contact-btn:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                  opacity: 0.9;
              }
          `}} />
      </div>
    </DashboardLayout>
  );
}
