import { FilePondFile } from 'filepond';
import React from 'react';
import { FilePond } from 'react-filepond';

interface FileUploaderProps {
    files: FilePondFile[];
    onUploadFile: (fileItems: FilePondFile[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ files, onUploadFile }) => {
    return (
        <>
            <FilePond
                className="custom-filepond"
                files={files.length > 0 ? [files[0].file] : []}
                allowMultiple={false}
                onupdatefiles={onUploadFile}
                name="file"
                acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png']}
                labelIdle=""
                credits={false}
                labelFileProcessingComplete=""
                stylePanelLayout="compact"
                styleButtonRemoveItemPosition="right"
                styleButtonProcessItemPosition="right"
            />

            <div
                className="relative bg-[#1C1A1C] w-[15em] h-[5em] rounded-full flex justify-center items-center gap-3 cursor-pointer
                transition-all duration-450 ease-in-out
                hover:bg-gradient-to-b from-[#A47CF3] to-[#683FEA]
                hover:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.4),
                inset_0px_-4px_0px_0px_rgba(0,0,0,0.2),
                0px_0px_0px_4px_rgba(255,255,255,0.2),
                0px_0px_180px_0px_#9917FF]
                hover:translate-y-[-2px]"
                onClick={() => {
                    const fileInput = document.querySelector('.filepond--wrapper input[type="file"]') as HTMLInputElement;
                    if (fileInput) {
                        fileInput.click();
                    } else {
                        console.error('File input not found');
                    }
                }}
            >
                <svg
                    height="24"
                    width="24"
                    fill="#FFFFFF"
                    viewBox="0 0 24 24"
                    data-name="Layer 1"
                    id="Layer_1"
                    className="sparkle fill-[#AAAAAA] transition-all duration-[800ms] ease-in-out hover:fill-white hover:scale-[1.2]"
                >
                    <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                </svg>
                <span className="text font-semibold text-[#AAAAAA] text-md transition-colors duration-[800ms] hover:text-white">
                    Add Images
                </span>
            </div>
        </>
    );
};

export default FileUploader;
