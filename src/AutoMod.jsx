import { useState, useEffect } from "react";

const GOLD = "#F0B429";
const BG = "#0d0d0f";
const SURFACE = "#141416";
const SURFACE2 = "#1a1a1d";
const BORDER = "#2a2a2e";
const TEXT = "#e8e8ea";
const TEXT_DIM = "#7a7a8a";
const GREEN = "#3dd68c";
const RED = "#f04d4d";

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

export default function AutoMod({ token, guild, apiFetch, user }) {
  const [config, setConfig] = useState(null);
  const [warnings, setWarnings] = useState({});
  const [members, setMembers] = useState({});
  const [saving, setSaving] = useState(false);
  const [badwordInput, setBadwordInput] = useState("");
  const [saved, setSaved] = useState(false);

  const isOwner = guild?.ownerId === user?.id;

  useEffect(() => {
    if (!guild) return;
    apiFetch(`/guild/${guild.id}/automod`, token).then(setConfig);
    apiFetch(`/guild/${guild.id}/warnings`, token).then(setWarnings);
  }, [guild]);

  function updateRule(rule, key, value) {
    setConfig(c => ({ ...c, rules: { ...c.rules, [rule]: { ...c.rules[rule], [key]: value } } }));
  }

  function addBadword() {
    if (!badwordInput.trim()) return;
    updateRule("badwords", "words", [...(config.rules.badwords.words || []), badwordInput.trim().toLowerCase()]);
    setBadwordInput("");
  }

  function removeBadword(word) {
    updateRule("badwords", "words", config.rules.badwords.words.filter(w => w !== word));
  }

  async function save() {
    setSaving(true);
    await apiFetch(`/guild/${guild.id}/automod`, token, { method: "POST", body: JSON.stringify(config) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function clearWarnings(userId) {
    await apiFetch(`/guild/${guild.id}/warnings/${userId}`, token, { method: "DELETE" });
    setWarnings(w => { const n = { ...w }; delete n[userId]; return n; });
  }

  if (!config) return <div style={{ color: TEXT_DIM, padding: 40, textAlign: "center" }}>Loading...</div>;

  const warnEntries = Object.entries(warnings);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Master Toggle */}
      <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: TEXT, fontSize: 15 }}>Auto Moderation</div>
          <div style={{ color: TEXT_DIM, fontSize: 13, marginTop: 2 }}>Automatically detect and punish rule violations</div>
        </div>
        <Toggle value={config.enabled} onChange={v => setConfig(c => ({ ...c, enabled: v }))} />
      </Card>

      {config.enabled && (<>

        {/* Escalation Thresholds */}
        <Card>
          <SectionTitle>Escalation Thresholds</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ color: TEXT_DIM, fontSize: 12, marginBottom: 6 }}>Timeout after X warns</div>
              <input type="number" min={1} max={9} value={config.warnThresholdTimeout}
                onChange={e => setConfig(c => ({ ...c, warnThresholdTimeout: parseInt(e.target.value) }))}
                style={{ width: "100%", background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "10px 14px", fontSize: 16, fontWeight: 700, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ color: TEXT_DIM, fontSize: 12, marginBottom: 6 }}>Ban after X warns</div>
              <input type="number" min={1} max={20} value={config.warnThresholdBan}
                onChange={e => setConfig(c => ({ ...c, warnThresholdBan: parseInt(e.target.value) }))}
                style={{ width: "100%", background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, padding: "10px 14px", fontSize: 16, fontWeight: 700, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
        </Card>

        {/* Rules */}
        <Card>
          <SectionTitle>Rules</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Spam */}
            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: config.rules.spam.enabled ? 12 : 0 }}>
                <span style={{ fontSize: 18 }}>⚡</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: TEXT, fontSize: 14 }}>Spam Detection</div>
                  <div style={{ color: TEXT_DIM, fontSize: 12 }}>Too many messages in a short time</div>
                </div>
                <Toggle value={config.rules.spam.enabled} onChange={v => updateRule("spam", "enabled", v)} />
              </div>
              {config.rules.spam.enabled && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <div style={{ color: TEXT_DIM, fontSize: 11, marginBottom: 4 }}>Max messages</div>
                    <input type="number" min={2} max={20} value={config.rules.spam.maxMessages}
                      onChange={e => updateRule("spam", "maxMessages", parseInt(e.target.value))}
                      style={{ width: "100%", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT, padding: "8px 10px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <div style={{ color: TEXT_DIM, fontSize: 11, marginBottom: 4 }}>Interval (seconds)</div>
                    <input type="number" min={1} max={60} value={config.rules.spam.interval / 1000}
                      onChange={e => updateRule("spam", "interval", parseInt(e.target.value) * 1000)}
                      style={{ width: "100%", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT, padding: "8px 10px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Bad Words */}
            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: config.rules.badwords.enabled ? 12 : 0 }}>
                <span style={{ fontSize: 18 }}>🤬</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: TEXT, fontSize: 14 }}>Bad Words</div>
                  <div style={{ color: TEXT_DIM, fontSize: 12 }}>Block specific words or phrases</div>
                </div>
                <Toggle value={config.rules.badwords.enabled} onChange={v => updateRule("badwords", "enabled", v)} />
              </div>
              {config.rules.badwords.enabled && (
                <div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <input value={badwordInput} onChange={e => setBadwordInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addBadword()}
                      placeholder="Add a word..." style={{ flex: 1, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT, padding: "8px 10px", fontSize: 13, outline: "none" }} />
                    <button onClick={addBadword} style={{ padding: "8px 14px", borderRadius: 7, background: GOLD, color: BG, border: "none", fontWeight: 700, cursor: "pointer" }}>Add</button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {(config.rules.badwords.words || []).map(w => (
                      <span key={w} style={{ background: RED + "22", border: `1px solid ${RED}44`, color: RED, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                        {w}
                        <span onClick={() => removeBadword(w)} style={{ cursor: "pointer", fontWeight: 900 }}>×</span>
                      </span>
                    ))}
                    {(config.rules.badwords.words || []).length === 0 && <span style={{ color: TEXT_DIM, fontSize: 12 }}>No words added yet</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Mass Mentions */}
            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: config.rules.massmentions.enabled ? 12 : 0 }}>
                <span style={{ fontSize: 18 }}>📢</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: TEXT, fontSize: 14 }}>Mass Mentions</div>
                  <div style={{ color: TEXT_DIM, fontSize: 12 }}>Block pinging too many users at once</div>
                </div>
                <Toggle value={config.rules.massmentions.enabled} onChange={v => updateRule("massmentions", "enabled", v)} />
              </div>
              {config.rules.massmentions.enabled && (
                <div>
                  <div style={{ color: TEXT_DIM, fontSize: 11, marginBottom: 4 }}>Max mentions allowed</div>
                  <input type="number" min={1} max={20} value={config.rules.massmentions.max}
                    onChange={e => updateRule("massmentions", "max", parseInt(e.target.value))}
                    style={{ width: 100, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT, padding: "8px 10px", fontSize: 14, outline: "none" }} />
                </div>
              )}
            </div>

            {/* Links */}
            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>🔗</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: TEXT, fontSize: 14 }}>Block Links</div>
                <div style={{ color: TEXT_DIM, fontSize: 12 }}>Delete any message containing a URL</div>
              </div>
              <Toggle value={config.rules.links.enabled} onChange={v => updateRule("links", "enabled", v)} />
            </div>

            {/* Invites */}
            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>🚫</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: TEXT, fontSize: 14 }}>Block Discord Invites</div>
                <div style={{ color: TEXT_DIM, fontSize: 12 }}>Delete any discord.gg invite links</div>
              </div>
              <Toggle value={config.rules.invites.enabled} onChange={v => updateRule("invites", "enabled", v)} />
            </div>

          </div>
        </Card>

        {/* Save Button */}
        <button onClick={save} style={{ padding: 12, borderRadius: 8, background: saved ? GREEN : GOLD, color: BG, border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "background 0.3s" }}>
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Auto Mod Settings"}
        </button>

        {/* Warnings List */}
        {warnEntries.length > 0 && (
          <Card>
            <SectionTitle>Active Warnings</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {warnEntries.map(([userId, warns]) => (
                <div key={userId} style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}><@{userId}></div>
                    <div style={{ color: TEXT_DIM, fontSize: 12, marginTop: 2 }}>{warns.length} warning{warns.length !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ fontSize: 12, color: warns.length >= config.warnThresholdBan ? RED : warns.length >= config.warnThresholdTimeout ? GOLD : TEXT_DIM, fontWeight: 700 }}>
                    {warns.length}/{config.warnThresholdBan}
                  </div>
                  {isOwner && (
                    <button onClick={() => clearWarnings(userId)} style={{ background: RED + "22", border: `1px solid ${RED}44`, color: RED, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                      Clear
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

      </>)}
    </div>
  );
}
