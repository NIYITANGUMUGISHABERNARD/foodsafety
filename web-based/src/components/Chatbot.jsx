import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { sendMessage } from "../services/chatbotServices";
import { toast } from "react-toastify";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hello! I'm your Food Safety Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await sendMessage(userMessage);
            setMessages(prev => [...prev, { role: "bot", text: response.data.response }]);
        } catch (error) {
            toast.error("Failed to get response from chatbot");
            setMessages(prev => [...prev, { role: "bot", text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50 hover:scale-110"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-2xl flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold">Food Safety Assistant</h3>
                            <p className="text-xs text-white/80">AI-powered help</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-start space-x-2 ${
                                    msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                                }`}
                            >
                                <div
                                    className={`p-2 rounded-full ${
                                        msg.role === "user"
                                            ? "bg-green-500 text-white"
                                            : "bg-purple-500 text-white"
                                    }`}
                                >
                                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${
                                        msg.role === "user"
                                            ? "bg-green-500 text-white rounded-tr-sm"
                                            : "bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-200"
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start space-x-2">
                                <div className="bg-purple-500 text-white p-2 rounded-full">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-200">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about products, batches, risks..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Type "help" to see what I can do
                        </p>
                    </form>
                </div>
            )}
        </>
    );
}

export default Chatbot;
