import { storage } from "@/appwrite"

const getImageUrl =async (image:Image) => {
    const url = storage.getFilePreview(image.bucketId, image.fileID)

    return url;
}

export default getImageUrl;