export class API {
  public static uploadImage = async (file: File) => {
    // Simulating an asynchronous upload process with a delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Here you would typically upload the file to a server and return the URL
    // For demonstration purposes, returning a placeholder URL
    return "/placeholder-image.jpg";
  };
}

export default API;
