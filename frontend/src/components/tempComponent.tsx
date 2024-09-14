import React from 'react';
import PictureBook from './Book/pictureBook';

const TestTempComponent = () => {
    return (
        <>
            <div className="flex justify-center items-center h-screen bg-gray-200"> 
                <div className="w-full max-w-3xl mx-auto p-6 bg-gray-100 shadow-xl rounded-xl">
                    <PictureBook />
                </div>
            </div>
        </>
    );
};

export default TestTempComponent;
