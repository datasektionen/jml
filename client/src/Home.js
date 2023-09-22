
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from 'methone';
import { url } from './App';
import ReCAPTCHA from "react-google-recaptcha";

const Home = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [content, setContent] = useState("")
    const [select, setSelect] = useState("no")
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [recaptchaSuccess, setRecaptchaSuccess] = useState(false);
    const [recaptchaValue, setRecaptchaValue] = useState("");

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
        setRecaptchaSuccess(false)
        setRecaptchaValue("")
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

        axios.post(url("/api/case/create"), {
            ...body,
            "g-recaptcha-response": recaptchaValue,
        })
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
                    Hej! Jag heter Jennifer och är Jämlikhetsnämndens ordförande (JNO). Min uppgift är att se till att du känner dig trygg, inkluderad och välkommen, men framförallt att alla sektionens medlemmar behandlas lika.
                </p>
                <p>
                    Här kan du göra två saker:
                </p>
                <ul>
                    <li>
                        Ställa en fråga till mig (egentligen om vad som helst, men jag kanske inte är så bra på att svara på icke-JML-frågor 😉)
                    </li>
                    <li>
                        Berätta om någonting som du tycker att jag behöver veta. Du kan berätta om allt ifrån en kränkande behandling du blivit utsatt för (både på och utanför KTH) till ett dåligt uppförande av en föreläsare eller problem med psykiska ohälsa. Om du till exempel blivit utsatt för trakasserier och vill gå vidare med en anmälan till KTH så kan jag hjälpa dig, men det kan vara bra att veta att det tyvärr då inte går att vara anonym.
                    </li>
                </ul>
                <p>
                    Posten JNO är numera en SSO post, vilket innebär att jag har officiell tystnadsplikt. Du ska kunna känna dig trygg i att det du berättar för mig stannar mellan oss ❤️.
                </p>
                <p>
                    Det går också alltid bra att rycka tag i mig om du ser mig på (eller utanför) campus!
                </p>
                <p>
                    Som systemet är uppbyggt nu så kommer din mailadress inte synas, men (om du anger det) så kommer jag att kunna se ditt namn och ditt telefonnummer. Däremot kommer systemet att skicka svaret till dig på den mailadress du uppgett (om du uppgett någon). Alla uppgifter du lämnar kommer vara kvar i systemet tills jag svarat (och sedan 7 dagar till), innan de automatiskt tas bort. Däremot kan jag komma att använda verkliga händelser som berättas om genom det här systemet (i anonymiserad och ändrad form så klart!) till cases för olika workshops (om det känns relevant).
                </p>
                <p>
                    Om du har några frågor till mig om formuläret eller vad som helst annat så får du jättegärna maila på <a href="mailto:jno@datasektionen.se">jno@datasektionen.se</a> eller rycka tag i mig på annat sätt! (eller fylla i formuläret så klart 🙂)
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
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY}
                        onChange={(data) => {
                            setRecaptchaSuccess(true);
                            setRecaptchaValue(data)
                        }}
                    />
                    <button
                        disabled={disabled || loading || !recaptchaSuccess}
                        onClick={submit}
                    >Skicka</button>
                </div>
            </div>
        </>
    )
}

export default Home
