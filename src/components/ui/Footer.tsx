"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import PartnersSponsors from "./PartnersSponsors";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-4">RATOTECKI</h2>
            {/* <div className="mb-4">
              <Image
                src="/img/ratotecki-logo-black.png"
                alt="Ratotecki Logo"
                width={110}
                height={24}
              />
            </div> */}
            <p className="text-gray-400 max-w-md mb-6">
              Transforming how protection and control systems are engineered in the power and energy sector with AI and virtual twins.
            </p>
            <div className="flex space-x-4">
              <span className="text-gray-400">Follow us:</span>
              <a
                href="https://www.linkedin.com/company/ratotecki-inc/"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Specialties</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Artificial Intelligence (AI)</li>
              <li className="text-gray-400">Software Simulation</li>
              <li className="text-gray-400">Industrial Automation</li>
            </ul>
          </div>
        </div>

        {/* Partners & Sponsors */}
        <PartnersSponsors />

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Ratotecki Inc. All rights reserved.</p>
          <p className="mt-2">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 