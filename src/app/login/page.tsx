"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError("Sai tài khoản hoặc mật khẩu");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="bg-gradient-primary min-vh-100 d-flex align-items-center">
      <div className="container">
          <div className="row justify-content-center">
              <div className="col-md-9 col-lg-12 col-xl-10">
                  <div className="card shadow-lg my-5 o-hidden border-0">
                      <div className="card-body p-0">
                          <div className="row">
                              <div className="col-lg-6 col-xxl-5">
                                  <div className="p-5">
                                      <div className="text-center">
                                          <h4 className="text-dark mb-4">Welcome Back!</h4>
                                      </div>
                                      {error && <div className="alert alert-danger p-2 text-center">{error}</div>}
                                      <form className="user" onSubmit={handleSubmit}>
                                          <div className="mb-3">
                                            <input className="form-control form-control-user" type="email" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Nhập địa chỉ email..." name="email" required />
                                          </div>
                                          <div className="mb-3">
                                            <input className="form-control form-control-user" type="password" id="exampleInputPassword" placeholder="Mật khẩu" name="password" required />
                                          </div>
                                          <div className="mb-3">
                                              <div className="custom-checkbox small">
                                                  <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="formCheck-1" />
                                                    <label className="form-check-label" htmlFor="formCheck-1">Nhớ Đăng Nhập</label>
                                                  </div>
                                              </div>
                                          </div>
                                          <button className="btn btn-primary d-block w-100 btn-user" type="submit">Đăng Nhập</button>
                                          <hr />
                                          <a className="btn btn-primary d-block w-100 mb-2 btn-google btn-user" role="button">
                                            <i className="fab fa-google"></i>&nbsp; Đăng Nhập Google
                                          </a>
                                          <a className="btn btn-primary d-block w-100 btn-facebook btn-user" role="button">
                                            <i className="fab fa-facebook-f"></i>&nbsp; Đăng Nhập Facebook
                                          </a>
                                          <hr />
                                      </form>
                                      <div className="text-center">
                                        <Link className="small" href="/forgot-password">Quên Mật Khẩu?</Link>
                                      </div>
                                      <div className="text-center">
                                        <Link className="small" href="/register">Đăng Ký</Link>
                                      </div>
                                  </div>
                              </div>
                              <div className="col">
                                <img className="img-fluid" width="1360" height="1640" src="/assets/img/autoproxy_hero.png" alt="Auto Proxy Hero" />
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
