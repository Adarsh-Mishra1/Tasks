import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetAlertMessages } from "../configs/WebService";

export async function getAlertMessages() {
  try {
    const response = await axios.get(GetAlertMessages);

    if (!response.status === 200)
      throw new Error("Error getting alert messages.");

    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export function useAlertMessages() {
  const {
    data: alertMessages,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["alert-messages"],
    queryFn: getAlertMessages,
    retry: 0,
  });

  return { alertMessages, isLoading, error };
}
