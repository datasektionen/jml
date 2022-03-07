import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Header } from 'methone';
import { url } from './App';
import Moment from 'react-moment';
import Answer from './Answer';
import { AdminContext } from './App'

const Admin = () => {

    const [hasFirstFetch, setHasFirstFetch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    const fetchAll = () => {
        axios.get(url("/api/case/all"), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => {
            setItems(res.data.body)
        })
        .finally(() => {
            setHasFirstFetch(true)
        })
    }

    useEffect(() => {
        fetchAll()
    }, [])

    const { admin, loading: checkingToken } = useContext(AdminContext)
    if (checkingToken) return <div>Laddar...</div>
    if (!admin) return (
        <>
            <Header title="401 Unauthorized" />
            <div id="content">
                Du har inte behörighet att se denna sida
            </div>
        </>
    )

    const deleteItem = (id) => {
        if (loading) return
        setLoading(true)
        axios.delete(url(`/api/case/${id}`), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => {
            setItems(items.filter(i => i.id !== id))
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const renderContactMethod = (m) => {
        if (m === "phone") return "Vill bli kontaktad via telefon"
        if (m === "email") return "Vill bli kontaktad via e-post"
        if (m === "irl") return "Vill bli kontaktad personligen"
        if (m === "no") return "Vill inte bli kontaktad"
    }

    return (
        <div className="Admin">
            <Header title="Administrera" />
            <div id="content">
                <p>
                    Här behandlar du ärenden. Svarar du via mejl tas ärendet bort, spara uppgifter om något behöver sparas. Med soptunnan tar du bort ärenden.
                </p>
                <div className="table">
                    <span><b>Id</b></span>
                    <span><b>Tid</b></span>
                    <span><b>Namn/Nummer</b></span>
                    {!hasFirstFetch &&
                        <div style={{textAlign: "center"}}>
                            <p>Laddar...</p>
                        </div>
                    }
                    {items.map(i =>
                        <div key={"item-"+i.id}>
                            <div id="item">
                                <span>{i.id}</span>
                                <span>
                                    <Moment format="YYYY-MM-DD HH:mm:ss">
                                        {i.createdAt}
                                    </Moment>
                                </span>
                                <span>
                                    {i.name ?? "Inget namn angett"}
                                    {i.phone && " " + i.phone}
                                </span>
                                <span>
                                    {renderContactMethod(i.contactMethod)}
                                </span>
                                <span>
                                    <i
                                        className="fas fa-trash"
                                        onClick={() => deleteItem(i.id)}
                                    />
                                </span>
                            </div>
                            <Answer
                                item={i}
                                killMe={(id) => setItems(items.filter(i => i.id !== id))}
                                loading={loading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Admin