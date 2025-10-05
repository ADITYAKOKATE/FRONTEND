import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SpaceChatbot = () => {
  const { t, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize welcome message and update when language changes
  useEffect(() => {
    setMessages([{
      id: 1,
      text: t('chatbotWelcome'),
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [currentLanguage, t]);

  // Sample knowledge base for space research
  const knowledgeBase = {
    'microgravity': 'Microgravity is the condition in which people or objects appear to be weightless. In space, astronauts experience microgravity which affects human physiology, including bone density loss, muscle atrophy, and cardiovascular changes.',
    'iss': 'The International Space Station (ISS) is a modular space station in low Earth orbit. It serves as a microgravity and space environment research laboratory where scientific research is conducted in astrobiology, astronomy, meteorology, physics, and other fields.',
    'mars': 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. NASA is planning human missions to Mars, which will require extensive research on how humans can survive and work in the Martian environment.',
    'space radiation': 'Space radiation consists of high-energy particles that can damage DNA and increase cancer risk. Astronauts are exposed to cosmic rays and solar particle events, making radiation protection a critical area of research.',
    'space food': 'Space food must be nutritious, lightweight, and have a long shelf life. Research focuses on developing foods that maintain nutritional value and palatability in microgravity conditions.',
    'cardiovascular': 'Cardiovascular research in space studies how the heart and blood vessels adapt to microgravity. Key findings include fluid shifts, changes in heart shape, and decreased exercise capacity.',
    'bone loss': 'Bone loss in space occurs due to lack of mechanical loading. Astronauts can lose 1-2% of bone mass per month in space, making osteoporosis research crucial for long-duration missions.',
    'muscle atrophy': 'Muscle atrophy occurs in space due to reduced use of muscles against gravity. Astronauts must exercise 2.5 hours daily to maintain muscle mass and strength.',
    'sleep': 'Sleep patterns are disrupted in space due to the 90-minute day/night cycle on the ISS and lack of natural light cues. Research focuses on optimizing sleep schedules for mission success.',
    'psychology': 'Psychological factors are crucial for long-duration space missions. Research examines isolation, confinement, and stress management techniques for astronauts.',
    'plants': 'Plant growth in space is essential for future missions. Research includes growing food crops in microgravity and understanding how plants respond to space environments.',
    'bacteria': 'Bacteria behave differently in space, growing faster and becoming more resistant to antibiotics. This research is important for astronaut health and mission safety.',
    'water': 'Water recycling systems are critical for long-duration missions. Research focuses on developing efficient systems to purify and reuse water in space.',
    'oxygen': 'Oxygen generation and recycling systems are essential for life support in space. Research includes electrolysis of water and other methods to produce breathable air.',
    'exercise': 'Exercise countermeasures are crucial for maintaining astronaut health. Research includes developing effective exercise equipment and routines for microgravity environments.'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Listen for external open events with an optional seeded message
  useEffect(() => {
    const handler = (e) => {
      setIsOpen(true);
      setIsMinimized(false);
      const seed = e?.detail?.message;
      if (seed) {
        setInputValue(seed);
      }
    };
    window.addEventListener('open-space-chatbot', handler);
    return () => window.removeEventListener('open-space-chatbot', handler);
  }, []);

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for specific topics (keep English knowledge base for now, can be translated later)
    for (const [topic, response] of Object.entries(knowledgeBase)) {
      if (lowerMessage.includes(topic)) {
        return response;
      }
    }

    // General responses based on keywords - now multilingual
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
        lowerMessage.includes('hola') || lowerMessage.includes('bonjour') ||
        lowerMessage.includes('hallo') || lowerMessage.includes('ciao') ||
        lowerMessage.includes('你好') || lowerMessage.includes('こんにちは') ||
        lowerMessage.includes('안녕하세요') || lowerMessage.includes('привет')) {
      return t('chatbotGreeting');
    }
    
    if (lowerMessage.includes('research') || lowerMessage.includes('study') ||
        lowerMessage.includes('investigación') || lowerMessage.includes('recherche') ||
        lowerMessage.includes('forschung') || lowerMessage.includes('ricerca') ||
        lowerMessage.includes('研究') || lowerMessage.includes('연구')) {
      return t('chatbotResearch');
    }
    
    if (lowerMessage.includes('mission') || lowerMessage.includes('astronaut') ||
        lowerMessage.includes('misión') || lowerMessage.includes('astronaute') ||
        lowerMessage.includes('mission') || lowerMessage.includes('astronauta') ||
        lowerMessage.includes('ミッション') || lowerMessage.includes('우주비행사')) {
      return t('chatbotMission');
    }
    
    if (lowerMessage.includes('health') || lowerMessage.includes('medical') ||
        lowerMessage.includes('salud') || lowerMessage.includes('santé') ||
        lowerMessage.includes('gesundheit') || lowerMessage.includes('salute') ||
        lowerMessage.includes('健康') || lowerMessage.includes('건강')) {
      return t('chatbotHealth');
    }
    
    if (lowerMessage.includes('future') || lowerMessage.includes('mars') ||
        lowerMessage.includes('futuro') || lowerMessage.includes('avenir') ||
        lowerMessage.includes('zukunft') || lowerMessage.includes('futuro') ||
        lowerMessage.includes('未来') || lowerMessage.includes('미래')) {
      return t('chatbotFuture');
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do') ||
        lowerMessage.includes('ayuda') || lowerMessage.includes('aide') ||
        lowerMessage.includes('hilfe') || lowerMessage.includes('aiuto') ||
        lowerMessage.includes('帮助') || lowerMessage.includes('도움')) {
      return t('chatbotHelp');
    }

    // Default response - now multilingual
    return t('chatbotDefault');
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group"
        >
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-6 right-6 bg-space-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50 ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
            } transition-all duration-300`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{t('chatbotAssistant')}</h3>
                  <p className="text-xs text-green-400">{t('chatbotOnline')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[350px]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-blue-500' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-3 h-3 text-white" />
                          ) : (
                            <Bot className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className={`px-3 py-2 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700/50 text-gray-100'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-gray-700/50 text-gray-100 px-3 py-2 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('chatbotPlaceholder')}
                      className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      {isTyping ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SpaceChatbot;
