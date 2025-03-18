import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import { apiKeyHeader } from "../configs/ApiKeys";
import { WSReadWebContentByCode } from "../configs/WebService";

export async function getWebContentByCode(webContentCode) {
  try {
    const response = await axios.post(
      WSReadWebContentByCode,
      JSON.stringify({
        code: webContentCode,
      }),
      {
        headers: apiKeyHeader(),
      }
    );

    const responseData = response.data;
    if (responseData.result_code === 1) {
      return {
        content: responseData.result_message.pageContent,
        code: webContentCode,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("error", error);
    return null;
  }
}

export function useWebContent(webContentCodes) {
  const queries = useQueries({
    queries:
      webContentCodes?.map((webContentCode) => ({
        queryKey: ["webContent", webContentCode],
        queryFn: () => getWebContentByCode(webContentCode),
        enabled: !!webContentCode,
      })) || [],
  });

  const webContents = queries.map(({ data, isPending, error }) => ({
    webContent: data,
    isPending,
    error,
  }));

  const isLoading = queries.some(({ isPending }) => isPending);

  return { webContents, isLoading };
}
