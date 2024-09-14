import { useNavigate } from "react-router-dom";
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { useEffect, useState } from "react";

import '../App.css';
import { gql, useMutation, useQuery } from "@apollo/client";
import { FilePondFile, FilePondInitialFile } from "filepond";
import { UPLOAD_FILE_MUTATION } from "../graphql/mutations/photo-upload-mutation";
import { FETCH_IMAGE_URL } from "../graphql/query/photo-initialize-query";



const MemoryLane = () => {
    const [urls, setUrls] = useState([])
    const navigate = useNavigate();
    const [files, setFiles] = useState<FilePondFile[]>([]);

    const { loading, data, error } = useQuery(FETCH_IMAGE_URL, {
        onCompleted(data) {
            setUrls(data || [])
            console.log(data)
        },
        onError(error) {
            console.error(error)
        },
    })


    

    const [uploadImage] = useMutation(UPLOAD_FILE_MUTATION,{
        onCompleted(data) {
            console.log("Data recieved", data)
            
        },
        onError: (err) => {
            console.log("Error from mutation", err)
        }
        
    });

    const uploadFile = (fileItems : FilePondFile[]) => {
        setFiles(fileItems);
        if(fileItems.length > 0){
            const file = fileItems[0].file
            console.log(file)
            const fileBlob = new File([file], file.name, {
                type: file.type,
                lastModified: file.lastModified
            });
            if(file){
                uploadImage({
                    variables:{
                        file : file
                    },

                })
                .then(() => {
                    console.log("Upload Success")
                }).catch((err) => {
                    console.error("Error", err)
                })
            }
            else{
                console.error("NO files selected");
            }

        }
    }
    return (
        <>
            <div className="flex justify-center items-center h-screen">
                
                <div className="">
                </div>
                <FilePond
  className=" bg-[#1C1A1C] w-[15em] h-[5em] rounded-full flex justify-center items-center gap-3 cursor-pointer transition-all duration-450 ease-in-out hover:bg-gradient-to-b from-[#A47CF3] to-[#683FEA] hover:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.4),inset_0px_-4px_0px_0px_rgba(0,0,0,0.2),0px_0px_0px_4px_rgba(255,255,255,0.2),0px_0px_180px_0px_#9917FF]"
  files={files.length > 0 ? [files[0].file] : []}
  allowMultiple={false}
  onupdatefiles={uploadFile} 
  name="file"
  acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png']}
  labelIdle='<span class="filepond--label-action">Add Images</span>'
  credits={false}
  labelFileProcessingComplete="Upload Success"
  stylePanelLayout="compact"
  styleButtonRemoveItemPosition="right"
  styleButtonProcessItemPosition="right"
  
/>






            </div>
        </>
    )
}
export default MemoryLane;