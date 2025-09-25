import axios from 'axios';
import { useEffect, useState } from 'react'

// Hook that runs once on application mount. Checks the token (if any) and sets admin status and loading status
const useAuthorization = () => {
    const [admin, setAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setHasToken(true)
        axios.get("/api/check-token", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => setAdmin(res.data.admin))
        .catch(res => {
            setHasToken(false)
            setAdmin(false)
        })
        .finally(() => setLoading(false))
    }, [])

    return { admin, loading, hasToken }
}

export default useAuthorization;
