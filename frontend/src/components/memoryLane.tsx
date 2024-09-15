import { useNavigate } from "react-router-dom";
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { useEffect, useState } from "react";

import '../App.css';
import { gql, useMutation, useQuery } from "@apollo/client";
import { FilePondFile, FilePondInitialFile } from "filepond";
import { UPLOAD_FILE_MUTATION } from "../graphql/mutations/photo-upload-mutation";
import { FETCH_IMAGE_URL } from "../graphql/query/photo-initialize-query";
import Background from "./background";
import FileUploader from "./fileUploader";
import SuccessMessage from "./sucessMessage";
import PictureBook from "./Book/pictureBook";
import { url } from "inspector";



const MemoryLane = () => {
    const [urls, setUrls] = useState<string[]>([])
    const navigate = useNavigate();
    const [files, setFiles] = useState<FilePondFile[]>([]);
    const[uploadSuccessMessage, setUploadSuccessMessage] = useState(false);
    const { loading, data, error, refetch } = useQuery(FETCH_IMAGE_URL, {
        onCompleted(data) { 
            if(data?.allImages){
                setUrls(data.allImages)
            }
        },
        onError(error) {
            console.error(error)
        },
    })

    useEffect(() => {
        if (data && data.allImages) {
          setUrls(data.allImages);
          console.log("URLs updated via useEffect:", data.allImages);
        }
      }, [data]);

    

    const [uploadImage] = useMutation(UPLOAD_FILE_MUTATION,{
        refetchQueries: [{ query: FETCH_IMAGE_URL }],
        awaitRefetchQueries: true,
        onCompleted(data) {
            console.log("Image updated")
            refetch().then(refetchedData => {
            })
            setUploadSuccessMessage(true); // Show success message
            setTimeout(() => setUploadSuccessMessage(false), 5000); // Hide after 5 seconds
            
        },
        onError: (err) => {
            console.log("Error from mutation", err)
        }
        
    });

    const uploadFile = (fileItems : FilePondFile[]) => {
        setFiles(fileItems);
        if(fileItems.length > 0){
            const file = fileItems[0].file
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
    useEffect(() => {
        console.log("URLs updated:", urls);
      }, [urls]);

      
      return (
        <div className="relative h-screen w-screen">
          
          <Background />
    
          
          <div className="relative z-0 flex flex-col items-center justify-center h-full w-full">
        <div className="w-full max-w-3xl mx-auto p-6 bg-transparent">
          
          <PictureBook urls={urls} />
    
              
              <div className="mt-4 flex flex-col items-center">
                <FileUploader files={files} onUploadFile={uploadFile} />
                <SuccessMessage isVisible={uploadSuccessMessage} />
              </div>
            </div>
          </div>
        </div>
      );
}
export default MemoryLane;