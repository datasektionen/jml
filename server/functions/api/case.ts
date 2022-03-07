import ApiResponse from '../../common/ApiResponse';
import prisma from '../../common/client';
import configuration from '../../common/configuration';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { KthUser } from 'common/types';

const createdEmail = fs.readFileSync(path.join(__dirname, "..", "..", "emails", "new_errand.md")).toString();
const answerEmail = fs.readFileSync(path.join(__dirname, "..", "..", "emails", "answer.md")).toString();

export const create = (name: string, content: string, contactMethod: string, email: string | null, phone: string | null): Promise<ApiResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await prisma.case.create({
                data: {
                    name,
                    content,
                    contactMethod,
                    email,
                    phone,
                }
            });

            const emails = configuration.NODE_ENV === "development" ? [configuration.DEVELOPMENT_ADMIN_EMAIL] : ["jamlikordf@d.kth.se"];
            await sendMail(emails as any, "Nytt ärende tillagt", createdEmail);
        
            return resolve({
                body: result
            });
        } catch (err) {
            return reject({
                body: err,
            });
        }
    });
};

export const sendMail = async (to: string[], subject: string, content: string): Promise<boolean> => {
    if (!configuration.SPAM_API_KEY) return false;
    // Don't send email if development and no admin address sent
    if (configuration.NODE_ENV === "development" && !configuration.DEVELOPMENT_ADMIN_EMAIL) return false;
    if (configuration.NODE_ENV === "testing") return false;
    if (configuration.NODE_ENV === "development" && !configuration.SEND_MAIL_IN_DEVELOPMENT) return false;

    const result = await axios.post(`${configuration.SPAM_API_URL}/sendmail`, {
        from: "jml-no-reply@datasektionen.se",
        to,
        subject,
        content,
        key: configuration.SPAM_API_KEY,
    });

    console.log(result.status === 200 ? `Email sent to ${to.map(x => x + ", ")}` : "Failed to send email.");

    return result.status === 200 ? true : false;
};

export const getAll = async (): Promise<ApiResponse> => {
    try {
        const cases = await prisma.case.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                contactMethod: true,
                name: true,
                phone: true,
                delete: true,
            }
        });
    
        return {
            body: cases,
        };
    } catch (err) {
        return {
            error: "Something went wrong"
        };
    }
};

export const answer = (id: number, content: string, original: string, user: KthUser): Promise<ApiResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const object = await prisma.case.findUnique({
                where: {
                    id,
                }
            });

            if (object?.email) {
                // ddos possibility here
                const status = await sendMail([object.email], "Din fråga är besvarad", answerEmail.replace("{MEDDELANDE}", content).replace("{USER}", `${user?.first_name} ${user?.last_name} (${user?.user})`).replace("{ORIGINAL}", original));

                if (status) {

                    await prisma.case.update({
                        where: {
                            id
                        },
                        data: {
                            delete: new Date(Date.now() + 3600*24*7*1000)
                        }
                    });
        
                    return resolve({
                        body: "Mejlet skickades och ärendet togs bort."
                    });
                } else {
                    if (configuration.NODE_ENV === "testing") return true;
                    return reject({
                        error: "Mejlet kunde inte skickas, försök igen senare."
                    });
                }
            } else {
                return reject({
                    error: "Ingen e-postadress finns på ärendet, kan inte skicka mejl."
                });
            }

        } catch (err) {
            console.log(err);
            return reject({
                error: "Något gick fel."
            });
        }
    });
};

export const deleteCase = async (id: number): Promise<ApiResponse> => {
    try {
        await prisma.case.delete({
            where: {
                id,
            },
        });

        return { 
            body: "Deleted case: " + id,
        };
    } catch (err) {
        if (err.code === "P2025") return {
            error: "Case not found.",
        };

        return { };
    }
};