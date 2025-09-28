"use client"
import React, { useEffect } from 'react';
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsentT from "vanilla-cookieconsent";

const CookieConsent = () => {
    useEffect(() => {
        CookieConsentT.run({
            categories: {
        necessary: {
            enabled: true,  // this category is enabled by default
            readOnly: true,  // this category cannot be disabled,
            services:{
                guesses:{
                    label:"Your guess across the modes (used and not used options as well as the correctly guessed option)",
                    
                }
            }
        },
        analytics: {
            autoClear: {
                cookies: [
                    {
                        name: /^fullres/,   // regex: match all cookies starting with '_ga'
                    }
                ]
            },

            // https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
            services: {
                fullres: {
                    label: 'Fullres Analytics',
                    onAccept: () => {
                        if(process.env.NEXT_PUBLIC_ENV !== "production")return;
                        const fullres = document.createElement('script');
                        fullres.async = true;
                        fullres.src = 'https://t.fullres.net/dbdlepasiotestudio.js?' + (Date.now() - (Date.now() % 43200000));
                        document.head.appendChild(fullres);
                    },
                    onReject: () => {}
                },
            }
        }
    },

    language: {
        default: 'en',
        translations: {
            en: {
                consentModal: {
                    title: 'We use cookies',
                    description: 'This website uses cookies in order to enhance the overall user experience.',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Only essentials',
                    showPreferencesBtn: 'Manage'
                },
                preferencesModal: {
                    title: 'Manage cookie preferences',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Reject all',
                    savePreferencesBtn: 'Accept current selection',
                    closeIconLabel: 'Close modal',
                    sections: [
                        {
                            title: 'Somebody said ... cookies?',
                            description: 'I want one!'
                        },
                        {
                            title: 'Strictly Necessary cookies',
                            description: 'These cookies are essential for the proper functioning of the website and cannot be disabled.',

                            //this field will generate a toggle linked to the 'necessary' category
                            linkedCategory: 'necessary'
                        },
                        {
                            title: 'Performance and Analytics',
                            description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                            linkedCategory: 'analytics'
                        },
                    ]
                }
            }
        }
    }
        });
    }, []);
    return (
    <>
    </>
    );
};
export default CookieConsent;