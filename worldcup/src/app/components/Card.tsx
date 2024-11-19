import { ReactNode } from 'react';
import './Card.css';
    interface CardProps {
        className?: string;
        children: ReactNode;
    }
    const Card: React.FC<CardProps> = ({ className = '', children }) => {
    const classes = `card ${className}`;
    return <div className={classes}>{children}</div>;
    };
    export default Card;