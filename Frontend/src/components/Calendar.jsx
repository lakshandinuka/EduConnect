import React, { useState } from 'react';

const calStyles = {
    wrap: {
        background: '#f0fdf4',
        border: '1px solid #86efac',
        borderRadius: 8,
        padding: '16px',
        minWidth: 228,
        boxShadow: '0 1px 4px rgba(22,163,74,0.08)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    navBtn: {
        background: '#dcfce7',
        border: '1px solid #86efac',
        borderRadius: 4,
        color: '#166534',
        fontWeight: 700,
        fontSize: 18,
        cursor: 'pointer',
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        padding: 0,
    },
    monthLabel: {
        fontWeight: 700,
        fontSize: 14,
        color: '#166534',
        letterSpacing: '0.02em',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2,
    },
    dayName: {
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 700,
        color: '#16a34a',
        padding: '4px 0',
        textTransform: 'uppercase',
    },
    cell: {
        textAlign: 'center',
        fontSize: 13,
        color: '#1f2937',
        padding: '5px 2px',
        borderRadius: 4,
        cursor: 'default',
        background: 'transparent',
    },
    todayCell: {
        background: '#16a34a',
        color: '#ffffff',
        fontWeight: 700,
        borderRadius: 4,
    },
    emptyCell: {
        padding: '5px 2px',
    },
};

const Calendar = () => {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isToday = (d) =>
        d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    return (
        <div style={calStyles.wrap}>
            <div style={calStyles.header}>
                <button onClick={prevMonth} style={calStyles.navBtn}>‹</button>
                <span style={calStyles.monthLabel}>{monthNames[month]} {year}</span>
                <button onClick={nextMonth} style={calStyles.navBtn}>›</button>
            </div>
            <div style={calStyles.grid}>
                {dayNames.map(d => (
                    <div key={d} style={calStyles.dayName}>{d}</div>
                ))}
                {cells.map((d, i) => (
                    <div
                        key={i}
                        style={d ? (isToday(d) ? { ...calStyles.cell, ...calStyles.todayCell } : calStyles.cell) : calStyles.emptyCell}
                    >
                        {d || ''}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;