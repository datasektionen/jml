import React, { useState } from 'react';
import axios from 'axios';
import { url } from './App';

const Answer = ({ item, killMe, loading: disabled }) => {

    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const submit = (id, body) => {
        setLoading(true)
        axios.post(url(`/api/case/answer/${id}`), body, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => {
            killMe(id)
        })
        .catch(err => {
            if (err.response && err.response.data) setError(err.response.data.error)
            else setError(err.toString())
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div>
            <p>
                {item.content}
            </p>
            {error &&
                <div>
                    {error}
                </div>
            }
            {item.contactMethod === "email" &&
                <>
                    <textarea
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        disabled={loading || disabled}
                        placeholder="Skriv ditt svar som skickas via e-post"
                    />
                    <button
                        disabled={answer.length === 0 || loading || disabled}
                        onClick={() => submit(item.id, { content: answer })}
                    >Skicka svar</button>
                </>
            }
        </div>
    )
}

export default Answer