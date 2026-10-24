import {
  AlertTriangle,
  Check,
  Link2,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { ContainerScroll } from "./container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="scroll-demo-showcase">
      <ContainerScroll
        titleComponent={
          <div className="scroll-demo-title">
            <span className="scroll-demo-eyebrow">SCROLL-LINKED PREVIEW</span>
            <h2>
              Spot the warning signs
              <br />
              <strong>before you tap.</strong>
            </h2>
            <p>Scroll down to inspect a sample message safely.</p>
          </div>
        }
      >
        <div className="scroll-demo-screen">
          <header className="scroll-screen-topbar">
            <div className="scroll-screen-brand">
              <span className="scroll-screen-brand-icon">
                <ShieldCheck size={18} />
              </span>
              <span>
                <b>CyberShield</b>
                <small>MESSAGE REVIEW</small>
              </span>
            </div>
            <span className="scroll-screen-private">
              <LockKeyhole size={12} /> LOCAL PREVIEW
            </span>
          </header>

          <div className="scroll-screen-content">
            <div className="scroll-screen-inbox">
              <div className="scroll-screen-section-title">
                <MessageSquareText size={15} />
                <span>Sample inbox</span>
                <small>1 message</small>
              </div>
              <div className="scroll-screen-message">
                <span className="scroll-sender-avatar">BK</span>
                <div>
                  <b>Bank Support</b>
                  <small>Just now</small>
                  <p>
                    Your account will be blocked today. Verify your KYC now at
                    the link below.
                  </p>
                  <span className="scroll-suspicious-link">
                    <Link2 size={11} /> secure-bank-check.example
                  </span>
                </div>
              </div>
            </div>

            <aside className="scroll-screen-analysis">
              <div className="scroll-analysis-title">
                <span className="scroll-risk-icon">
                  <AlertTriangle size={16} />
                </span>
                <span>
                  <small>MESSAGE CHECK</small>
                  <b>Needs review</b>
                </span>
                <strong>HIGH</strong>
              </div>
              <div className="scroll-risk-meter">
                <i />
              </div>
              <div className="scroll-indicator-row">
                <AlertTriangle size={14} />
                <span>
                  <b>Urgent account threat</b>
                  <small>Pressure to act immediately</small>
                </span>
              </div>
              <div className="scroll-indicator-row">
                <Link2 size={14} />
                <span>
                  <b>Unverified link</b>
                  <small>Does not look like an official bank address</small>
                </span>
              </div>
              <div className="scroll-safe-action">
                <Check size={14} />
                Verify through your bank&apos;s official app or number.
              </div>
              <small className="scroll-demo-disclaimer">
                Example only · pattern checks are guidance, not proof of fraud.
              </small>
            </aside>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
