"use client";
import React, { useState } from "react";
import { RocketLaunch, EnvelopeSimple, LinkedinLogo, TwitterLogo } from "phosphor-react";
import Link from "next/link";

export const footerConfig = {
    brand: "CareInsight",
    description: "Empowering healthcare decisions with AI-driven insights and comprehensive medical information.",
    sections: [
        {
            title: "Quick Links",
            links: [
                { text: "Disease Catalogue", href: "/catalogue" },
                { text: "Prescription Analysis", href: "/prescription" },
                { text: "About Us", href: "/about" },
                { text: "Help Center", href: "/help" },
            ],
        },
        {
            title: "Legal",
            links: [
                { text: "Terms of Service", href: "/tos" },
                { text: "Privacy Policy", href: "/privacy" },
                { text: "Cookie Policy", href: "/cookies" },
                { text: "Disclaimer", href: "/disclaimer" },
            ],
        },
    ],
};

const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const { description, sections } = footerConfig;

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 10000); 
        }
    };

    return (
        <footer className="bg-gradient-to-b from-blue-50 to-white border-t border-blue-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-bold text-blue-800">{footerConfig.brand}</span>
                        </Link>
                        <p className="text-gray-600 text-xs mb-4">
                            {description}
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                <TwitterLogo size={24} weight="fill" />
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                <LinkedinLogo size={24} weight="fill" />
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                <EnvelopeSimple size={24} weight="fill" />
                            </a>
                        </div>
                    </div>

                    {/* Links Sections - First Two Columns */}
                    {sections.map((section, index) => (
                        <div key={index} className="lg:col-span-1">
                            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                                        >
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter Section in Right Column */}
                    <div className="lg:col-span-1">
                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                            Newsletter
                        </h3>
                        {subscribed ? (
                            <div className="text-green-600 text-sm animate-fade-in">
                                Thanks for subscribing!
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-gray-600 text-xs">
                                    Get the latest medical insights directly to your inbox.
                                </p>
                                <form onSubmit={handleSubscribe} className="space-y-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <button 
                                        type="submit"
                                        className="w-full bg-blue-600 text-white px-4 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-blue-100">
                    <p className="text-center text-gray-500 text-xs">
                        © {new Date().getFullYear()} {footerConfig.brand}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
