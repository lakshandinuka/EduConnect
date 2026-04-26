import React from 'react';
import Calendar from './Calendar';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            {/* Subtle top border accent */}
            <div style={styles.topAccent} />

            <div style={styles.inner}>

                {/* Left — Brand + tagline */}
                <div style={styles.brand}>
                    <div style={styles.logoMark}>
                        <span style={styles.logoIcon}>*</span>
                    </div>
                    <h2 style={styles.brandName}>SFS EDUConnect</h2>
                    <p style={styles.tagline}>
                        Streamlining student services<br />across every department.
                    </p>
                    <div style={styles.socials}>
                        {['✉', '📞', '🌐'].map((icon, i) => (
                            <button key={i} style={styles.socialBtn}>{icon}</button>
                        ))}
                    </div>
                </div>

                {/* Center — Quick links */}
                <div style={styles.linksCol}>
                    <p style={styles.colHeading}>Quick Links</p>
                    {['Dashboard', 'Tickets', 'Announcements'].map(link => (
                        <a key={link} href="#" style={styles.link}>{link}</a>
                    ))}
                </div>

                {/* Center-right — Departments */}
                <div style={styles.linksCol}>
                    <p style={styles.colHeading}>Departments</p>
                    {['Registrar', 'Finance', 'Library', 'IT Support', 'Student Affairs'].map(dept => (
                        <a key={dept} href="#" style={styles.link}>{dept}</a>
                    ))}
                </div>

                {/* Right — Calendar */}
                <div style={styles.calCol}>
                    <p style={styles.colHeading}>Academic Calendar</p>
                    <div style={styles.calWrapper}>
                        <Calendar />
                    </div>
                </div>

            </div>

            {/* Bottom bar */}
            <div style={styles.bottomBar}>
                <span style={styles.copyright}>
                    © {new Date().getFullYear()} UniPortal. All rights reserved.
                </span>
                <div style={styles.bottomLinks}>
                    {['Privacy Policy', 'Terms of Use', 'Accessibility'].map((item, i) => (
                        <React.Fragment key={item}>
                            {i > 0 && <span style={styles.dot}>·</span>}
                            <a href="#" style={styles.bottomLink}>{item}</a>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        background: 'linear-gradient(160deg, #0f1f3d 0%, #0a1628 60%, #071020 100%)',
        color: '#cbd5e1',
        fontFamily: "'Georgia', 'serif'",
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
    },
    topAccent: {
        height: 3,
        background: 'linear-gradient(90deg, #1e40af, #3b82f6, #60a5fa, #3b82f6, #1e40af)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 4s linear infinite',
    },
    inner: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '48px 32px 32px',
        display: 'flex',
        gap: 48,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },

    // Brand column
    brand: {
        flex: '1 1 180px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    logoMark: {
        width: 44,
        height: 44,
        background: 'rgba(59,130,246,0.15)',
        border: '1px solid rgba(59,130,246,0.35)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
    },
    logoIcon: {},
    brandName: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        color: '#f0f6ff',
        letterSpacing: '0.04em',
    },
    tagline: {
        margin: 0,
        fontSize: 13,
        color: '#94a3b8',
        lineHeight: 1.7,
    },
    socials: {
        display: 'flex',
        gap: 8,
        marginTop: 4,
    },
    socialBtn: {
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        color: '#93c5fd',
        width: 34,
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: 15,
        transition: 'background 0.2s',
    },

    // Link columns
    linksCol: {
        flex: '1 1 130px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    colHeading: {
        margin: '0 0 6px',
        fontSize: 11,
        fontWeight: 700,
        color: '#60a5fa',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily: "'Georgia', serif",
    },
    link: {
        color: '#94a3b8',
        textDecoration: 'none',
        fontSize: 13.5,
        lineHeight: 1.5,
        transition: 'color 0.2s',
        cursor: 'pointer',
    },

    // Calendar column
    calCol: {
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    calWrapper: {
        // Tint the calendar to match the dark footer environment
        filter: 'brightness(0.88) saturate(0.9)',
        borderRadius: 8,
        overflow: 'hidden',
    },

    // Bottom bar
    bottomBar: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '16px 32px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
    },
    copyright: {
        fontSize: 12,
        color: '#475569',
    },
    bottomLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    bottomLink: {
        fontSize: 12,
        color: '#475569',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    dot: {
        color: '#334155',
        fontSize: 12,
    },
};

// Inject shimmer keyframe once
if (typeof document !== 'undefined' && !document.getElementById('footer-shimmer-style')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'footer-shimmer-style';
    styleEl.textContent = `
        @keyframes shimmer {
            0% { background-position: 0% 0; }
            100% { background-position: 200% 0; }
        }
        footer a:hover { color: #93c5fd !important; }
    `;
    document.head.appendChild(styleEl);
}

export default Footer;