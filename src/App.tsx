import React, { useState, useMemo } from 'react';
import { format, addMinutes, startOfDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Plus, X, Clock } from 'lucide-react';

const COMMON_ZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/Los_Angeles', label: 'PST / PDT' },
  { value: 'America/New_York', label: 'EST / EDT' },
  { value: 'Europe/London', label: 'GMT / BST' },
  { value: 'Europe/Paris', label: 'CET / CEST' },
  { value: 'Asia/Kolkata', label: 'IST' },
  { value: 'Asia/Tokyo', label: 'JST' },
  { value: 'Australia/Sydney', label: 'AEST / AEDT' },
];

function App() {
  const [selectedZones, setSelectedZones] = useState(['UTC', 'America/Los_Angeles', 'Asia/Kolkata']);
  const [sliderValue, setSliderValue] = useState(12 * 60); // minutes from start of day (0 to 24*60)
  const [baseDate, setBaseDate] = useState(() => startOfDay(new Date()));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value, 10));
  };

  const removeZone = (zoneToRemove: string) => {
    setSelectedZones(selectedZones.filter(z => z !== zoneToRemove));
  };

  const addZone = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && !selectedZones.includes(val)) {
      setSelectedZones([...selectedZones, val]);
    }
    e.target.value = '';
  };

  // Convert minutes to hours and minutes string
  const getFormattedTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Target date-time based on slider
  const targetDate = useMemo(() => addMinutes(baseDate, sliderValue), [baseDate, sliderValue]);

  return (
    <div className="min-h-screen bg-background text-ink p-8 flex justify-center font-sans">
      <div className="w-full max-w-2xl bg-surface border border-line rounded-xl shadow-sm p-6 space-y-8">
        
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-bold">Timezone Slider</h1>
          </div>
          
          <select 
            className="bg-surface-2 border border-line rounded-md px-3 py-1.5 text-sm outline-none focus:border-accent"
            onChange={addZone}
            defaultValue=""
          >
            <option value="" disabled>+ Add Timezone</option>
            {COMMON_ZONES.map(z => (
              <option key={z.value} value={z.value}>{z.label} ({z.value})</option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center text-sm font-medium">
            <span>00:00</span>
            <span className="text-accent text-lg font-bold">{getFormattedTime(sliderValue)}</span>
            <span>23:59</span>
          </div>
          
          <input 
            type="range" 
            min="0" 
            max={24 * 60 - 1} 
            value={sliderValue} 
            onChange={handleSliderChange}
            className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>

        <div className="space-y-4 pt-4">
          {selectedZones.map(zone => {
            const timeStr = formatInTimeZone(targetDate, zone, 'HH:mm');
            const dateStr = formatInTimeZone(targetDate, zone, 'MMM dd, yyyy');
            const offsetStr = formatInTimeZone(targetDate, zone, 'O');
            
            return (
              <div key={zone} className="flex items-center justify-between p-4 bg-surface-2 rounded-lg border border-line group relative">
                <div>
                  <h3 className="font-semibold">{COMMON_ZONES.find(z => z.value === zone)?.label || zone}</h3>
                  <p className="text-sm text-muted">{zone} <span className="ml-2 text-xs bg-line px-2 py-0.5 rounded">{offsetStr}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold tracking-tight text-accent">{timeStr}</p>
                  <p className="text-sm text-muted">{dateStr}</p>
                </div>
                
                {selectedZones.length > 1 && (
                  <button 
                    onClick={() => removeZone(zone)}
                    className="absolute -right-2 -top-2 bg-surface border border-line rounded-full p-1 text-muted hover:text-warn hover:border-warn opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
