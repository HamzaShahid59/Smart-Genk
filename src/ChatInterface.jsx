import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Box,
  Avatar,
  Snackbar,
  Fade
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Genklogo from '/Genk.png'
const markdownStyles = {
  '& h1': { fontSize: '1.5rem', fontWeight: 600, margin: '16px 0' },
  '& h2': { fontSize: '1.3rem', fontWeight: 500, margin: '12px 0' },
  '& h3': { fontSize: '1.1rem', fontWeight: 500, margin: '8px 0' },
  '& p': { margin: '8px 0', lineHeight: 1.6 },
  '& ul': {
    listStyleType: 'disc',
    paddingLeft: '32px',
    margin: '12px 0',
    '& li': {
      marginBottom: '6px',
      lineHeight: 1.5
    }
  },
  '& a': {
    color: '#7dd3fc',
    textDecoration: 'underline',
    '&:hover': {
      color: '#38bdf8'
    }
  },
  '& strong': {
    fontWeight: 600,
    color: '#f8fafc'
  }
};

const ChatBot = () => {
  const [queryText, setQueryText] = useState('');
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, currentAnswer]);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const handleQuery = () => {
    if (!queryText) {
      alert('Please enter a query!');
      return;
    }
  
    setLoadingQuery(true);
    setCurrentAnswer('');
  
    // Add user message immediately to chat history
    const newHumanMessage = {
      content: queryText,
      type: 'human',
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, newHumanMessage]);
  
    const newWs = new WebSocket('ws://localhost:8000/ws/chat');
  
    newWs.onopen = () => {
      newWs.send(JSON.stringify({
        message: queryText,
        history: chatHistory
      }));
    };
  
    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'chunk') {
        setCurrentAnswer(prev => prev + data.content);
      }
  
      if (data.type === 'complete') {
        // Add only the AI response to chat history
        const newAiMessage = {
          content: data.answer,
          type: 'ai',
          timestamp: new Date()
        };
        
        setChatHistory(prev => [...prev, newAiMessage]);
        setQueryText('');
        setCurrentAnswer('');
        setLoadingQuery(false);
        newWs.close();
      }
  
      if (data.error) {
        alert(`Error: ${data.error}`);
        setLoadingQuery(false);
        newWs.close();
      }
    };
  
    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
      setLoadingQuery(false);
      newWs.close();
    };
  
    setWs(newWs);
  };

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      alignItems: 'stretch',
      justifyContent: 'stretch'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        height: '100vh',
        bgcolor: 'background.paper'
      }}>
        <Box sx={{
          py: 2,
          px: 4,
          borderBottom: '1px solid #334155',
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{
            maxWidth: 1200,
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <img src={Genklogo} alt='Genk logo'
            height={41.2} width={100} />
            <Typography variant="h6" sx={{
              color: '#e2e8f0',
              fontWeight: 600,
              letterSpacing: '-0.5px'
            }}>
              Slim Genk
              <Typography component="span" sx={{
                ml: 1.5,
                color: '#94a3b8',
                fontSize: '0.875rem',
                fontWeight: 400
              }}>
                Idereen genk
              </Typography>
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
        }}>
          {chatHistory.map((msg, index) => (
            <Box key={index} sx={{
              display: 'flex',
              mb: 2,
              justifyContent: msg.type === 'human' ? 'flex-end' : 'flex-start'
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexDirection: msg.type === 'human' ? 'row-reverse' : 'row'
              }}>
                <Avatar sx={{
                  bgcolor: msg.type === 'human' ? '#6366f1' : '#10b981',
                  width: 36,
                  height: 36,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {msg.type === 'human' ? (
                    <PersonOutlineOutlinedIcon fontSize="small" />
                  ) : (
                    <SmartToyOutlinedIcon fontSize="small" />
                  )}
                </Avatar>
                <Paper sx={{
                  p: 2,
                  maxWidth: 600,
                  borderRadius: 4,
                  bgcolor: msg.type === 'human' ? '#6366f1' : '#334155',
                  color: '#f8fafc',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  border: msg.type === 'human' ? 'none' : '1px solid #3f4a5f',
                  overflowX: 'auto',
                  ...markdownStyles
                }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                      code: ({ children }) => (
                        <code style={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          padding: '2px 4px',
                          borderRadius: 4,
                          fontFamily: 'monospace'
                        }}>
                          {children}
                        </code>
                      )
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </Paper>
              </Box>
            </Box>
          ))}
          {currentAnswer && (
            <Box sx={{ display: 'flex', mb: 2, justifyContent: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#4caf50', width: 32, height: 32 }}>
                  <SmartToyOutlinedIcon fontSize="small" />
                </Avatar>
                <Paper sx={{
                  p: 2,
                  maxWidth: 600,
                  borderRadius: 4,
                  bgcolor: '#334155',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  ...markdownStyles
                }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      )
                    }}
                  >
                    {currentAnswer}
                  </ReactMarkdown>
                </Paper>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{
          borderTop: '1px solid #334155',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          py: 1
        }}>
          <Box sx={{
            maxWidth: 800,
            p: 1,
            mx: 'auto',
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            marginTop: 1,
            marginBottom: 1
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loadingQuery && handleQuery()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 25,
                  bgcolor: '#1e293b',
                  '& fieldset': { borderColor: '#334155' },
                  '&:hover fieldset': { borderColor: '#4f46e5' },
                  '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                },
                '& .MuiInputBase-input': {
                  color: '#e2e8f0'
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleQuery}
              disabled={loadingQuery}
              sx={{
                minWidth: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: '#6366f1',
                '&:hover': { bgcolor: '#4f46e5' }
              }}
            >
              {loadingQuery ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                <SendIcon sx={{ color: 'white' }} />
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBot;