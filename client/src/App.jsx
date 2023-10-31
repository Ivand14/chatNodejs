import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Box, Button, Input, List, ListItem, ListItemText, Paper } from '@mui/material';
import './App.css'; // Importa tu archivo CSS personalizado aquí si lo tienes

const socket = io('/');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      body: message,
      from: 'Me',
      type: 'sent'
    };
    setMessages([...messages, newMessage]);
    socket.emit('message', message);
    setMessage('');
  };

  useEffect(() => {
    socket.on('message', recivedMessage);

    return () => {
      socket.off('message', recivedMessage);
    };
  }, []);

  const recivedMessage = (message) => {
    setMessages((state) => [...state, { ...message, type: 'received',from:'Other' }]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'space-between' }}>
      
      <Paper sx={{ padding: '16px', overflowY: 'auto', flexGrow: 1, backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <List>
          {messages.map((msg, i) => (
            <ListItem key={i} className={msg.type === 'sent' ? 'sent' : 'received'}>
              <ListItemText className={msg.type === 'sent' ? 'sent' : 'received'} primary={`${msg.from}: ${msg.body}`} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ padding: '16px', marginBottom: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' ,mt:'16px'}}>
        <form className='containerForm' onSubmit={handleSubmit}>
          <Input
            sx={{width:'50%',mr:10}}
            placeholder='Escribe tu mensaje...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type='submit' variant='contained' color='primary'>
            Enviar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default App;



