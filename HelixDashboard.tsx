import { useState } from "react";

const GOLD = "#F0B429";
const GOLD_DIM = "#B8860B";
const BG = "#0d0d0f";
const SURFACE = "#141416";
const SURFACE2 = "#1a1a1d";
const BORDER = "#2a2a2e";
const TEXT = "#e8e8ea";
const TEXT_DIM = "#7a7a8a";
const GREEN = "#3dd68c";
const RED = "#f04d4d";
const BLUE = "#5b8af5";
const PURPLE = "#9b7cff";

const NAV = [
  { id: "overview", icon: "⬡", label: "Overview" },
  { id: "automod", icon: "🛡", label: "Auto Mod" },
  { id: "moderation", icon: "⚔", label: "Moderation" },
  { id: "gambling", icon: "🎰", label: "Gambling" },
  { id: "embed", icon: "📨", label: "Embed Sender" },
  { id: "reactionroles", icon: "🎭", label: "Reaction Roles" },
  { id: "permissions", icon: "🔒", label: "Permissions" },
  { id: "antinuke", icon: "🚨", label: "Anti Nuke" },
  { id: "logs", icon: "📋", label: "Logs" },
  { id: "welcome", icon: "👋", label: "Welcome" },
  { id: "joinroles", icon: "🎁", label: "Join Roles" },
  { id: "settings", icon: "⚙", label: "Settings" },
  { id: "premium", icon: "💎", label: "Premium", gold: true },
];

const SOON = ["automod", "moderation", "gambling", "embed", "reactionroles", "antinuke"];

function Badge({ text, color }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 1,
      padding: "2px 7px", borderRadius: 4,
      background: color + "22", color, border: `1px solid ${color}44`,
      textTransform: "uppercase"
    }}>{text}</span>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 44, height: 24, borderRadius: 12, cursor: "pointer",
      background: value ? GOLD : BORDER, position: "relative",
      transition: "background 0.2s", flexShrink: 0
    }}>
      <div style={{
        position: "absolute", top: 3, left: value ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: value ? BG : TEXT_DIM, transition: "left 0.2s"
      }} />
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: SURFACE, border: `1px solid ${BORDER}`,
      borderRadius: 12, padding: 20, ...style
    }}>{children}</div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: GOLD, textTransform: "uppercase", marginBottom: 16 }}>
      {children}
    </div>
  );
}

function ComingSoon() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16 }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: TEXT }}>Coming Soon</div>
      <div style={{ color: TEXT_DIM, fontSize: 14 }}>This section is being built out.</div>
    </div>
  );
}

function Overview() {
  const stats = [
    { label: "Servers", value: "1", color: GOLD },
    { label: "Users", value: "—", color: BLUE },
    { label: "Ping", value: "42ms", color: GREEN },
    { label: "Uptime", value: "99.9%", color: PURPLE },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        {stats.map(s => (
          <Card key={s.label}>
            <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>
      <Card>
        <SectionTitle>Bot Status</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: GREEN, boxShadow: `0 0 8px ${GREEN}` }} />
          <span style={{ color: TEXT, fontWeight: 600 }}>Helix is online</span>
          <span style={{ color: TEXT_DIM, fontSize: 13, marginLeft: "auto" }}>Last restart: just now</span>
        </div>
      </Card>
      <Card>
        <SectionTitle>Quick Actions</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["Redeploy Bot", "Clear Invites", "Sync Commands"].map(a => (
            <button key={a} style={{
              background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT,
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600
            }}>{a}</button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Permissions() {
  const features = ["Reaction Role", "Deleted Logs", "Edit Logs", "Invite Cleanup"];
  const [selected, setSelected] = useState(features[0]);
  const [grants, setGrants] = useState({});
  const [denies, setDenies] = useState({});

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <SectionTitle>Select Feature</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {features.map(f => (
            <button key={f} onClick={() => setSelected(f)} style={{
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: selected === f ? GOLD + "22" : SURFACE2,
              border: `1px solid ${selected === f ? GOLD : BORDER}`,
              color: selected === f ? GOLD : TEXT
            }}>{f}</button>
          ))}
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card>
          <SectionTitle>✅ Granted Roles</SectionTitle>
          <div style={{ color: TEXT_DIM, fontSize: 13, marginBottom: 12 }}>Roles that can use {selected}</div>
          <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", color: TEXT_DIM, fontSize: 13 }}>
            No roles granted yet
          </div>
          <button style={{
            marginTop: 12, width: "100%", padding: "9px", borderRadius: 8,
            background: GREEN + "18", border: `1px solid ${GREEN}44`, color: GREEN,
            cursor: "pointer", fontWeight: 700, fontSize: 13
          }}>+ Add Role</button>
        </Card>
        <Card>
          <SectionTitle>❌ Denied Roles</SectionTitle>
          <div style={{ color: TEXT_DIM, fontSize: 13, marginBottom: 12 }}>Roles blocked from {selected}</div>
          <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", color: TEXT_DIM, fontSize: 13 }}>
            No roles denied yet
          </div>
          <button style={{
            marginTop: 12, width: "100%", padding: "9px", borderRadius: 8,
            background: RED + "18", border: `1px solid ${RED}44`, color: RED,
            cursor: "pointer", fontWeight: 700, fontSize: 13
          }}>+ Add Role</button>
        </Card>
      </div>
    </div>
  );
}

function Logs() {
  const logTypes = [
    { key: "deleted", label: "Deleted Messages", icon: "🗑️" },
    { key: "edited", label: "Edited Messages", icon: "✏️" },
    { key: "join", label: "Member Joins", icon: "📥" },
    { key: "leave", label: "Member Leaves", icon: "📤" },
  ];
  const [enabled, setEnabled] = useState({});
  const [channels, setChannels] = useState({});

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <SectionTitle style={{ marginBottom: 0 }}>Log Channels</SectionTitle>
      {logTypes.map(l => (
        <Card key={l.key} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 22 }}>{l.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: TEXT, fontSize: 14 }}>{l.label}</div>
            <div style={{ color: TEXT_DIM, fontSize: 12, marginTop: 2 }}>
              {enabled[l.key] ? "Logging to #channel" : "Not configured"}
            </div>
          </div>
          <input placeholder="#channel" style={{
            background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8,
            color: TEXT, padding: "7px 12px", fontSize: 13, width: 140, outline: "none"
          }} />
          <Toggle value={!!enabled[l.key]} onChange={v => setEnabled(p => ({ ...p, [l.key]: v }))} />
        </Card>
      ))}
    </div>
  );
}

function Welcome() {
  const [enabled, setEnabled] = useState(false);
  const [msg, setMsg] = useState("Welcome to the server, {user}! 🎉");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: TEXT }}>Welcome Messages</div>
          <div style={{ color: TEXT_DIM, fontSize: 13, marginTop: 2 }}>Send a message when a member joins</div>
        </div>
        <Toggle value={enabled} onChange={setEnabled} />
      </Card>
      {enabled && (
        <>
          <Card>
            <SectionTitle>Welcome Channel</SectionTitle>
            <input placeholder="#welcome" style={{
              background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8,
              color: TEXT, padding: "10px 14px", fontSize: 14, width: "100%", outline: "none", boxSizing: "border-box"
            }} />
          </Card>
          <Card>
            <SectionTitle>Message</SectionTitle>
            <div style={{ color: TEXT_DIM, fontSize: 12, marginBottom: 10 }}>
              Variables: <code style={{ color: GOLD }}>{"{user}"}</code> <code style={{ color: GOLD }}>{"{server}"}</code> <code style={{ color: GOLD }}>{"{count}"}</code>
            </div>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} style={{
              background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8,
              color: TEXT, padding: "10px 14px", fontSize: 14, width: "100%",
              outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box"
            }} />
          </Card>
          <Card>
            <SectionTitle>Preview</SectionTitle>
            <div style={{
              background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8,
              padding: 14, borderLeft: `3px solid ${GOLD}`, color: TEXT, fontSize: 14
            }}>
              {msg.replace("{user}", "@NewMember").replace("{server}", "Your Server").replace("{count}", "42")}
            </div>
          </Card>
          <button style={{
            padding: "11px", borderRadius: 8, background: GOLD, color: BG,
            border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer"
          }}>Save Welcome Settings</button>
        </>
      )}
    </div>
  );
}

function JoinRoles() {
  const [roles, setRoles] = useState([]);
  const [input, setInput] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <SectionTitle>Auto Join Roles</SectionTitle>
        <div style={{ color: TEXT_DIM, fontSize: 13, marginBottom: 16 }}>
          These roles are automatically given to new members when they join.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Role name or ID"
            style={{
              flex: 1, background: SURFACE2, border: `1px solid ${BORDER}`,
              borderRadius: 8, color: TEXT, padding: "10px 14px", fontSize: 14, outline: "none"
            }}
          />
          <button onClick={() => { if (input.trim()) { setRoles(p => [...p, input.trim()]); setInput(""); } }} style={{
            padding: "10px 18px", borderRadius: 8, background: GOLD, color: BG,
            border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer"
          }}>Add</button>
        </div>
      </Card>
      {roles.length > 0 && (
        <Card>
          <SectionTitle>Configured Roles</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {roles.map((r, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px"
              }}>
                <span style={{ color: TEXT, fontWeight: 600 }}>@{r}</span>
                <button onClick={() => setRoles(p => p.filter((_, j) => j !== i))} style={{
                  background: RED + "22", border: `1px solid ${RED}44`, color: RED,
                  borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 700
                }}>Remove</button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Settings() {
  const [prefix, setPrefix] = useState(",");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <SectionTitle>Bot Prefix</SectionTitle>
        <input value={prefix} onChange={e => setPrefix(e.target.value)} maxLength={3} style={{
          background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8,
          color: TEXT, padding: "10px 14px", fontSize: 20, fontWeight: 700,
          width: 80, outline: "none", textAlign: "center"
        }} />
      </Card>
      <Card>
        <SectionTitle>Danger Zone</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={{
            padding: "10px 16px", borderRadius: 8, background: RED + "18",
            border: `1px solid ${RED}44`, color: RED, cursor: "pointer", fontWeight: 700, fontSize: 13, textAlign: "left"
          }}>🗑️  Reset All Permissions</button>
          <button style={{
            padding: "10px 16px", borderRadius: 8, background: RED + "18",
            border: `1px solid ${RED}44`, color: RED, cursor: "pointer", fontWeight: 700, fontSize: 13, textAlign: "left"
          }}>⚠️  Clear All Reaction Roles</button>
        </div>
      </Card>
    </div>
  );
}

function Premium() {
  const perks = [
    { icon: "🤖", title: "Custom Bot Name", desc: "Set a unique nickname for Helix in your server" },
    { icon: "🖼️", title: "Custom Bot Avatar", desc: "Upload a custom avatar for Helix in your server" },
    { icon: "🎨", title: "Embed Color Theme", desc: "Choose the embed accent color across all commands" },
    { icon: "💬", title: "Custom Prefix", desc: "Set any prefix you want per server" },
    { icon: "💎", title: "Premium Badge", desc: "Displayed in ,helix and bot profile" },
    { icon: "⚡", title: "Priority Support", desc: "Fast-track support from the Helix team" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ borderColor: GOLD + "66", background: `linear-gradient(135deg, ${SURFACE} 0%, #1a1600 100%)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <span style={{ fontSize: 36 }}>💎</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: GOLD }}>Helix Premium</div>
            <div style={{ color: TEXT_DIM, fontSize: 13 }}>Unlock full customization for your server</div>
          </div>
          <Badge text="Coming Soon" color={GOLD} />
        </div>
        <div style={{ color: TEXT_DIM, fontSize: 13, borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
          Premium is server-specific — each server gets its own profile and settings.
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {perks.map(p => (
          <Card key={p.title} style={{ opacity: 0.7, position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: 8, right: 8
            }}><Badge text="Soon" color={GOLD} /></div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
            <div style={{ fontWeight: 700, color: TEXT, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
            <div style={{ color: TEXT_DIM, fontSize: 12 }}>{p.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const PAGES = {
  overview: <Overview />,
  permissions: <Permissions />,
  logs: <Logs />,
  welcome: <Welcome />,
  joinroles: <JoinRoles />,
  settings: <Settings />,
  premium: <Premium />,
};

export default function App() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentNav = NAV.find(n => n.id === active);
  const isSoon = SOON.includes(active);

  return (
    <div style={{ display: "flex", height: "100vh", background: BG, color: TEXT, fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{
        width: 220, background: SURFACE, borderRight: `1px solid ${BORDER}`,
        display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto"
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: GOLD + "22",
              border: `1.5px solid ${GOLD}55`, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18
            }}>⬡</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: TEXT, letterSpacing: 0.5 }}>Helix</div>
              <div style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 1 }}>DASHBOARD</div>
            </div>
          </div>
        </div>

        {/* Server pill */}
        <div style={{ padding: "12px 12px 4px" }}>
          <div style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, paddingLeft: 4 }}>Server</div>
          <div style={{
            background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8,
            padding: "8px 12px", fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer"
          }}>
            My Server ▾
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "8px 8px", flex: 1 }}>
          {NAV.map(n => {
            const isActive = active === n.id;
            return (
              <button key={n.id} onClick={() => setActive(n.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                background: isActive ? (n.gold ? GOLD + "22" : "#ffffff10") : "transparent",
                color: isActive ? (n.gold ? GOLD : TEXT) : (n.gold ? GOLD_DIM : TEXT_DIM),
                fontWeight: isActive ? 700 : 500, fontSize: 13, textAlign: "left",
                marginBottom: 2, transition: "all 0.15s"
              }}>
                <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{n.icon}</span>
                {n.label}
                {SOON.includes(n.id) && (
                  <span style={{ marginLeft: "auto", fontSize: 9, color: TEXT_DIM, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "1px 5px", letterSpacing: 0.5 }}>SOON</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${BORDER}`, fontSize: 11, color: TEXT_DIM }}>
          Helix v1.0 • Not connected
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{
          height: 56, borderBottom: `1px solid ${BORDER}`, padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: TEXT }}>{currentNav?.label}</span>
            {isSoon && <Badge text="Coming Soon" color={GOLD} />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />
            <span style={{ fontSize: 12, color: TEXT_DIM }}>Online</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {isSoon ? <ComingSoon /> : (PAGES[active] ?? <ComingSoon />)}
        </div>
      </div>
    </div>
  );
}
