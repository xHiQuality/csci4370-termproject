    import React from "react";

    interface ButtonProps {
    type?: "button" | "submit" | "reset";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    customClass?: string; // Add a prop to accept additional custom classes
    }

    const Button: React.FC<ButtonProps> = ({
    type = "button",
    onClick,
    children,
    customClass = "",
    }) => {
    return (
        <button
        className={`button ${customClass}`} // Allow additional custom classes
        type={type}
        onClick={onClick}
        >
        {children}
        </button>
    );
    };

    export default Button;
