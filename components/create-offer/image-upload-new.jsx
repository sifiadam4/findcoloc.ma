"use client";

import { useState, useRef } from "react";
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageUploadNew({ value = [], onChange, maxFiles = 8 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef();

  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB
  const acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      return `Le fichier ${file.name} n'est pas un format d'image supporté.`;
    }
    if (file.size > maxSize) {
      return `Le fichier ${file.name} est trop volumineux (max. ${maxSizeMB}MB).`;
    }
    return null;
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (files) => {
    setIsUploading(true);
    setErrors([]);

    const fileArray = Array.from(files);
    const newErrors = [];

    // Validate files
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      }
    }

    // Check total count
    if (value.length + fileArray.length > maxFiles) {
      newErrors.push(
        `Vous ne pouvez télécharger que ${maxFiles} images maximum.`
      );
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsUploading(false);
      return;
    }

    try {
      // Convert valid files to base64
      const validFiles = fileArray.filter((file) => !validateFile(file));
      const base64Results = await Promise.all(
        validFiles.map(async (file) => {
          const base64 = await convertFileToBase64(file);
          return {
            file: base64, // This is the base64 data URL
            preview: base64,
            name: file.name,
            size: file.size,
            id: `${Date.now()}-${file.name}`,
          };
        })
      ); // Update the form with new base64 data URLs
      const newValue = [
        ...value,
        ...base64Results.map((result) => result.file),
      ];
      onChange(newValue);
    } catch (error) {
      console.error("Error processing files:", error);
      setErrors(["Erreur lors du traitement des fichiers."]);
    }

    setIsUploading(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors
          ${isDragging ? "bg-accent/50 border-ring" : "border-input"}
          ${value.length > 0 ? "" : "justify-center"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="sr-only"
          aria-label="Upload image files"
        />

        {value.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Photos téléchargées ({value.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                disabled={value.length >= maxFiles || isUploading}
                type="button"
              >
                <UploadIcon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                {isUploading ? "Traitement..." : "Ajouter plus"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {value.map((imageUrl, index) => (
                <div
                  key={index}
                  className="bg-accent relative aspect-square rounded-md"
                >
                  <img
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    className="size-full rounded-[inherit] object-cover"
                  />
                  <Button
                    onClick={() => removeImage(index)}
                    size="icon"
                    type="button"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Supprimer l'image"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">
              {isUploading
                ? "Traitement des images..."
                : "Glissez-déposez vos images ici"}
            </p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG, GIF ou WebP (max. {maxSizeMB}MB)
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={openFileDialog}
              type="button"
              disabled={isUploading}
            >
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              {isUploading ? "Traitement..." : "Sélectionner des images"}
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <div
              key={index}
              className="text-destructive flex items-center gap-1 text-xs"
              role="alert"
            >
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
