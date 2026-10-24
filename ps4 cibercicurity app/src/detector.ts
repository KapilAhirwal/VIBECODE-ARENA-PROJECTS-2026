export type Detection = {
  id: string;
  text: string;
  risk: number;
  level: string;
  category: string;
  indicators: string[];
  time: string;
};

const indicators = [
  [
    "Urgency / threat",
    /urgent|immediately|suspend|blocked|within \d+ hours|act now|final warning/i,
    18,
  ],
  [
    "Credential or OTP request",
    /\b(otp|password|pin|passcode|verification code|login credentials)\b/i,
    30,
  ],
  [
    "Money or payment request",
    /\b(pay|payment|transfer|upi|processing fee|deposit|bank details|refund fee)\b/i,
    23,
  ],
  [
    "Reward or lottery claim",
    /\b(won|winner|lottery|prize|reward|cashback)\b/i,
    22,
  ],
  [
    "KYC / account verification",
    /\b(kyc|verify your account|account verification|re-activate)\b/i,
    18,
  ],
  ["Suspicious link", /https?:\/\/|www\./i, 14],
  [
    "Impersonation language",
    /\b(bank|government|police|support team|customer care|income tax)\b/i,
    10,
  ],
  [
    "Manipulative secrecy",
    /\b(keep this secret|do not tell|confidential|act alone)\b/i,
    14,
  ],
] as const;

export function analyze(text: string): Detection {
  const found = indicators.filter(([, re]) => re.test(text));
  const score = Math.min(
    99,
    found.reduce((sum, x) => sum + x[2], 0),
  );
  const level =
    score >= 60
      ? "High"
      : score >= 30
        ? "Medium"
        : text.trim().length < 10
          ? "Uncertain"
          : "Low";
  let category = "No strong indicators";
  if (/otp|password|pin|passcode/i.test(text)) category = "Credential theft";
  else if (/won|winner|lottery|prize|reward/i.test(text))
    category = "Fake reward";
  else if (/upi|transfer|processing fee|payment/i.test(text))
    category = "Financial scam";
  else if (/kyc|verify|suspend/i.test(text)) category = "Phishing";
  else if (/https?:\/\/|www\./i.test(text))
    category = "Potentially malicious link";
  return {
    id: "S-" + Math.floor(5000 + Math.random() * 900),
    text,
    risk: score,
    level,
    category,
    indicators: found.map((x) => x[0]),
    time: new Date().toLocaleString(),
  };
}
