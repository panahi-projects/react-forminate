import { useField } from "@/hooks";
import {
  FileMetadata,
  FileStorageFormatType,
  FileValue,
  InputFileType,
} from "@/types";
import React, { useCallback, useState, useMemo, useEffect } from "react";

// Utility functions moved outside component
const isFile = (value: unknown): value is File => value instanceof File;
const isFileMetadata = (value: unknown): value is FileMetadata =>
  !!value && typeof value === "object" && "name" in value;

const FilePreviewRenderer: React.FC<{
  file: FileValue;
  previewUrl?: string;
  storageFormat: FileStorageFormatType;
  onRemove?: () => void;
}> = ({ file, previewUrl, storageFormat, onRemove }) => {
  if (!file) return null;

  const renderContent = () => {
    if (storageFormat === "blobUrl" || storageFormat === "base64") {
      const src = previewUrl || (typeof file === "string" ? file : null);
      return src ? <img src={src} alt="File preview" /> : null;
    }

    if (isFile(file)) return <span>{file.name}</span>;
    if (isFileMetadata(file)) return <span>{file.name}</span>;
    if (typeof file === "string") return <span>{file}</span>;

    return null;
  };

  return (
    <div className="file-preview">
      {renderContent()}
      {onRemove && (
        <button type="button" onClick={onRemove} className="remove-file">
          Remove
        </button>
      )}
    </div>
  );
};

const InputFileField: React.FC<InputFileType> = (props) => {
  const {
    eventHandlers,
    fieldParams,
    fieldValue = null,
    isTouched,
    setValue,
  } = useField(props);

  const storageFormat: FileStorageFormatType = props.storageFormat || "file";
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { htmlHandlers, customHandlers } = eventHandlers;

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const processFile = useCallback(
    async (file: File): Promise<FileValue> => {
      const processors: Record<
        FileStorageFormatType,
        () => Promise<FileValue>
      > = {
        file: async () => file,
        fileList: async () => [file],
        base64: async () =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          }),
        blobUrl: async () => URL.createObjectURL(file),
        arrayBuffer: async () =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.readAsArrayBuffer(file);
          }),
        remoteUrl: async () => `https://example.com/uploads/${file.name}`,
        metadata: async () => ({
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        }),
      };

      return processors[storageFormat]();
    },
    [storageFormat]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;

      const files = Array.from(e.target.files);
      const processedFiles = await Promise.all(files.map(processFile));

      if (["base64", "blobUrl"].includes(storageFormat)) {
        setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
      }

      const newValue =
        storageFormat === "fileList"
          ? e.target.files
          : processedFiles.length === 1
            ? processedFiles[0]
            : processedFiles;

      setValue(props.fieldId, newValue);
      customHandlers?.onUpload?.(processedFiles as File[], props.fieldId);
    },
    [processFile, storageFormat, setValue, props.fieldId, customHandlers]
  );

  const handleRemoveFile = useCallback(
    (index?: number) => {
      const isArray = Array.isArray(fieldValue);
      const filesToRemove = isArray ? [fieldValue[index!]] : [fieldValue];
      const newValue = isArray
        ? fieldValue.filter((_, i) => i !== index)
        : null;

      // Cleanup blob URLs
      filesToRemove.forEach((file) => {
        if (storageFormat === "blobUrl" && typeof file === "string") {
          URL.revokeObjectURL(file);
        }
      });

      setValue(props.fieldId, newValue);
      setPreviewUrls((prev) =>
        isArray ? prev.filter((_, i) => i !== index) : []
      );
      customHandlers?.onRemove?.(filesToRemove[0], props.fieldId);
    },
    [fieldValue, storageFormat, setValue, props.fieldId, customHandlers]
  );

  const acceptedFileTypes = useMemo(
    () => (Array.isArray(props.accept) ? props.accept.join(",") : props.accept),
    [props.accept]
  );

  const renderFilePreviews = () => {
    if (!fieldValue) return null;

    if (Array.isArray(fieldValue)) {
      return fieldValue.map((file, index) => (
        <FilePreviewRenderer
          key={`${props.fieldId}-${index}`}
          file={file}
          previewUrl={previewUrls[index]}
          storageFormat={storageFormat}
          onRemove={() => handleRemoveFile(index)}
        />
      ));
    }

    if (typeof fieldValue === "object" && !Object.keys(fieldValue).length) {
      return null;
    }

    return (
      <FilePreviewRenderer
        file={fieldValue as FileValue}
        previewUrl={previewUrls[0]}
        storageFormat={storageFormat}
        onRemove={() => handleRemoveFile()}
      />
    );
  };

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
      <div className="file-previews">{renderFilePreviews()}</div>
    </div>
  );
};

export default React.memo(InputFileField);
