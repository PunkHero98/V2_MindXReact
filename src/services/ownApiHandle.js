const backEndUrl = 'http://localhost:3000';

const checkUserEmail = async (email) => {
    try {
        const url = `${backEndUrl}/api/register/verify_email`;
        const response = await fetch(url , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if(!data.success){
            return { success: false, message: data.message };
        }
        return { success: true, data: data.message };
    } catch (err) {
        return { fail: true, message: err.message };
    }
};

const addNewUser = async (user) => {
    try {
        const url = `${backEndUrl}/api/register`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if(data.status == '400'){
            return { success: false, message: data.message };
        }
        return { success: true, data: data.message };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

const checkUserName = async (username) => {
    try {
        const url = `${backEndUrl}/api/register/verify_username`;
        const response = await fetch(url , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if(!data.success){
            return { success: false, message: data.message };
        }
        return { success: true, data: data.message };
    } catch (err) {
        return { fail: true, message: err.message };
    }
}

export { checkUserEmail, addNewUser , checkUserName};