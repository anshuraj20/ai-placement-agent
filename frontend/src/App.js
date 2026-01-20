import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Button, Modal, Box, TextField, MenuItem, Typography, Paper, Grid, List, ListItem, ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [level, setLevel] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://ai-placement-agent.onrender.com/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_role: domain,
          current_level: level,
        }),
      });
      const data = await res.json();
      setResponse(data);
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ mt: 4, position: 'relative' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          AI Placement Agent
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
          Get personalized placement preparation plans
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" size="large" onClick={handleOpen} endIcon={<SendIcon />}>
            Start Preparation
          </Button>
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Enter Your Details
            </Typography>
            <TextField
              fullWidth
              label="Domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              margin="normal"
              placeholder="e.g., Data Scientist"
            />
            <TextField
              select
              fullWidth
              label="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              margin="normal"
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </TextField>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Generating...' : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Modal>

        {response && (
          <Paper sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Preparation Plan for {response.target_role}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Roadmap</Typography>
                <List>
                  {response.preparation_roadmap.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={item.topic} secondary={item.resources.join(', ')} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Daily Plan</Typography>
                <List>
                  {response.daily_plan.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${item.time}: ${item.task}`} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Mock Questions</Typography>
                <List>
                  {response.mock_questions.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={item.question} secondary={item.answer} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Watermark */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            opacity: 0.3,
            transform: 'rotate(-15deg)',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'primary.main',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          AR
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;