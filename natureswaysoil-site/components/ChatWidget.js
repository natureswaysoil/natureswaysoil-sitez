import { useState, useEffect, useRef } from 'react';

/**
 * Simple floating chat widget.  When clicked, it expands into a chat
 * panel that allows the user to send messages to an AI assistant.  The
 * backend of the assistant is implemented in `/pages/api/chat.js` and
 * requires an OpenAI API key set in the environment.  If no API key
 * is configured the assistant will reply with a default message.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change.
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input.trim() }];
    setMessages(newMessages);
    setInput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      if (data?.reply) {
        setMessages((msgs) => [...msgs, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((msgs) => [...msgs, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((msgs) => [...msgs, { role: 'assistant', content: 'Error sending message.' }]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="bg-white shadow-lg rounded-lg w-80 h-96 flex flex-col overflow-hidden mb-2">
          <div className="flex items-center justify-between bg-primary text-white px-4 py-2">
            <span>Chat with us</span>
            <button onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-green-100 self-end' : 'bg-gray-100 self-start'}`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t flex space-x-2">
            <input
              type="text"
              className="flex-1 border rounded px-2 py-1"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button onClick={sendMessage} className="bg-primary text-white px-4 py-1 rounded">
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-primary text-white rounded-full p-3 shadow-lg focus:outline-none"
      >
        {open ? '–' : '💬'}
      </button>
    </div>
  );
}