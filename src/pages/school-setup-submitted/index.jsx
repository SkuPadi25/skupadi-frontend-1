import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Check, ChevronDown, UserCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const STEPS = ["School Info", "School Profile", "Verification", "Admin Profile", "Security", "Review"];

const getSchoolName = (user, state) =>
  state?.schoolName ||
  user?.school?.name ||
  user?.schoolName ||
  "your school";

const SetupSubmitted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth() || {};
  const schoolName = getSchoolName(user, location?.state);
  const currentDate = new Date()?.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#eef2f8] lg:flex">
      <aside className="hidden bg-[#091f50] px-6 py-5 text-white lg:flex lg:w-[230px] lg:flex-col">
        <img src="/assets/images/sk1e.png" alt="SkuPadi" className="h-9 w-auto object-contain" />
      </aside>

      <main className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-[#dbe1ee] bg-white">
          <div className="flex h-16 items-center justify-between px-5 md:px-8">
            <p className="text-xs text-[#475467]">{currentDate}</p>
            <div className="flex items-center gap-4 text-[#101828]">
              <button type="button" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5 fill-[#101828]" />
                <span className="absolute -right-0.5 top-0 h-1.5 w-1.5 rounded-full bg-[#d92d20]" />
              </button>
              <UserCircle className="h-5 w-5" />
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 py-5 md:px-8">
          <div className="mx-auto max-w-[760px]">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mb-7 inline-flex items-center gap-2 text-xs font-medium text-[#1d2939]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Dashboard
            </button>

            <section className="mb-6 rounded-[8px] bg-white px-7 py-5 shadow-[0_10px_24px_rgba(16,24,40,0.03)]">
              <div className="grid grid-cols-3 gap-y-4 md:grid-cols-6">
                {STEPS.map((label, index) => (
                  <div key={label} className="relative flex flex-col items-center gap-2 text-center">
                    {index > 0 ? (
                      <div className="absolute left-[-50%] top-[13px] hidden h-[2px] w-full bg-[#102567] md:block" />
                    ) : null}
                    <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#102567] text-white">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-medium text-[#1d2939]">{label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[8px] bg-white px-5 py-10 text-center shadow-[0_12px_32px_rgba(16,24,40,0.04)] md:px-16">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#d7dced]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-[6px] border-[#9ba6c6] bg-[#102567] text-white shadow-[0_10px_22px_rgba(16,37,103,0.18)]">
                  <Check className="h-5 w-5" />
                </div>
              </div>

              <h1 className="font-serif text-[30px] font-bold leading-tight text-[#10203f]">
                Application Submitted
              </h1>
              <p className="mx-auto mt-5 max-w-[420px] text-sm leading-6 text-[#101828]">
                We&apos;ve received the application for <span className="font-semibold">{schoolName}</span>, submitted by{" "}
                <span className="font-semibold">{location?.state?.adminName || user?.fullName || "the administrator"}</span>.
              </p>

              <div className="mx-auto mt-7 max-w-[390px] rounded-[4px] bg-[#f0f2f7] px-7 py-5 text-left">
                <div className="mb-5 flex items-center justify-center gap-3 text-xs">
                  <span className="font-semibold text-[#101828]">Verification Status:</span>
                  <span className="font-semibold text-[#f79009]">Pending</span>
                </div>
                <div className="grid grid-cols-[1fr_1fr_1fr] items-start text-center">
                  {["Submitted", "Under Review", "Verified"].map((label, index) => (
                    <div key={label} className="relative flex flex-col items-center gap-2">
                      {index > 0 ? (
                        <div className={`absolute right-1/2 top-[10px] h-[2px] w-full ${index < 2 ? "bg-[#102567]" : "bg-[#cfd5e5]"}`} />
                      ) : null}
                      <div
                        className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                          index < 2
                            ? "border-[#102567] bg-[#102567] text-white"
                            : "border-[#98a2b3] bg-white text-[#475467]"
                        }`}
                      >
                        {index < 2 ? <Check className="h-3 w-3" /> : index + 1}
                      </div>
                      <span className="text-[10px] font-medium text-[#1d2939]">{label}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-center text-[11px] text-[#667085]">Estimated review time: 24-48 hours</p>
              </div>

              <div className="mx-auto mt-7 max-w-[270px]">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="h-11 w-full rounded-[4px] bg-[#1029a6] text-sm font-semibold text-white shadow-[0_10px_18px_rgba(16,41,166,0.18)] transition hover:bg-[#0d238f]"
                >
                  Go to dashboard
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="mt-6 inline-flex items-center justify-center gap-2 text-xs font-medium text-[#344054]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SetupSubmitted;
