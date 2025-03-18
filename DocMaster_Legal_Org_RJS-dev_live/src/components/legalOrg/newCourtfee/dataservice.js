const API_URL = "https://web1024.ipguide.net:4002";
//user get states
export const getUserStates = async () => {
  try {
    const response = await fetch(`${API_URL}/api/user/getStates`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
//get user's nature of suites
export const getNatureOfSuites = async () => {
  try {
    const response = await fetch(`${API_URL}/api/user/getNatureOfSuit`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

//user get states
export const getFee = async ({ state_id, nature_of_suit, value_of_suit }) => {
  const requestBody = { state_id, nature_of_suit, value_of_suit };
  console.log(requestBody);
  try {
    const response = await fetch(`${API_URL}/api/user/calculateCourtFee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (response.ok) {
      const responseData = await response.json();
      const data = responseData.data;
      return data;
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};
