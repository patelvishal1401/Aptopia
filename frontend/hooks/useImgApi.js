import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../services/supabase";
import { urlGeneration } from "../utils/helperFn";

function useImgApi() {
  const [loading, setLoading] = useState(false);

  const apiFn = async ({ file }) => {
    try {

      if(!file) return

      setLoading(true);
      const { data, error } = await supabase.storage
        .from("tokens")
        .upload(`${uuidv4()}.${file.type.replace("image/","")}`, file);
      console.log(data);
      
      if (error) {
        console.log(error);
        throw new Error(error.message || "Failed to upload image");
      }
      const imageUrl = urlGeneration(data?.fullPath);
      setLoading(false);
      return { response: imageUrl, error: null };
    } catch (error) {
      setLoading(false);

      return {
        response: null,
        error: error?.message ? error?.message : "Error Occurred",
      };
    }
  };

  return { apiFn, loading };
}

export default useImgApi;
