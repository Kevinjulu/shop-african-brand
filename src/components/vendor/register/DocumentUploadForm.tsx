import { Upload } from "lucide-react";

interface DocumentUploadFormProps {
  documents: File[];
  setDocuments: (files: File[]) => void;
  isLoading: boolean;
}

export const DocumentUploadForm = ({ documents, setDocuments, isLoading }: DocumentUploadFormProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Verification Documents
      </label>
      <div className="mt-2">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Business registration, licenses, permits (PDF, JPG, PNG)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </label>
        </div>
        {documents.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium">Selected files:</p>
            <ul className="mt-2 space-y-2">
              {documents.map((file, index) => (
                <li key={index} className="text-sm text-gray-500">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};