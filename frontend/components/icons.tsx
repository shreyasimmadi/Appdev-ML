import * as React from "react";

type P = React.SVGProps<SVGSVGElement> & { size?: number };

const make = (path: React.ReactNode) =>
  function Glyph({ size = 16, ...rest }: P) {
    return (
      <svg className="ic" width={size} height={size} viewBox="0 0 24 24" {...rest}>
        {path}
      </svg>
    );
  };

export const Plus = make(<path d="M12 5v14M5 12h14" />);
export const Search = make(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const ChatI = make(<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />);
export const Check = make(<path d="M20 6 9 17l-5-5" />);
export const Book = make(<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>);
export const Library = make(<path d="M3 3v18M21 3v18M7 3v18M17 3v18M11 6h2M11 12h2M11 18h2" />);
export const Send = make(<><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></>);
export const Mic = make(<><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M19 10a7 7 0 0 1-14 0M12 19v3" /></>);
export const Paperclip = make(<path d="m21 12-9 9a5 5 0 0 1-7-7l9-9a3 3 0 0 1 4 4l-9 9a1 1 0 0 1-1-1l8-8" />);
export const Panel = make(<><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="15" y1="3" x2="15" y2="21" /></>);
export const Copy = make(<><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>);
export const Refresh = make(<><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>);
export const ChevR = make(<path d="m9 18 6-6-6-6" />);
export const Atom = make(<><circle cx="12" cy="12" r="1" /><ellipse cx="12" cy="12" rx="10" ry="4.5" /><ellipse cx="12" cy="12" rx="4.5" ry="10" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="4.5" ry="10" transform="rotate(-60 12 12)" /></>);
export const Cog = make(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" /></>);
export const X = make(<path d="M18 6 6 18M6 6l12 12" />);
export const Bulb = make(<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1 1 2v1.3h6v-1.3c0-1 .4-1.5 1-2A7 7 0 0 0 12 2z" />);
export const Question = make(<><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></>);
export const Brain = make(<><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08A3 3 0 0 1 2 14.5a3 3 0 0 1 1.6-2.7A3 3 0 0 1 5 6.5a3 3 0 0 1 4.5-4.5z" /><path d="M14.5 2a2.5 2.5 0 0 0-2.5 2.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08A3 3 0 0 0 22 14.5a3 3 0 0 0-1.6-2.7A3 3 0 0 0 19 6.5a3 3 0 0 0-4.5-4.5z" /></>);
export const File = make(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>);
export const ThumbsUp = make(<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7" />);
export const ThumbsDown = make(<path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17" />);
export const Code = make(<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>);
export const Sigma = make(<path d="M18 7V4H6l6 8-6 8h12v-3" />);
