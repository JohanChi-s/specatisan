// src/BlockEditor/api.ts
export class API {
  public static async uploadImage(file: File): Promise<string> {
    // Fetch the presigned URL and form fields from the backend
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get presigned URL");
    }

    const { url, fields } = await response.json();

    // Create a new FormData object and append the fields and file
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("file", file);
    // Upload the image file to S3 using the presigned URL
    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image to S3");
    }
    // Return the URL of the uploaded image
    return `${url}${fields.key}`;
  }
}

export default API;
