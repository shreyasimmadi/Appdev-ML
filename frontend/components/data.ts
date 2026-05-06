import type { ChatThread, ChecklistSection, CourseNote } from "../lib/types";

export const sampleThread: ChatThread = {
  id: "t1",
  title: "Forward kinematics — 2-link planar arm",
  updatedAt: "2m ago",
  sources: [
    {
      id: 1,
      title: "Lecture 06 — Forward Kinematics",
      path: "ENPM662/notes/lec06_kinematics.md",
      score: 0.91,
      pageRange: "p. 14–17",
      chunk: 3,
      tokens: 412,
      snippet:
        "For a planar 2-link manipulator with link lengths L₁ and L₂ and joint angles θ₁, θ₂, the end-effector position in the base frame is given by <mark>x = L₁cos(θ₁) + L₂cos(θ₁+θ₂)</mark> and y = L₁sin(θ₁) + L₂sin(θ₁+θ₂).",
    },
    {
      id: 2,
      title: "Lecture 06 — Forward Kinematics",
      path: "ENPM662/notes/lec06_kinematics.md",
      score: 0.87,
      pageRange: "p. 18",
      chunk: 4,
      tokens: 318,
      snippet:
        "We compose homogeneous transformation matrices T₀¹ and T₁² along the kinematic chain so that T₀² = T₀¹·T₁². The DH parameters (a, α, d, θ) generalize this construction to arbitrary serial chains.",
    },
    {
      id: 3,
      title: "Tutorial 03 — Trigonometric identities",
      path: "ENPM662/tutorials/trig_review.md",
      score: 0.74,
      chunk: 1,
      tokens: 256,
      snippet:
        "Recall the angle-addition identity: cos(α+β) = cos α cos β − sin α sin β. This is what allows us to expand the L₂cos(θ₁+θ₂) term when deriving the end-effector position.",
    },
    {
      id: 4,
      title: "Problem Set 4 — Solutions",
      path: "ENPM662/psets/ps4_solutions.md",
      score: 0.62,
      chunk: 7,
      tokens: 198,
      snippet:
        "When θ₁ = π/2 and θ₂ = 0, the arm is fully extended along the y-axis and x = 0, y = L₁ + L₂. Use this configuration to sanity-check derivations.",
    },
  ],
  messages: [
    {
      id: "m1",
      role: "user",
      name: "You",
      time: "2:14 PM",
      blocks: [
        {
          type: "text",
          html: "Can you just give me the forward kinematics equations for a 2-link planar arm? I have a problem set due tomorrow and I keep getting tangled up in the trig.",
        },
      ],
    },
    {
      id: "m2",
      role: "assistant",
      name: "eckard",
      badge: "Socratic",
      time: "2:14 PM",
      citations: [1, 2, 3],
      blocks: [
        {
          type: "text",
          html: "Let's <em>not</em> jump straight to the equations — once we walk through the geometry together, you'll be able to derive them on any problem set. Promise it'll click.",
        },
        {
          type: "callout",
          kind: "recall",
          title: "Recall",
          html: "From your <strong>Lecture 06 notes</strong>, the link lengths are L₁, L₂ and the joint angles are θ₁ (shoulder) and θ₂ (elbow, measured relative to link 1).",
        },
        {
          type: "text",
          html: "Start with just <strong>link 1</strong>. If only the shoulder rotates by θ₁, where does the elbow joint land in the base frame? Try writing its (x, y) before reading on.",
        },
        {
          type: "callout",
          kind: "question",
          title: "Your turn",
          html: "What are the coordinates of the elbow joint in terms of L₁ and θ₁? (Hint: this is the same as a single point on a circle of radius L₁.)",
        },
      ],
    },
    {
      id: "m3",
      role: "user",
      name: "You",
      time: "2:16 PM",
      blocks: [
        {
          type: "text",
          html: "Elbow is at (L₁cos θ₁, L₁sin θ₁), right?",
        },
      ],
    },
    {
      id: "m4",
      role: "assistant",
      name: "eckard",
      badge: "Socratic",
      time: "2:16 PM",
      citations: [1, 3],
      blocks: [
        {
          type: "text",
          html: "Exactly — that's the elbow. Now <em>stand at the elbow</em> with a new local axis pointing along link 1. The end-effector is link-2 rotated by θ₂ <strong>in that local frame</strong>. To express it in the base frame, you need to rotate by the cumulative angle.",
        },
        {
          type: "formula",
          tag: "(eq. base-frame elbow → end-effector)",
          tex: "endeffector",
        },
        {
          type: "text",
          html: "If you expand using the angle-addition identity from the trig review, you can collapse those into closed-form expressions for x and y. What do you get?",
        },
        {
          type: "callout",
          kind: "hint",
          title: "Hint",
          html: "<code>cos(θ₁+θ₂) = cos θ₁ cos θ₂ − sin θ₁ sin θ₂</code>. The same trick gives you sin(θ₁+θ₂). Substitute and simplify.",
        },
      ],
    },
  ],
};

export const checklist: ChecklistSection[] = [
  {
    id: "fk",
    title: "Forward kinematics",
    items: [
      { id: "fk1", title: "Define link lengths and joint angles", desc: "Sketch a 2-link arm and label L₁, L₂, θ₁, θ₂.", difficulty: "easy", done: true },
      { id: "fk2", title: "Locate the elbow joint in the base frame", desc: "Write (x, y) of the elbow in terms of L₁ and θ₁.", difficulty: "easy", done: true },
      { id: "fk3", title: "Add link 2 to find the end-effector", desc: "Use cumulative angle θ₁+θ₂ and apply the angle-addition identity.", difficulty: "medium", done: false },
      { id: "fk4", title: "Sanity-check at known configurations", desc: "θ₁=π/2, θ₂=0 should give (0, L₁+L₂).", difficulty: "medium", done: false },
    ],
  },
  {
    id: "trig",
    title: "Trig review",
    items: [
      { id: "tr1", title: "Angle-addition identities", desc: "Prove cos(α+β) and sin(α+β) from the unit circle.", difficulty: "easy", done: true },
      { id: "tr2", title: "Pythagorean identity in 2D", desc: "Show sin²θ + cos²θ = 1 and use it to verify lengths.", difficulty: "easy", done: false },
    ],
  },
  {
    id: "dh",
    title: "Denavit–Hartenberg parameters",
    items: [
      { id: "dh1", title: "Build T₀¹ for link 1", desc: "Translate a, rotate α, translate d, rotate θ.", difficulty: "medium", done: false },
      { id: "dh2", title: "Compose T₀² = T₀¹·T₁²", desc: "Reason about why the order matters.", difficulty: "hard", done: false },
      { id: "dh3", title: "Generalize to a 6-DOF arm", desc: "Convince yourself why the same scheme scales.", difficulty: "hard", done: false },
    ],
  },
];

export const recentChats = [
  { id: "t1", title: "Forward kinematics — 2-link arm", time: "2m" },
  { id: "t2", title: "Big-O of mergesort", time: "1h" },
  { id: "t3", title: "Why is BFS shortest-path?", time: "Yesterday" },
  { id: "t4", title: "DH parameters — confused", time: "Yesterday" },
  { id: "t5", title: "Quaternion vs Euler angles", time: "Mon" },
  { id: "t6", title: "Dynamic programming intuition", time: "Sun" },
];

export const topics = [
  {
    title: "Forward kinematics",
    prompt: "Walk me through deriving end-effector position for a 2-link arm.",
    color: "var(--terra)",
    tag: "Robotics",
  },
  {
    title: "Time complexity",
    prompt: "Help me reason about the runtime of mergesort vs quicksort.",
    color: "var(--sage)",
    tag: "Algorithms",
  },
  {
    title: "Graph traversal",
    prompt: "Why does BFS give shortest paths in unweighted graphs?",
    color: "var(--plum)",
    tag: "Algorithms",
  },
  {
    title: "Dynamic systems",
    prompt: "I keep getting confused by state-space representations.",
    color: "oklch(0.62 0.10 240)",
    tag: "Controls",
  },
];

export const starters = [
  "Quiz me on linked lists",
  "Explain DH parameters intuitively",
  "Why is recursion hard for me?",
  "Help me with this week's pset",
];

export const courseNotes: CourseNote[] = [
  { id: "n1", title: "Lecture 01 — Introduction to Robotics", path: "ENPM662/notes/lec01_intro.md", course: "ENPM662", pages: 22, chunks: 18, updated: "2d ago" },
  { id: "n2", title: "Lecture 02 — Rigid Body Motion", path: "ENPM662/notes/lec02_rigid.md", course: "ENPM662", pages: 30, chunks: 27, updated: "2d ago" },
  { id: "n3", title: "Lecture 06 — Forward Kinematics", path: "ENPM662/notes/lec06_kinematics.md", course: "ENPM662", pages: 28, chunks: 24, updated: "1d ago" },
  { id: "n4", title: "Tutorial 03 — Trig Review", path: "ENPM662/tutorials/trig_review.md", course: "ENPM662", pages: 8, chunks: 9, updated: "3d ago" },
  { id: "n5", title: "Problem Set 4 — Solutions", path: "ENPM662/psets/ps4_solutions.md", course: "ENPM662", pages: 12, chunks: 11, updated: "1d ago" },
  { id: "n6", title: "Lecture 01 — Algorithm Analysis", path: "CMSC351/notes/lec01_analysis.md", course: "CMSC351", pages: 18, chunks: 15, updated: "5d ago" },
  { id: "n7", title: "Lecture 04 — Graph Algorithms", path: "CMSC351/notes/lec04_graphs.md", course: "CMSC351", pages: 24, chunks: 20, updated: "4d ago" },
];
