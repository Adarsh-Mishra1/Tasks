export const apiKey = "docmaster-apikey";
export const apiKeyValue = "abcdef12345";
export const apiKeyAddTo = "header";

export const apiKeyHeader = () => {
  let header2Post = {};
  header2Post["content-type"] = "application/json";
  header2Post[apiKey] = apiKeyValue;
  return header2Post;
};

export const apiKeyHeaderMultiPartFormData = () => {
  let header2Post = {};
  header2Post["Accept"] = "application/json";
  header2Post["content-type"] = "multipart/form-data";
  header2Post[apiKey] = apiKeyValue;
  return header2Post;
};
