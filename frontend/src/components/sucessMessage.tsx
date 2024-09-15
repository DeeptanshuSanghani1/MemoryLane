import React from 'react';

interface SuccessMessageProps {
    isVisible: boolean; // Prop to determine if the message is visible
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ isVisible }) => {
    return isVisible ? (
        <div className="text-white text-sm">
            Upload Success
        </div>
    ) : null;
};

export default SuccessMessage;
