"""CyberShield AI API starter. No arbitrary URL fetching or external AI by default."""
from datetime import datetime, timezone
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal
import re

app = FastAPI(title="CyberShield AI API", version="1.0.0")

RULES = [
    ("Urgency / threat", re.compile(r"urgent|immediately|suspend|blocked|act now", re.I), 18),
    ("Credential or OTP request", re.compile(r"\b(otp|password|pin|passcode|verification code)\b", re.I), 30),
    ("Money or payment request", re.compile(r"\b(pay|payment|transfer|upi|processing fee|deposit)\b", re.I), 23),
    ("Reward or lottery claim", re.compile(r"\b(won|winner|lottery|prize|reward|cashback)\b", re.I), 22),
    ("KYC / account verification", re.compile(r"\b(kyc|verify your account|account verification)\b", re.I), 18),
    ("Suspicious link", re.compile(r"https?://|www\.", re.I), 14),
]

class AnalyzeRequest(BaseModel):
    text: str = Field(min_length=1, max_length=10000)

@app.get("/api/health")
def health():
    return {"status": "ok", "mode": "local-rules", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.post("/api/analyze")
def analyze(body: AnalyzeRequest):
    matches = [name for name, pattern, _ in RULES if pattern.search(body.text)]
    score = min(99, sum(points for _, pattern, points in RULES if pattern.search(body.text)))
    level: Literal["Low", "Medium", "High", "Uncertain"] = "High" if score >= 60 else "Medium" if score >= 30 else "Low"
    return {"risk_score": score, "risk_level": level, "indicators": matches,
            "note": "A rule-based indicator, not a probability of fraud or guarantee of safety."}
