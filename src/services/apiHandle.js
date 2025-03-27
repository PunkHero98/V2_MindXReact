// const apiKey = import.meta.env.VITE_APP_SECRET_KEY;
const apiKey = "677fa32d3b77870627c596d5";
const apiUrl = "https://mindx-mockup-server.vercel.app"

const getUser = async () => {
  try {
    const url = `${apiUrl}/resources/users?apiKey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return { success: true, data: data.data.data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const updateUser = async (id, user) => {
  try {
    const url = `${apiUrl}/resources/users/${id}?apiKey=${apiKey}`;
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const insertNote = async (note) => {
  try {
    const url = `${apiUrl}/resources/Note?apiKey=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(note),
    });
    if (!response.ok) {
      return { success: false, message: "Network response was not ok" };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const getNote = async () => {
  try {
    const url = `${apiUrl}/resources/Note?apiKey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return { success: true, data: data.data.data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const updateNote = async (id, note) => {
  try {
    const url = `${apiUrl}/resources/Note/${id}?apiKey=${apiKey}`;
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(note),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return { success: true, data: data.data.data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const deleteNote = async (id) => {
  try {
    const url = `${apiUrl}/resources/Note/${id}?apiKey=${apiKey}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const getDepartment = async () => {
  try {
    const url = `${apiUrl}/resources/department?apiKey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      return { success: false, message: "Network response was not ok" };
    }
    const data = await response.json();
    return { success: true, data: data.data.data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const updateDepartment = async (id, item) => {
  try {
    const url = `${apiUrl}/resources/department/${id}?apiKey=${apiKey}`;
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      return { success: false, message: "Network response was not ok" };
    }
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
const addUser = async (user) => {
  try {
    const url = `${apiUrl}/resources/users?apiKey=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      return { success: false, message: "Network response was not ok" };
    }
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
export {
  getUser,
  insertNote,
  getNote,
  updateNote,
  deleteNote,
  getDepartment,
  addUser,
  updateDepartment,
  updateUser,
};
