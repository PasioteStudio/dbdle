"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Image from "next/image";
import Footer from "@/component/layout/footer";
import * as CookieConsentT from "vanilla-cookieconsent";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const handleClick = () => {
    CookieConsentT.eraseCookies("cc_cookie")
    window.location.reload()
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="selection:bg-red-700 p-4 bg-white text-black font-sans items-center justify-items-center min-h-screen pb-20 gap-16">
          <div className="s:w-[75%] sm:w-[60%] md:w-[50%] flex flex-col gap-4">
            <h1 className="text-4xl">DBDle -- Privacy Policy</h1>
            <h2 className="text-3xl">Content Used From</h2>
            <p>
              This website uses materials (including images and perk
              descriptions) from most of the articles on the{" "}
              <Link
                className="text-blue-700 underline"
                href={
                  "https://deadbydaylight.fandom.com/wiki/Dead_by_Daylight_Wiki"
                }
              >
                Dead by Daylight wiki
              </Link>{" "}
              at{" "}
              <Link
                className="text-blue-700 underline"
                href={"https://www.fandom.com/"}
              >
                Fandom
              </Link>{" "}
              and is licensed under the{" "}
              <Link
                className="text-blue-700 underline"
                href={"https://creativecommons.org/licenses/by-sa/3.0/"}
              >
                CC BY-NC-SA (Attribution-NonCommercial-ShareAlike) License
              </Link>
              .
            </p>
            <h2 className="text-3xl">Bug and Security Reports</h2>
            <p>
              If you find any security vulnerabilities or bugs please contact us
              at{" "}
              <Link
                className="text-blue-700 underline"
                href={"mailto:" + process.env.NEXT_PUBLIC_MAIL}
              >
                {process.env.NEXT_PUBLIC_MAIL}
              </Link>
            </p>
            <h2 className="text-3xl">Cookie Policy</h2>
            <h3 className="text-2xl">How do we use cookies?</h3>
            <h2 className="text-3xl font-bold">Essential cookies</h2>
            <table>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>cc_cookie</td>
                  <td>Used to store the user's cookie consent preferences.</td>
                  <td>182 days</td>
                </tr>
                <tr>
                  <td>guesses (/perk /quote /killer and /splash)</td>
                  <td>Used to store the user's guesses across the modes.</td>
                  <td>182 days</td>
                </tr>
                <tr>
                  <td>XSRF-TOKEN	Used to secure both the user and our website against cross-site request forgery attacks.	2 hours
</td>
                  <td>Used to store the user's cookie consent preferences.</td>
                  <td>1 year 1 month 1 day</td>
                </tr>
              </tbody>
            </table>
            <h2 className="text-3xl font-bold">Analytics cookies</h2>
            <table>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>fullres_analytics</td>
                  <td>This cookie helps to give us a feedback about the website usage.</td>
                  <td>182 days</td>
                </tr>
              </tbody>
            </table>
            <p>Users can opt out of cookies by clicking here -{`>`} <button onClick={handleClick} className="cursor-pointer px-2 py-1 bg-yellow-400 rounded">reset</button></p>
            <p>
              Thanks for playing DBDle! Go back to playing right{" "}
              <Link className="text-blue-700 underline" href={"/"}>
                here
              </Link>
              .
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
