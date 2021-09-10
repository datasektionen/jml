
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from 'methone';
import { url } from './App';

const Home = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [content, setContent] = useState("")
    const [select, setSelect] = useState("no")
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const selectItems = [
        {label: "Vill inte bli kontaktad", key: "no"},
        {label: "E-post", key: "email"},
        {label: "Telefon", key: "phone"},
        {label: "Personligen", key: "irl"},
    ]

    useEffect(() => {
        setDisabled(false)
        if (content.trim().length === 0) setDisabled(true);
        if (select === "email") {
            if (email.trim().length === 0) setDisabled(true)
            if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) setDisabled(true)
        }
        if (select === "phone") {
            if (phone.trim().length === 0) setDisabled(true)
        }
    }, [name, email, phone, content, select])

    const clear = () => {
        setName("")
        setEmail("")
        setPhone("")
        setContent("")
        setSelect("no")
    }

    const submit = () => {
        setLoading(true)
        const body = {
            content,
            contactMethod: select,
        }

        if (select === "email") body["email"] = email
        if (select === "phone") body["phone"] = phone
        if (name.length !== 0) body["name"] = name

        axios.post(url("/api/case/create"), body)
        .then(res => {
            clear()
        })
        .catch(err => {

        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <>
            <Header title="Anmälan och frågor" />
            <div id="content">
                <p>
                    Hej! Jag heter Tobias och är studiesocial ledamot och skyddsombud på Fysiksektionen. Det innebär bland annat att jag är ansvarig för att se till att alla studenter på sektionen känner sig trygga och mår bra, både fysiskt och psykiskt. Det medför även att jag har tystnadsplikt enligt lag.
                </p>
                <p>
                    Här kan du berätta om allt ifrån en kränkande behandling du blivit utsatt för (både på och utanför KTH) till ett dåligt uppförande av en föreläsare eller problem med psykiska ohälsa. Om du tex blivit utsatt för trakasserier kan jag hjälpa dig att gå vidare med en anmälan till KTH men då går det tyvärr inte att vara anonym. Vill du däremot bara ha ett svar går det bra.
                </p>
                <p>
                    Sist men inte minst vill jag bara säga att det alltid går bra att rycka tag i mig om du ser mig på (eller utanför) campus!
                </p>
                <p>
                    Skriv något om att jml inte ser epostadresser. Hen fyller bara i ett formulär så skickar systemet ett mejl.
                </p>
                <div className="form">
                    <div className="field">
                        <label htmlFor="name">Namn (frivilligt)</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Namn"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="select">Om du vill bli kontaktad, hur vill du bli kontaktad?</label>
                        <select
                            id="select"
                            onChange={e => setSelect(e.target.value)}
                        >
                            {selectItems.map(o =>
                                <option
                                    key={"option-"+o.key}
                                    value={o.key}>{o.label}
                                </option>
                            )}
                        </select>
                    </div>
                    {select === "email" &&
                        <div className="field">
                            <label htmlFor="email">E-post</label>
                            <input
                                id="email"
                                type="text"
                                placeholder="E-postadress"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                    }
                    {select === "phone" &&
                        <div className="field">
                            <label htmlFor="phone">Telefonnummer</label>
                            <input
                                id="phone"
                                type="text"
                                placeholder="Telefonnummer"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                    }
                    <div className="field">
                        <label htmlFor="description">Vad vill du berätta?</label>
                        <textarea
                            id="description"
                            placeholder="Skriv här"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>
                    <button
                        disabled={disabled}
                        onClick={submit}
                    >Skicka</button>
                </div>
            </div>
        </>
    )
}

export default Home