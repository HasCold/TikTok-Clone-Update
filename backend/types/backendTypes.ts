export interface userTypes{
    _id: string;
    name: string;
    email: string;
}

export interface fileTypes{
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
}

export interface UploadFileInfo {
    originalname?: string;
    filename?: string;
    path?: string;
    size?: number;
}


export type ImagesArray = {
    userId?: string;
    originalName?: string;
    fileName?: string;
    filePath?: string;
    fileSize?: number;
}


export type DeletePostType = {
    profile_id: string;
    filePath: string;
}
