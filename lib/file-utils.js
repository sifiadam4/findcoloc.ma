/**
 * Convert a file to base64 data URL
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 data URL
 */
export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Validate file size and type
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes (default: 5MB)
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean} - Whether the file is valid
 */
export const validateFile = (
  file,
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
) => {
  if (!file) return false;

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `File type not supported. Allowed types: ${allowedTypes.join(", ")}`
    );
  }

  return true;
};

/**
 * Process file for upload (convert to base64 and validate)
 * @param {File} file - The file to process
 * @returns {Promise<string>} - Base64 data URL
 */
export const processFileForUpload = async (file) => {
  try {
    validateFile(file);
    return await convertFileToBase64(file);
  } catch (error) {
    throw new Error(`File processing failed: ${error.message}`);
  }
};
