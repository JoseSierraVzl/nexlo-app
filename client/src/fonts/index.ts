import { Urbanist, Open_Sans } from "next/font/google";

export const urbanist = Urbanist({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-urbanist",
});

export const openSans = Open_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-open-sans",
});
