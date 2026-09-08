import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from 'methone';
import ReCAPTCHA from "react-google-recaptcha";

const translations = {
    sv: {
        header: "Anmälan och frågor",
        languageToggle: "English",
        intro: {
            greeting: "Hej! Jag heter Tina och är Jämlikhets-, Mångfalds- och Likabehandlingsansvarig (JMLA) här på Datasektionen.",
            purpose: "Min uppgift är att se till att du känner dig trygg, inkluderad och välkommen, men framförallt att alla sektionens medlemmar behandlas lika.",
            canDo: "Här kan du göra två saker:",
            listItem1: "Ställa en fråga till mig (egentligen om vad som helst, men jag kanske inte är så bra på att svara på icke-JML-frågor 😉)",
            listItem2: "Berätta om någonting som du tycker att jag behöver veta. Allt ifrån en kränkande behandling du blivit utsatt för (både på och utanför KTH), dåligt uppförande av en föreläsare eller problem med psykiska ohälsa. Om du till exempel blivit utsatt för trakasserier och vill gå vidare med en anmälan till KTH så kan jag hjälpa dig, men det kan vara bra att veta att det tyvärr då inte går att vara anonym.",
            confidentiality: "Posten JMLA är en SSO (studerandeskyddsombud) post, vilket innebär att jag har officiell tystnadsplikt. Detta innebär att det du delar med mig kan alltid stanna mellan oss ❤️.",
            approach: "Det går också alltid bra att rycka tag i mig om du ser mig på (eller utanför) campus!",
            dataRetention: "Som systemet är uppbyggt nu så kommer din mailadress inte synas, men (om du anger det) så kommer jag att kunna se ditt namn och ditt telefonnummer. Däremot kommer systemet att skicka svaret till dig på den mailadress du uppgett (om du uppgett någon). Alla uppgifter du lämnar kommer vara kvar i systemet tills jag svarat (och sedan 7 dagar till), innan de automatiskt tas bort. Däremot kan jag komma att använda verkliga händelser som berättas om genom det här systemet (i anonymiserad och ändrad form så klart!) till cases för olika workshops (om det känns relevant).",
            contact: "Om du har några frågor till mig om formuläret eller vad som helst annat så får du jättegärna maila på "
        },
        form: {
            name: "Namn (frivilligt)",
            namePlaceholder: "Namn",
            contactLabel: "Om du vill bli kontaktad, hur vill du bli kontaktad?",
            email: "E-post",
            emailPlaceholder: "E-postadress",
            phone: "Telefonnummer",
            phonePlaceholder: "Telefonnummer",
            description: "Vad vill du berätta?",
            descriptionPlaceholder: "Skriv här",
            submit: "Skicka"
        },
        selectItems: [
            {label: "Vill inte bli kontaktad", key: "no"},
            {label: "E-post", key: "email"},
            {label: "Telefon", key: "phone"},
            {label: "Personligen", key: "irl"},
        ]
    },
    en: {
        header: "Report and Questions",
        languageToggle: "Swedish",
        intro: {
            greeting: "Hi there! My name is Tina and I am Head of Equality, Diversity and Equal Treatment (JMLA) here at the Computer Science Chapter.",
            purpose: "My purpose is to make sure that you feel safe, included and welcome, but first and foremost, to make sure that all the Chapter's members are treated equally.",
            canDo: "Here, you can do two things:",
            listItem1: "Ask me a question (or anything else really, but I might not be that good at answering non-JML questions 😉)",
            listItem2: "Tell me something that you feel I need to know. You can tell me about anything from experiencing offensive treatment (both at or outside KTH) to poor behaviour by a lecturer or struggles with mental health. For example, if you have been subjected to harassment and want to proceed with a complaint to KTH, I can assist you, however it is worth noting that you unfortunately cannot remain anonymous when reporting incidents.",
            confidentiality: "The position of JMLA is an SSO position (student safety representative), which means that I have official duty of confidentiality, so what you tell me will always stay between just us ❤️.",
            approach: "It's always okay to approach me if you see me on (or off) campus!",
            dataRetention: "As the system is currently set up, your email address will not be visible, but (if you provide it) I will be able to see your name and phone number. However, the system will send my response to you at the email address you provided (if you provided one). All information you provide will be retained in the system until I respond (and then for an additional 7 days) before being automatically deleted. However, I may use real events reported through this system (in anonymized and modified form, of course!) for various workshop cases (if it seems relevant).",
            contact: "If you have any questions for me about the form or anything else, please feel free to email me at "
        },
        form: {
            name: "Name (optional)",
            namePlaceholder: "Name",
            contactLabel: "If you want to be contacted, how do you want to be contacted?",
            email: "E-post",
            emailPlaceholder: "E-postadress",
            phone: "Telefonnummer",
            phonePlaceholder: "Telefonnummer",
            description: "What would you like to tell us?",
            descriptionPlaceholder: "Write here",
            submit: "Send"
        },
        selectItems: [
            {label: "I don't want to be contacted", key: "no"},
            {label: "E-post", key: "email"},
            {label: "Telephone", key: "phone"},
            {label: "In person", key: "irl"},
        ]
    }
};

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
    const [isEnglish, setIsEnglish] = useState(false);

    const toggleLanguage = () => {
        setIsEnglish(!isEnglish);
    };

    const t = translations[isEnglish ? 'en' : 'sv'];

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

        axios.post("/api/case/create", {
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
            <Header title={t.header} action={{
                onClick: toggleLanguage,
                text: t.languageToggle
            }}/>
            <div id="content">
                <p>{t.intro.greeting}</p>
                <p>{t.intro.purpose}</p>
                <p>{t.intro.canDo}</p>
                <ul>
                    <li>{t.intro.listItem1}</li>
                    <li>{t.intro.listItem2}</li>
                </ul>
                <p>{t.intro.confidentiality}</p>
                <p>{t.intro.approach}</p>
                <p>{t.intro.dataRetention}</p>
                <p>
                    {t.intro.contact}
                    <a href="mailto:jmla@datasektionen.se">jmla@datasektionen.se</a>
                    {isEnglish ? " or reach out to me in another way! (or fill out the form, of course 🙂)." : " eller rycka tag i mig på annat sätt! (eller fylla i formuläret så klart 🙂)."}
                </p>
                
                <div className="form">
                    <div className="field">
                        <label htmlFor="name">{t.form.name}</label>
                        <input
                            id="name"
                            type="text"
                            placeholder={t.form.namePlaceholder}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="select">{t.form.contactLabel}</label>
                        <select
                            id="select"
                            onChange={e => setSelect(e.target.value)}
                        >
                            {t.selectItems.map(o =>
                                <option
                                    key={"option-"+o.key}
                                    value={o.key}>{o.label}
                                </option>
                            )}
                        </select>
                    </div>
                    {select === "email" &&
                        <div className="field">
                            <label htmlFor="email">{t.form.email}</label>
                            <input
                                id="email"
                                type="text"
                                placeholder={t.form.emailPlaceholder}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                    }
                    {select === "phone" &&
                        <div className="field">
                            <label htmlFor="phone">{t.form.phone}</label>
                            <input
                                id="phone"
                                type="text"
                                placeholder={t.form.phonePlaceholder}
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                    }
                    <div className="field">
                        <label htmlFor="description">{t.form.description}</label>
                        <textarea
                            id="description"
                            placeholder={t.form.descriptionPlaceholder}
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
                    >{t.form.submit}</button>
                </div>
            </div> 
        </>
    )
}

export default Home
