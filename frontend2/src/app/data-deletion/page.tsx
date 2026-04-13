import Link from "next/link";
import { Shield, Mail, Trash2, Clock, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Data Deletion | BoostLink Pro",
  description: "How to request deletion of your data from BoostLink Pro",
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-bg font-sans">
      {/* Nav */}
      <nav className="border-b border-bdr bg-card">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-t1 no-underline"
          >
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white text-xs font-black">B</span>
            </div>
            <span className="text-sm font-extrabold text-t1">
              BoostLink Pro
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-t3 hover:text-t1 transition-colors"
          >
            Back to dashboard →
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center shrink-0">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-t1 tracking-tight">
              Data Deletion
            </h1>
            <p className="text-t3 mt-1 text-sm">
              How to request removal of your personal data from BoostLink Pro
            </p>
          </div>
        </div>

        {/* What we store */}
        <section className="bg-card border border-bdr rounded-2xl p-7 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield size={18} className="text-brand" />
            <h2 className="text-base font-bold text-t1">What data we store</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                label: "Instagram account info",
                desc: "Username, profile picture, follower count, access token",
              },
              {
                label: "Automation rules",
                desc: "Keywords, DM messages, and post targeting you configured",
              },
              {
                label: "Digital products",
                desc: "Product names, prices, descriptions and uploaded files",
              },
              {
                label: "Account details",
                desc: "Email address, plan type, and billing history",
              },
              {
                label: "Usage data",
                desc: "DMs sent count, link clicks, and product sales",
              },
            ].map(({ label, desc }) => (
              <div
                key={label}
                className="flex items-start gap-3 py-3 border-b border-bdr last:border-0"
              >
                <CheckCircle size={15} className="text-brand mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-t1">{label}</p>
                  <p className="text-xs text-t3 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to delete */}
        <section className="bg-card border border-bdr rounded-2xl p-7 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <Trash2 size={18} className="text-brand" />
            <h2 className="text-base font-bold text-t1">
              How to delete your data
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                step: "01",
                title: "Delete via dashboard",
                desc: "The fastest way. Go to Settings → Account → Delete Account. This immediately removes all your data, automations, products, and disconnects Instagram.",
                highlight: true,
              },
              {
                step: "02",
                title: "Email us directly",
                desc: 'Send a deletion request to privacy@boostlinkpro.com with the subject line "Data Deletion Request" and include your registered email address.',
                highlight: false,
              },
              {
                step: "03",
                title: "Disconnect Instagram only",
                desc: "If you only want to remove your Instagram connection, go to Settings → Instagram → Disconnect. This revokes access and deletes your stored access token.",
                highlight: false,
              },
            ].map(({ step, title, desc, highlight }) => (
              <div
                key={step}
                className={`flex gap-4 p-4 rounded-xl border ${highlight ? "border-brand/20 bg-brandpale" : "border-bdr bg-bg2"}`}
              >
                <span
                  className={`text-xs font-black shrink-0 mt-0.5 ${highlight ? "text-brand" : "text-t4"}`}
                >
                  {step}
                </span>
                <div>
                  <p
                    className={`text-sm font-bold mb-1 ${highlight ? "text-brand" : "text-t1"}`}
                  >
                    {title}
                  </p>
                  <p className="text-xs text-t3 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-card border border-bdr rounded-2xl p-7 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <Clock size={18} className="text-brand" />
            <h2 className="text-base font-bold text-t1">Deletion timeline</h2>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            {[
              {
                time: "Immediately",
                action: "Instagram access token revoked, automations disabled",
              },
              {
                time: "Within 24 hours",
                action:
                  "Account data, automations, and products removed from active systems",
              },
              {
                time: "Within 30 days",
                action: "All data purged from backups and logs",
              },
            ].map(({ time, action }) => (
              <div key={time} className="flex items-start gap-3">
                <span className="shrink-0 text-xs font-bold text-brand bg-brandpale px-2.5 py-1 rounded-full min-w-[120px] text-center mt-0.5">
                  {time}
                </span>
                <span className="text-t2 text-xs leading-relaxed pt-1">
                  {action}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-card border border-bdr rounded-2xl p-7">
          <div className="flex items-center gap-3 mb-4">
            <Mail size={18} className="text-brand" />
            <h2 className="text-base font-bold text-t1">Contact us</h2>
          </div>
          <p className="text-sm text-t2 leading-relaxed mb-4">
            For any data-related questions or requests, reach out at:
          </p>
          <a
            href="mailto:privacy@boostlinkpro.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brandhov transition-colors no-underline"
          >
            <Mail size={14} />
            privacy@boostlinkpro.com
          </a>
          <p className="text-xs text-t4 mt-4">
            We respond to all data deletion requests within 48 hours.
          </p>
        </section>

        <p className="text-center text-xs text-t4 mt-10">
          Last updated: March 2026 · BoostLink Pro
        </p>
      </div>
    </main>
  );
}
