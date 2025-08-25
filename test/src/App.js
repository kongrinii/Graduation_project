import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

// 퍼블릭 폴더에 mo-logo.png 파일 필요 (public/mo-logo.png)
const LogoSrc = process.env.PUBLIC_URL + "/mo-logo.png";

// 진행 순서
const ORDER = [
  "calibrating1",
  "calibrating2",
  "calibrated",
  "driving",
  "assist_left",
  "assist_lane",
  "report",
];

// 각 단계 시간(ms)
const DUR = {
  calibrating1: 1800,
  calibrating2: 1800,
  calibrated: 1200,
  driving: 2500,
  assist_left: 1800,
  assist_lane: 1800,
  report: 0,
};

function LoadingDots({ dots = 3, size = 8 }) {
  return (
    <div className="dots">
      {Array.from({ length: dots }).map((_, i) => (
        <span
          key={i}
          className="dot"
          style={{ width: size, height: size, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function Spinner({ size = 32 }) {
  const bw = Math.max(2, Math.floor(size / 16));
  return (
    <div
      className="spinner"
      style={{ width: size, height: size, borderWidth: bw }}
      aria-label="loading"
    />
  );
}

function MOLogo() {
  return (
    <div className="logo">
      <img src={LogoSrc} alt="MindOverride" className="logo-img" />
      <div className="logo-sub">MindOverride</div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState("start");
  const [name, setName] = useState("");

  // 자동 진행
  useEffect(() => {
    if (step === "start" || step === "report") return;
    const idx = ORDER.indexOf(step);
    if (idx < 0) return;
    const t = setTimeout(() => {
      setStep(ORDER[idx + 1] ?? "report");
    }, DUR[step]);
    return () => clearTimeout(t);
  }, [step]);

  const canStart = useMemo(() => name.trim().length > 0, [name]);

  const dev =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("dev");

  return (
    <div className="page">
      <div className="phone">
        <MOLogo />

        <div className="content">
          {step === "start" && (
  <div className="start-wrap">
    <p className="headline">환영합니다!</p>
    <p className="caption">
      이름을 입력하고
      <br />
      시작 버튼을 눌러주세요.
    </p>
    <div className="col">
      <input
        className="input"
        placeholder="이름을 입력해주세요."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="btn primary full"
        onClick={() => canStart && setStep("calibrating1")}
        disabled={!canStart}
      >
        시작
      </button>
    </div>
  </div>
)}

          

          {step === "calibrating1" && (
            <div className="center">
              <div className="title">{name}님,</div>
              <div className="caption">Mindoverride를 활성화 중입니다.</div>
              <LoadingDots />
            </div>
          )}

          {step === "calibrating2" && (
            <div className="center">
              <div className="title">{name}님,</div>
              <div className="caption">연결을 확인 중입니다.</div>
              <LoadingDots />
            </div>
          )}

          {step === "calibrated" && (
            <div className="center">
              <div className="title">{name}님,</div>
              <div className="caption">적용이 완료되었습니다.</div>
              <div className="ok">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          )}

          {step === "driving" && (
            <div className="center">
              <div className="speed">
                80 <span className="unit">km/h</span>
              </div>
              <div className="big">자율주행 중</div>
              <div className="caption">mode: 3</div>
            </div>
          )}

          {step === "assist_left" && (
            <div className="center">
              <div className="caption">차량을 제어중입니다.</div>
              <Spinner size={36} />
              <div className="big">좌회전 수행중</div>
            </div>
          )}

          {step === "assist_lane" && (
            <div className="center">
              <div className="caption">티브레인 호출 중…</div>
              <Spinner size={36} />
              <div className="big">차선 변경 중</div>
            </div>
          )}

          {step === "report" && (
            <div className="center">
              <div className="caption">운전 결과 리포트</div>
              <div className="report-box">그래프</div>
              <button className="btn secondary">세부 리포트 보기</button>
            </div>
          )}
        </div>

        {dev && (
          <div className="devbar">
            {["start", ...ORDER].map((s) => (
              <button
                key={s}
                className={`pill ${step === s ? "active" : ""}`}
                onClick={() => setStep(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
