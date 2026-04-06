"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Kiểm tra mật khẩu
    if (formData.get("password") !== formData.get("password_repeat")) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const firstName = formData.get("first_name")?.toString() || "";
      const lastName = formData.get("last_name")?.toString() || "";
      const name = firstName + " " + lastName;
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError("Đã có lỗi xảy ra");
    }
  };

  return (
    <div className="bg-gradient-primary min-vh-100 d-flex align-items-center">
      <div className="container">
          <div className="card shadow-lg my-5 o-hidden border-0">
              <div className="card-body p-0">
                  <div className="row">
                      <div className="col-lg-5 d-none d-lg-flex">
                          <div className="flex-grow-1 bg-register-image" style={{ backgroundImage: "url('/assets/img/dogs/image2.jpeg')" }}>
                            <img className="img-fluid" width="1360" height="1640" src="/assets/img/autoproxy_hero.png" alt="AutoProxy" />
                          </div>
                      </div>
                      <div className="col-lg-7">
                          <div className="p-5">
                              <div className="text-center">
                                  <h4 className="text-dark mb-4">Tạo Tài Khoản Mới!</h4>
                              </div>
                              {error && <div className="alert alert-danger p-2 text-center">{error}</div>}
                              {success && <div className="alert alert-success p-2 text-center">{success}</div>}
                              <form className="user" onSubmit={handleSubmit}>
                                  <div className="mb-3 row">
                                      <div className="col-sm-6 mb-3 mb-sm-0">
                                        <input className="form-control form-control-user" type="text" id="exampleFirstName" placeholder="Họ" name="first_name" required />
                                      </div>
                                      <div className="col-sm-6">
                                        <input className="form-control form-control-user" type="text" id="exampleLastName" placeholder="Tên" name="last_name" required />
                                      </div>
                                  </div>
                                  <div className="mb-3">
                                    <input className="form-control form-control-user" type="email" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Địa chỉ Email" name="email" required />
                                  </div>
                                  <div className="mb-3 row">
                                      <div className="col-sm-6 mb-3 mb-sm-0">
                                        <input className="form-control form-control-user" type="password" id="examplePasswordInput" placeholder="Mật khẩu" name="password" required />
                                      </div>
                                      <div className="col-sm-6">
                                        <input className="form-control form-control-user" type="password" id="exampleRepeatPasswordInput" placeholder="Nhập lại Mật khẩu" name="password_repeat" required />
                                      </div>
                                  </div>
                                  <button className="btn btn-primary d-block w-100 btn-user" type="submit">Đăng Ký</button>
                                  <hr />
                                  <a className="btn btn-primary d-block w-100 mb-2 btn-google btn-user" role="button">
                                    <i className="fab fa-google"></i>&nbsp; Đăng Ký Bằng Google
                                  </a>
                                  <a className="btn btn-primary d-block w-100 btn-facebook btn-user" role="button">
                                    <i className="fab fa-facebook-f"></i>&nbsp; Đăng Ký Bằng Facebook
                                  </a>
                                  <hr />
                              </form>
                              <div className="text-center">
                                <Link className="small" href="/forgot-password">Quên Mật Khẩu?</Link>
                              </div>
                              <div className="text-center">
                                <Link className="small" href="/login">Đã Có Tài Khoản? Đăng Nhập</Link>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
