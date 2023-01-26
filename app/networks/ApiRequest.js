import { isValidJSON } from "../utils/helpers";
import * as globals from "../utils/Globals";
import { showErrorMessage } from "../utils/helpers";
import errors from "../resources/languages/errors";

export const postRequest = async (apiUrl, body) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const result = await response.text();
    if (isValidJSON(result)) {
      return JSON.parse(result);
    } else {
      return {
        statusCode: 1,
        message: "JSON Parse error: Unrecognized token '<'",
      };
    }
  } catch (error) {
    if (error.message === "Network request failed") {
      showErrorMessage(errors.no_internet);
    } else {
      throw error;
    }
  }
};

export const postRequestWithTokenandData = async (apiUrl, body) => {
  try {
    const getaccessToken = globals.access_token;
    if (getaccessToken && getaccessToken == null) {
      return;
    }
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${getaccessToken}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.text();

    if (isValidJSON(result)) {
      return JSON.parse(result);
    } else {
      return {
        statusCode: 1,
        message: "JSON Parse error: Unrecognized token '<'",
      };
    }
  } catch (error) {
    if (error.message === "Network request failed") {
      showErrorMessage(errors.no_internet);
    } else {
      throw error;
    }
  }
};

export const makePostHeaderswithToken = async (apiUrl) => {
  try {
    const getaccessToken = globals.access_token;
    if (getaccessToken && getaccessToken == null) {
      return;
    }
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getaccessToken}`,
        Accept: "application/json",
      },
    });
    const result = await response.text();
    if (isValidJSON(result)) {
      return JSON.parse(result);
    } else {
      return {
        statusCode: 1,
        message: "JSON Parse error: Unrecognized token '<'",
      };
    }
  } catch (error) {
    if (error.message === "Network request failed") {
      showErrorMessage(errors.no_internet);
    } else {
      throw error;
    }
  }
};

export const makeGetHeaders = async (apiUrl) => {
  try {
    const getaccessToken = globals.access_token;
    if (getaccessToken && getaccessToken == null) {
      return;
    }
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getaccessToken}`,
        Accept: "application/json",
      },
    });
    const result = await response.text();
    if (isValidJSON(result)) {
      return JSON.parse(result);
    } else {
      return {
        statusCode: 1,
        message: "JSON Parse error: Unrecognized token '<'",
      };
    }
  } catch (error) {
    if (error.message === "Network request failed") {
      showErrorMessage(errors.no_internet);
    } else {
      throw error;
    }
  }
};

export const makeGetHeadersWithoutToken = async (apiUrl) => {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const result = await response.text();
    if (isValidJSON(result)) {
      return JSON.parse(result);
    } else {
      return {
        statusCode: 1,
        message: "JSON Parse error: Unrecognized token '<'",
      };
    }
  } catch (error) {
    if (error.message === "Network request failed") {
      showErrorMessage(errors.no_internet);
    } else {
      throw error;
    }
  }
};

export const postImageRequest = async (apiUrl, body) => {
  try {
    const getaccessToken = globals.access_token;
    if (getaccessToken && getaccessToken == null) {
      return;
    }
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getaccessToken}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      },
      body: createFormData(body),
    });
    const result = await response.json();

    if (result) {
      return result;
    } else {
      return {
        statusCode: 1,
        message: "JSON Parse error: Unrecognized token '<'",
      };
    }
  } catch (error) {
    if (error.message === "Network request failed") {
      showErrorMessage(errors.no_internet);
    } else {
      throw error;
    }
  }
};

const createFormData = (body) => {
  const data = new FormData();

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });
  return data;
};
