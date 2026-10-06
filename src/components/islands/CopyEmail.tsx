import { useEffect, useRef, useState } from "react";

interface Props {
  email: string;
}

export default function CopyEmail({ email }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? "已复制" : "复制邮箱"}
    </button>
  );
}
