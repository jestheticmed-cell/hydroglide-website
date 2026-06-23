"use client";

import { MessageCircle, Send, UserRound, X } from "lucide-react";
import { FormEvent, useState } from "react";

const instantAnswers = {
  "What is your return policy?": "We offer a 30-day return and exchange policy for unused items in original condition. Please contact customer service before sending anything back.",
  "Track my order": "Please email hydroglide@gmail.com with your order email or order number. We will help check your latest shipping status.",
  "What are your shipping details?": "We offer worldwide express shipping. Standard shipping usually takes 9-15 business days, and express shipping usually takes 5-10 business days.",
  "What is your contact info?": "You can reach us at hydroglide@gmail.com. Our team will get back to you as soon as possible.",
  "Do you have any promotions right now?": "Current promotions may vary by product and season. Add your favorite items to cart or contact us for the latest offer.",
  "How can I customize an eFoil?": "Tell us your preferred model, color, usage scenario, and any special requirements. Our team can help confirm available customization options."
};

type ChatMessage = {
  id: number;
  role: "user" | "support";
  text: string;
};

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const toggleChat = () => setOpen((value) => !value);
  const hasMessages = messages.length > 0;

  function addExchange(question: string, answer?: string) {
    const supportAnswer = answer ?? "Thanks for your message. Our support team will reply soon. You can also email us at hydroglide@gmail.com.";

    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text: question },
      { id: Date.now() + 1, role: "support", text: supportAnswer }
    ]);
  }

  function handleSend(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const trimmed = message.trim();

    if (!trimmed) return;

    addExchange(trimmed);
    setMessage("");
  }

  return (
    <>
      {open ? (
        <section className="fixed bottom-24 right-5 z-[9998] flex max-h-[calc(100vh-120px)] w-[calc(100vw-40px)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:bottom-28 sm:right-7 sm:max-h-[calc(100vh-140px)]">
          <div className="shrink-0 bg-[#eef0f0] px-6 pb-5 pt-5 text-ink">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[24px] font-semibold leading-tight">Chat with us</h2>
                <p className="mt-3 text-[18px] leading-7 text-charcoal">Hi, message us with any questions. We&apos;re happy to help!</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-graphite transition hover:bg-white hover:text-ink" aria-label="Close chat">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form className="mt-5 flex h-[72px] items-center rounded-xl border border-line bg-white px-4" onSubmit={handleSend}>
              <span className="sr-only">Write message</span>
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[18px] text-ink outline-none placeholder:text-graphite/70"
                placeholder="Write message"
              />
              <button type="submit" className="grid h-10 w-10 place-items-center text-[#c8c8c8] transition hover:text-[#41b8ae]" aria-label="Send message">
                <Send className="h-6 w-6" aria-hidden="true" />
              </button>
            </form>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-6">
            {hasMessages ? (
              <div className="mb-5 pr-1">
                <div className="grid gap-3">
                  {messages.map((item) => (
                    <div
                      key={item.id}
                      className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        item.role === "user" ? "ml-auto bg-[#41b8ae] text-white" : "mr-auto bg-porcelain text-charcoal"
                      }`}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <h3 className="text-center text-[22px] font-semibold text-ink">Instant answers</h3>
            <div className="mt-5 grid gap-3">
              {Object.entries(instantAnswers).map(([question, answer]) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => addExchange(question, answer)}
                  className="rounded-xl border border-graphite/50 bg-white px-4 py-3 text-left text-[18px] font-medium leading-6 text-graphite transition hover:border-[#41b8ae] hover:text-ink"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onMouseDown={(event) => {
          event.preventDefault();
          toggleChat();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleChat();
          }
        }}
        className="fixed bottom-5 right-5 z-[9999] grid h-16 w-16 place-items-center rounded-full border border-line bg-white text-[#41b8ae] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 hover:text-[#078b8b] focus:outline-none focus:ring-2 focus:ring-[#41b8ae] focus:ring-offset-2 sm:bottom-7 sm:right-7"
        aria-label={open ? "Close live chat" : "Open live chat"}
        aria-expanded={open}
      >
        {open ? <UserRound className="h-8 w-8 pointer-events-none" aria-hidden="true" /> : <MessageCircle className="h-8 w-8 pointer-events-none" aria-hidden="true" />}
        {!open ? (
          <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-red-500 px-1 text-xs font-semibold leading-none text-white">
            1
          </span>
        ) : null}
      </button>
    </>
  );
}
