const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Skapa uploads-mapp
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configurera multer för filuppladdning
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/webp', 'image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Endast bilder tillåtna'));
    }
  }
});

// Configurera Nodemailer
const transporter = nodemailer.createTransport({
  host: 'your-mail-server.com', // Din mail-server från One.com
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@emiliaskapar.se',
    pass: 'your-password'
  }
});

// Order API
app.post('/api/order', upload.single('file'), async (req, res) => {
  try {
    const { namn, telefon, mail, beskrivning } = req.body;

    // Validera mail
    if (!mail) {
      return res.status(400).json({ error: 'E-post är obligatorisk' });
    }

    // Skapa e-post till Emilia
    const mailOptions = {
      from: 'noreply@emiliaskapar.se',
      to: 'emiliajonsson@live.com',
      subject: `Ny beställning från ${namn || 'okänd'}`,
      html: `
        <h2>Ny beställning mottagen!</h2>
        <p><strong>Namn:</strong> ${namn || 'Inte angett'}</p>
        <p><strong>Telefon:</strong> ${telefon || 'Inte angett'}</p>
        <p><strong>E-post:</strong> ${mail}</p>
        <p><strong>Beskrivning:</strong> ${beskrivning || 'Ingen beskrivning'}</p>
        ${req.file ? `<p><strong>Bildfil bifogad:</strong> ${req.file.filename}</p>` : ''}
      `,
      attachments: req.file ? [{
        filename: req.file.originalname,
        path: req.file.path
      }] : []
    };

    // Skicka e-post till Emilia
    await transporter.sendMail(mailOptions);

    // Skicka bekräftelse till kunden
    const confirmationEmail = {
      from: 'noreply@emiliaskapar.se',
      to: mail,
      subject: 'Vi mottog din beställning!',
      html: `
        <h2>Tack för din beställning!</h2>
        <p>Vi har mottagit din beställning och återkommer till dig så snart som möjligt.</p>
        <p>Emilia Skapar</p>
      `
    };

    await transporter.sendMail(confirmationEmail);

    res.json({ success: true, message: 'Beställning mottagen' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Något gick fel' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server körs på port ${PORT}`);
});