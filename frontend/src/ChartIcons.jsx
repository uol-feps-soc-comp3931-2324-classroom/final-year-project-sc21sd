import React, { useState, useEffect, useRef } from 'react';
import { FaRegChartBar, FaTools} from 'react-icons/fa';

const ChartIcons = ({ setChartType }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const iconRef = useRef(); // Ref for the icon to position the dropdown

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (iconRef.current && !iconRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div ref={iconRef} style={{ margin: '0 10px' }}>
                <FaRegChartBar size={20} onClick={() => setShowDropdown(!showDropdown)} />
                {showDropdown && (
                    <ul style={{
                        position: 'absolute',
                        top: '100%', // Position it below the icon
                        listStyleType: 'none',
                        padding: '10px',
                        margin: '0',
                        backgroundColor: '#fff',
                        boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                        zIndex: '1'
                    }}>
                        <li style={{ padding: '5px 10px' }} onClick={() => setChartType('candlestick')}>Candle</li>
                        <li style={{ padding: '5px 10px' }} onClick={() => setChartType('line')}>Line</li>
                        <li style={{ padding: '5px 10px' }} onClick={() => setChartType('area')}>Area</li>
                    </ul>
                )}
            </div>
            {/* <FaRegClock size={20} style={{ margin: '0 10px' }} />
      <FaPlus size={20} style={{ margin: '0 10px' }} /> */}
            <FaTools size={20} style={{ margin: '0 10px' }} />
        </div>

    );
};

export default ChartIcons;
