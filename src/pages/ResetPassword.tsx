import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export default function ResetPassword() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code") || "";
    const email = queryParams.get("email") || "";
      const { addNotification } = useNotifications();

    const [formData, setFormData] = useState({
        email: email,
        password_reset_code: code,
        newPassword: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
    window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
    }
    try {
        const response = await api.post("/auth/password/reset", {
            email,
            password_reset_code: code,
            new_password: formData.newPassword,
            new_password_confirmation: formData.confirmPassword
        });
        if (response.data.success) {
            console.log("Password reset successful:", response.data);
            addNotification({
                type: "success",
                title: "Password Reset Successful",
                message: "Your password has been reset successfully. Please log in with your new password."
            });
            navigate("/login");
        }
    } catch (err: any) {
        setError(err.response?.data?.message || "An error occurred");
    } finally {
        setIsLoading(false);
    }
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-20 pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-4">Reset Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
            <div className="mt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
)};
