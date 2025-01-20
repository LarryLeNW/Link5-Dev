import http from "@/lib/http";
import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";

type UploadProps = {
    children: React.ReactNode;
    type: string;
    setProgress: (progress: number) => void;
    setData: (data: any) => void;
};

type ProgressEvent = {
    loaded: number;
    total: number;
};

type AuthenticatorResponse = {
    data: {
        signature: string;
        expire: number;
        token: string;
    };
    message: string;
};


const authenticator = async (): Promise<{ signature: string; expire: number; token: string }> => {
    try {
        const response = await http.get<
            AuthenticatorResponse
        >(`/media/upload-image-kit`);
        console.log("🚀 ~ authenticator ~ response:", response.payload);

        if (!response.payload) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return response.payload.data;
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

const Upload: React.FC<UploadProps> = ({ children, type, setProgress, setData }) => {
    const ref = useRef<HTMLInputElement | null>(null);

    const onError = (err: unknown) => {
        console.error(err);
    };

    const onSuccess = (res: any) => {
        setData(res.url);
    };

    const onUploadProgress = (progress: ProgressEvent) => {
        console.log(progress);
        setProgress(Math.round((progress.loaded / progress.total) * 100));
    };

    return (
        <IKContext
            publicKey={process.env.NEXT_PUBLIC_IK_PUBLIC_KEY as string}
            urlEndpoint={process.env.NEXT_PUBLIC_IK_URL_ENDPOINT as string}
            authenticator={authenticator}
        >
            <IKUpload
                useUniqueFileName
                onError={(err) => onError(err)}
                onSuccess={(res) => onSuccess(res)}
                onUploadProgress={(progress) => onUploadProgress(progress)}
                className="hidden"
                ref={ref}
                accept={`${type}/*`}
            />
            <div className="cursor-pointer" onClick={() => ref.current?.click()}>
                {children}
            </div>
        </IKContext>
    );
};

export default Upload;