import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/calculo/:monto', (req, res) => {
    const monto = Number(req.params.monto);

    if (!Number.isFinite(monto) || monto <= 0) {
        return res.status(400).json({
            error: 'El salario debe ser un numero mayor a cero',
        });
    }

    res.json({
        monto,
        iva: monto * 0.13,
        renta: monto * 0.1,
    });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
