import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FilePondFile } from "filepond";
import Background from "./background";
import FileUploader from "./fileUploader";
import SuccessMessage from "./sucessMessage";
import PictureBook from "./Book/pictureBook";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../hooks/useAuth";
import Banner from "../Pages/Components/Banner"
import { FETCH_IMAGE_URLS } from "../graphql/query/photo-initialize-query";
import { UPLOAD_FILE_MUTATION } from "../graphql/mutations/photo-upload-mutation";
import { DELETE_FILE_MUTATION } from "../graphql/mutations/photo-delete-mutation";


const MemoryLane = () => {
  const [urls, setUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<FilePondFile[]>([]);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState(false);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  const navigate = useNavigate();

  const localToken = localStorage.getItem("user");
  let username = "";
  if (localToken) {
    const parsedToken = JSON.parse(localToken);
    username = parsedToken.username;
  }

  // GraphQL Query for fetching image URLs
  const { loading, error, data, refetch } = useQuery(FETCH_IMAGE_URLS, {
    variables: { username: username },
    onCompleted(data) {
      if(data.allImages){
        setUrls(data.allImages)
      }
    },
    onError(err) {
      console.error("Error fetching images:", err);
    },
  });

  useEffect(() => {
    if (data && data.allImages) {
      setUrls(data.allImages);
    }
  }, [data]);


  // GraphQL Mutation for uploading a file
  const [uploadPhoto] = useMutation(UPLOAD_FILE_MUTATION, {
    refetchQueries: [{query : FETCH_IMAGE_URLS}],
    onCompleted(data) {
      setUploadSuccessMessage(true);
      setTimeout(() => setUploadSuccessMessage(false), 5000);
      refetch();
    },
    onError(err) {
      console.error("Error uploading file:", err);
    },
  });

  // GraphQL Mutation for deleting a file
  const [deletePhoto] = useMutation(DELETE_FILE_MUTATION, {
    refetchQueries: [{query : FETCH_IMAGE_URLS}],
    onCompleted(data) {
      refetch();
    },
    onError(err) {
      console.error("Error deleting file:", err);
    },
  });

  const uploadFile = (fileItems: FilePondFile[]) => {
    setFiles(fileItems);

    if (fileItems.length > 0) {
      const file = fileItems[0].file;
      if (file) {
        uploadPhoto({
          variables: {
            file,
            username: username,
          },
        });
      } else {
        console.error("No file selected");
      }
    }
  };

  const handleDelete = () => {
    if (selectedPage !== null && urls[selectedPage]) {
      const fileUrl = urls[selectedPage];
      const fileKey = fileUrl.replace(
        `https://storage.googleapis.com/picturebook-images/${username}/`,
        ""
      );
      // const fileKey = fileUrl.split(
      //   "https://images-bucket-memory-lane.s3.amazonaws.com/"
      // )[1];
      deletePhoto({
        variables: {
          fileKey : fileKey,
          username: username,
        },
      });
      setSelectedPage(null);
    } else {
      console.error("Invalid page selection");
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <Banner />

      <Background />

      <div className="relative z-0 flex flex-col items-center justify-center h-full w-full">
        <div className="w-full max-w-3xl mx-auto p-6 bg-transparent">
          <PictureBook key={urls.length} urls={urls} />

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
                className="ml-2 p-2 bg-red-500 text-white rounded"
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
};

export default MemoryLane;
