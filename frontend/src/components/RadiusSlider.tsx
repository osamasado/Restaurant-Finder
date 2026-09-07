type RadiusSliderProps = {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

const MIN_METERS = 1000;
const MAX_METERS = 5000;
const STEP_METERS = 1000;

function formatKm(meters: number): string {
    return `${meters / 1000} km`;
}

export default function RadiusSlider(
    {value, onChange, disabled}: Readonly<RadiusSliderProps>
) {
    return (
        <div className="w-full max-w-xs">
            <label htmlFor="radius-slider" className="text-sm text-slate-300">
                Search radius: <span className="font-semibold text-white">{formatKm(value)}</span>
            </label>

            <input
                id="radius-slider"
                type="range"
                min={MIN_METERS}
                max={MAX_METERS}
                step={STEP_METERS}
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(Number(event.target.value))}
                aria-valuetext={formatKm(value)}
                className="mt-1 w-full accent-indigo-500 disabled:opacity-50"
            />

            <div className="flex justify-between text-xs text-slate-400">
                {Array.from(
                    {length: (MAX_METERS - MIN_METERS) / STEP_METERS + 1},
                    (_, index) => MIN_METERS + index * STEP_METERS
                ).map((meters) => (
                    <span key={meters}>{formatKm(meters)}</span>
                ))}
            </div>
        </div>
    );
}
