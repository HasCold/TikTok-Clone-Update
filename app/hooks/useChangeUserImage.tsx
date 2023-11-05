import Image from "image-js";
import { Profile } from "../types";
import useRetrieveImage from "./useRetrieveImage";
import useDeletePreviousFilesFromDBAndFilesystem from "./useDeletePreviousFilesFromDBAndFilesystem";

const useChangeUserImage = async (file: File, currentProfile: Profile | null, cropper: any, currentImage: string, token: string | null) => {
    // The slice() method can take two arguments like slice(1, 3).
    // The method then selects elements from the start argument, and up to (but not including) the end argument.
    // The slice() method slices out a piece of an array into a new array.

    const x = cropper.left;
    const y = cropper.top;
    const width = cropper.width;
    const height = cropper.height;

    try {

          // Fetch the image file
        const response = await fetch(URL.createObjectURL(file));
        const imageBuffer = await response.arrayBuffer()

         // Load the image with image-js
        const image =  await Image.load(imageBuffer);

          // Crop and resize the image
        const croppedImage = image.crop({x, y, width, height});
        const resizedImage = croppedImage.resize({width: 200, height: 200});

         // Convert the processed image to a Blob
        const blob = await resizedImage.toBlob();

        // Create a new File from the Blob with the original file name and type        
        const finalFile = new File([blob], file.name, {type: blob.type})

        // FormData is a built-in JavaScript object that allows you to easily construct a set of key/value pairs that represent form fields and their values. It is commonly used to create and manage form data when making HTTP requests, particularly when dealing with file uploads or sending complex data to a server.

        const formData = new FormData();
        formData.append("myFile", finalFile);

        if(!formData)  throw new Error("File hasn't selected");

        const uploadResponse = await fetch(`/api/uploads/${currentProfile?._id}/imageUpload`, {
            method: "POST",
            headers:{
                "Authorization": `Bearer ${token}`                  
            },
            body: formData
        });

        const responseData = await uploadResponse.json();
        const {fileName} = responseData.imageData;

        if(responseData.success){
            await useDeletePreviousFilesFromDBAndFilesystem(fileName, currentProfile, token);
        }

        return fileName;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default useChangeUserImage