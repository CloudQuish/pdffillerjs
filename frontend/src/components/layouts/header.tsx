"use client";
import Image from "next/image";
import Link from "next/link";
import Modal from "../Modal";
import { useState } from "react";
import APIKEY from "../landing/APIKeys/APIKEY";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex justify-between items-center w-full max-sm:border-b">
      <header className="container flex items-center w-full px-4 py-3 justify-between max-sm:py-4">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="PDF Filler API | REVESH"
            width={40}
            height={40}
          />
        </Link>

        <nav className="flex items-center gap-2">
          {/* <Button variant="default" size="lg">
            API Key
          </Button> */}
          <Modal
            buttonLabel="API Key"
            closeButtonLabel="Close"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            Content={<APIKEY />}
          />
        </nav>
      </header>
    </div>
  );
};

export default Header;
