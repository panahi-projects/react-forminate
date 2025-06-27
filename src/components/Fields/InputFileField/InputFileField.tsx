import { useField } from "@/hooks";
import { InputFileType } from "@/types";
import { useCallback, useState, useMemo } from "react";

type FileStorageFormat =
  | "file" // Raw File object
  | "fileList" // FileList
  | "base64" // Base64 string
  | "blobUrl" // Blob URL
  | "arrayBuffer" // ArrayBuffer
  | "remoteUrl" // Remote URL string
  | "metadata"; // Custom metadata object

const InputFileField: React.FC<InputFileType> = (props) => {
  const {
    eventHandlers,
    fieldParams,
    fieldValue = null,
    isTouched,
    setValue,
  } = useField(props);

  // Get storage format from field schema (default to 'file')
  const storageFormat: FileStorageFormat = props.storageFormat || "file";
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Extract custom handlers
  const { htmlHandlers, customHandlers } = eventHandlers;

  // Convert file to desired format
  const processFile = useCallback(
    async (file: File): Promise<any> => {
      switch (storageFormat) {
        case "file":
          return file;

        case "fileList":
          // Note: FileList is read-only, we'll simulate it with an array
          return [file];

        case "base64":
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

        case "blobUrl":
          return URL.createObjectURL(file);

        case "arrayBuffer":
          return new Promise<ArrayBuffer>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.readAsArrayBuffer(file);
          });

        case "remoteUrl":
          // This would typically involve an upload API call
          // For demo, we'll return a placeholder
          return `https://example.com/uploads/${file.name}`;

        case "metadata":
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            // Add any custom metadata
          };

        default:
          return file;
      }
    },
    [storageFormat]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const files = Array.from(e.target.files);
      const processedFiles = await Promise.all(files.map(processFile));

      // Generate previews for image files
      if (["base64", "blobUrl"].includes(storageFormat)) {
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
      }

      // Set value based on storage format
      if (storageFormat === "fileList") {
        setValue(props.fieldId, e.target.files); // Actual FileList
      } else {
        setValue(
          props.fieldId,
          processedFiles.length === 1 ? processedFiles[0] : processedFiles
        );
      }

      // Call the upload handler with the correct parameters
      if (customHandlers?.onUpload) {
        customHandlers.onUpload(processedFiles, props.fieldId);
      }
    },
    [processFile, storageFormat, setValue, props.fieldId, customHandlers]
  );

  const handleRemoveFile = useCallback(
    async (index: number) => {
      if (!Array.isArray(fieldValue)) return;

      const removedFile = fieldValue[index];
      const newValue = fieldValue.filter((_, i) => i !== index);

      // Revoke blob URLs if used
      if (storageFormat === "blobUrl" && typeof removedFile === "string") {
        URL.revokeObjectURL(removedFile);
      }

      setValue(props.fieldId, newValue.length === 0 ? null : newValue);
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

      // Call custom remove handler if provided
      if (customHandlers?.onRemove) {
        customHandlers.onRemove(removedFile, props.fieldId);
      }
    },
    [fieldValue, storageFormat, setValue, props.fieldId, customHandlers]
  );

  // Determine accepted file types
  const acceptedFileTypes = useMemo(() => {
    if (!props.accept) return undefined;
    if (Array.isArray(props.accept)) return props.accept.join(",");
    return props.accept;
  }, [props.accept]);

  return (
    <div className="file-input-container">
      <input
        {...fieldParams}
        {...htmlHandlers}
        type="file"
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        multiple={props.multiple}
        data-touched={isTouched}
      />

      {/* File previews */}
      <div className="file-previews">
        {Array.isArray(fieldValue) ? (
          fieldValue.map((file, index) => (
            <div key={index} className="file-preview">
              {storageFormat === "blobUrl" || storageFormat === "base64" ? (
                <img
                  src={
                    previewUrls[index] || (typeof file === "string" ? file : "")
                  }
                  alt="Preview"
                />
              ) : (
                <span>{file.name || file}</span>
              )}
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="remove-file"
              >
                Remove
              </button>
            </div>
          ))
        ) : fieldValue ? (
          <div className="file-preview">
            {storageFormat === "blobUrl" || storageFormat === "base64" ? (
              <img
                src={
                  previewUrls[0] ||
                  (typeof fieldValue === "string" ? fieldValue : "")
                }
                alt="Preview"
              />
            ) : (
              <span>{fieldValue.name || fieldValue}</span>
            )}
            <button
              type="button"
              onClick={() => {
                setValue(props.fieldId, null);
                setPreviewUrls([]);
                if (customHandlers?.onRemove) {
                  customHandlers.onRemove(fieldValue, props.fieldId);
                }
              }}
              className="remove-file"
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InputFileField;
