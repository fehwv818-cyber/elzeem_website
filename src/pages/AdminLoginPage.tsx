import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { db } from '../services/db';
import { PageView } from '../types';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (view: PageView) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('za3eem2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Secure check: Demo admin credentials
      if (
        (username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'alza3eem') &&
        (password === 'za3eem2026' || password === 'admin123')
      ) {
        db.setAdminAuthenticated(true);
        onLoginSuccess();
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#141820] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-right space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">تسجيل دخول الإدارة</h1>
          <p className="text-xs text-neutral-400">
            لوحة تحكم وتعديل بيانات وقائمة مطعم الزعيم
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-300 text-xs font-semibold text-right">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-300">
              اسم المستخدم
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
              />
              <User className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-300">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#0d0f12] border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
              />
              <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          {/* Quick Demo Credentials Reminder */}
          <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1 text-right">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>بيانات الدخول التجريبية معبأة تلقائياً:</span>
            </div>
            <p className="tabular-nums">المستخدم: <strong className="text-white">admin</strong> | كلمة المرور: <strong className="text-white">za3eem2026</strong></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-black text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>{loading ? 'جارٍ التحقق...' : 'دخول لوحة التحكم'}</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};
