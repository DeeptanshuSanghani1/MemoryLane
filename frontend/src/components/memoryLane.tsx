import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FilePondFile } from "filepond";
import Background from "./background";
import FileUploader from "./fileUploader";
import SuccessMessage from "./sucessMessage";
import PictureBook from "./Book/pictureBook";
import Banner from "../pages/Components/Banner";
import { API_URL } from "../constants/constants";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";


const MemoryLane = () => {
    const [urls, setUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [files, setFiles] = useState<FilePondFile[]>([]);
    const[uploadSuccessMessage, setUploadSuccessMessage] = useState(false);
    const [selectedPage, setSelectedPage] = useState<number | null>(null);
    const AUTH_URL = API_URL + "/api/upload"
    let username = ""
    const localToken = localStorage.getItem("user");
    if(localToken){
      const parsedToken = JSON.parse(localToken);
      username = parsedToken.user?.username; 
    }
    // const { loading, data, error, refetch } = useQuery(FETCH_IMAGE_URL, {
    //     onCompleted(data) { 
    //         if(data?.allImages){
    //             setUrls(data.allImages)
    //         }
    //     },
    //     onError(error) {
    //         console.error(error)
    //     },
    // })

    useEffect(() => {
        fetchImageUrls();
      }, []);

      useEffect(() => {
        console.log("Updated URLs:", urls);
      }, [urls]);

    const fetchImageUrls = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get<string[]>(`${AUTH_URL}/get_photos`, {
            params : {username : username},
          }); // Replace with your REST API endpoint
          if (response.data) {
            setUrls(response.data); // Assuming response.data is an array of image URLs
          }
        } catch (err) {
          console.error("Error fetching image URLs:", err);
          setError("Failed to fetch image URLs");
        } finally {
          setLoading(false);
        }
      };


    
    const handleDelete = async () => {
        if (selectedPage !== null && urls[selectedPage]) {
          const fileUrl = urls[selectedPage];
          const fileKey = fileUrl.split("https://images-bucket-memory-lane.s3.amazonaws.com/")[1];
          console.log("Key: ", fileKey);
      
          try {
            await axios.delete(`${AUTH_URL}/delete_photo`,{
              params: {file_key : fileKey}
            });
            setSelectedPage(null);
            setUrls((prevUrls) => prevUrls.filter((url) => url !== fileUrl));
            await fetchImageUrls();
            console.log("Page deleted successfully");
          } catch (err) {
            console.error("Error deleting page:", err);
          }
        } else {
          console.error("Invalid page selection");
        }
      };
      

      const uploadFile = async (fileItems: FilePondFile[]) => {
        setFiles(fileItems);
      
        if (fileItems.length > 0) {
          const file = fileItems[0].file;
      
          if (file) {
            const formData = new FormData();
            formData.append("file", file); // Append the file to the FormData object
      
            try {
              const response = await axios.post(`${AUTH_URL}/upload_photo`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                params: {username : username}
              });
      
              console.log("Upload success:", response.data);
              setUploadSuccessMessage(true);
              setTimeout(() => setUploadSuccessMessage(false), 5000);
              await fetchImageUrls();
            } catch (err) {
              console.error("Error uploading file:", err);
            }
          } else {
            console.error("No files selected");
          }
        } else {
          console.error("No files provided");
        }
      };
      
    useEffect(() => {
        
      }, [urls]);

      
      return (
        <div className="relative h-screen w-screen">
          <Banner/>
          
          <Background />
    
          
          <div className="relative z-0 flex flex-col items-center justify-center h-full w-full">
        <div className="w-full max-w-3xl mx-auto p-6 bg-transparent">
          
          <PictureBook urls={urls} />
    
              
              <div className="mt-4 flex flex-col items-center">
                <FileUploader files={files} onUploadFile={uploadFile} />
                <SuccessMessage isVisible={uploadSuccessMessage} />
                <div className="mt-4">
                            <select
                                className="p-2 rounded border"
                                value={selectedPage ?? ""}
                                onChange={(e) =>
                                    setSelectedPage(e.target.value ? parseInt(e.target.value) : null)
                                }
                            >
                                <option value="">Select a page to delete</option>
                                {urls.map((_, index) => (
                                    <option key={index} value={index}>
                                        Page {index + 1}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="ml-2 p-2 bg-red-500 text-white rounded "
                                onClick={handleDelete}
                                disabled={selectedPage === null}
                            >
                                Delete Page
                            </button>
                        </div>
              </div>
            </div>
          </div>
        </div>
      );
}
export default MemoryLane;