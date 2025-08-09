import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Code, 
  Upload,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const PromptBox = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hi! I'll help you configure your ${location.state?.service?.name || 'service'}. What would you like this service to do?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState(null);
  const [showBYOC, setShowBYOC] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const botResponse = generateBotResponse(input);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        config: botResponse.config
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (botResponse.config) {
        setGeneratedConfig(botResponse.config);
      }
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBotResponse = (userInput) => {
    const service = location.state?.service;
    
    // Simple response generation based on keywords
    if (userInput.toLowerCase().includes('chat') || userInput.toLowerCase().includes('assistant')) {
      return {
        content: "Great! I'll configure a chat assistant for you. Here's a basic configuration:",
        config: {
          type: 'chat-assistant',
          framework: service?.frameworks?.[0] || 'LangChain',
          tools: ['search', 'calculator', 'weather'],
          model: 'gpt-4',
          systemPrompt: 'You are a helpful AI assistant.',
          endpoints: ['/chat', '/health']
        }
      };
    } else if (userInput.toLowerCase().includes('code') || userInput.toLowerCase().includes('programming')) {
      return {
        content: "Perfect! I'll set up a code generation agent. Here's the configuration:",
        config: {
          type: 'code-generator',
          framework: 'LangChain',
          tools: ['code-execution', 'file-operations', 'git'],
          model: 'gpt-4',
          systemPrompt: 'You are an expert programmer who helps generate and debug code.',
          endpoints: ['/generate', '/review', '/debug', '/health']
        }
      };
    } else {
      return {
        content: "I understand! Let me create a custom configuration based on your requirements:",
        config: {
          type: 'custom-agent',
          framework: service?.frameworks?.[0] || 'LangChain',
          tools: ['web-search', 'data-analysis'],
          model: 'gpt-4',
          systemPrompt: `You are a specialized AI agent for: ${userInput}`,
          endpoints: ['/execute', '/status', '/health']
        }
      };
    }
  };

  const handleContinueToBundle = () => {
    const finalConfig = {
      ...location.state,
      aiConfig: generatedConfig,
      messages: messages
    };
    
    toast.success('Configuration saved! Moving to bundle selection...');
    navigate('/bundle', { state: finalConfig });
  };

  const frameworks = ['LangChain', 'LangGraph', 'CrewAI', 'AutoGen'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-medium text-card-foreground">AI Configuration Chat</h1>
        <p className="mt-2 text-sm text-card-foreground">
          Describe what you want your {location.state?.service?.name || 'service'} to do
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg flex flex-col h-96">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-card text-card-foreground'
                    }`}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-card text-card-foreground'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.config && (
                        <div className="mt-2 p-2 bg-white bg-opacity-20 rounded text-xs">
                          <p className="font-medium">Configuration generated!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-card text-card-foreground flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-card">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-card rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-card rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-card rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Describe what you want your service to do..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="space-y-4">
          {/* Generated Config */}
          {generatedConfig && (
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium text-card-foreground mb-3 flex items-center">
                <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                Generated Config
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-card-foreground">Type:</span>
                  <span className="ml-2 text-card-foreground">{generatedConfig.type}</span>
                </div>
                <div>
                  <span className="font-medium text-card-foreground">Framework:</span>
                  <span className="ml-2 text-card-foreground">{generatedConfig.framework}</span>
                </div>
                <div>
                  <span className="font-medium text-card-foreground">Model:</span>
                  <span className="ml-2 text-card-foreground">{generatedConfig.model}</span>
                </div>
                <div>
                  <span className="font-medium text-card-foreground">Tools:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {generatedConfig.tools?.map((tool) => (
                      <span key={tool} className="px-2 py-1 bg-card text-card-foreground rounded text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleContinueToBundle}
                className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary"
              >
                Continue to Bundle
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}

          {/* BYOC Option */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Bring Your Own Code
            </h3>
            <p className="text-xs text-blue-700 mb-3">
              Already have code? Upload it and we'll help you deploy it.
            </p>
            <button
              onClick={() => setShowBYOC(!showBYOC)}
              className="flex items-center text-sm text-blue-700 hover:text-blue-800"
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload Code
            </button>
          </div>

          {/* Framework Options */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-card-foreground mb-3">Available Frameworks</h3>
            <div className="space-y-2">
              {frameworks.map((framework) => (
                <div key={framework} className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-card-foreground">{framework}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptBox;
