
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
        if (loading) return
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
                    Hej! Vi heter Amanda och Ebba och är tillsammans Jämlikhetsnämndens ordförande. Vår uppgift är att se till att du känner dig trygg, inkluderad och välkommen, men framförallt att alla sektionens medlemmar behandlas lika.
                </p>
                <p>
                    Här kan du göra två saker:
                </p>
                <ul>
                    <li>
                        Ställa en fråga till oss (egentligen om vad som helst, men vi kanske inte är så bra på att svara på icke-JML-frågor 😉)
                    </li>
                    <li>
                        Berätta om någonting som du tycker att vi behöver veta. Du kan berätta om allt ifrån en kränkande behandling du blivit utsatt för (både på och utanför KTH) till ett dåligt uppförande av en föreläsare eller problem med psykiska ohälsa. Om du tex blivit utsatt för trakasserier kan jag hjälpa dig att gå vidare med en anmälan till KTH men då går det tyvärr inte att vara anonym
                    </li>
                </ul>
                <p>
                    Värt för dig att veta är att vi inte har officiell tystnadsplikt, men vi kommer självklart inte sprida vidare det du berättar iallafall ❤️.
                </p>
                <p>
                    Det går också alltid bra att rycka tag i oss om du ser oss på (eller utanför) campus!
                </p>
                <p>
                    Som systemet är uppbyggt nu så kommer vi inte att se din mailadress, men (om du anger det) så kommer vi se ditt namn och ditt telefonnummer. Däremot kommer systemet att skicka svaret till dig på den mailadress du uppgett (om du uppgett någon). Alla uppgifter du lämnar kommer vara kvar i systemet tills vi svarat (och sedan 7 dagar till), innan de automatiskt tas bort. Däremot kan vi komma att använda verkliga händelser som berättas om genom det här systemet (i anonymiserad och ändrad form så klart!) till cases för olika workshops (om det känns relevant).
                </p>
                <p>
                    Om du har några frågor till oss om formuläret eller annars så får du jättegärna maila på <a href="mailto:jamllikordf@d.kth.se">jamllikordf@d.kth.se</a> eller rycka tag i oss på annat sätt! (eller fylla i formuläret så klart 🙂)
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
                        disabled={disabled || loading}
                        onClick={submit}
                    >Skicka</button>
                </div>
            </div>
        </>
    )
}

export default Home