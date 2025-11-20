import axios from 'axios';
import { useEffect, useState } from 'react'

const useAuthorization = () => {
    const [admin, setAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        axios.get("/api/check-token")
        .then(res => {
            setAdmin(res.data.isAdmin)
            setHasToken(true)
        })
        .catch(res => {
            setHasToken(false)
            setAdmin(false)
        })
        .finally(() => setLoading(false))
    }, [])

    return { admin, loading, hasToken }
}

export default useAuthorization;
