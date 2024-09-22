const nodemailer = require('nodemailer');
const pdf = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');

// Configuración del transportador de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar correos
const sendMail = async (to, subject, text, pdfPath) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            attachments: [
                {
                    filename: path.basename(pdfPath),
                    path: pdfPath
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado:', info.response);
    } catch (error) {
        console.error('Error al enviar email:', error);
    }
};

// Función para crear el PDF
const createPdf = async (data) => {
    const logoPath = path.join(__dirname, '..', 'src', 'assets', 'col.png'); // Ajusta la ruta según la ubicación de tu logo
    console.log('Ruta del logo:', logoPath);
    
    // Asegúrate de que el archivo existe
    if (!fs.existsSync(logoPath)) {
        throw new Error('Logo no encontrado en la ruta especificada');
    }

    // Cargar el logo como base64
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    const logoSrc = `data:image/png;base64,${logoBase64}`;

    const html = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                h1 {
                    color: #007BFF;
                }
                p {
                    font-size: 14px;
                }
                .content {
                    border: 1px solid #007BFF;
                    padding: 10px;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888;
                }
                .logo {
                    width: 100px; /* Ajusta el tamaño según necesites */
                }
            </style>
        </head>
        <body>
            <img src="${logoSrc}" class="logo" alt="Logo" />
            <h1>Notificación de Solicitud</h1>
            <div class="content">
                <p>Señor/a ${data.username},</p>
                <p>Usted ha solicitado <strong>${data.cantidad} unidad(es) de ${data.producto}</strong>. Su estado es: <strong>${data.estado}</strong>.</p>
            </div>
            <div class="footer">
                <p>Gracias por confiar en nosotros.</p>
            </div>
        </body>
        </html>
    `;

    const options = {
        format: 'A4',
        orientation: 'portrait',
        border: '10mm'
    };

    const document = {
        html,
        data,
        path: './temp/solicitud.pdf'
    };

    // Asegúrate de que la carpeta 'temp' exista
    if (!fs.existsSync('./temp')) {
        fs.mkdirSync('./temp');
    }

    try {
        await pdf.create(document, options);
        console.log('PDF creado en:', document.path);
        return document.path;
    } catch (error) {
        console.error('Error al crear el PDF:', error);
        throw error; // Re-lanzar el error para manejarlo más arriba
    }
};

module.exports = { sendMail, createPdf };
