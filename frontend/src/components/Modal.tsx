import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { Button } from "./ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IModalProps {
  hideTrigger?: boolean;
  buttonLabel?: string;
  closeButtonLabel?: string;
  Content?: React.ReactNode;
  Trigger?: LucideIcon;
  hideCloseButton?: boolean;
  className?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Modal({
  hideTrigger = false,
  buttonLabel,
  closeButtonLabel = "Close",
  Content = "This is the content of the modal",
  Trigger,
  hideCloseButton = false,
  className,
  isOpen,
  setIsOpen,
}: IModalProps) {
  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      {!hideTrigger &&
        (Trigger ? (
          <Button className={cn("flex gap-2", className)} onClick={openModal}>
            <Trigger />
            {buttonLabel}
          </Button>
        ) : (
          <Button type="button" onClick={openModal}>
            {buttonLabel}
          </Button>
        ))}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full overflow-x-scroll max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {Content}

                  {!hideCloseButton && (
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        {closeButtonLabel}
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
