import { useState, useEffect, useRef } from "react";
import AutoMod from "./AutoMod.jsx";

// ── Config ────────────────────────────────────────────────────────────────────
const CLIENT_ID = "1516339885261328475";
const REDIRECT_URI = "https://helix-dashboard-six.vercel.app/callback";
const API = import.meta.env.VITE_API_URL || "https://helix-backup-production.up.railway.app/api";
const OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify+guilds`;

// ── Tokens ────────────────────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function apiFetch(path, token, opts = {}) {
  return fetch(`${API}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "ngrok-skip-browser-warning": "true", ...(opts.headers ?? {}) },
  }).then(r => r.json());
}

// ── UI Primitives ─────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, ...style }}>{children}</div>;
}

function SectionTitle({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: GOLD, textTransform: "uppercase", marginBottom: 16 }}>{children}</div>;
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", background: value ? GOLD : BORDER, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: value ? BG : TEXT_DIM, transition: "left 0.2s" }} />
    </div>
  );
}

function Badge({ text, color }) {
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "2px 7px", borderRadius: 4, background: color + "22", color, border: `1px solid ${color}44`, textTransform: "uppercase" }}>{text}</span>;
}

function Spinner() {
  return <div style={{ width: 32, height: 32, border: `3px solid ${BORDER}`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />;
}

// ── Login Page ────────────────────────────────────────────────────────────────
function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 32 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ animation: "fadeIn 0.5s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: GOLD + "22", border: `2px solid ${GOLD}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>⬡</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: TEXT, letterSpacing: -1 }}>Helix Dashboard</div>
          <div style={{ color: TEXT_DIM, fontSize: 15, marginTop: 6 }}>Manage your server with ease</div>
        </div>
        <a href={OAUTH_URL} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 28px",
          background: "#5865F2", borderRadius: 12, textDecoration: "none",
          color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: 0.3,
          boxShadow: "0 4px 24px #5865F244", transition: "transform 0.15s"
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
          Login with Discord
        </a>
        <div style={{ color: TEXT_DIM, fontSize: 12 }}>You must have Manage Server permission in a server with Helix</div>
      </div>
    </div>
  );
}

// ── Server Picker ─────────────────────────────────────────────────────────────
function ServerPicker({ token, user, onSelect }) {
  const [guilds, setGuilds] = useState(null);

  useEffect(() => {
    apiFetch("/auth/guilds", token).then(setGuilds);
  }, [token]);

  const INVITE = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot+applications.commands&permissions=8`;

  return (
    <div style={{ minHeight: "100vh", background: BG, padding: 32 }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: GOLD + "22", border: `1.5px solid ${GOLD}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⬡</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: TEXT }}>Helix Dashboard</div>
            <div style={{ fontSize: 12, color: TEXT_DIM }}>Welcome, {user?.username}</div>
          </div>
          {user?.avatar && <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} style={{ width: 36, height: 36, borderRadius: "50%", marginLeft: "auto", border: `2px solid ${BORDER}` }} />}
        </div>

        <div style={{ fontSize: 13, color: TEXT_DIM, marginBottom: 16, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 700 }}>Select a Server</div>

        {!guilds ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {guilds.map((g, i) => (
              <div key={g.id} onClick={() => g.hasBot && onSelect(g)} style={{
                animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                display: "flex", alignItems: "center", gap: 14,
                background: SURFACE, border: `1px solid ${g.hasBot ? BORDER : BORDER}`,
                borderRadius: 12, padding: "14px 16px", cursor: g.hasBot ? "pointer" : "default",
                opacity: g.hasBot ? 1 : 0.5, transition: "border-color 0.15s"
              }}>
                {g.icon
                  ? <img src={g.icon} style={{ width: 42, height: 42, borderRadius: 12 }} />
                  : <div style={{ width: 42, height: 42, borderRadius: 12, background: SURFACE2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: TEXT_DIM }}>{g.name[0]}</div>
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: TEXT, fontSize: 14 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 2 }}>{g.hasBot ? "Helix is in this server" : "Helix not added"}</div>
                </div>
                {g.hasBot
                  ? <div style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>Manage →</div>
                  : <a href={`${INVITE}&guild_id=${g.id}`} onClick={e => e.stopPropagation()} style={{ fontSize: 12, color: BLUE, fontWeight: 700, textDecoration: "none", background: BLUE + "18", border: `1px solid ${BLUE}44`, padding: "5px 10px", borderRadius: 7 }}>Add Bot</a>
                }
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
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
  { id: "chest", icon: "🎁", label: "Chest Settings" },
  { id: "chestperms", icon: "🔑", label: "Chest Permissions" },
  { id: "premium", icon: "💎", label: "Premium", gold: true },
];
const SOON = ["moderation", "gambling", "embed", "reactionroles", "antinuke"];

// ── Dashboard Pages ───────────────────────────────────────────────────────────
function ComingSoon() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16 }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: TEXT }}>Coming Soon</div>
      <div style={{ color: TEXT_DIM, fontSize: 14 }}>This section is being built out.</div>
    </div>
  );
}

function Overview({ token, guild, stats }) {
  const statCards = [
    { label: "Servers", value: stats?.guildCount ?? "—", color: GOLD },
    { label: "Members", value: stats?.memberCount ?? "—", color: BLUE },
    { label: "Ping", value: stats?.ping ? `${stats.ping}ms` : "—", color: GREEN },
    { label: "Status", value: "Online", color: GREEN },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        {statCards.map(s => (
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
          <span style={{ color: TEXT, fontWeight: 600 }}>Helix is online in {guild?.name}</span>
        </div>
      </Card>
    </div>
  );
}

function Permissions({ token, guild }) {
  const features = [
    { label: "Reaction Role", value: "reactionrole" },
    { label: "Invite Cleanup", value: "invitecleanup" },
    { label: "Warnings", value: "warnings" },
  ];
  const [selected, setSelected] = useState(features[0].value);
  const [perms, setPerms] = useState(null);
  const [roles, setRoles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!guild) return;
    apiFetch(`/guild/${guild.id}/permissions`, token).then(setPerms);
    apiFetch(`/guild/${guild.id}/roles`, token).then(setRoles);
  }, [guild]);

  const fp = perms?.[selected] ?? { grant: [], deny: [] };

  function addRole(type, roleId) {
    if (!roleId) return;
    const updated = { ...perms, [selected]: { ...fp, [type]: [...(fp[type] ?? []), roleId].filter((v, i, a) => a.indexOf(v) === i) } };
    if (type === "grant") updated[selected].deny = updated[selected].deny.filter(id => id !== roleId);
    if (type === "deny") updated[selected].grant = updated[selected].grant.filter(id => id !== roleId);
    setPerms(updated);
  }

  function removeRole(type, roleId) {
    const updated = { ...perms, [selected]: { ...fp, [type]: fp[type].filter(id => id !== roleId) } };
    setPerms(updated);
  }

  async function save() {
    setSaving(true);
    await apiFetch(`/guild/${guild.id}/permissions`, token, { method: "POST", body: JSON.stringify(perms) });
    setSaving(false);
  }

  const roleById = id => roles.find(r => r.id === id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <SectionTitle>Select Feature</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {features.map(f => (
            <button key={f.value} onClick={() => setSelected(f.value)} style={{
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: selected === f.value ? GOLD + "22" : SURFACE2,
              border: `1px solid ${selected === f.value ? GOLD : BORDER}`,
              color: selected === f.value ? GOLD : TEXT
            }}>{f.label}</button>
          ))}
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {["grant", "deny"].map(type => (
          <Card key={type}>
            <SectionTitle>{type === "grant" ? "✅ Granted Roles" : "❌ Denied Roles"}</SectionTitle>
            <select onChange={e => addRole(type, e.target.value)} defaultValue="" style={{
              width: "100%", background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8,
              color: TEXT, padding: "9px 12px", fontSize: 13, marginBottom: 12, outline: "none"
            }}>
              <option value="">+ Add role...</option>
              {roles.map(r => <option key={r.id} value={r.id}>@{r.name}</option>)}
            </select>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(fp[type] ?? []).length === 0
                ? <div style={{ color: TEXT_DIM, fontSize: 13 }}>None set</div>
                : fp[type].map(id => (
                  <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 7, padding: "7px 10px" }}>
                    <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>@{roleById(id)?.name ?? id}</span>
                    <button onClick={() => removeRole(type, id)} style={{ background: "none", border: "none", color: RED, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
                  </div>
                ))
              }
            </div>
          </Card>
        ))}
      </div>
      <button onClick={save} style={{ padding: 11, borderRadius: 8, background: GOLD, color: BG, border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save Permissions"}
      </button>
    </div>
  );
}

function Logs({ token, guild }) {
  const logTypes = [
    { key: "deleted", label: "Deleted Messages", icon: "🗑️" },
    { key: "edited", label: "Edited Messages", icon: "✏️" },
    { key: "warnings", label: "Warning Logs", icon: "⚠️" },
    { key: "invitecleanup", label: "Invite Cleanup Logs", icon: "🧹" },
  ];
  const [config, setConfig] = useState(null);
  const [channels, setChannels] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!guild) return;
    apiFetch(`/guild/${guild.id}/channels`, token).then(setChannels);
    apiFetch(`/guild/${guild.id}/logs`, token).then(setConfig);
  }, [guild]);

  function update(key, field, value) {
    setConfig(c => ({ ...c, [key]: { ...c[key], [field]: value } }));
  }

  async function save() {
    setSaving(true);
    await apiFetch(`/guild/${guild.id}/logs`, token, { method: "POST", body: JSON.stringify(config) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!config) return <div style={{ color: TEXT_DIM, padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <SectionTitle>Log Channels</SectionTitle>
      {logTypes.map(l => (
        <Card key={l.key} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 22 }}>{l.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: TEXT, fontSize: 14 }}>{l.label}</div>
            <div style={{ color: TEXT_DIM, fontSize: 12, marginTop: 2 }}>
              {config[l.key]?.enabled && config[l.key]?.channelId
                ? `Logging to #${channels.find(c => c.id === config[l.key].channelId)?.name ?? "..."}`
                : "Not configured"}
            </div>
          </div>
          <select
            value={config[l.key]?.channelId ?? ""}
            onChange={e => update(l.key, "channelId", e.target.value)}
            style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "7px 12px", fontSize: 13, width: 160, outline: "none" }}
          >
            <option value="">Select channel</option>
            {channels.map(c => <option key={c.id} value={c.id}>#{c.name}</option>)}
          </select>
          <Toggle value={!!config[l.key]?.enabled} onChange={v => update(l.key, "enabled", v)} />
        </Card>
      ))}
      <button onClick={save} style={{ padding: 11, borderRadius: 8, background: saved ? GREEN : GOLD, color: BG, border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "background 0.3s" }}>
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Log Settings"}
      </button>
    </div>
  );
}

function Welcome({ token, guild }) {
  const [enabled, setEnabled] = useState(false);
  const [msg, setMsg] = useState("Welcome to the server, {user}! 🎉");
  const [channels, setChannels] = useState([]);
  const [channel, setChannel] = useState("");

  useEffect(() => {
    if (!guild) return;
    apiFetch(`/guild/${guild.id}/channels`, token).then(setChannels);
  }, [guild]);

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
            <select value={channel} onChange={e => setChannel(e.target.value)} style={{ width: "100%", background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "10px 14px", fontSize: 14, outline: "none" }}>
              <option value="">Select a channel</option>
              {channels.map(c => <option key={c.id} value={c.id}>#{c.name}</option>)}
            </select>
          </Card>
          <Card>
            <SectionTitle>Message</SectionTitle>
            <div style={{ color: TEXT_DIM, fontSize: 12, marginBottom: 10 }}>
              Variables: <code style={{ color: GOLD }}>{"{user}"}</code> <code style={{ color: GOLD }}>{"{server}"}</code> <code style={{ color: GOLD }}>{"{count}"}</code>
            </div>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "10px 14px", fontSize: 14, width: "100%", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
          </Card>
          <Card>
            <SectionTitle>Preview</SectionTitle>
            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, borderLeft: `3px solid ${GOLD}`, color: TEXT, fontSize: 14 }}>
              {msg.replace("{user}", "@NewMember").replace("{server}", guild?.name ?? "Your Server").replace("{count}", "42")}
            </div>
          </Card>
          <button style={{ padding: 11, borderRadius: 8, background: GOLD, color: BG, border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>Save Welcome Settings</button>
        </>
      )}
    </div>
  );
}

function JoinRoles({ token, guild }) {
  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (!guild) return;
    apiFetch(`/guild/${guild.id}/roles`, token).then(setAllRoles);
  }, [guild]);

  function add() {
    if (!selected || roles.find(r => r.id === selected)) return;
    const role = allRoles.find(r => r.id === selected);
    if (role) { setRoles(p => [...p, role]); setSelected(""); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <SectionTitle>Auto Join Roles</SectionTitle>
        <div style={{ color: TEXT_DIM, fontSize: 13, marginBottom: 16 }}>Roles automatically given to new members when they join.</div>
        <div style={{ display: "flex", gap: 10 }}>
          <select value={selected} onChange={e => setSelected(e.target.value)} style={{ flex: 1, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "10px 14px", fontSize: 14, outline: "none" }}>
            <option value="">Select a role...</option>
            {allRoles.map(r => <option key={r.id} value={r.id}>@{r.name}</option>)}
          </select>
          <button onClick={add} style={{ padding: "10px 18px", borderRadius: 8, background: GOLD, color: BG, border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>Add</button>
        </div>
      </Card>
      {roles.length > 0 && (
        <Card>
          <SectionTitle>Configured Roles</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {roles.map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px" }}>
                <span style={{ color: TEXT, fontWeight: 600 }}>@{r.name}</span>
                <button onClick={() => setRoles(p => p.filter(x => x.id !== r.id))} style={{ background: RED + "22", border: `1px solid ${RED}44`, color: RED, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Remove</button>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 12, padding: 11, borderRadius: 8, background: GOLD, color: BG, border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer", width: "100%" }}>Save Join Roles</button>
        </Card>
      )}
    </div>
  );
}

function Settings({ token, guild }) {
  const [prefix, setPrefix] = useState(",");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <SectionTitle>Bot Prefix</SectionTitle>
        <input value={prefix} onChange={e => setPrefix(e.target.value)} maxLength={3} style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "10px 14px", fontSize: 20, fontWeight: 700, width: 80, outline: "none", textAlign: "center" }} />
      </Card>
      <Card>
        <SectionTitle>Danger Zone</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={{ padding: "10px 16px", borderRadius: 8, background: RED + "18", border: `1px solid ${RED}44`, color: RED, cursor: "pointer", fontWeight: 700, fontSize: 13, textAlign: "left" }}>🗑️  Reset All Permissions</button>
          <button style={{ padding: "10px 16px", borderRadius: 8, background: RED + "18", border: `1px solid ${RED}44`, color: RED, cursor: "pointer", fontWeight: 700, fontSize: 13, textAlign: "left" }}>⚠️  Clear All Reaction Roles</button>
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
        <div style={{ color: TEXT_DIM, fontSize: 13, borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>Premium is server-specific — each server gets its own profile and settings.</div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {perks.map(p => (
          <Card key={p.title} style={{ opacity: 0.7, position: "relative" }}>
            <div style={{ position: "absolute", top: 8, right: 8 }}><Badge text="Soon" color={GOLD} /></div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
            <div style={{ fontWeight: 700, color: TEXT, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
            <div style={{ color: TEXT_DIM, fontSize: 12 }}>{p.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Chest Settings ────────────────────────────────────────────────────────────
const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Ascended", "Legendary", "Mythic", "Godly", "Divine"];
const RARITY_COLORS = { Divine: "#ff6b6b", Godly: "#ff9f43", Mythic: "#a29bfe", Legendary: "#fd79a8", Ascended: "#6c5ce7", Epic: "#e17055", Rare: "#74b9ff", Uncommon: "#55efc4", Common: "#b2bec3" };
const RARITY_EMOJIS = { Divine: "💀", Godly: "🔥", Mythic: "✨", Legendary: "🔴", Ascended: "🗝️", Epic: "🟠", Rare: "🟣", Uncommon: "🔵", Common: "🟢" };

function ChestSettings({ token, guild }) {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPrize, setNewPrize] = useState({ name: "", weight: 1, emoji: "", rewardType: "none", rewardAmount: 0 });

  useEffect(() => {
    if (!guild) return;
    apiFetch(`/guild/${guild.id}/chest-config`, token).then(d => setConfig(d || { prizes: [], embed: { color: "#5865F2", title: "🔮  HELIX VAULT", description: "Open chests to win amazing prizes!" } }));
  }, [guild]);

  function addPrize() {
    if (!newPrize.name.trim()) return;
    const reward = (newPrize.rewardType && newPrize.rewardType !== "none") ? { type: newPrize.rewardType, amount: Number(newPrize.rewardAmount || 0) } : {};
    setConfig(c => ({ ...c, prizes: [...c.prizes, { name: newPrize.name.trim(), weight: Number(newPrize.weight || 1), emoji: newPrize.emoji || "", reward }] }));
    setNewPrize({ name: "", weight: 1, emoji: "", rewardType: "none", rewardAmount: 0 });
  }

  function removePrize(i) {
    setConfig(c => ({ ...c, prizes: c.prizes.filter((_, idx) => idx !== i) }));
  }

  function updateEmbed(key, val) {
    setConfig(c => ({ ...c, embed: { ...c.embed, [key]: val } }));
  }

  async function save() {
    setSaving(true);
    await apiFetch(`/guild/${guild.id}/chest-config`, token, { method: "POST", body: JSON.stringify(config) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // Build preview description
  function buildPreview() {
    if (!config) return "";
    let desc = config.embed?.description || "";
    config.prizes.forEach((p, i) => {
      const emoji = p.emoji || "🎁";
      desc = desc.replace(`{prize_${i + 1}}`, `${emoji} **${p.name}**`);
    });
    return desc.replace(/\{prize_\d+\}/g, "");
  }

  if (!config) return <div style={{ color: TEXT_DIM, padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Prize List */}
      <Card>
        <SectionTitle>🎁  Prize Pool</SectionTitle>
        <div style={{ color: TEXT_DIM, fontSize: 12, marginBottom: 12 }}>
          These are the prizes members can win in this server. Use <code style={{ color: GOLD, background: SURFACE2, padding: "1px 5px", borderRadius: 4 }}>{"{prize_1}"}</code>, <code style={{ color: GOLD, background: SURFACE2, padding: "1px 5px", borderRadius: 4 }}>{"{prize_2}"}</code> etc. in your embed description to display them.
        </div>

        {/* Add prize form */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            value={newPrize.name}
            onChange={e => setNewPrize(p => ({ ...p, name: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && addPrize()}
            placeholder="Prize name..."
            style={{ flex: 1, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "9px 12px", fontSize: 13, outline: "none" }}
          />
          <input
            type="number"
            min="1"
            value={newPrize.weight}
            onChange={e => setNewPrize(p => ({ ...p, weight: Number(e.target.value) }))}
            style={{ width: 90, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "9px 12px", fontSize: 13 }}
          />
          <input
            value={newPrize.emoji}
            onChange={e => setNewPrize(p => ({ ...p, emoji: e.target.value }))}
            placeholder="Emoji (optional)"
            style={{ width: 120, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "9px 12px", fontSize: 13 }}
          />
          <select value={newPrize.rewardType} onChange={e => setNewPrize(p => ({ ...p, rewardType: e.target.value }))} style={{ width: 140, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "9px 12px", fontSize: 13 }}>
            <option value="none">No Reward</option>
            <option value="coins">Coins</option>
            <option value="exp">EXP</option>
            <option value="prize">Prize Item</option>
          </select>
          <input
            type="number"
            min="0"
            value={newPrize.rewardAmount}
            onChange={e => setNewPrize(p => ({ ...p, rewardAmount: Number(e.target.value) }))}
            placeholder="Amount"
            style={{ width: 110, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "9px 12px", fontSize: 13 }}
          />
          <button onClick={addPrize} style={{ padding: "9px 16px", borderRadius: 8, background: GOLD, color: BG, border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Add</button>
        </div>

        {/* Prize list */}
        {config.prizes.length === 0
          ? <div style={{ color: TEXT_DIM, fontSize: 13 }}>No prizes added yet.</div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {config.prizes.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px" }}>
                <span style={{ fontSize: 16 }}>{p.emoji || "🎁"}</span>
                <span style={{ flex: 1, fontWeight: 600, color: TEXT, fontSize: 13 }}>{p.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: TEXT, background: SURFACE2, border: `1px solid ${BORDER}`, padding: "2px 8px", borderRadius: 4 }}>Weight: {p.weight}</span>
                <span style={{ fontSize: 11, color: TEXT_DIM, marginLeft: 8 }}>{p.reward && p.reward.type ? (p.reward.type === "coins" ? `${p.reward.amount} coins` : p.reward.type === "exp" ? `${p.reward.amount} EXP` : "Prize Item") : "No reward"}</span>
                <span style={{ fontSize: 10, color: TEXT_DIM, fontFamily: "monospace" }}>{"{prize_" + (i + 1) + "}"}</span>
                <button onClick={() => removePrize(i)} style={{ background: RED + "22", border: `1px solid ${RED}44`, color: RED, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✕</button>
              </div>
            ))}
          </div>
        }
      </Card>

      {/* Embed Builder */}
      <Card>
        <SectionTitle>📝  Embed Builder</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: TEXT_DIM, marginBottom: 5 }}>TITLE</div>
              <input value={config.embed?.title || ""} onChange={e => updateEmbed("title", e.target.value)}
                style={{ width: "100%", background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "9px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: TEXT_DIM, marginBottom: 5 }}>COLOR</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="color" value={config.embed?.color || "#5865F2"} onChange={e => updateEmbed("color", e.target.value)}
                  style={{ width: 42, height: 38, padding: 2, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, cursor: "pointer" }} />
                <span style={{ color: TEXT_DIM, fontSize: 12, fontFamily: "monospace" }}>{config.embed?.color || "#5865F2"}</span>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: TEXT_DIM, marginBottom: 5 }}>DESCRIPTION — use {"{prize_1}"}, {"{prize_2}"} etc. to insert prizes</div>
            <textarea value={config.embed?.description || ""} onChange={e => updateEmbed("description", e.target.value)} rows={6}
              style={{ width: "100%", background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "10px 12px", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card>
        <SectionTitle>👁️  Embed Preview</SectionTitle>
        <div style={{ borderLeft: `4px solid ${config.embed?.color || "#5865F2"}`, background: "#23272a", borderRadius: "0 8px 8px 0", padding: "12px 16px" }}>
          <div style={{ fontWeight: 800, color: "#fff", fontSize: 15, marginBottom: 6 }}>{config.embed?.title || "🔮  HELIX VAULT"}</div>
          <div style={{ color: "#dcddde", fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {buildPreview() || <span style={{ color: "#72767d" }}>Your description will appear here...</span>}
          </div>
        </div>
        <div style={{ color: TEXT_DIM, fontSize: 11, marginTop: 8 }}>This is what will be posted when you run <code style={{ color: GOLD }}>/chestsetup</code></div>
      </Card>

      <button onClick={save} style={{ padding: 12, borderRadius: 8, background: saved ? GREEN : GOLD, color: BG, border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "background 0.3s" }}>
        {saving ? "Saving..." : saved ? "✓ Saved! Run /chestsetup to post" : "Save Chest Settings"}
      </button>
    </div>
  );
}

// ── Chest Permissions ─────────────────────────────────────────────────────────
function ChestPermissions({ token, guild }) {
  const [config, setConfig] = useState(null);
  const [roles, setRoles] = useState([]);
  const [channels, setChannels] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");

  useEffect(() => {
    if (!guild) return;
    apiFetch(`/guild/${guild.id}/chest-permissions`, token).then(d => setConfig(d || { allowedRoles: [], allowedChannels: [] }));
    apiFetch(`/guild/${guild.id}/roles`, token).then(setRoles);
    apiFetch(`/guild/${guild.id}/channels`, token).then(setChannels);
  }, [guild]);

  function addRole() {
    if (!selectedRole || config.allowedRoles.includes(selectedRole)) return;
    setConfig(c => ({ ...c, allowedRoles: [...c.allowedRoles, selectedRole] }));
    setSelectedRole("");
  }

  function removeRole(id) {
    setConfig(c => ({ ...c, allowedRoles: c.allowedRoles.filter(r => r !== id) }));
  }

  function addChannel() {
    if (!selectedChannel || config.allowedChannels.includes(selectedChannel)) return;
    setConfig(c => ({ ...c, allowedChannels: [...c.allowedChannels, selectedChannel] }));
    setSelectedChannel("");
  }

  function removeChannel(id) {
    setConfig(c => ({ ...c, allowedChannels: c.allowedChannels.filter(ch => ch !== id) }));
  }

  async function save() {
    setSaving(true);
    await apiFetch(`/guild/${guild.id}/chest-permissions`, token, { method: "POST", body: JSON.stringify(config) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!config) return <div style={{ color: TEXT_DIM, padding: 40, textAlign: "center" }}>Loading...</div>;

  const roleById = id => roles.find(r => r.id === id);
  const channelById = id => channels.find(c => c.id === id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <div style={{ color: TEXT_DIM, fontSize: 13, marginBottom: 4 }}>
          Control which roles can use chest commands and which channels they work in. Leave both empty to allow everyone everywhere.
        </div>
      </Card>

      {/* Allowed Roles */}
      <Card>
        <SectionTitle>🎭  Allowed Roles</SectionTitle>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
            style={{ flex: 1, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "9px 12px", fontSize: 13, outline: "none" }}>
            <option value="">Select a role...</option>
            {roles.map(r => <option key={r.id} value={r.id}>@{r.name}</option>)}
          </select>
          <button onClick={addRole} style={{ padding: "9px 16px", borderRadius: 8, background: GOLD, color: BG, border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Add</button>
        </div>
        {config.allowedRoles.length === 0
          ? <div style={{ color: TEXT_DIM, fontSize: 13 }}>No restrictions — all roles can use chest commands.</div>
          : config.allowedRoles.map(id => (
            <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
              <span style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}>@{roleById(id)?.name ?? id}</span>
              <button onClick={() => removeRole(id)} style={{ background: RED + "22", border: `1px solid ${RED}44`, color: RED, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✕</button>
            </div>
          ))
        }
      </Card>

      {/* Allowed Channels */}
      <Card>
        <SectionTitle>📢  Allowed Channels</SectionTitle>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <select value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)}
            style={{ flex: 1, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "9px 12px", fontSize: 13, outline: "none" }}>
            <option value="">Select a channel...</option>
            {channels.map(c => <option key={c.id} value={c.id}>#{c.name}</option>)}
          </select>
          <button onClick={addChannel} style={{ padding: "9px 16px", borderRadius: 8, background: GOLD, color: BG, border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Add</button>
        </div>
        {config.allowedChannels.length === 0
          ? <div style={{ color: TEXT_DIM, fontSize: 13 }}>No restrictions — chest commands work in all channels.</div>
          : config.allowedChannels.map(id => (
            <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
              <span style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}>#{channelById(id)?.name ?? id}</span>
              <button onClick={() => removeChannel(id)} style={{ background: RED + "22", border: `1px solid ${RED}44`, color: RED, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✕</button>
            </div>
          ))
        }
      </Card>

      <button onClick={save} style={{ padding: 12, borderRadius: 8, background: saved ? GREEN : GOLD, color: BG, border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "background 0.3s" }}>
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Chest Permissions"}
      </button>
    </div>
  );
}

// ── Dashboard Shell ───────────────────────────────────────────────────────────
function Dashboard({ token, user, guild, onBack }) {
  const [active, setActive] = useState("overview");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch(`/guild/${guild.id}/stats`, token).then(setStats);
  }, [guild]);

  const PAGES = {
    overview: <Overview token={token} guild={guild} stats={stats} />,
    automod: <AutoMod token={token} guild={guild} apiFetch={apiFetch} user={user} />,
    permissions: <Permissions token={token} guild={guild} />,
    logs: <Logs token={token} guild={guild} />,
    welcome: <Welcome token={token} guild={guild} />,
    joinroles: <JoinRoles token={token} guild={guild} />,
    settings: <Settings token={token} guild={guild} />,
    chest: <ChestSettings token={token} guild={guild} />,
    chestperms: <ChestPermissions token={token} guild={guild} />,
    premium: <Premium />,
  };

  const currentNav = NAV.find(n => n.id === active);

  return (
    <div style={{ display: "flex", height: "100vh", background: BG, color: TEXT, fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Sidebar */}
      <div style={{ width: 220, background: SURFACE, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: GOLD + "22", border: `1.5px solid ${GOLD}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⬡</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: TEXT }}>Helix</div>
              <div style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 1 }}>DASHBOARD</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 12px 4px" }}>
          <div style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, paddingLeft: 4 }}>Server</div>
          <div onClick={onBack} style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            {guild.icon && <img src={guild.icon} style={{ width: 20, height: 20, borderRadius: 5 }} />}
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{guild.name}</span>
            <span style={{ color: TEXT_DIM, fontSize: 11 }}>▾</span>
          </div>
        </div>

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
                {SOON.includes(n.id) && <span style={{ marginLeft: "auto", fontSize: 9, color: TEXT_DIM, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "1px 5px" }}>SOON</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          {user?.avatar && <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} style={{ width: 28, height: 28, borderRadius: "50%" }} />}
          <span style={{ fontSize: 12, color: TEXT_DIM, overflow: "hidden", textOverflow: "ellipsis" }}>{user?.username}</span>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: 56, borderBottom: `1px solid ${BORDER}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: TEXT }}>{currentNav?.label}</span>
            {SOON.includes(active) && <Badge text="Coming Soon" color={GOLD} />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />
            <span style={{ fontSize: 12, color: TEXT_DIM }}>Online</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {SOON.includes(active) ? <ComingSoon /> : (PAGES[active] ?? <ComingSoon />)}
        </div>
      </div>
    </div>
  );
}

// ── OAuth Callback Handler ────────────────────────────────────────────────────
function useOAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("helix_token"));
  const [loading, setLoading] = useState(false);
  const exchanged = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code || token || exchanged.current) return;
    exchanged.current = true;

    setLoading(true);
    fetch(`${API}/auth/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem("helix_token", data.access_token);
          setToken(data.access_token);
          window.history.replaceState({}, "", "/");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { token, loading, logout: () => { localStorage.removeItem("helix_token"); setToken(null); } };
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const { token, loading, logout } = useOAuth();
  const [user, setUser] = useState(null);
  const [guild, setGuild] = useState(null);

  useEffect(() => {
    if (!token) return;
    apiFetch("/auth/user", token).then(u => {
      if (u.id) setUser(u);
      else logout();
    });
  }, [token]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spinner />
    </div>
  );

  if (!token || !user) return <LoginPage />;
  if (!guild) return <ServerPicker token={token} user={user} onSelect={setGuild} />;
  return <Dashboard token={token} user={user} guild={guild} onBack={() => setGuild(null)} />;
}
