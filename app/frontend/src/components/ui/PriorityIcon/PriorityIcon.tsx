export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

type PriorityIconProps = {
    level: PriorityLevel;
    color?: string;
    className?: string;
};

const FILLED_BARS: Record<PriorityLevel, number> = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
};

const COLORS: Record<PriorityLevel, string> = {
    LOW: 'var(--success)',
    MEDIUM: 'var(--warning)',
    HIGH: 'var(--danger)',
};

const BAR_HEIGHTS = [5, 8, 11];

export const PriorityIcon = (props: PriorityIconProps) => {
    const filled = FILLED_BARS[props.level];
    const color = props.color ?? COLORS[props.level];

    return (
        <svg
            width={14}
            height={14}
            viewBox={'0 0 14 14'}
            fill={'none'}
            className={props.className}
        >
            {BAR_HEIGHTS.map((height, index) => (
                <rect
                    key={index}
                    x={index * 5}
                    y={12 - height}
                    width={3}
                    height={height}
                    rx={1}
                    fill={color}
                    fillOpacity={index < filled ? 1 : 0.25}
                />
            ))}
        </svg>
    );
};
